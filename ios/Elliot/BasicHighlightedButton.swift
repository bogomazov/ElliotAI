//
//  BasicHighlightedButton.swift
//  Elliot
//
//  Created by ikbal kazar on 27/01/17.
//  Copyright © 2017 Elliot Technologies. All rights reserved.
//

import UIKit

class BasicHighlightedButton: UIButton {
    override var isHighlighted: Bool {
        didSet {
            if isHighlighted {
                self.alpha = 0.5
            } else {
                self.alpha = 1.0
            }
        }
    }
}

