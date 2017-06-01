//
//  ReactTestConnector.swift
//  Elliot
//
//  Created by Ikbal KAZAR on 5/30/17.
//  Copyright © 2017 Elliot Technologies. All rights reserved.
//

import Foundation
import React

@objc(ReactTestConnector)
class ReactTestConnector: NSObject {
    
    var bridge: RCTBridge!
    
    @objc func tappedBack(_ reactTag: NSNumber) {
        DispatchQueue.main.async {
            guard let view = self.bridge.uiManager.view(forReactTag: reactTag) else { return }
            guard let reactTestVC = view.reactViewController() as? ReactTestViewController else { return }
            reactTestVC.reactTappedBack()
        }
    }
}
