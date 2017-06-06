//
//  UIColor+Elliot.swift
//  Elliot
//
//  Created by ikbal kazar on 18/01/17.
//  Copyright © 2017 Elliot Technologies. All rights reserved.
//

import Foundation
import UIKit

extension UIColor {
    static func from(hex: Int, alpha: Double) -> UIColor {
        let red = (hex >> 16) & 0xFF
        let green = (hex >> 8) & 0xFF
        let blue = hex & 0xFF
        return UIColor(red: CGFloat(red) / 255.0, green: CGFloat(green) / 255.0, blue: CGFloat(blue) / 255.0, alpha: CGFloat(alpha))
    }
    
    static func darkElliotBeige() -> UIColor {
        return UIColor(red:0.70, green:0.65, blue:0.52, alpha:1.0)
    }
    
    static func elliotBeige(alpha: Double = 1.0) -> UIColor {
        return from(hex: 0xB3A784, alpha: alpha)
    }
    
    static func borderBeige() -> UIColor {
        return from(hex: 0xCEC19B, alpha: 1.0)
    }
    
    static func buttonGreen(alpha: Double = 1.0) -> UIColor {
        return from(hex: 0x139A9C, alpha: alpha)
    }
    
    static func tableBackground() -> UIColor {
        return from(hex: 0xF1F1F1, alpha: 1.0)
    }
    
    static func navigationAndTabBar() -> UIColor {
        return from(hex: 0xFFFFFF, alpha: 1.0)
    }
}
