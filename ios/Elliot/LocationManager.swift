//
//  LocationManager.swift
//  Elliot
//
//  Created by ikbal kazar on 07/01/17.
//  Copyright © 2017 Elliot Technologies. All rights reserved.
//

import UIKit
import CoreLocation

class LocationManager: NSObject, CLLocationManagerDelegate, AccessRequired {
    static let shared = LocationManager()
    
    var locationManager: CLLocationManager?
    var shouldPost: Bool = false
    
    var metroIdOpenTable: String = "0"
    var metroName: String = "Local"
    
    var requestCompletion: (() -> ())?
    var inProgress: Bool = false
    
    static func getAccessStatus() -> AccessStatus {
        switch CLLocationManager.authorizationStatus() {
        case .authorizedAlways, .authorizedWhenInUse:
            return .granted
        case .notDetermined:
            return .notDetermined
        default:
            return .denied
        }
    }
    
    static func requestAccess(completion: @escaping () -> ()) {
        shared.requestCompletion = completion
        shared.locationManager?.requestWhenInUseAuthorization()
    }
    
    override init() {
        super.init()
        // create a location manager now in case authorization request is required
        locationManager = CLLocationManager()
        locationManager?.delegate = self
    }
    
    func postUpdate() {
        if LocationManager.getAccessStatus() != .granted {
            // don't start the location fetch if access has not been granted
            // we don't need to worry about access status change since app is killed 
            // and launched again when that happens
            return
        }
        inProgress = true
        shouldPost = true
        locationManager?.startUpdatingLocation()
    }
    
    func locationManager(_ manager: CLLocationManager, didChangeAuthorization status: CLAuthorizationStatus) {
        if LocationManager.getAccessStatus() != .granted {
            return
        }
        if let completion = requestCompletion {
            completion()
            // deallocate the completion once it is called to not call it twice
            self.requestCompletion = nil
        }
    }
    
    func locationManager(_ manager: CLLocationManager, didUpdateLocations locations: [CLLocation]) {
        
        guard let coordinate = locations.last?.coordinate else {
            return
        }
        
        print("New location captured: \(locations.last!.description)")
        
        determineMetroArea(location: locations.last!)
        
        self.locationManager?.stopUpdatingLocation()
        
        // make sure to send only once
        if shouldPost {
            shouldPost = false
            let locRequest = LocationRequest(longitude: coordinate.longitude, latitude: coordinate.latitude)
            NetworkManager.shared.make(request: locRequest) { (json, success) in
                print("Location post success = \(success)")
                self.inProgress = false
                NotificationCenter.default.post(name: NotificationNames.locationReady, object: self)
            }
        }
    }
    
    func determineMetroArea(location: CLLocation) {
        if (location.distance(from: CLLocation(latitude: 42.36, longitude: -71.05)) < 100000) {
            metroIdOpenTable = "7"
            metroName = "Boston Area"
        } else if (location.distance(from: CLLocation(latitude: 37.56, longitude: -122.32)) < 100000) {
            metroIdOpenTable = "4"
            metroName = "San Francisco Bay Area"
        } else if (location.distance(from: CLLocation(latitude: 40.71, longitude: -74.00)) < 100000) {
            metroIdOpenTable = "8"
            metroName = "New York Area"
        } else if (location.distance(from: CLLocation(latitude: 41.87, longitude: -87.62)) < 100000) {
            metroIdOpenTable = "3"
            metroName = "Chicago Area"
        } else if (location.distance(from: CLLocation(latitude: 47.60, longitude: -122.33)) < 100000) {
            metroIdOpenTable = "2"
            metroName = "Seattle Area"
        } else if (location.distance(from: CLLocation(latitude: 34.05, longitude: -118.24)) < 100000) {
            metroIdOpenTable = "6"
            metroName = "Los Angeles Area"
        } else if (location.distance(from: CLLocation(latitude: 26.12, longitude: -80.13)) < 100000) {
            metroIdOpenTable = "17"
            metroName = "Miami Area"
        } else if (location.distance(from: CLLocation(latitude: 43.65, longitude: -79.38)) < 100000) {
            metroIdOpenTable = "74"
            metroName = "Toronto Area"
        } else if (location.distance(from: CLLocation(latitude: 45.50, longitude: -73.56)) < 100000) {
            metroIdOpenTable = "75"
            metroName = "Montreal Area"
        }
    }
}
