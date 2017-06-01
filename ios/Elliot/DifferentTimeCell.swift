//
//  DifferentTimeCell.swift
//  Elliot
//
//  Created by ikbal kazar on 25/04/2017.
//  Copyright © 2017 Elliot Technologies. All rights reserved.
//

import UIKit
import Nuke

class DifferentTimeCell: UITableViewCell {
    @IBOutlet weak var descriptionLabel: UILabel!
    @IBOutlet weak var profileImageView: UIImageView!
    @IBOutlet weak var meetingTypeIcon: UIImageView!
    @IBOutlet weak var dateLabel: UILabel!
    @IBOutlet weak var wrapperView: UIView!
    
    override func awakeFromNib() {
        super.awakeFromNib()
        contentView.backgroundColor = UIColor.tableBackground()
        wrapperView.layer.cornerRadius = 15
        wrapperView.clipsToBounds = true
        profileImageView.layer.cornerRadius = profileImageView.frame.width / 2
        profileImageView.clipsToBounds = true
    }
    
    func configure(suggestion: Suggestion) {
        descriptionLabel.text = "\(suggestion.type) with \(suggestion.person.fullName())"
        dateLabel.text = suggestion.date.fullDateWithShortMonth()
        
        meetingTypeIcon.image = UIImage(named: suggestion.getIconName())
        profileImageView.image = nil
        if let urlStr = suggestion.person.imageURL,
            let url = URL(string: urlStr) {
            Nuke.loadImage(with: url, into: profileImageView)
        }
    }
}
