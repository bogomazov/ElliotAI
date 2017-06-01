//
//  DefaultsKeysExtension.swift
//  Elliot
//
//  Created by ikbal kazar on 08/01/17.
//  Copyright © 2017 Elliot Technologies. All rights reserved.
//

import SwiftyUserDefaults

extension DefaultsKeys {
    // static keys will be defined here.
    static func ofMeeting(id: Int) -> String {
        return "MeetingKey\(id)"
    }
}
