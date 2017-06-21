//
//  SuggestionsViewController.swift
//  Elliot
//
//  Created by ikbal kazar on 14/01/17.
//  Copyright © 2017 Elliot Technologies. All rights reserved.
//

import UIKit
import Nuke
import BRYXBanner
import SwiftyUserDefaults
import Presentr
import React

protocol SuggestionRemover: class {
    func remove(suggestion: Suggestion, senderTag: Int)
}

protocol Forwarder: class {
    func forwardToInvite()
}

protocol SuggestionsRefresher: class {
    func refreshData()
}

class SuggestionsViewController: UIViewController, UITableViewDelegate, UITableViewDataSource, SuggestionsRefresher {
    
    let explanationCellText = "Elliot suggests people and times for you to meet here. Tap 'More Options' on a suggestion to find another time to meet."
    
    let declineSegueId = "declineSuggestion"
    let differentTimeSegueId = "differentTime"
    
    let horizontalPresenter: Presentr = {
        let presenter = Presentr(presentationType: .fullScreen)
        presenter.transitionType = .coverHorizontalFromRight
        return presenter
    }()
    
    @IBOutlet weak var tableView: UITableView!
    var topView: UIView!
    var loadingIndicator: UIActivityIndicatorView!
    
    var suggestions: [Suggestion] = []
    var isGettingRejected: [Bool] = []
    var shouldShowFriendSearch = false
    
    var reactView: RCTRootView?
    
    override func viewDidLoad() {
        super.viewDidLoad()
        //Timer.scheduledTimer(timeInterval: 300.0, target: self, selector: #selector(self.refreshData),
        //                     userInfo: nil, repeats: true)
        
        self.tableView.rowHeight = UITableViewAutomaticDimension
        self.tableView.estimatedRowHeight = 220
        self.tableView.backgroundColor = UIColor.tableBackground()
        
        self.navigationController?.navigationBar.barTintColor = UIColor.navigationAndTabBar()
        self.navigationController?.navigationBar.setBottomBorder()
        
        self.navigationItem.titleView = UIImageView(image: UIImage(named: "logo-bar")!)
        
        self.topView = setUpBannerOnNavigationBar()
        
        loadingIndicator = UIActivityIndicatorView(activityIndicatorStyle: .white)
        loadingIndicator.color = UIColor.elliotBeige()
        loadingIndicator.center = self.view.center
        self.view.addSubview(loadingIndicator)
        /*
        informThenRefresh()
        
        NotificationCenter.default.addObserver(self, selector: #selector(self.informThenRefresh),
                                               name: NotificationNames.foregroundUpdate, object: nil)
        NotificationCenter.default.addObserver(self, selector: #selector(self.onNewMeeting),
                                               name: NotificationNames.newMeetingPushNotif, object: nil)
        NotificationCenter.default.addObserver(self, selector: #selector(self.refreshData),
                                               name: NotificationNames.refreshSuggestions, object: nil)
        */
        navigationController?.setNavigationBarHidden(true, animated: false)
        initReactView()
        
        NotificationCenter.default.addObserver(self, selector: #selector(self.hideBottomBar),
                                               name: NSNotification.Name.init("hide-bottom-bar"), object: nil)
        NotificationCenter.default.addObserver(self, selector: #selector(self.showBottomBar),
                                               name: NSNotification.Name.init("show-bottom-bar"), object: nil)
    }
    
    func initReactView() {
        ReactFactory.rootViewController = self
        reactView = ReactFactory.shared.createView(name: "Elliot",
                                                       props: ["nativeIOS": ["accessToken": AuthorizationManager.shared.serverAuthToken!]])
        guard let bottomBarHeight = tabBarController?.tabBar.frame.height else { return }
        reactView?.frame = CGRect(x: 0, y: 20, width: view.frame.width, height: view.frame.height - bottomBarHeight - 20)
        hideBottomBar()
        view.addSubview(reactView!)
        
        let barView = UIView(frame: CGRect(x: 0, y: 0, width: view.frame.width, height: 20))
        barView.backgroundColor = UIColor.navigationAndTabBar()
        view.addSubview(barView)
    }
    
    func hideBottomBar() {
        reactView?.frame = CGRect(x: 0, y: 20, width: view.frame.width, height: view.frame.height - 20)
        self.tabBarController?.tabBar.isHidden = true
    }
    
    func showBottomBar() {
        guard let bottomBarHeight = tabBarController?.tabBar.frame.height else { return }
        reactView?.frame = CGRect(x: 0, y: 20, width: view.frame.width, height: view.frame.height - 20 - bottomBarHeight)
        self.tabBarController?.tabBar.isHidden = false
    }
    
    func onNewMeeting(notif: NSNotification) {
        if let text = notif.userInfo?["alert"] as? String {
            showBanner(onView: self.topView, title: "New Confirmed Meeting!", subtitle: text)
        }
    }
    
    // Ensures the order of requests.
    // i.e. provides back-end with location and calendar data before loading suggestions.
    func informThenRefresh() {
        return
        print("[LocationSync] \(#function)")
        if suggestions.count == 0 {
            loadingIndicator.startAnimating()
        }
        ensureLocationIsPosted(attempts: 3) { (locationSuccess) in
            print("[LocationSync] post location result = \(locationSuccess)")
            CalendarManager.shared.postUpdate(completion: { [weak self] (calendarSuccess) in
                print("[LocationSync] post calendar events result = \(calendarSuccess)")
                self?.refreshData()
            })
        }
    }
    
    func ensureLocationIsPosted(attempts: Int, completion: @escaping (Bool) -> Void) {
        if LocationManager.getAccessStatus() != .granted {
            // if location access is not granted, minimize latency
            completion(false)
            return
        }
        LocationManager.shared.postUpdate { [weak self] (success) in
            if success {
                completion(true)
                return
            }
            if attempts > 0 {
                self?.ensureLocationIsPosted(attempts: attempts - 1, completion: completion)
            } else {
                completion(false)
            }
        }
    }
    
    func refreshData() {
        return
        print("[LocationSync] Refreshing Suggestions")
        let request = Request(method: .get, path: "/suggestions")
        NetworkManager.shared.make(request: request) { (json, success) in
            if self.loadingIndicator.isAnimating {
                self.loadingIndicator.stopAnimating()
            }
            if success {
                self.suggestions = []
                self.isGettingRejected = []
                for (_, object) in json {
                    self.suggestions.append(Suggestion.deserialize(json: object))
                    self.isGettingRejected.append(false)
                }
                self.shouldShowFriendSearch = (self.suggestions.count >= 5)
                self.reloadTable()
            }
        }
    }
    
    func showForward() -> Bool {
        return true
    }
    
    func showInstructions() -> Bool {
        return !Defaults[.noExplanationOnSuggestions] && !UsageStats.isExperienced()
    }
    
    func numberOfRows() -> Int {
        var numRows = suggestions.count + (shouldShowFriendSearch ? 1 : 0)
        numRows += (showForward() ? 1 : 0)
        numRows += (showInstructions() ? 1 : 0)
        return numRows
    }
    
    enum CellType {
        case friendSearch
        case sugggestion(Int)
        case forward
        case instruction
    }
    
    var cellTypes: [CellType] = []
    
    func reloadTable() {
        cellTypes = []
        if showInstructions() {
            cellTypes.append(.instruction)
        }
        if shouldShowFriendSearch {
            cellTypes.append(.friendSearch)
        }
        for i in 0 ..< suggestions.count {
            cellTypes.append(.sugggestion(i))
        }
        if showForward() {
            cellTypes.append(.forward)
        }
        tableView.reloadData()
    }
    
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return cellTypes.count
    }
    
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let type = cellTypes[indexPath.row]
        switch type {
        case .instruction:
            let instructionCell = tableView.dequeueReusableCell(withIdentifier: "explanationCell",
                                                                for: indexPath) as! ExplanationCell
            instructionCell.configure(text: explanationCellText, closeAction: { [weak self] in
                Defaults[.noExplanationOnSuggestions] = true
                self?.cellTypes.remove(at: indexPath.row)
                self?.tableView.deleteRows(at: [indexPath], with: .fade)
            })
            instructionCell.selectionStyle = .none
            return instructionCell
        
        case .forward:
            let cellID = suggestions.count > 0 ? "forwardCell2" : "forwardCell"
            let forwardCell = tableView.dequeueReusableCell(withIdentifier: cellID,
                                                            for: indexPath) as! ForwardToInviteCell
            forwardCell.selectionStyle = .none
            return forwardCell
            
        case let .sugggestion(index):
            let cell = tableView.dequeueReusableCell(withIdentifier: "suggestionCell",
                                                     for: indexPath) as! SuggestionTableViewCell
            cell.delegate = self
            let suggestion = suggestions[index]
            cell.configure(suggestion: suggestion, isGettingRejected: isGettingRejected[index])
            cell.selectionStyle = .none
            return cell
            
        case .friendSearch:
            let cell = tableView.dequeueReusableCell(withIdentifier: "findFriendsCell",
                                                     for: indexPath) as! FindFriendsCell
            cell.selectionStyle = .none
            return cell
        }
    }
    
    func tableView(_ tableView: UITableView, viewForFooterInSection section: Int) -> UIView? {
        return UIView()
    }
    
    func tableView(_ tableView: UITableView, heightForFooterInSection section: Int) -> CGFloat {
        return 15
    }
    
    func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        tableView.deselectRow(at: indexPath, animated: true)
        let cell = tableView.cellForRow(at: indexPath)
        if cell is FindFriendsCell {
            let storyboard = UIStoryboard(name: "Main", bundle: nil)
            let vc = storyboard.instantiateViewController(withIdentifier: "FriendSearchVC")
            DispatchQueue.main.async { [weak self] in
                self?.present(vc, animated: true, completion: nil)
            }
            return
        }
        
        guard let sugCell = cell as? SuggestionTableViewCell else { return }
        let suggestion = sugCell.suggestion
        DispatchQueue.main.async { [weak self] in
            guard let stself = self else { return }
            let storyboard = UIStoryboard(name: "Main", bundle: nil)
            let vc = storyboard.instantiateViewController(withIdentifier: "AcceptVC") as! AcceptSuggestionViewController
            vc.suggestion = suggestion
            vc.remover = stself
            stself.customPresentViewController(stself.horizontalPresenter, viewController: vc,
                                               animated: true, completion: nil)
        }
    }
    
    func tableView(_ tableView: UITableView, willDisplay cell: UITableViewCell, forRowAt indexPath: IndexPath) {
        
    }
    
    var activeSuggestion: Suggestion?
    
    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        super.prepare(for: segue, sender: sender)
        switch segue.identifier! {
        case differentTimeSegueId:
            let vc = segue.destination as! DifferentTimeViewController
            vc.baseSuggestion = activeSuggestion
            vc.baseFriend = activeSuggestion?.person
            vc.remover = self
            vc.homePageRefresher = self
        default:
            break
        }
    }
    
    // This is called only when users accept a suggestion.
    @IBAction func unwindToSuggestionsFeed(segue: UIStoryboardSegue) {
        refreshData()
        if !UsageStats.isExperienced() {
            showBanner(onView: self.topView,
                       title: "Great! You accepted a suggestion",
                       subtitle: "Meeting will be scheduled once Elliot finds a time that works for both of you")
        }
    }
}

extension SuggestionsViewController: SuggestionCellDelegate {
    // Deprecated, we are using tableViewDidSelect: instead.
    func accept(suggestion: Suggestion) {
    }
    
    func rejectAndRefresh(index: IndexPath, suggestion: Suggestion) {
        guard case let .sugggestion(sugIndex) = cellTypes[index.row] else { return }
        isGettingRejected[sugIndex] = true
        tableView.reloadRows(at: [index], with: .none)
        let request = RejectRequest(suggestionId: suggestion.id, responseType: "neither")
        NetworkManager.shared.make(request: request) { (json, success) in
            if success {
                self.refreshData()
            } else {
                // we can also show an error alert here.
                self.isGettingRejected[sugIndex] = false
                self.tableView.reloadRows(at: [index], with: .none)
            }
        }
    }
    
    func decline(cell: SuggestionTableViewCell, suggestion: Suggestion) {
        guard let index = tableView.indexPath(for: cell) else { return }
        UsageStats.reportRejectTap()
        if UsageStats.shouldWarnOnReject() {
            let alertMessage = "Tip for new users: This means you don't want to meet with \(suggestion.person.firstName) in the near future (they won't know that). If you would actually like to find another time to meet with \(suggestion.person.firstName) press 'More options' instead."
            let alert = UIAlertController(title: "Are you sure?",
                                          message: alertMessage,
                                          preferredStyle: .alert)
            let cancelAction = UIAlertAction(title: "Cancel", style: .destructive, handler: nil)
            let yesAction = UIAlertAction(title: "Yes", style: .default, handler: { (_) in
                self.rejectAndRefresh(index: index, suggestion: suggestion)
            })
            alert.addAction(cancelAction)
            alert.addAction(yesAction)
            present(alert, animated: true, completion: nil)
            return
        }
        rejectAndRefresh(index: index, suggestion: suggestion)
    }
    
    func differentTime(suggestion: Suggestion) {
        activeSuggestion = suggestion
        self.performSegue(withIdentifier: self.differentTimeSegueId, sender: self)
    }
}

extension SuggestionsViewController: SuggestionRemover {
    func remove(suggestion: Suggestion, senderTag: Int) {
        if let index = suggestions.index(where: {$0.id == suggestion.id}) {
            suggestions.remove(at: index)
            reloadTable()
        }
    }
}
