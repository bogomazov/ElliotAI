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
class NSNotificationAccess: RCTEventEmitter {
    struct Events {
        static let refreshSuggestions = "refreshSuggestions"
    }
    
    override init() {
        super.init()
        NotificationCenter.default.addObserver(self, selector: #selector(self.sendRefreshSuggestions),
                                               name: NotificationNames.refreshSuggestions, object: nil)
    }
    
    deinit {
        NotificationCenter.default.removeObserver(self)
    }
    
    override func supportedEvents() -> [String]! {
        return [Events.refreshSuggestions]
    }
    
    func sendRefreshSuggestions() {
        self.sendEvent(withName: Events.refreshSuggestions, body: [])
    }
    
    @objc func post(_ name: String, info: [AnyHashable: Any]) {
        DispatchQueue.main.async {
            NotificationCenter.default.post(name: NSNotification.Name(rawValue: name),
                                            object: self,
                                            userInfo: info)
        }
    }
}
