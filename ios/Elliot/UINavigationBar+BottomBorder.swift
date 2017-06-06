//
//  UINavigationBar+BottomBorder.swift
//  Elliot
//
//  Created by Ikbal KAZAR on 5/22/17.
//  Copyright © 2017 Elliot Technologies. All rights reserved.
//

import Foundation
import UIKit

extension UINavigationBar {
    func setBottomBorder() {
        let width = UIScreen.main.bounds.width
        let view = UIView(frame: CGRect(x: 0, y: self.frame.height, width: width, height: 2))
        view.backgroundColor = UIColor.borderBeige()
        addSubview(view)
    }
}
