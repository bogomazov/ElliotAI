//
//  NotificationsManager.swift
//  Elliot
//
//  Created by ikbal kazar on 19/01/17.
//  Copyright © 2017 Elliot Technologies. All rights reserved.
//

import Foundation
import UIKit
import SwiftyJSON
import SwiftyUserDefaults

extension DefaultsKeys {
    static let cancelledMeetings = DefaultsKey<[String: Any]>("cancelledMeetings")
}

// TODO: Consider making this a static class instead of a singleton since it's stateless
class NotificationsManager: NSObject {
    static let shared = NotificationsManager()
    
    func requestAccess() {
        let settings = UIUserNotificationSettings(types: [.badge, .alert, .sound],
                                                  categories: nil)
        UIApplication.shared.registerUserNotificationSettings(settings)
    }
    
    enum NotifType: Int {
        case weekly = 0
        case friendJoined = 1
        case confirmed = 2
        case reschedule = 3
        case update = 4
        case openInvite = 5
    }
    
    func getNotifType(data: JSON) -> NotifType? {
        guard let type = data["type"].int else {
            return nil
        }
        return NotifType(rawValue: type)
    }
    
    func setShownTab(target: Int) {
        guard let appDelegate = UIApplication.shared.delegate as? AppDelegate else {
            return
        }
        if let tabbarVC = appDelegate.tabBarVC {
            if tabbarVC.selectedIndex != target {
                tabbarVC.selectedIndex = target
            }
        }
    }
    
    func setTabForNotif(type: NotifType?) {
        if type == nil {
            return
        }
        switch type! {
        case .friendJoined, .reschedule, .weekly:
            setShownTab(target: MainTabBarController.suggestionTab)
        case .confirmed:
            setShownTab(target: MainTabBarController.meetingsTab)
        case .openInvite:
            setShownTab(target: MainTabBarController.inviteTab)
        default:
            break
        }
    }
    
    func handleNotificationTap(data: JSON) {
        print("PUSHLOG: Handling notification tap...")
        guard let notifType = getNotifType(data: data) else {
            return
        }
        if notifType == .update {
            if let url = URL(string: "https://itunes.apple.com/us/app/elliot-meet-with-friends/id1198050572?mt=8") {
                DispatchQueue.main.async {
                    UIApplication.shared.openURL(url)
                }
            }
            return
        }
        setTabForNotif(type: notifType)
    }
    
    func handleSMSOpenTab(notifyType: Int) {
        setTabForNotif(type: NotifType(rawValue: notifyType))
    }
    
    func handleInAppNotification(data: JSON) {
        print("PUSHLOG: Handling in-app notification")
        guard let type = getNotifType(data: data) else {
            // refresh confirmed meetings if no type is provided
            NotificationCenter.default.post(name: NotificationNames.refreshMeetings, object: self)
            return
        }
        if type == .reschedule || type == .confirmed {
            NotificationCenter.default.post(name: NotificationNames.refreshMeetings, object: self)
        }
        if type == .confirmed && data["aps"]["alert"].string != nil {
            NotificationCenter.default.post(name: NotificationNames.newMeetingPushNotif,
                                            object: self, userInfo: ["alert": data["aps"]["alert"].stringValue])
        }
    }
    
    func getActiveNavController() -> UINavigationController? {
        let appDelegate = UIApplication.shared.delegate as! AppDelegate
        guard let tabBarBC = appDelegate.tabBarVC else {
            return nil
        }
        return tabBarBC.selectedViewController as? UINavigationController
    }
    
    // TODO: move cancellation logic to it's own class
    
    func setProcessed(meeting: Meeting) {
        var cancelledSet = Defaults[.cancelledMeetings]
        let key = "\(meeting.id)"
        cancelledSet[key] = "considered"
        Defaults[.cancelledMeetings] = cancelledSet
    }
    
    func isProcessed(meeting: Meeting) -> Bool {
        var cancelledSet = Defaults[.cancelledMeetings]
        let key = "\(meeting.id)"
        return cancelledSet[key] != nil
    }
    
    func handleCancelled(meeting: Meeting) {
        if isProcessed(meeting: meeting) {
            return
        }
        setProcessed(meeting: meeting)
        
        CalendarManager.shared.remove(meeting: meeting)
        
        let message = "Unfortunately we will need to reschedule the \(meeting.type.lowercased()) with \(meeting.person.firstName)"
        let alert = UIAlertController(title: "Reschedule", message: message,
                                      preferredStyle: .alert)
        alert.addAction(UIAlertAction(title: "More Suggestions", style: .default, handler: { (action) in
            let navController = self.getActiveNavController()
            let visibleVC = navController?.visibleViewController
            visibleVC?.dismiss(animated: true, completion: nil)
            navController?.popToRootViewController(animated: true)
            NotificationsManager.shared.setShownTab(target: MainTabBarController.suggestionTab)
            NotificationCenter.default.post(name: NotificationNames.refreshSuggestions, object: self)
        }))
        let navController = self.getActiveNavController()
        navController?.visibleViewController?.present(alert, animated: true, completion: nil)
    }
}
