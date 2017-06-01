//
//  DifferentTimeViewController.swift
//  Elliot
//
//  Created by ikbal kazar on 14/03/17.
//  Copyright © 2017 Elliot Technologies. All rights reserved.
//

import UIKit
import Presentr

class DifferentTimeViewController: UIViewController, UITableViewDataSource, UITableViewDelegate {
    
    let acceptSegueId = "differentTime-acceptSuggestion"
    
    let horizontalPresenter: Presentr = {
        let presenter = Presentr(presentationType: .fullScreen)
        presenter.transitionType = .coverHorizontalFromRight
        return presenter
    }()
    
    @IBOutlet weak var tableView: UITableView!
    var baseSuggestion: Suggestion?
    var baseFriend: Friend!
    weak var remover: SuggestionRemover?
    weak var homePageRefresher: SuggestionsRefresher?
    
    var suggestions: [Suggestion] = []
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        tableView.backgroundColor = UIColor.tableBackground()
        
        if let friendFBId = baseFriend.facebookID {
            let request = AnotherTimeRequest(friendFBId: friendFBId)
            NetworkManager.shared.make(request: request, completion: { (json, success) in
                if success {
                    self.suggestions = []
                    for (_, object) in json {
                        self.suggestions.append(Suggestion.deserialize(json: object))
                    }
                    self.tableView.reloadData()
                }
            })
        }
    }
    
    @IBAction func tappedBack(_ sender: Any) {
        homePageRefresher?.refreshData()
        dismiss(animated: true, completion: nil)
    }
    
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return suggestions.count
    }
    
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCell(withIdentifier: "differentTimeCell",
                                                 for: indexPath) as! DifferentTimeCell
        cell.configure(suggestion: suggestions[indexPath.row])
        cell.selectionStyle = .none
        return cell
    }
    
    func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        // Dispatching to main queue as a workaround solution 
        // for iOS 8 bug: https://forums.developer.apple.com/thread/5861
        DispatchQueue.main.async { [weak self] in
            guard let stself = self else { return }
            
            let storyboard = UIStoryboard(name: "Main", bundle: nil)
            let vc = storyboard.instantiateViewController(withIdentifier: "AcceptVC") as! AcceptSuggestionViewController
            vc.suggestion = stself.suggestions[indexPath.row]
            vc.remover = stself.remover
            vc.suggestionToReject = stself.baseSuggestion
            
            stself.customPresentViewController(stself.horizontalPresenter, viewController: vc,
                                               animated: true, completion: nil)
        }
    }
}
