//
//  Date+FormatUtil.swift
//  Elliot
//
//  Created by ikbal kazar on 13/01/17.
//  Copyright © 2017 Elliot Technologies. All rights reserved.
//

import Foundation

extension Date {
    func utcString() -> String {
        let formatter = DateFormatter()
        formatter.dateFormat = "yyyy-MM-dd HH:mm:ss"
        return formatter.string(from: self)
    }
    
    func dayOfMonth() -> String {
        let formatter = DateFormatter()
        formatter.dateFormat = "dd"
        return formatter.string(from: self)
    }
    
    func shortMonthName() -> String {
        let formatter = DateFormatter()
        formatter.dateFormat = "MMM"
        return formatter.string(from: self)
    }
    
    func dayString() -> String {
        let formatter = DateFormatter()
        formatter.dateFormat = "EEEE"
        return formatter.string(from: self)
    }
    
    func localString(format: String) -> String {
        let formatter = DateFormatter()
        formatter.dateFormat = format
        return formatter.string(from: self)
    }
    
    func localString() -> String {
        return localString(format: "yyyy-MM-dd HH:mm:ss")
    }
    
    func fullDateString() -> String {
        let formatter = DateFormatter()
        formatter.dateFormat = "EEEE, MMMM d, yyyy"
        return formatter.string(from: self)
    }
    
    func fullDateWithShortMonth() -> String {
        let formatter = DateFormatter()
        formatter.dateFormat = "EEEE, MMM d"
        return formatter.string(from: self)
    }
    
    func basicTimeString() -> String {
        let formatter = DateFormatter()
        formatter.dateFormat = "h:mm a"
        return formatter.string(from: self)
    }
    
    func dateQueryString() -> String {
        let formatter = DateFormatter()
        formatter.dateFormat = "yyyy-MM-dd"
        return formatter.string(from: self)
    }
 
    func hourQueryString() -> String {
        let formatter = DateFormatter()
        formatter.dateFormat = "HH"
        return formatter.string(from: self)
    }

    func minuteQueryString() -> String {
        let formatter = DateFormatter()
        formatter.dateFormat = "mm"
        return formatter.string(from: self)
    }
    
    static func from(string: String) -> Date {
        let formatter = DateFormatter()
        formatter.dateFormat = "yyyy-MM-dd HH:mm:ss"
        return formatter.date(from: string)!
    }
    
    // Rounding Utils
    
    func roundDownToHour() -> Date {
        let minutes = Calendar.current.component(.minute, from: self)
        return self.addingTimeInterval(Double(minutes) * -60)
    }
}
