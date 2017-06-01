//
//  AcceptSuggestionViewController.swift
//  Elliot
//
//  Created by ikbal kazar on 14/01/17.
//  Copyright © 2017 Elliot Technologies. All rights reserved.
//

import UIKit
import EventKit
import Nuke

class AcceptSuggestionViewController: UIViewController, UITableViewDataSource, UITableViewDelegate {

    @IBOutlet weak var doneButton: UIButton!
    @IBOutlet weak var profileImageView: UIImageView!
    @IBOutlet weak var datetimeLabel: UILabel!
    @IBOutlet weak var descriptionLabel: UILabel!
    @IBOutlet weak var eventsTable: UITableView!
    @IBOutlet weak var blocksTable: UITableView!
    
    var suggestion: Suggestion!
    var suggestionToReject: Suggestion?
    weak var remover: SuggestionRemover?
    
    struct Block {
        var event: Event
        var chosen: Bool
    }
    
    var chosenCount = 0
    var blocks: [Block] = []
    var events: [EKEvent] = []
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        descriptionLabel.text = "\(suggestion.type) with \(suggestion.person.fullName())"
        datetimeLabel.text = suggestion.date.fullDateWithShortMonth()
        
        profileImageView.layer.cornerRadius = profileImageView.frame.width / 2
        profileImageView.clipsToBounds = true
        if let urlStr = suggestion.person.imageURL,
            let url = URL(string: urlStr) {
            Nuke.loadImage(with: url, into: profileImageView)
        }
        
        loadBlocks()
        loadEvents()
        
        refreshDoneButton()
    }
    
    func loadBlocks() {
        var fromDate = suggestion.date
        blocks = []
        for _ in 0 ..< 6 {
            let nextDate = fromDate.addingTimeInterval(30 * 60)
            let event = Event(begin: fromDate, end: nextDate)
            blocks.append(Block(event: event, chosen: false))
            fromDate = nextDate
        }
    }
    
    // should call loadBlocks first
    func loadEvents() {
        let from = blocks.first!.event.begin.addingTimeInterval(60 * 60 * -1)
        let to = blocks.last!.event.end.addingTimeInterval(60 * 60 * 2)
        let unfilteredEvents = CalendarManager.shared.fetchEventsOfDay(date: suggestion.date)
        let notallDays = unfilteredEvents.filter {!$0.isAllDay}
        
        var borderCandidates: [EKEvent] = []
        var intersecting: [EKEvent] = []
        for event in notallDays {
            if event.startDate < to && event.endDate > from {
                intersecting.append(event)
            } else {
                borderCandidates.append(event)
            }
        }
        
        events = []
        if let before = borderCandidates.filter({$0.endDate < from + 300}).max(by: {$0.endDate < $1.endDate}) {
            events.append(before)
        }
        events.append(contentsOf: intersecting)
        if let after = borderCandidates.filter({$0.startDate > to - 300}).min(by: {$0.startDate < $1.startDate}) {
            events.append(after)
        }
        
        eventsTable.reloadData()
    }
    
    func rejectSuggestionIfRequired() {
        guard let suggestion = suggestionToReject else { return }
        let request = RejectRequest(suggestionId: suggestion.id, responseType: "another-time")
        NetworkManager.shared.make(request: request) { (json, success) in
            if !success {
                print("Error, Failed to reject base suggestion of find-another-time choice")
            }
        }
    }
    
    @IBAction func tappedCancel(_ sender: UIButton) {
        dismiss(animated: true, completion: nil)
    }
    
    @IBAction func tappedDone(_ sender: Any) {
        if chosenCount == 0 {
            return
        }
        self.doneButton.isEnabled = false
        let chosenTimes: [String] = blocks.filter({$0.chosen}).map({$0.event.begin.utcString()})
        let request = AcceptRequest(suggestionId: suggestion.id, times: chosenTimes)
        NetworkManager.shared.make(request: request) { (json, success) in
            if success {
                self.rejectSuggestionIfRequired()
                self.remover?.remove(suggestion: self.suggestion, senderTag: 1)
                // Call /meetings after about a second
                let afterASecond = DispatchTime.now() + .seconds(1)
                DispatchQueue.main.asyncAfter(deadline: afterASecond, execute: { 
                    NotificationCenter.default.post(name: NotificationNames.refreshMeetings, object: self)
                })
                self.performSegue(withIdentifier: "unwindToSuggestionsFeed", sender: self)
            } else {
                let alert = UIAlertController.errorAlert(title: "Connection Error", message: "Please check you internet connection")
                self.present(alert, animated: true, completion: nil)
                self.doneButton.isEnabled = true
            }
        }
    }
    
    func refreshDoneButton() {
        if chosenCount > 0 {
            doneButton.backgroundColor = UIColor.buttonGreen()
        } else {
            doneButton.backgroundColor = UIColor.buttonGreen(alpha: 0.5)
        }
    }
    
    func cellString(begin: Date, end: Date) -> String {
        return "\(begin.basicTimeString()) - \(end.basicTimeString())"
    }
    
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        if tableView == blocksTable {
            return blocks.count
        } else {
            return events.count
        }
    }
    
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        if tableView == blocksTable {
            let cell = tableView.dequeueReusableCell(withIdentifier: "blockCell", for: indexPath) as! TimeBlockTableViewCell
            let block = blocks[indexPath.row]
            cell.timeLabel.text = "\(block.event.begin.basicTimeString())"
            cell.selectionStyle = .none
            return cell
        } else {
            let cell = tableView.dequeueReusableCell(withIdentifier: "eventCell", for: indexPath) as! CalendarEventTableViewCell
            let event = events[indexPath.row]
            cell.dateLabel.text = "\(event.startDate.basicTimeString()) - \(event.endDate.basicTimeString())"
            cell.locationLabel.text = event.location
            cell.titleLabel.text = event.title
            cell.selectionStyle = .none
            return cell
        }
    }
    
    func tableView(_ tableView: UITableView, willDisplay cell: UITableViewCell, forRowAt indexPath: IndexPath) {
        if tableView != blocksTable {
            return
        }
        let blockCell = cell as! TimeBlockTableViewCell
        if blocks[indexPath.row].chosen {
            blockCell.timeLabel.layer.borderColor = UIColor.buttonGreen().cgColor
            blockCell.timeLabel.backgroundColor = UIColor.buttonGreen(alpha: 0.3)
            blockCell.timeLabel.layer.borderWidth = 1
            blockCell.accessoryType = .checkmark
            blockCell.tintColor = UIColor.buttonGreen()
        } else {
            blockCell.timeLabel.layer.borderColor = UIColor.gray.cgColor
            blockCell.timeLabel.backgroundColor = UIColor.clear
            blockCell.timeLabel.layer.borderWidth = 0
            blockCell.accessoryType = .checkmark
            blockCell.tintColor = UIColor.clear
        }
    }
    
    func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        if tableView == eventsTable {
            return
        }
        tableView.deselectRow(at: indexPath, animated: true)
        let chosen = blocks[indexPath.row].chosen
        if chosen {
            chosenCount -= 1
        } else {
            chosenCount += 1
        }
        blocks[indexPath.row].chosen = !chosen
        tableView.reloadRows(at: [indexPath], with: .automatic)
        refreshDoneButton()
    }
}
