//
//  DeclineSuggestionTableViewCell.swift
//  Elliot
//
//  Created by ikbal kazar on 19/01/17.
//  Copyright © 2017 Elliot Technologies. All rights reserved.
//

import UIKit

class DeclineSuggestionTableViewCell: UITableViewCell {
    @IBOutlet weak var theLabel: UILabel!
    @IBOutlet weak var iconImageView: UIImageView!
    
    override func setHighlighted(_ highlighted: Bool, animated: Bool) {
        if highlighted {
            theLabel.alpha = 0.5
            iconImageView.alpha = 0.5
        } else {
            theLabel.alpha = 1.0
            iconImageView.alpha = 1.0
        }
    }
}
