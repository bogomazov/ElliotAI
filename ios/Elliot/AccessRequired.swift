//
//  AccessProtocol.swift
//  Elliot
//
//  Created by ikbal kazar on 08/01/17.
//  Copyright © 2017 Elliot Technologies. All rights reserved.
//

enum AccessStatus {
    case notDetermined
    case denied
    case granted
    
    static func hasEnabledAll() -> Bool {
        return LocationManager.getAccessStatus() == .granted &&
            ContactsManager.getAccessStatus() == .granted &&
            CalendarManager.getAccessStatus() == .granted
    }
}

protocol AccessRequired     {
    static func getAccessStatus() -> AccessStatus
    static func requestAccess(completion: @escaping () -> ()) -> Void
}
