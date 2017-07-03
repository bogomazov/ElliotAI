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

class MainViewController: UIViewController {
    var reactView: RCTRootView? = nil
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        ReactFactory.rootViewController = self
        reactView = ReactFactory.shared.createView(name: "Elliot",
                                                   props: ["nativeIOS": ["accessToken": AuthorizationManager.shared.serverAuthToken!]])
        reactView?.frame = CGRect(x: 0, y: 20, width: view.frame.width, height: view.frame.height - 20)
        view.addSubview(reactView!)
        
        let barView = UIView(frame: CGRect(x: 0, y: 0, width: view.frame.width, height: 20))
        barView.backgroundColor = UIColor.navigationAndTabBar()
        view.addSubview(barView)
    }
}
