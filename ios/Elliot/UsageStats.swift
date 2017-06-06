//
//  UsageStats.swift
//  Elliot
//
//  Created by ikbal kazar on 29/01/17.
//  Copyright © 2017 Elliot Technologies. All rights reserved.
//

import Foundation
import SwiftyUserDefaults

extension DefaultsKeys {
    static let sessionCount = DefaultsKey<Int>("sessionCount")
    static let hasPastMeeting = DefaultsKey<Bool>("hasPastMeeting")
    static let rejectTapCount = DefaultsKey<Int>("rejectTapCount")
}

class UsageStats {
    static func reportSession() {
        Defaults[.sessionCount] += 1
    }
    
    static func reportPastMeeting() {
        Defaults[.hasPastMeeting] = true
    }
    
    static func reportRejectTap() {
        Defaults[.rejectTapCount] += 1
    }
    
    static func isExperienced() -> Bool {
        return Defaults[.sessionCount] > 2 || Defaults[.hasPastMeeting]
    }
    
    static func shouldWarnOnReject() -> Bool {
        return Defaults[.rejectTapCount] < 3
    }
}
