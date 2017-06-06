//
//  TimeBlockTableViewCell.swift
//  Elliot
//
//  Created by ikbal kazar on 19/01/17.
//  Copyright © 2017 Elliot Technologies. All rights reserved.
//

import UIKit

class TimeBlockTableViewCell: UITableViewCell {
    @IBOutlet weak var timeLabel: UILabel!
    
    override func awakeFromNib() {
        super.awakeFromNib()
        timeLabel.layer.cornerRadius = timeLabel.frame.height / 2
        timeLabel.clipsToBounds = true
        timeLabel.layer.borderWidth = 1
        timeLabel.layer.borderColor = UIColor.gray.cgColor
    }
}
