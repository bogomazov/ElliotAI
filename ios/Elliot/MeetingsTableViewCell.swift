//
//  MeetingsTableViewCell.swift
//  Elliot
//
//  Created by ikbal kazar on 11/01/17.
//  Copyright © 2017 Elliot Technologies. All rights reserved.
//

import UIKit

class MeetingsTableViewCell: UITableViewCell {

    @IBOutlet weak var wrapperView: UIView!
    @IBOutlet weak var titleLabel: UILabel!
    @IBOutlet weak var dateLabel: UILabel!
    @IBOutlet weak var timeLabel: UILabel!
    @IBOutlet weak var profileImageView: UIImageView!
    
    override func awakeFromNib() {
        super.awakeFromNib()
        
        contentView.backgroundColor = UIColor.tableBackground()
        
        profileImageView.layer.cornerRadius = profileImageView.frame.width / 2
        profileImageView.clipsToBounds = true
    }
    
    func configure(meeting: Meeting) {
        wrapperView.layer.cornerRadius = 10
        wrapperView.clipsToBounds = true
        titleLabel.text = "\(meeting.type) with \(meeting.person.fullName())"
        timeLabel.text = meeting.datetime.basicTimeString()
        dateLabel.text = meeting.datetime.fullDateWithShortMonth()
    }
}
