//
//  MeetingsViewController.swift
//  Elliot
//
//  Created by ikbal kazar on 11/01/17.
//  Copyright © 2017 Elliot Technologies. All rights reserved.
//

import UIKit
import SwiftyJSON
import Nuke
import OpenSansSwift
import SwiftyUserDefaults

protocol Refreshable: class {
    func refreshData()
}

class MeetingsViewController: UIViewController, UITableViewDataSource, UITableViewDelegate, Refreshable {

    let explanationCellText = "When you and your friends respond to suggestions, Elliot will confirm times to meet here."
    
    @IBOutlet weak var tableView: UITableView!
    
    var upcomingMeetings: [Meeting] = []
    var pastMeetings: [Meeting] = []
    var selectedMeeting: Meeting?
    var upcomingButton: UIButton!
    var pastButton: UIButton!
    var onUpcoming: Bool = true
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        self.tableView.backgroundColor = UIColor.tableBackground()

        self.upcomingButton = UIButton(frame: CGRect(x: 0, y: 0, width: 100, height: 30))
        self.upcomingButton.setTitle("Upcoming", for: .normal)
        self.upcomingButton.titleLabel?.font = UIFont.openSansBoldFontOfSize(16)
        self.upcomingButton.setTitleColor(UIColor.darkElliotBeige(), for: .normal)
        self.upcomingButton.addTarget(self, action: #selector(self.tappedUpcoming), for: .touchUpInside)
        
        self.pastButton = UIButton(frame: CGRect(x: 100, y: 0, width: 100, height: 30))
        self.pastButton.setTitle("Past", for: .normal)
        self.pastButton.titleLabel?.font = UIFont.openSansFontOfSize(16)
        self.pastButton.setTitleColor(UIColor.darkElliotBeige(), for: .normal)
        self.pastButton.addTarget(self, action: #selector(self.tappedPast), for: .touchUpInside)

        let header: UIView = {
            let view = UIView(frame: CGRect(x: 0, y: 0, width: 200, height: 30))
            view.backgroundColor = UIColor.clear
            view.addSubview(self.upcomingButton)
            view.addSubview(self.pastButton)
            return view
        }()
        
        self.navigationItem.titleView = header
        
        self.navigationController?.navigationBar.barTintColor = UIColor.navigationAndTabBar()
        self.navigationController?.navigationBar.setBottomBorder()
        
        onUpcoming = true
        
        Timer.scheduledTimer(timeInterval: 300.0, target: self, selector: #selector(self.refreshData),
                             userInfo: nil, repeats: true)
        refreshData()
        
        NotificationCenter.default.addObserver(self, selector: #selector(self.refreshData),
                                               name: NotificationNames.foregroundUpdate, object: nil)
        NotificationCenter.default.addObserver(self, selector: #selector(self.refreshData),
                                               name: NotificationNames.refreshMeetings, object: nil)
    }
    
    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(animated)
        self.navigationController?.setNavigationBarHidden(false, animated: true)
    }
    
    override func viewDidAppear(_ animated: Bool) {
        super.viewDidAppear(animated)
        resetBadge()
    }
    
    func populateToTest() {
        // Test code - begin
        var meeting1 = Meeting(id: 111, person: Friend(firstName:"John", lastName:"Appleseed", facebookID: nil, imageURL: nil),
                               type: "Dinner", datetime: Date.from(string: "2017-01-30 20:00:00"),
                               location: "San Francisco Bay Area", isCancelled: false)
        let meeting2 = Meeting(id: 1, person: Friend(firstName:"Scott", lastName: "Wu", facebookID: nil, imageURL: "https://scontent.xx.fbcdn.net/v/t1.0-1/c0.0.50.50/p50x50/15350535_10207598533783704_918325435068479679_n.jpg?oh=515d6cb338cc7112fdf7810d71c94fee&oe=591A1C24"),
                               type: "Coffee", datetime: Date.from(string: "2017-01-19 14:00:00"),
                               location: "San Francisco Bay Area", isCancelled: false)
        
        pastMeetings.append(meeting1)
        upcomingMeetings.append(meeting2)
        
        CalendarManager.shared.add(meeting: meeting1)
        
        for i in 0 ..< 50 {
            let randomId = Int(arc4random_uniform(10))
            meeting1.person.imageURL = "https://unsplash.it/100/100?image=\(randomId + 20)"
            meeting1.person.firstName = "Test"
            meeting1.person.lastName = "\(randomId)"
            pastMeetings.append(meeting1)
            upcomingMeetings.append(meeting1)
        }
        // Test code - end
    }
    
    func refreshData() {
        let request = Request(method: .get, path: "/scheduled")
        NetworkManager.shared.make(request: request, retry: false) { (json, success) in
            if success {
                self.pastMeetings = []
                self.upcomingMeetings = []
                
                // Later on, we should call json["badges"] as well
                for (_, object) in json["data"] {
                    print(object)
                    var meeting = Meeting.deserialize(json: object)
                    meeting.location = meeting.isCall() ? "Home" : LocationManager.shared.metroName
                    
                    if meeting.isCancelled {
                        if !meeting.isPast() {
                            NotificationsManager.shared.handleCancelled(meeting: meeting)
                        }
                        continue
                    }
                    
                    if meeting.isPast() {
                        UsageStats.reportPastMeeting()
                        self.pastMeetings.append(meeting)
                    } else {
                        CalendarManager.shared.add(meeting: meeting)
                        self.upcomingMeetings.append(meeting)
                    }
                }
                
                self.setTabBarBadge(n: json["badges"].intValue)
                self.pastMeetings.reverse()
                self.tableView.reloadData()
            }
        }
    }
    
    func resetBadge() {
        UIApplication.shared.applicationIconBadgeNumber = 0
        setTabBarBadge(n: 0)
        NetworkManager.shared.make(request: Request(method: .post, path: "/badge_reset")) { (json, success) in
            print("Badge reset request, success: \(success)")
        }
    }
    
    func setTabBarBadge(n: Int) {
        guard let controller = self.navigationController?.tabBarController as? MainTabBarController else { return }
        controller.setTabBarBadge(n: n)
    }
    
    func tappedUpcoming() {
        if onUpcoming {
            return
        }
        onUpcoming = true
        self.upcomingButton.titleLabel?.font = UIFont.openSansBoldFontOfSize(16)
        self.pastButton.titleLabel?.font = UIFont.openSansFontOfSize(16)  
        tableView.reloadData()
    }
    
    func tappedPast() {
        if !onUpcoming {
            return
        }
        onUpcoming = false
        self.upcomingButton.titleLabel?.font = UIFont.openSansFontOfSize(16)
        self.pastButton.titleLabel?.font = UIFont.openSansBoldFontOfSize(16)
        tableView.reloadData()
    }
    
    func meetingFor(indexPath: IndexPath) -> Meeting {
        if onUpcoming {
            return upcomingMeetings[indexPath.row]
        } else {
            return pastMeetings[indexPath.row]
        }
    }
    
    func shouldShowExplanation() -> Bool {
        if Defaults[.noExplanationOnMeetings] {
            return false
        }
        return upcomingMeetings.count == 0 && pastMeetings.count == 0
    }
    
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        if onUpcoming && shouldShowExplanation() {
            return 1
        }
        return (onUpcoming ? upcomingMeetings.count : pastMeetings.count)
    }
    
    func tableView(_ tableView: UITableView, heightForRowAt indexPath: IndexPath) -> CGFloat {
        if onUpcoming && shouldShowExplanation() {
            return 90
        }
        return 120
    }
    
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        if onUpcoming && shouldShowExplanation() {
            let cell = tableView.dequeueReusableCell(withIdentifier: "explanationCell", for: indexPath) as! ExplanationCell
            cell.configure(text: explanationCellText, closeAction: { [weak self] in
                Defaults[.noExplanationOnMeetings] = true
                self?.tableView.deleteRows(at: [indexPath], with: .fade)
            })
            cell.selectionStyle = .none
            return cell
        }
        let cell = tableView.dequeueReusableCell(withIdentifier: "meetingCell", for: indexPath) as! MeetingsTableViewCell
        let meeting = meetingFor(indexPath: indexPath)
        cell.configure(meeting: meeting)
        cell.profileImageView.image = nil
        if let urlStr = meeting.person.imageURL,
            let url = URL(string: urlStr) {
            Nuke.loadImage(with: url, into: cell.profileImageView)
        }
        cell.selectionStyle = .none
        return cell
    }
    
    func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        tableView.deselectRow(at: indexPath, animated: true)
        if onUpcoming && shouldShowExplanation() {
            return
        }
        selectedMeeting = meetingFor(indexPath: indexPath)
        performSegue(withIdentifier: "meetingDetail", sender: self)
    }
    
    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        if segue.identifier == "meetingDetail" {
            let detailVC = segue.destination as! MeetingDetailViewController
            detailVC.meeting = selectedMeeting
            detailVC.refreshable = self
        }
    }
}
