//
//  SMSNotifManager.swift
//  Elliot
//
//  Created by Ikbal KAZAR on 5/22/17.
//  Copyright © 2017 Elliot Technologies. All rights reserved.
//

import Foundation
import SwiftyUserDefaults

extension DefaultsKeys {
    static let hasVerifiedNumber = DefaultsKey<Bool>("hasVerifiedNumber")
}

class SMSNotifManager {
    // Returns true if url denotes an SMS notif
    class func handle(url: URL) -> Bool {
        guard url.scheme == "elliot" else { return false }
        guard url.host == "actions" else { return false }
        let paths = url.pathComponents
        guard paths.count > 1 else { return false }
        switch paths[1] {
        case "phone-verification":
            if paths.count > 2 {
                NotificationCenter.default.post(name: NotificationNames.gotSMSToken,
                                                object: self,
                                                userInfo: ["token": paths[2]])
            }
            return true
        default:
            return false
        }
    }
    
    class func setVerifiedNumber() {
        Defaults[.hasVerifiedNumber] = true
    }
    
    class func hasVerifiedNumber() -> Bool {
        return Defaults[.hasVerifiedNumber]
    }
}
