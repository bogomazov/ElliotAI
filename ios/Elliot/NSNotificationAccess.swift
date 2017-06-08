//
//  NSNotificationAccess.swift
//  Elliot
//
//  Created by Ikbal KAZAR on 6/8/17.
//  Copyright © 2017 Elliot Technologies. All rights reserved.
//

import Foundation
import React

@objc(NSNotificationAccess)
class NSNotificationAccess: NSObject {
    var bridge: RCTBridge!
    
    @objc func post(_ name: String, info: [AnyHashable: Any]) {
        DispatchQueue.main.async {
            NotificationCenter.default.post(name: NSNotification.Name(rawValue: name),
                                            object: self,
                                            userInfo: info)
        }
    }
}
