//
//  CalendarEventTableViewCell.swift
//  Elliot
//
//  Created by ikbal kazar on 19/01/17.
//  Copyright © 2017 Elliot Technologies. All rights reserved.
//

import UIKit

class CalendarEventTableViewCell: UITableViewCell {
    @IBOutlet weak var beigeDot: UIView!
    @IBOutlet weak var locationLabel: UILabel!
    @IBOutlet weak var titleLabel: UILabel!
    @IBOutlet weak var dateLabel: UILabel!
    
    override func awakeFromNib() {
        super.awakeFromNib()
        beigeDot.layer.cornerRadius = beigeDot.frame.width / 2
        beigeDot.clipsToBounds = true
    }
}
