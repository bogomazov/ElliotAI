//
//  FindFriendsCell.swift
//  Elliot
//
//  Created by ikbal kazar on 05/05/2017.
//  Copyright © 2017 Elliot Technologies. All rights reserved.
//

import Foundation
import UIKit

class FindFriendsCell: UITableViewCell {
    @IBOutlet weak var topLabel: UILabel!
    @IBOutlet weak var bottomLabel: UILabel!
    @IBOutlet weak var wrapperView: UIView!
    
    override func awakeFromNib() {
        super.awakeFromNib()

        contentView.backgroundColor = UIColor.tableBackground()
        
        wrapperView.layer.cornerRadius = 10
        wrapperView.clipsToBounds = true
        wrapperView.layer.borderColor = UIColor.borderBeige().cgColor
        wrapperView.layer.borderWidth = 2.0
    }
}
