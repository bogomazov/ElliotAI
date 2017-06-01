//
//  FriendSearchViewController.swift
//  Elliot
//
//  Created by ikbal kazar on 05/05/2017.
//  Copyright © 2017 Elliot Technologies. All rights reserved.
//

import UIKit

class FriendSearchViewController: UIViewController, UITableViewDataSource, UITableViewDelegate {

    @IBOutlet weak var tableView: UITableView!
    @IBOutlet weak var searchBar: UISearchBar!
    
    var friends: [Friend] = []
    var tableData: [Friend] = []
    
    var searchController: SearchController!
    
    override func viewDidLoad() {
        super.viewDidLoad()
        searchBar.tintColor = UIColor.elliotBeige()
        searchController = SearchController(searchBar: searchBar)
        searchController.delegate = self
        
        // hides separator lines between empty cells
        tableView.tableFooterView = UIView(frame: CGRect.zero)
    }
    
    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(animated)
        
        let request = Request(method: .get, path: "/friends")
        NetworkManager.shared.make(request: request) { (json, success) in
            guard success else { return }
            self.friends = []
            for (_, object) in json {
                self.friends.append(Friend.deserialize(json: object))
            }
            self.refreshData()
        }
    }
    
    func refreshData() {
        guard let searchedText = searchBar.text,
            searchedText.characters.count > 0 else {
            invalidateFilter()
            return
        }
        filterWith(text: searchedText)
    }
    
    @IBAction func tappedDismiss(_ sender: Any) {
        dismiss(animated: true, completion: nil)
    }
    
    // MARK - TableViewDataSource
    
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return tableData.count
    }
    
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCell(withIdentifier: "friend-search-cell",
                                                 for: indexPath) as! FriendSearchCell
        cell.configure(person: tableData[indexPath.row])
        return cell
    }
    
    // MARK - TableViewDelegate
    
    func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        tableView.deselectRow(at: indexPath, animated: true)
        let friend = tableData[indexPath.row]
        
        let storyboard = UIStoryboard(name: "Main", bundle: nil)
        let vc = storyboard.instantiateViewController(withIdentifier: "AnotherTimeVC") as! DifferentTimeViewController
        vc.baseFriend = friend
        present(vc, animated: true, completion: nil)
    }
}

extension FriendSearchViewController: SearchControllerDelegate {
    func filterWith(text: String) {
        tableData = []
        for friend in friends {
            let fullName = friend.fullName().lowercased()
            if fullName.contains(text.lowercased()) {
                tableData.append(friend)
            }
        }
        tableView.reloadData()
    }
    
    func invalidateFilter() {
        tableData = friends
        tableView.reloadData()
    }
}
