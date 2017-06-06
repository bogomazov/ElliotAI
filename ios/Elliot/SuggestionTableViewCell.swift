//
//  SuggestionTableViewCell.swift
//  Elliot
//
//  Created by ikbal kazar on 14/01/17.
//  Copyright © 2017 Elliot Technologies. All rights reserved.
//

import UIKit
import Nuke

protocol SuggestionCellDelegate: class {
    func accept(suggestion: Suggestion)
    func decline(cell: SuggestionTableViewCell, suggestion: Suggestion)
    func differentTime(suggestion: Suggestion)
}

class HighlightedButton: UIButton {
    override var isHighlighted: Bool {
        didSet {
            if isHighlighted {
                self.backgroundColor = UIColor.elliotBeige(alpha: 0.6)
            } else {
                self.backgroundColor = UIColor.white
            }
        }
    }
}

class SuggestionTableViewCell: UITableViewCell {
    
    @IBOutlet weak var wrapperView: UIView!
    @IBOutlet weak var descriptionLabel: UILabel!
    @IBOutlet weak var dateLabel: UILabel!
    @IBOutlet weak var typeImageView: UIImageView!
    @IBOutlet weak var profileImageView: UIImageView!
    @IBOutlet weak var noButton: UIButton!
    @IBOutlet weak var differentTimeButton: HighlightedButton!
    @IBOutlet weak var reasonLabel: UILabel!
    @IBOutlet weak var differentTimeLabel: UILabel!
    
    var loadingIndicator: UIActivityIndicatorView!
    
    weak var delegate: SuggestionCellDelegate?
    var suggestion: Suggestion?
    
    override func awakeFromNib() {
        super.awakeFromNib()
        
        contentView.backgroundColor = UIColor.tableBackground()
        
        wrapperView.layer.cornerRadius = 10
        wrapperView.clipsToBounds = true
    
        profileImageView.layer.cornerRadius = profileImageView.frame.width / 2
        profileImageView.clipsToBounds = true
    
        loadingIndicator = UIActivityIndicatorView(activityIndicatorStyle: .white)
        loadingIndicator.center = noButton.center
        noButton.superview?.addSubview(loadingIndicator)
    }
    
    func configure(suggestion: Suggestion, isGettingRejected: Bool) {
        self.suggestion = suggestion
        descriptionLabel.text = "\(suggestion.type) with \(suggestion.person.fullName())"
        dateLabel.text = suggestion.date.fullDateWithShortMonth()
        differentTimeLabel.text = "Show Less of \(suggestion.person.firstName)"
        
        if isGettingRejected {
            noButton.backgroundColor = UIColor.elliotBeige(alpha: 0.6)
            loadingIndicator.startAnimating()
        } else {
            noButton.backgroundColor = UIColor.white
            loadingIndicator.stopAnimating()
        }
        
        typeImageView.image = UIImage(named: suggestion.getIconName())
        profileImageView.image = nil
        if let urlStr = suggestion.person.imageURL,
            let url = URL(string: urlStr) {
            Nuke.loadImage(with: url, into: profileImageView)
        }
    }
    
    @IBAction func tappedNo(_ sender: UIButton) {
        if suggestion != nil {
            self.delegate?.decline(cell: self, suggestion: self.suggestion!)
        }
    }
    
    @IBAction func tappedDifferentTime(_ sender: UIButton) {
        if suggestion != nil {
            self.delegate?.differentTime(suggestion: self.suggestion!)
        }
    }
}
