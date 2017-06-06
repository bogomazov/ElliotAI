//
//  AlertController+Util.swift
//  Elliot
//
//  Created by ikbal kazar on 15/01/17.
//  Copyright © 2017 Elliot Technologies. All rights reserved.
//

import Foundation
import UIKit

extension UIAlertController {
    static func errorAlert(title: String, message: String) -> UIAlertController {
        let alert = UIAlertController(title: title, message: message, preferredStyle: .alert)
        let okAction = UIAlertAction(title: "OK", style: .default, handler: nil)
        alert.addAction(okAction)
        return alert
    }
    
    static func connectionError() -> UIAlertController {
        return errorAlert(title: "Connection Error", message: "Please check your internet connection")
    }
}
