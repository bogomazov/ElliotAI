//
//  CalendarManager.swift
//  Elliot
//
//  Created by ikbal kazar on 08/01/17.
//  Copyright © 2017 Elliot Technologies. All rights reserved.
//

import UIKit
import EventKit
import SwiftyUserDefaults

extension DefaultsKeys {
    static let previousCalendar = DefaultsKey<String?>("previousCalendar")
}

class CalendarManager: NSObject, AccessRequired {
    static let shared = CalendarManager()
    
    var eventStore: EKEventStore?
    var calendars: [EKCalendar]?
    
    static func getAccessStatus() -> AccessStatus {
        switch EKEventStore.authorizationStatus(for: .event) {
        case .authorized:
            return .granted
        case .notDetermined:
            return .notDetermined
        default:
            return .denied
        }
    }
    
    static func requestAccess(completion: @escaping () -> ()) {
        shared.eventStore?.requestAccess(to: .event, completion: { (granted, error) in
            completion()
        })
    }
    
    static func applyAllDayFilter(events: [EKEvent]) -> [EKEvent] {
        var res: [EKEvent] = []
        
        for event in events {
            if (!event.isAllDay)
            {
                res.append(event)
            }
        }
        return res
    }
    
    override init() {
        super.init()
        eventStore = EKEventStore()
    }
    
    func fetchCalendars() {
        self.calendars = eventStore?.calendars(for: .event)
    }
    
    func fetchEvents(from: Date, to: Date) -> [EKEvent] {
        guard (eventStore != nil) && CalendarManager.getAccessStatus() == .granted else {
            return []
        }
        let calendars = eventStore!.calendars(for: .event)
        let predicate = eventStore!.predicateForEvents(withStart: from, end: to, calendars: calendars)
        return eventStore!.events(matching: predicate)
    }
    
    func fetchEventsOfDay(date: Date) -> [EKEvent] {
        let startTime = Calendar.current.startOfDay(for: date)
        let aDayInSeconds: Double = 24 * 60 * 60
        return fetchEvents(from: startTime, to: startTime.addingTimeInterval(aDayInSeconds))
    }
    
    func fetchAllEKEvents() -> [EKEvent] {
        let aDay: Double = 60 * 60 * 24
        let from = Date().addingTimeInterval(-aDay)
        let to = Date().addingTimeInterval(aDay * 14)
        return fetchEvents(from: from, to: to)
    }
    
    func postUpdate() {
        let events = fetchAllEKEvents().map { (ekevent) -> Event in
            return Event(begin: ekevent.startDate, end: ekevent.endDate)
        }
        let eventsRequest = EventsRequest(events: events)
        NetworkManager.shared.make(request: eventsRequest) { (json, success) in
            print("Calendar data update, success: \(success)")
        }
    }
    
    func add(meeting: Meeting) {
        if Defaults.hasKey(DefaultsKeys.ofMeeting(id: meeting.id)) {
            // it is already in the calendar
            return
        }
        let ekEvent = EKEvent(eventStore: self.eventStore!)
        ekEvent.startDate = meeting.datetime
        ekEvent.endDate = meeting.datetime.addingTimeInterval(meeting.duration())
        ekEvent.title = "\(meeting.type) with \(meeting.person.fullName())"
        ekEvent.location = meeting.location
        ekEvent.calendar = eventStore!.defaultCalendarForNewEvents
        do {
            let result = try self.eventStore?.save(ekEvent, span: EKSpan.thisEvent)
            print("Saved the event with result: \(result)")
            Defaults[DefaultsKeys.ofMeeting(id: meeting.id)] = ekEvent.eventIdentifier
            Defaults[.previousCalendar] = ekEvent.calendar.calendarIdentifier
        } catch {
            print("Error!.. Could not save the event")
        }
    }
    
    func remove(meeting: Meeting) {
        if !Defaults.hasKey(DefaultsKeys.ofMeeting(id: meeting.id)) {
            // meeting is not added to calendar before
            return
        }
        let identifier: String = Defaults[DefaultsKeys.ofMeeting(id: meeting.id)].stringValue
        guard let ekEvent = eventStore!.event(withIdentifier: identifier) else {
            // meeting is not in the calendar
            return
        }
        do {
            try eventStore!.remove(ekEvent, span: .thisEvent)
        } catch {
            print("Error!.. Could not remove the event")
        }
    }
}
