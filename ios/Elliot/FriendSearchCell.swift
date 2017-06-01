//
//  FriendSearchCell.swift
//  Elliot
//
//  Created by ikbal kazar on 05/05/2017.
//  Copyright © 2017 Elliot Technologies. All rights reserved.
//

import Foundation
import UIKit
import Nuke

class FriendSearchCell: UITableViewCell {
    
    @IBOutlet weak var profileImageView: UIImageView!
    @IBOutlet weak var nameLabel: UILabel!
    
    override func awakeFromNib() {
        super.awakeFromNib()
        profileImageView.layer.cornerRadius = profileImageView.frame.width / 2
        profileImageView.clipsToBounds = true
    }
    
    func configure(person: Friend) {
        nameLabel.text = person.fullName()
        profileImageView.image = nil
        guard let urlStr = person.imageURL else { return }
        guard let url = URL(string: urlStr) else { return }
        Nuke.loadImage(with: url, into: profileImageView)
    }
}
