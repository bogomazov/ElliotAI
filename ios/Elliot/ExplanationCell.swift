//
//  ExplanationCell.swift
//  Elliot
//
//  Created by ikbal kazar on 21/03/17.
//  Copyright © 2017 Elliot Technologies. All rights reserved.
//

import UIKit
import SwiftyUserDefaults

extension DefaultsKeys {
    static let noExplanationOnMeetings = DefaultsKey<Bool>("noExplanationOnMeetings");
    static let noExplanationOnSuggestions = DefaultsKey<Bool>("noExplanationOnSuggestions");
}

class ExplanationCell: UITableViewCell {
    @IBOutlet weak var label: UILabel!
    var closeAction: (() -> ())?
    
    func configure(text: String, closeAction: @escaping (() -> ())) {
        self.label.text = text
        self.closeAction = closeAction
        self.backgroundColor = UIColor.elliotBeige()
    }
    
    @IBAction func tappedClose(_ sender: Any) {
        closeAction?()
    }
}
