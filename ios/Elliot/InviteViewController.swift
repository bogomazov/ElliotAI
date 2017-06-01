//
//  InviteViewController.swift
//  Elliot
//
//  Created by ikbal kazar on 08/01/17.
//  Copyright © 2017 Elliot Technologies. All rights reserved.
//

import UIKit
import Contacts
import MessageUI
import FacebookShare
import Social

class InviteButton: UIButton {
    override var isHighlighted: Bool {
        didSet {
            if isHighlighted {
                backgroundColor = UIColor.white
            } else {
                backgroundColor = UIColor.groupTableViewBackground
            }
        }
    }
}

class InviteViewController: UIViewController, UITableViewDataSource, UITableViewDelegate {

    @IBOutlet var tableView: UITableView!
    @IBOutlet weak var searchBar: UISearchBar!
    @IBOutlet weak var messageButton: UIButton!
    @IBOutlet weak var emailButton: UIButton!
    @IBOutlet weak var messageIndicator: UIView!
    @IBOutlet weak var emailIndicator: UIView!
    
    var onMessageButton: Bool = true {
        didSet {
            refreshUI()
        }
    }
    
    var messageContacts: [CNContact] = []
    var emailContacts: [CNContact] = []
    var contacts: [CNContact] = []
    var filteredContacts: [CNContact] = []
    var shouldShowSearchResults = false
    
    var inviteActionLabel: UILabel!
    
    var topView: UIView!
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        self.navigationController?.navigationBar.barTintColor = UIColor.navigationAndTabBar()
        self.navigationController?.navigationBar.setBottomBorder()
        messageIndicator.backgroundColor = UIColor.borderBeige()
        emailIndicator.backgroundColor = UIColor.borderBeige()
        
        self.inviteActionLabel = UILabel()
        self.inviteActionLabel.text = "Tell Friends About Elliot"
        self.inviteActionLabel.font = UIFont.openSansBoldFontOfSize(16)
        self.inviteActionLabel.textColor = UIColor.darkElliotBeige()
        self.inviteActionLabel.sizeToFit()
        self.inviteActionLabel.adjustsFontSizeToFitWidth = false
        if #available(iOS 10.0, *) {
            self.inviteActionLabel.adjustsFontForContentSizeCategory = false
        }
        
        self.navigationItem.titleView = self.inviteActionLabel
        
        self.topView = setUpBannerOnNavigationBar()
    }
    
    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(animated)
    
        DispatchQueue.global().async {
            ContactsManager.shared.fetchContacts()
            let contacts = ContactsManager.shared.contacts
            self.messageContacts = contacts.filter({ (contact) -> Bool in
                return ContactsManager.findBestNumberForSMS(contact: contact) != nil
            })
            self.emailContacts = contacts.filter({ (contact) -> Bool in
                contact.emailAddresses.count > 0
            })
            DispatchQueue.main.async {
                self.refreshUI()
            }
        }
    }
    
    func refreshUI() {
        messageIndicator.isHidden = !onMessageButton
        emailIndicator.isHidden = onMessageButton
        messageButton.backgroundColor = onMessageButton ? UIColor.white : UIColor.groupTableViewBackground
        emailButton.backgroundColor = onMessageButton ? UIColor.groupTableViewBackground : UIColor.white
        
        contacts = onMessageButton ? messageContacts : emailContacts
        applySearchAndRefresh()
    }
    
    @IBAction func tappedMessage(_ sender: UIButton) {
        onMessageButton = true
    }
    
    @IBAction func tappedEmail(_ sender: UIButton) {
        onMessageButton = false
    }
    
    // MARK - Table View
    
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return shouldShowSearchResults ? filteredContacts.count : contacts.count
    }
    
    func contactFor(row: Int) -> CNContact {
        return shouldShowSearchResults ? filteredContacts[row] : contacts[row]
    }
    
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let identifier = onMessageButton ? "inviteCell" : "emailInviteCell"
        let cell = tableView.dequeueReusableCell(withIdentifier: identifier) as! ContactTableViewCell
        
        cell.configure(contact: contactFor(row: indexPath.row))

        return cell
    }
    
    func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        if onMessageButton {
            sendTextMessage(contact: contactFor(row: indexPath.row))
        } else {
            sendEMail(contact: contactFor(row: indexPath.row))
        }
        tableView.deselectRow(at: indexPath, animated: true)
    }
    
    func sendGrowthRequest(channel: String, person: String) {
        let request = GrowthLogRequest(channel: channel, person: person)
        NetworkManager.shared.make(request: request) { (json, success) in
            if success {
                print(json)
            }
        }
    }
    
    var personForBanner: String? = nil
    
    func showInvitationBanner() {
        // Make sure each 'personForBanner' is used only once
        defer {
            personForBanner = nil
        }
        var subtitle: String
        if let name = personForBanner {
            subtitle = "You sent an invitation to \(name)"
        } else {
            subtitle = "You sent an invitation to a friend"
        }
        showBanner(onView: self.topView,
                   title: "Invitation is Successful!",
                   subtitle: subtitle)
    }
    
    // MARK - Social invitation channels
    
    func sendTextMessage(contact: CNContact) {
        guard let phoneNumber = ContactsManager.findBestNumberForSMS(contact: contact) else {
            return
        }
        let composeVC = MFMessageComposeViewController()
        if !(MFMessageComposeViewController.canSendText()) {
            return
        }
        let fullName = CNContactFormatter.string(from: contact, style: .fullName)
        
        sendGrowthRequest(channel: "sms", person: fullName!)
        
        composeVC.messageComposeDelegate = self
        composeVC.recipients = [phoneNumber.stringValue]
        composeVC.body = "Hey \(contact.givenName), let's catch up soon! I am using this new app called Elliot to stay in touch with friends. http://elliot.ai"
        
        personForBanner = contact.givenName
        
        // We might want to show an activity indicator here.
        // it sometimes takes to much to present composeVC
        self.present(composeVC, animated: true, completion: nil)
    }
    
    func sendEMail(contact: CNContact) {
        let composeVC = MFMailComposeViewController()
        composeVC.mailComposeDelegate = self
        if contact.emailAddresses.count == 0 || !MFMailComposeViewController.canSendMail() {
            return
        }
        let fullName = CNContactFormatter.string(from: contact, style: .fullName)
        sendGrowthRequest(channel: "email", person: fullName!)
        let emailAddress = contact.emailAddresses[0]
        composeVC.setSubject("Try out Elliot!")
        composeVC.setToRecipients([emailAddress.value as String])
        composeVC.setMessageBody("Hey \(contact.givenName), let's catch up soon! I am using this new app called Elliot to stay in touch with friends. http://elliot.ai", isHTML: false)
        
        personForBanner = contact.givenName
        
        self.present(composeVC, animated: true, completion: nil)
    }
    
    @IBAction func inviteOnMessengerTapped(_ sender: UIButton) {
        sendGrowthRequest(channel: "fb-messenger", person: "")
        
        guard let url = URL(string: "http://elliot.ai") else {
            return
        }
        guard let shareVC = SLComposeViewController(forServiceType: "com.facebook.Messenger.ShareExtension") else {
            return
        }
        shareVC.add(url)
        shareVC.setInitialText("Let's catch up soon! I am using this new app called Elliot to stay in touch with friends, check it out.")
        present(shareVC, animated: true, completion: nil)
    }
    
    @IBAction func tappedFBShare(_ sender: UIButton) {
        sendGrowthRequest(channel: "fb-share", person: "")
        
        guard let url = URL(string: "http://elliot.ai") else {
            return
        }
        let content = LinkShareContent(url: url, title: "Elliot",
                                       description: "Try out Elliot, a new app to meet with friends!",
                                       quote: nil, imageURL: nil)
        let dialog = ShareDialog(content: content)
        do {
            try dialog.show()
        } catch {
            let alert = UIAlertController.errorAlert(title: "Error",
                                                     message: "Could not open facebook share dialog")
            present(alert, animated: true, completion: nil)
        }
    }
    
    @IBAction func tappedTweet(_ sender: UIButton) {
        sendGrowthRequest(channel: "twitter", person: "")
        guard let shareVC = SLComposeViewController(forServiceType: SLServiceTypeTwitter) else {
            return
        }
        shareVC.setInitialText("Try out Elliot, a new app to meet with friends!")
        guard let url = URL(string: "http://elliot.ai") else {
            return
        }
        shareVC.add(url)
        present(shareVC, animated: true, completion: nil)
    }
    
    func handleFailedComposeVCResult() {
        print("Could not send the invitation.")
        let alert = UIAlertController(title: "Error", message: "Could not send the invitation", preferredStyle: .alert)
        let okAction = UIAlertAction(title: "OK", style: .default, handler: nil)
        alert.addAction(okAction)
        self.present(alert, animated: true, completion: nil)
    }
}

extension InviteViewController: UISearchBarDelegate {
    func searchBar(_ searchBar: UISearchBar, textDidChange searchText: String) {
        if searchText.characters.count == 0 {
            shouldShowSearchResults = false
            tableView.reloadData()
            return
        }
        applySearchAndRefresh()
    }
    
    func applySearchAndRefresh() {
        defer {
            tableView.reloadData()
            tableView.setContentOffset(CGPoint(x: 0, y: 0), animated: true)
        }
        
        guard let searchedText = searchBar.text else { return }
        guard searchedText.characters.count > 0 else { return }
        filteredContacts = contacts.filter({ (contact) -> Bool in
            guard let fullName = CNContactFormatter.string(from: contact, style: .fullName) else {
                return false
            }
            return fullName.lowercased().contains(searchedText.lowercased())
        });
        shouldShowSearchResults = true
    }
    
    func showAll() {
        shouldShowSearchResults = false
        tableView.reloadData()
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
        showAll()
        searchBar.showsCancelButton = false
    }
    
    func searchBarSearchButtonClicked(_ searchBar: UISearchBar) {
        searchBar.resignFirstResponder()
        enableCancelButton()
    }
}

extension InviteViewController: MFMessageComposeViewControllerDelegate {
    func messageComposeViewController(_ controller: MFMessageComposeViewController, didFinishWith result: MessageComposeResult) {
        controller.dismiss(animated: true) {
            if result == .sent {
                self.showInvitationBanner()
            } else if result == .failed {
                self.handleFailedComposeVCResult()
            }
        }
    }
}

extension InviteViewController: MFMailComposeViewControllerDelegate {
    func mailComposeController(_ controller: MFMailComposeViewController, didFinishWith result: MFMailComposeResult, error: Error?) {
        controller.dismiss(animated: true) {
            if result == .sent {
                self.showInvitationBanner()
            } else if result == .failed {
                self.handleFailedComposeVCResult()
            }
        }
    }
}
