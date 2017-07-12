//
//  AuthorizationManager.swift
//  Elliot
//
//  Created by ikbal kazar on 17/01/17.
//  Copyright © 2017 Elliot Technologies. All rights reserved.
//

import Foundation
import KeychainAccess

class AuthorizationManager: NSObject {
    static let shared = AuthorizationManager()
    
    var serverAuthToken: String?
    var keychain: Keychain!
    
    override init() {
        super.init()
        keychain = Keychain(service: "com.elliottech.Elliot.token")
        loadServerAuthToken()
    }
    
    func setServerAuth(token: String) {
        keychain?["serverAuthToken"] = token
        serverAuthToken = token
    }
    
    func loadServerAuthToken() {
        serverAuthToken = keychain?["serverAuthToken"]
    }
}
