//
//  LocationManager.swift
//  Elliot
//
//  Created by ikbal kazar on 07/01/17.
//  Copyright © 2017 Elliot Technologies. All rights reserved.
//

import UIKit
import CoreLocation

enum AccessStatus {
    case granted
    case notDetermined
    case denied
}

class LocationManager: NSObject, CLLocationManagerDelegate {
    static let shared = LocationManager()
    
    var locationManager: CLLocationManager?
    
    var metroIdOpenTable: String = "0"
    var metroName: String = "Local"
    
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
    
    override init() {
        super.init()
        // create a location manager now in case authorization request is required
        locationManager = CLLocationManager()
        locationManager?.delegate = self
        // 3 km is accurate enough
        locationManager?.desiredAccuracy = kCLLocationAccuracyThreeKilometers
    }
    
    typealias LocationSuccess = ((Double, Double) -> Void)
    typealias LocationFailure = (String) -> Void
    
    var getLocationSuccess: LocationSuccess? = nil
    var getLocationFailure: LocationFailure? = nil
    
    func getLocation(success: @escaping LocationSuccess, failure: @escaping LocationFailure) {
        if LocationManager.getAccessStatus() != .granted {
            failure("permission is not granted")
            return
        }
        locationManager?.stopUpdatingLocation()
        locationManager?.requestLocation()
        getLocationSuccess = success
        getLocationFailure = failure
    }
    
    func locationManager(_ manager: CLLocationManager, didChangeAuthorization status: CLAuthorizationStatus) {
        if LocationManager.getAccessStatus() != .granted {
            return
        }
    }
    
    func locationManager(_ manager: CLLocationManager, didUpdateLocations locations: [CLLocation]) {
        
        guard let coordinate = locations.last?.coordinate else {
            return
        }
        
        print("[LocationSync] New location captured: \(locations.last!.description)")
        
        getLocationSuccess?(coordinate.longitude, coordinate.latitude)
        getLocationSuccess = nil
        getLocationFailure = nil
    }
    
    func locationManager(_ manager: CLLocationManager, didFailWithError error: Error) {
        print("[LocationSync] locationRequest failed with error = \(error.localizedDescription)")
        getLocationFailure?(error.localizedDescription)
        getLocationSuccess = nil
        getLocationFailure = nil
    }
}
