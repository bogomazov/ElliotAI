//
//  SearchController.swift
//  Elliot
//
//  Created by ikbal kazar on 06/05/2017.
//  Copyright © 2017 Elliot Technologies. All rights reserved.
//

import Foundation
import UIKit

protocol SearchControllerDelegate: class {
    func filterWith(text: String)
    func invalidateFilter()
}

class SearchController: NSObject, UISearchBarDelegate {
    weak var delegate: SearchControllerDelegate?
    var searchBar: UISearchBar
    
    init(searchBar: UISearchBar) {
        self.searchBar = searchBar
        super.init()
        self.searchBar.delegate = self
    }
    
    func searchBar(_ searchBar: UISearchBar, textDidChange searchText: String) {
        if searchText.characters.count == 0 {
            delegate?.invalidateFilter()
            return
        }
        delegate?.filterWith(text: searchText)
    }
    
    func enableCancelButton() {
        searchBar.showsCancelButton = true
        for parentView in searchBar.subviews {
            for view in parentView.subviews {
                if view.isKind(of: UIButton.self) {
                    let button = view as! UIButton
                    button.isEnabled = true
                    button.isUserInteractionEnabled = true
                }
            }
        }
    }
    
    func searchBarTextDidBeginEditing(_ searchBar: UISearchBar) {
        enableCancelButton()
    }
    
    func searchBarCancelButtonClicked(_ searchBar: UISearchBar) {
        searchBar.text = ""
        searchBar.resignFirstResponder()
        delegate?.invalidateFilter()
        searchBar.showsCancelButton = false
    }
    
    func searchBarSearchButtonClicked(_ searchBar: UISearchBar) {
        searchBar.resignFirstResponder()
        enableCancelButton()
    }
}
