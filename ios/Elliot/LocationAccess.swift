//
//  LocationAccess.swift
//  Elliot
//
//  Created by Ikbal KAZAR on 6/7/17.
//  Copyright © 2017 Elliot Technologies. All rights reserved.
//

import Foundation

import Foundation
import React

@objc(LocationAccess)
class LocationAccess: NSObject {
    var bridge: RCTBridge!
    
    @objc func checkLocationAccess(_ resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) {
        let granted = (LocationManager.getAccessStatus() == .granted)
        if LocationManager.getAccessStatus() == .granted {
            resolve("success")
        } else {
            reject("failure", "location access is not granted", nil)
        }
    }
    
    @objc func requestLocation(_ resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        DispatchQueue.main.async {
            LocationManager.shared.getLocation(success: { (longitude, latitude) in
                resolve([
                    "lng": longitude,
                    "lat": latitude,
                    "timestamp": Date().timeIntervalSince1970,
                    ] as NSDictionary)
            }) { (error) in
                reject("failure", error, nil)
            }
        }
    }
}
