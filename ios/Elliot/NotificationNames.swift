//
//  NotificationNames.swift
//  Elliot
//
//  Created by ikbal kazar on 26/01/17.
//  Copyright © 2017 Elliot Technologies. All rights reserved.
//

import Foundation

class NotificationNames {
    static let foregroundUpdate = NSNotification.Name("foregroundUpdateNotif")
    static let refreshMeetings = NSNotification.Name("refreshMeetingsNotif")
    static let showInvite = NSNotification.Name("showInviteNotif")
    static let locationReady = NSNotification.Name("locationReadyNotif")
    static let newMeetingPushNotif = NSNotification.Name("newMeetingPushNotifNotif")
    static let refreshSuggestions = NSNotification.Name("refreshSuggestions")
    static let gotSMSToken = NSNotification.Name("gotSMSToken")
}
