//
//  MeetingDetailTableViewCell.swift
//  Elliot
//
//  Created by ikbal kazar on 18/01/17.
//  Copyright © 2017 Elliot Technologies. All rights reserved.
//

import UIKit

class MeetingDetailTableViewCell: UITableViewCell {
    @IBOutlet weak var theLabel: UILabel!
    @IBOutlet weak var iconImageView: UIImageView!
    var hasActiveButton: Bool!
    
    override func setHighlighted(_ highlighted: Bool, animated: Bool) {
        if !hasActiveButton {
            return
        }
        if highlighted {
            self.iconImageView.alpha = 0.5
            self.theLabel.alpha = 0.5
        } else {
            self.iconImageView.alpha = 1.0
            self.theLabel.alpha = 1.0
        }
    }
}
