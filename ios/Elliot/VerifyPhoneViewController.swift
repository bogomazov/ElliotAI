//
//  VerifyPhoneViewController.swift
//  Elliot
//
//  Created by Ikbal KAZAR on 5/22/17.
//  Copyright © 2017 Elliot Technologies. All rights reserved.
//

import UIKit
import PhoneNumberKit
import FacebookCore


class VerifyPhoneViewController: UIViewController {
    @IBOutlet weak var verifyButton: UIButton!
    @IBOutlet weak var elliotLabel: UILabel!
    @IBOutlet weak var reasonLabel: UILabel!
    @IBOutlet weak var sentSMSLabel: UILabel!
    @IBOutlet weak var numberTextField: PhoneNumberTextField!
    @IBOutlet weak var tryAgainButton: BasicHighlightedButton!
    @IBOutlet weak var textFieldFooter: UIView!
    
    var generatedToken: String? = nil
    let phoneNumberKit = PhoneNumberKit()
    
    // UI State
    var numberOfTries = 0
    var isEnteringPhoneNumber: Bool = true {
        didSet {
            verifyButton.isHidden = !isEnteringPhoneNumber
            sentSMSLabel.isHidden = isEnteringPhoneNumber
            numberTextField.isHidden = !isEnteringPhoneNumber
            tryAgainButton.isHidden = isEnteringPhoneNumber
            textFieldFooter.isHidden = !isEnteringPhoneNumber
            if isEnteringPhoneNumber {
                numberOfTries += 1
                configureTextField()
                numberTextField.becomeFirstResponder()
            } else {
                numberTextField.resignFirstResponder()
            }
        }
    }
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        view.backgroundColor = UIColor.elliotBeige()
        [elliotLabel, reasonLabel, sentSMSLabel].forEach {
            $0?.textColor = UIColor.white
        }
        
        [verifyButton, tryAgainButton].forEach {
            $0?.layer.cornerRadius = ($0?.frame.height)! / 2
            $0?.layer.borderColor = UIColor.white.cgColor
            $0?.layer.borderWidth = 2
            $0?.tintColor = UIColor.white
            $0?.backgroundColor = UIColor.elliotBeige()
            $0?.titleLabel?.font = UIFont.openSansSemiboldFontOfSize(24)
        }
        
        numberTextField.textColor = UIColor.white
        numberTextField.font = UIFont.openSansFontOfSize(24)
        numberTextField.tintColor = UIColor.black
        numberTextField.keyboardAppearance = UIKeyboardAppearance.dark
        
        isEnteringPhoneNumber = true
        
        NotificationCenter.default.addObserver(self,
                                               selector: #selector(self.gotToken),
                                               name: NotificationNames.gotSMSToken,
                                               object: nil)
    }
    
    deinit {
        NotificationCenter.default.removeObserver(self)
    }
    
    func configureTextField() {
        // Try to guess the number of the user only if this is the first try
        if numberOfTries <= 1,
            let fullName = UserProfile.current?.fullName,
            let number = ContactsManager.findNumberForFullName(fullName: fullName) {
            numberTextField.text = number
            return
        }
        // If failed to guess, pre-populate with country-code
        let regionCode = PhoneNumberKit.defaultRegionCode()
        if let countryCode = phoneNumberKit.countryCode(for: regionCode) {
            numberTextField.text = "+\(countryCode) "
        }
    }
    
    func showInvalidNumberAlert() {
        let errorAlert = UIAlertController.errorAlert(title: "Invalid Mobile Number", message: "Please make sure to enter your mobile number correctly.")
        present(errorAlert, animated: true, completion: nil)
    }
    
    @IBAction func tappedVerify(_ sender: Any) {
        guard let numText = numberTextField.text else {
            showInvalidNumberAlert()
            return
        }
        var number: String? = nil
        do {
            let phoneNumber = try phoneNumberKit.parse(numText)
            number = phoneNumberKit.format(phoneNumber, toType: .e164)
        } catch {
            showInvalidNumberAlert()
            return
        }
        generatedToken = "\(arc4random_uniform(900000) + 100000)" // 6 figure token
        let request = SMSNumberRequest(phoneNumber: number!, token: generatedToken!)
        NetworkManager.shared.make(request: request) { (json, success) in
            if !success {
                let errorAlert = UIAlertController.errorAlert(title: "Try Again", message: "Please make sure that you are connected to the internet")
                self.present(errorAlert, animated: true, completion: nil)
            } else {
                self.isEnteringPhoneNumber = false
            }
        }
    }
    
    @IBAction func tappedTryAgain(_ sender: Any) {
        isEnteringPhoneNumber = true
    }
    
    func gotToken(notif: NSNotification) {
        guard let token = notif.userInfo?["token"] as? String else { return }
        if token == generatedToken {
            SMSNotifManager.setVerifiedNumber()
            continueToApp()
        }
    }
    
    func continueToApp() {
        let appDelegate = UIApplication.shared.delegate as! AppDelegate
        appDelegate.showViewController(identifier: "main-vc")
    }
}
