//
//  ContactTableViewCell.swift
//  Elliot
//
//  Created by ikbal kazar on 09/01/17.
//  Copyright © 2017 Elliot Technologies. All rights reserved.
//

import UIKit
import Contacts

class ContactTableViewCell: UITableViewCell {
    
    @IBOutlet weak var nameLabel: UILabel!
    @IBOutlet weak var contactImageView: UIImageView!
    @IBOutlet weak var initialsLabel: UILabel!
    @IBOutlet weak var smsImageView: UIImageView!

    var contact: CNContact?

    override func setHighlighted(_ highlighted: Bool, animated: Bool) {
        if highlighted {
            nameLabel.alpha = 0.5
            smsImageView.alpha = 0.5
        } else {
            nameLabel.alpha = 1.0
            smsImageView.alpha = 1.0
        }
    }
    
    func getInitials(contact: CNContact) -> String {
        var res: String = ""
        if let firstLetter = contact.givenName.characters.first {
            res += String(firstLetter)
        }
        if let secondLetter = contact.familyName.characters.first {
            res += String(secondLetter)
        }
        return res.uppercased()
    }
    
    func configure(contact: CNContact) {
        self.contact = contact
        let fullName = CNContactFormatter.string(from: contact, style: .fullName)
        
        nameLabel.text = fullName
        
        if let imageData = contact.thumbnailImageData {
            contactImageView.image = UIImage(data: imageData)
            contactImageView.isHidden = false
            initialsLabel.isHidden = true
        } else {
            initialsLabel.text = getInitials(contact: contact)
            initialsLabel.isHidden = false
            contactImageView.isHidden = true
        }
        
        contactImageView.layer.cornerRadius = contactImageView.frame.width / 2
        contactImageView.clipsToBounds = true
    
        initialsLabel.layer.cornerRadius = initialsLabel.frame.width / 2
        initialsLabel.clipsToBounds = true
    }
}
