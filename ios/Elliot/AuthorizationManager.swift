//
//  AuthorizationManager.swift
//  Elliot
//
//  Created by ikbal kazar on 17/01/17.
//  Copyright © 2017 Elliot Technologies. All rights reserved.
//

import Foundation
import Alamofire
import KeychainAccess
import SwiftyJSON
import FacebookCore

struct Pending {
    var request: Request
    var completion: Completion
}

class AuthorizationManager: NSObject {
    static let shared = AuthorizationManager()
    
    var serverAuthToken: String?
    var keychain: Keychain!
    var isLoading: Bool = false
    var pendingQueue: [Pending] = []
    
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
    
    func getAuthHeaders() -> HTTPHeaders? {
        if serverAuthToken == nil {
            return nil
        }
        return ["auth-token": serverAuthToken!]
    }

    func firePendingRequests() {
        for pending in pendingQueue {
            NetworkManager.shared.make(request: pending.request, retry: false,
                                       completion: pending.completion)
        }
        pendingQueue.removeAll()
    }
    
    func loadToken(completion: Completion? = nil) {
        guard let fbToken = AccessToken.current?.authenticationToken else {
            completion?(JSON.null, false)
            return
        }
        isLoading = true
        let request = Request(method: .post, path: "/load_user", data: ["fb_auth_token": fbToken])
        NetworkManager.shared.make(request: request, retry: false) { (json, success) in
            self.isLoading = false
            if success {
                self.setServerAuth(token: json["auth_token"].stringValue)
                self.firePendingRequests()
            }
            completion?(JSON.null, success)
        }
    }
    
    func retryRequest(request: Request, completion: @escaping Completion) {
        pendingQueue.append(Pending(request: request, completion: completion))
        if !isLoading {
            loadToken()
        }
    }
}
