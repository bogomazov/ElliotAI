//
//  MainViewController.swift
//  Elliot
//
//  Created by Ikbal KAZAR on 7/3/17.
//  Copyright © 2017 Elliot Technologies. All rights reserved.
//

import Foundation
import UIKit
import React
import SwiftyUserDefaults

extension DefaultsKeys {
    static let hasVerifiedNumber = DefaultsKey<Bool>("hasVerifiedNumber")
}

class MainViewController: UIViewController {
    var reactView: RCTRootView? = nil
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        let iosProps: [String: Any?] = [
            "accessToken": AuthorizationManager.shared.serverAuthToken,
            "hasVerifiedNumber": Defaults[.hasVerifiedNumber]
        ]
        
        ReactFactory.rootViewController = self
        reactView = ReactFactory.shared.createView(name: "Elliot",
                                                   props: ["nativeIOS": iosProps])
        reactView?.frame = CGRect(x: 0, y: 0, width: view.frame.width, height: view.frame.height)
        view.addSubview(reactView!)
    }
}
