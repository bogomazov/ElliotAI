//
//  Config.swift
//  Elliot
//
//  Created by Ikbal KAZAR on 7/6/17.
//  Copyright © 2017 Elliot Technologies. All rights reserved.
//

import Foundation
import React

@objc(Config)
class Config: NSObject {
    @objc func constantsToExport() -> NSObject {
        var buildEnv: String
        #if DEBUG
            buildEnv = "DEBUG"
        #else
            buildEnv = "RELEASE"
        #endif
        return ["buildEnvironment": buildEnv] as NSObject
    }
}
