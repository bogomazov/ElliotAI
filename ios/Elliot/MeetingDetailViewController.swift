//
//  MeetingDetailViewController.swift
//  Elliot
//
//  Created by ikbal kazar on 11/01/17.
//  Copyright © 2017 Elliot Technologies. All rights reserved.
//

import UIKit
import FacebookShare
import Contacts
import MessageUI
import Nuke
import PhoneNumberKit

class MeetingDetailViewController: UIViewController, UITableViewDelegate, UITableViewDataSource {
    
    @IBOutlet weak var profileImageView: UIImageView!
    @IBOutlet weak var wrapperView: UIView!
    @IBOutlet weak var titleLabel: UILabel!
    @IBOutlet weak var dateLabel: UILabel!
    
    @IBOutlet weak var tableView: UITableView!
    @IBOutlet weak var rescheduleView: UIView!
    @IBOutlet weak var rescheduleLabel: UILabel!
    @IBOutlet weak var rescheduleIcon: UIImageView!
    @IBOutlet weak var bottomStripe: UIView!
    
    weak var refreshable: Refreshable?
    var meeting: Meeting!
    var contacts: [CNContact]!
    
    let optionLabels = ["Message on Facebook", "SMS", "Call", "OpenTable", "Yelp"]
    let iconNames = ["time_grey-66px", "location_black-66px", "fb-icon-66px", "messageicon", "phone", "opentable-icon-66px", "yelp-icon-66px", "no-66px"]
    
    enum RowNames: Int {
        case time
        case location
        case facebook
        case sms
        case call
        case openTable
        case yelp
    }
    
    var shownIndexes: [RowNames] = []
    var phoneNumber: String?
    
    override func viewDidLoad() {
        super.viewDidLoad()
        wrapperView.layer.cornerRadius = 15
        wrapperView.clipsToBounds = true
        titleLabel.text = "\(meeting.type) with \(meeting.person.fullName())"
        dateLabel.text = meeting!.datetime.fullDateWithShortMonth()
        
        profileImageView.layer.cornerRadius = profileImageView.frame.width / 2
        profileImageView.clipsToBounds = true
        if let urlStr = meeting.person.imageURL, let url = URL(string: urlStr) {
            Nuke.loadImage(with: url, into: profileImageView)
        }
        
        ContactsManager.shared.fetchContacts()
        self.contacts = ContactsManager.shared.contacts
        initPhoneNumber()
        
        initTable()
        
        if meeting.isPast() {
            bottomStripe.removeFromSuperview()
            rescheduleView.removeFromSuperview()
        } else {
            let tapRecognizer = UITapGestureRecognizer(target: self,
                                                       action: #selector(self.rescheduleTapped))
            rescheduleView.addGestureRecognizer(tapRecognizer)
        }
    }
    
    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(animated)
        self.navigationController?.setNavigationBarHidden(true, animated: true)
    }
    
    override func viewWillDisappear(_ animated: Bool) {
        super.viewWillDisappear(animated)
        self.navigationController?.setNavigationBarHidden(false, animated: true)
    }
    
    func initPhoneNumber() {
        let fullName = meeting.person.fullName()
        phoneNumber = ContactsManager.findNumberForFullName(fullName: fullName)
    }
    
    func initTable() {
        shownIndexes = []
        shownIndexes.append(.time)
        shownIndexes.append(.location)
        shownIndexes.append(.facebook)
        if phoneNumber != nil && MFMessageComposeViewController.canSendText() {
            shownIndexes.append(.sms)
        }
        if meeting.isCall() && phoneNumber != nil {
            shownIndexes.append(.call)
        }
        if !meeting.isPast() && !meeting.isCall() {
            shownIndexes.append(.openTable)
            shownIndexes.append(.yelp)
        }
        tableView.reloadData()
    }
    
    func messengerTapped() {
        guard let fbID = meeting.person.facebookID else {
            return
        }
        // Facebook changed this API, need to look at this further later
        if let url = URL(string: "fb-messenger-public://") {
            if UIApplication.shared.canOpenURL(url) {
                UIApplication.shared.openURL(url)
            }
        }
    }
    
    func textTapped() {
        if phoneNumber == nil {
            return
        }
        
        let composeVC = MFMessageComposeViewController()
        composeVC.messageComposeDelegate = self
        composeVC.recipients = [phoneNumber!]
        
        if !meeting.isPast() {
            composeVC.body = "Let's figure out where we should meet.    "
        } else {
            composeVC.body = ""
        }
        
        if (MFMessageComposeViewController.canSendText()) {
            self.present(composeVC, animated: true, completion: nil)
        }
    }
    
    func callTapped() {
        guard let number = phoneNumber else {
            return
        }
        let formatter = PhoneNumberKit()
        var formattedNumber: String? = nil
        do {
            let phoneNumber = try formatter.parse(number)
            formattedNumber = formatter.format(phoneNumber, toType: .e164)
        } catch {
            return
        }
        guard let e164Number = formattedNumber,
            let url = URL(string: "tel://\(e164Number)") else {
            return
        }
        let app = UIApplication.shared
        if !app.canOpenURL(url) {
            return
        }
        let alert = UIAlertController(title: nil, message: "\(number)", preferredStyle: .alert)
        alert.addAction(UIAlertAction(title: "Cancel", style: .destructive, handler: nil))
        alert.addAction(UIAlertAction(title: "Call", style: .default, handler: { (action) in
            app.openURL(url)
        }))
        present(alert, animated: true, completion: nil)
    }
    
    func yelpTapped() {
        let app = UIApplication.shared
        if app.canOpenURL(URL(string: "yelp4:")!) {
            app.openURL(URL(string: "yelp4:///search?find_desc=\(meeting!.type)")!)
        } else {
            app.openURL(URL(string: "https://www.yelp.com/search?find_desc=\(meeting!.type)")!)
        }
    }
    
    func openTableTapped() {
        let metroId = LocationManager.shared.metroIdOpenTable
        
        if metroId == "0" {
            return
        }
        
        if let url = URL(string: "https://www.opentable.com/s/?covers=2&dateTime=\(meeting!.datetime.dateQueryString())%20\(meeting!.datetime.hourQueryString())%3A\(meeting!.datetime.minuteQueryString())&metroId=\(metroId)") {
            UIApplication.shared.openURL(url)
        }
    }
    
    func rescheduleTapped() {
        let alert = UIAlertController(title: nil, message: nil, preferredStyle: .actionSheet)
        alert.addAction(UIAlertAction(title: "Reschedule", style: .destructive, handler: { (action) in
            print("Requested to reschedule the meeting...")
            // post to /reschedule then go back to meetings page by refreshing
            let cancelRequest = CancelRequest(suggestionId: self.meeting.id)
            NetworkManager.shared.make(request: cancelRequest, completion: { (json, success) in
                guard success else {
                    let errorAlert = UIAlertController.connectionError()
                    self.present(errorAlert, animated: true, completion: nil)
                    return
                }
                CalendarManager.shared.remove(meeting: self.meeting)
                NotificationsManager.shared.setProcessed(meeting: self.meeting)
                NotificationCenter.default.post(name: NotificationNames.refreshSuggestions, object: self)
                
                self.refreshable?.refreshData()
                self.navigationController?.popViewController(animated: true)
            })
        }))
        alert.addAction(UIAlertAction(title: "Never mind", style: .cancel, handler: nil))
        present(alert, animated: true, completion: nil)
    }
    
    @IBAction func closeTapped(_ sender: UIButton) {
        self.navigationController?.popViewController(animated: true)
    }
    
    func labelFor(index: Int) -> String? {
        if index >= 2 {
            return optionLabels[index - 2]
        }
        if index == 0 {
            return meeting.datetime.basicTimeString()
        } else {
            return meeting.location
        }
    }
    
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return shownIndexes.count
    }
    
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCell(withIdentifier: "meetingDetailCell") as! MeetingDetailTableViewCell
        let row = shownIndexes[indexPath.row].rawValue
        cell.theLabel.text = labelFor(index: row)
        cell.iconImageView.image = nil
        cell.iconImageView.image = UIImage(named: iconNames[row])
        cell.hasActiveButton = (row >= 2)
        cell.selectionStyle = .none
        return cell
    }
   
    func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        switch shownIndexes[indexPath.row] {
        case .facebook:
            messengerTapped()
        case .openTable:
            openTableTapped()
        case .yelp:
            yelpTapped()
        case .sms:
            textTapped()
        case .call:
            callTapped()
        default:
            break
        }
        tableView.deselectRow(at: indexPath, animated: true)
    }
}

extension MeetingDetailViewController: MFMessageComposeViewControllerDelegate {
    func messageComposeViewController(_ controller: MFMessageComposeViewController, didFinishWith result: MessageComposeResult) {
        controller.dismiss(animated: true) {
            if result == .failed {
                print("Could not send the SMS.")
                let alert = UIAlertController(title: "Error", message: "Could not send the sms", preferredStyle: .alert)
                let okAction = UIAlertAction(title: "OK", style: .default, handler: nil)
                alert.addAction(okAction)
                self.present(alert, animated: true, completion: nil)
            }
        }
    }
}

// Handles the highlighting of reschedule button
extension MeetingDetailViewController {
    override func touchesBegan(_ touches: Set<UITouch>, with event: UIEvent?) {
        if touches.first?.view == self.rescheduleView {
            self.rescheduleView.alpha = 0.5
        }
    }
    
    override func touchesCancelled(_ touches: Set<UITouch>, with event: UIEvent?) {
        if touches.first?.view == self.rescheduleView {
            self.rescheduleView.alpha = 1.0
        }
    }
    
    override func touchesEnded(_ touches: Set<UITouch>, with event: UIEvent?) {
        if touches.first?.view == self.rescheduleView {
            self.rescheduleView.alpha = 1.0
        }
    }
}

