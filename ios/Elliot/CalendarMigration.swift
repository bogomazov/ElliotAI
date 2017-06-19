//
//  CalendarMigration.swift
//  Elliot
//
//  Created by Ikbal KAZAR on 6/15/17.
//  Copyright © 2017 Elliot Technologies. All rights reserved.
//

import Foundation
import React

@objc(CalendarMigration)
class CalendarMigration: NSObject {
    var bridge: RCTBridge!

    @objc func getAllStored(_ resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) {
        let dict = UserDefaults.standard.dictionaryRepresentation()
        var result: [String: String] = [:]
        for key in dict.keys {
            if (key.hasPrefix("MeetingKey")) {
                if let val = dict[key] as? String {
                    let fromIndex = key.index(key.startIndex, offsetBy: 10)
                    let actualKey = key.substring(from: fromIndex)
                    result[actualKey] = val
                }
            }
        }
        resolve(result)
    }
}
