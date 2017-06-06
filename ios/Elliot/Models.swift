//
//  Models.swift
//  Elliot
//
//  Created by ikbal kazar on 13/01/17.
//  Copyright © 2017 Elliot Technologies. All rights reserved.
//

import Foundation
import SwiftyJSON
import EventKit

struct Event {
    var begin: Date
    var end: Date
    
    func serialize() -> [String: Any] {
        return ["begin": begin.utcString(), "end": end.utcString()]
    }
    
    static func deserialize(json: JSON) -> Event {
        let begin = Date.from(string: json["begin"].stringValue)
        let end = Date.from(string: json["end"].stringValue)
        return Event(begin: begin, end: end)
    }
    
    static func fromCalendar(ekevent: EKEvent) -> Event {
        return Event(begin: ekevent.startDate, end: ekevent.endDate)
    }
}

struct Suggestion {
    var id: Int
    var person: Friend
    var date: Date
    var type: String
    var reason: String
    
    func getIconName() -> String {
        let parts = type.components(separatedBy: " ")
        return (parts.last?.lowercased())! + "-icon"
    }
    
    static func deserialize(json: JSON) -> Suggestion {
        let id = json["id"].intValue
        let person = Friend.deserialize(json: json["friend"])
        let date = Date.from(string: json["meeting_time"].stringValue)
        let type = json["meeting_type"].stringValue
        //TODO: parse 'reason' here
        return Suggestion(id: id, person: person, date: date, type: type, reason: "")
    }
}

struct Friend {
    var firstName: String
    var lastName: String
    // TODO: picture (optional)
    var facebookID: String?
    var imageURL: String?
    
    func fullName() -> String {
        return "\(self.firstName) \(self.lastName)"
    }
    
    func firstNameLastInitial() -> String {
        if let fc = lastName.characters.first {
            return "\(self.firstName) \(String(fc))."
        }
        return self.firstName
    }
    
    func initials() -> String {
        var res: String = ""
        if let fc = firstName.characters.first {
            res += String(fc)
        }
        if let sc = lastName.characters.first {
            res += String(sc)
        }
        return res.uppercased()
    }
    
    static func deserialize(json: JSON) -> Friend {
        let firstName = json["first_name"].stringValue
        let lastName = json["last_name"].stringValue
        let facebookID = json["fb_id"].stringValue
        let imageURL = json["image"].stringValue
        
        return Friend(firstName: firstName, lastName: lastName, facebookID: facebookID, imageURL: imageURL)
    }
}

struct Meeting {
    var id: Int
    var person: Friend
    var type: String
    var datetime: Date
    var location: String?
    var isCancelled: Bool
    
    func duration() -> Double {
        if self.isCall() {
            return 30 * 60
        }
        return 60 * 60
    }
    
    func isPast() -> Bool {
        // Meeting is called past if it has ended.
        return datetime.addingTimeInterval(duration()) < Date()
    }
    
    func isCall() -> Bool {
        let parts = type.components(separatedBy: " ")
        return (parts.last?.lowercased())! == "call"
    }
    
    static func deserialize(json: JSON) -> Meeting {
        let id = json["suggestion_id"].intValue
        let type = json["meeting_type"].stringValue
        let datetime = Date.from(string: json["meeting_time"].stringValue)
        let person = Friend.deserialize(json: json["friend"])
        
        // if 'isCancelled' does not exists, its default is false
        let isCancelled = json["canceled"].boolValue
        
        return Meeting(id: id, person: person, type: type, datetime: datetime,
                       location: nil, isCancelled: isCancelled)
    }
}
