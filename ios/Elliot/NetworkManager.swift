//
//  Network.swift
//  Elliot
//
//  Created by ikbal kazar on 10/01/17.
//  Copyright © 2017 Elliot Technologies. All rights reserved.
//

import UIKit
import Alamofire
import SwiftyJSON

class Request {
    var method: HTTPMethod
    var path: String = ""
    var data: [String: Any]?

    init(method: HTTPMethod, path: String, data: [String: Any]? = nil) {
        self.method = method
        self.path = path
        self.data = data
    }
}

class LocationRequest: Request {
    init(longitude: Double, latitude: Double) {
        super.init(method: .post, path: "/location")
        self.data = ["longitude": longitude, "latitude": latitude, "time_zone": TimeZone.current.secondsFromGMT()]
    }
}

class EventsRequest: Request {
    init(events: [Event]) {
        super.init(method: .post, path: "/calendar_events")
        let serializedArray = events.map { (event) -> [String: Any] in
            return event.serialize()
        }
        self.data = ["data": serializedArray]
    }
}

class AcceptRequest: Request {
    init(suggestionId: Int, times: [String]) {
        super.init(method: .post, path: "/accept")
        self.data = ["suggestion_id": suggestionId, "times": times]
    }
}

class RejectRequest: Request {
    init(suggestionId: Int, responseType: String) {
        super.init(method: .post, path: "/reject")
        self.data = ["suggestion_id": suggestionId, "response_type": responseType]
    }
}

class DeviceTokenRequest: Request {
    init(token: String) {
        super.init(method: .post, path: "/device_token")
        self.data = ["device_token": token]
    }
}

class GrowthLogRequest : Request {
    init(channel: String, person: String) {
        super.init(method: .post, path: "/growth_log")
        self.data = ["channel": channel, "person": person]
    }
}

class CancelRequest: Request {
    init(suggestionId: Int) {
        super.init(method: .post, path: "/cancel")
        self.data = ["suggestion_id": suggestionId]
    }
}

class AnotherTimeRequest: Request {
    init(friendFBId: String) {
        super.init(method: .get, path: "/suggestions?friend=\(friendFBId)")
    }
}

class SMSNumberRequest: Request {
    init(phoneNumber: String, token: String) {
        super.init(method: .post, path: "/sms_number")
        self.data = ["sms_number": phoneNumber, "sms_token": token]
    }
}

typealias Completion = ((JSON, Bool) -> ())

class NetworkManager: NSObject {
    static let shared = NetworkManager()
    
    let host: String = "https://staging.elliot.ai/control"
    
    func make(request: Request, retry: Bool = true, completion: @escaping Completion) {
        let url = host + request.path
        print("Alamofire LOG: sending \(url)")
        Alamofire.request(url, method: request.method, parameters: request.data,
          encoding: JSONEncoding.default, headers: AuthorizationManager.shared.getAuthHeaders()).responseJSON {
            (response) in
            print("Alamofire LOG: url: \(url), code: \(response.response?.statusCode)")
            print("Alamofire LOG: request")
            if let requestHttpBody = response.request?.httpBody {
                print("\(String(data: requestHttpBody, encoding: String.Encoding.utf8))")
            }
            print("\nHeaders\n\(response.request?.allHTTPHeaderFields.debugDescription)\n")
            print("Alamofire LOG: response \n \(response.result.debugDescription)")
            print("\n")
            
            guard let statusCode = response.response?.statusCode else {
                completion(JSON.null, false)
                return
            }
            
            if retry && statusCode == 401 {
                AuthorizationManager.shared.retryRequest(request: request, completion: completion)
                return
            }
            
            switch response.result {
            case .success(let value):
                // success range is [200, 300)
                if statusCode >= 200 && statusCode < 300 {
                    completion(JSON(value), true)
                } else {
                    completion(JSON(value), false)
                }
            case .failure(let error):
                completion(JSON.null, false)
            }
        }
    }
}
