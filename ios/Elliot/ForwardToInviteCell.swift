//
//  ForwardToInviteCell.swift
//  Elliot
//
//  Created by ikbal kazar on 20/01/17.
//  Copyright © 2017 Elliot Technologies. All rights reserved.
//

import UIKit

class ForwardToInviteCell: UITableViewCell {

    @IBOutlet weak var wrapperView: UIView!
    @IBOutlet weak var forwardButton: UIButton!
    
    override func awakeFromNib() {
        super.awakeFromNib()
        
        contentView.backgroundColor = UIColor.tableBackground()
        
        wrapperView.layer.cornerRadius = 10
        wrapperView.clipsToBounds = true
        
        forwardButton.layer.cornerRadius = 15
        forwardButton.layer.borderWidth = 1
        forwardButton.layer.borderColor = UIColor.darkElliotBeige().cgColor
        forwardButton.clipsToBounds = true
    }

    @IBAction func tappedForward(_ sender: Any) {
        NotificationCenter.default.post(name: NotificationNames.showInvite, object: self)
    }
}
