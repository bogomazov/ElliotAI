//
//  PermissionsViewController.swift
//  Elliot
//
//  Created by ikbal kazar on 08/01/17.
//  Copyright © 2017 Elliot Technologies. All rights reserved.
//

import UIKit
import SwiftyUserDefaults

class PermissionsViewController: UIViewController {

    @IBOutlet weak var enableLocationButton: UIButton!
    @IBOutlet weak var enableContactsButton: UIButton!
    @IBOutlet weak var enableCalendarsButton: UIButton!
    @IBOutlet weak var continueButton: UIButton!
    
    override func viewDidLoad() {
        super.viewDidLoad()
        enableContactsButton.layer.cornerRadius = 15
        enableLocationButton.layer.cornerRadius = 15
        enableCalendarsButton.layer.cornerRadius = 15
        
        enableContactsButton.layer.borderWidth = 1
        enableContactsButton.layer.borderColor = UIColor.white.cgColor
        
        enableLocationButton.layer.borderWidth = 1
        enableLocationButton.layer.borderColor = UIColor.white.cgColor
        
        enableCalendarsButton.layer.borderWidth = 1
        enableCalendarsButton.layer.borderColor = UIColor.white.cgColor
    }
    
    override func viewDidAppear(_ animated: Bool) {
        super.viewDidAppear(animated)
        refreshButtonColors()
    }
    
    lazy var forwardToSettingsAlert: UIAlertController = {
        let alert = UIAlertController(title: "Enable from Settings", message: "Please give permissions from settings",  preferredStyle: .alert)
        let cancelAction = UIAlertAction(title: "Cancel", style: .cancel, handler: nil)
        let settingsAction = UIAlertAction(title: "Settings", style: .default, handler: {
            action in
            let settingsUrl = URL(string: UIApplicationOpenSettingsURLString)!
            if #available(iOS 10, *) {
                UIApplication.shared.open(settingsUrl)
            } else {
                UIApplication.shared.openURL(settingsUrl)
            }
        })
        alert.addAction(cancelAction)
        alert.addAction(settingsAction)
        return alert
    }()
    
    func refreshButtonColors() {
        if LocationManager.getAccessStatus() == .granted {
            enableLocationButton.backgroundColor = UIColor.elliotBeige()
        }
        if ContactsManager.getAccessStatus() == .granted {
            enableContactsButton.backgroundColor = UIColor.elliotBeige()
        }
        if CalendarManager.getAccessStatus() == .granted {
            enableCalendarsButton.backgroundColor = UIColor.elliotBeige()
        }
        
        if AccessStatus.hasEnabledAll() {
            continueForward()
        }
    }
    
    func continueForward() {
        let appDelegate = UIApplication.shared.delegate as! AppDelegate
        if SMSNotifManager.hasVerifiedNumber() {
            appDelegate.showViewController(identifier: "main-vc")
        } else {
            appDelegate.showViewController(identifier: "verify-phone-vc")
        }
    }
    
    @IBAction func tappedContinue(_ sender: UIButton) {
        if CalendarManager.getAccessStatus() != .granted {
            let alert = UIAlertController.errorAlert(title: "Please enable calendars first so that Elliot can schedule for you.", message: "")
            present(alert, animated: true, completion: nil)
            return
        }
        if AccessStatus.hasEnabledAll() {
            continueForward()
            return
        }
        let alert = UIAlertController(title: "Are you sure?", message: "Elliot needs all three permissions to show suggestions for meeting friends at times and locations convenient for you.", preferredStyle: .alert)
        let yesAction = UIAlertAction(title: "Yes", style: .default) { [weak self] (_) in
            self?.continueForward()
        }
        let cancelAction = UIAlertAction(title: "Cancel", style: .destructive, handler: nil)
        alert.addAction(cancelAction)
        alert.addAction(yesAction)
        present(alert, animated: true, completion: nil)
    }
    
    @IBAction func enableLocationTapped(_ sender: Any) {
        switch LocationManager.getAccessStatus() {
        case .denied:
            present(forwardToSettingsAlert, animated: true, completion: nil)
        case .notDetermined:
            LocationManager.requestAccess {
                DispatchQueue.main.async {
                    self.refreshButtonColors()
                }
            }
        default:
            break
        }
    }
    
    @IBAction func enableContactsTapped(_ sender: Any) {
        switch ContactsManager.getAccessStatus() {
        case .denied:
            present(forwardToSettingsAlert, animated: true, completion: nil)
        case .notDetermined:
            ContactsManager.requestAccess {
                DispatchQueue.main.async {
                    self.refreshButtonColors()
                }
            }
        default:
            break
        }
    }
    
    @IBAction func enableCalendarsTapped(_ sender: Any) {
        switch CalendarManager.getAccessStatus() {
        case .denied:
            present(forwardToSettingsAlert, animated: true, completion: nil)
        case .notDetermined:
            CalendarManager.requestAccess {
                DispatchQueue.main.async {
                    self.refreshButtonColors()
                }
            }
        default:
            break
        }
    }
}
