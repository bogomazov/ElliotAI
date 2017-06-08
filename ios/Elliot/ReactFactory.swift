//
//  ReactFactory.swift
//  Elliot
//
//  Created by Ikbal KAZAR on 5/30/17.
//  Copyright © 2017 Elliot Technologies. All rights reserved.
//

import Foundation
import React
import CodePush

// Used for creating react-native views.
// Keeps a reference to the common RCTBridge.
class ReactFactory: NSObject, RCTBridgeDelegate {
    static let shared = ReactFactory()
    
    lazy var bridge: RCTBridge = {
        return RCTBridge(delegate: self, launchOptions: nil)
    }()
    
    func sourceURL(for bridge: RCTBridge!) -> URL! {
        #if TARGET_IPHONE_SIMULATOR
            return URL(string: "http://localhost:8081/index.ios.bundle?platform=ios")
        #else
            return CodePush.bundleURL()
        #endif
    }
    
    func createView(name: String, props: [String: Any]?) -> RCTRootView {
        return RCTRootView(bridge: self.bridge, moduleName: name, initialProperties: props)
    }
}
