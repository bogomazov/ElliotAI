//
//  LoginViewController.swift
//  Elliot
//
//  Created by ikbal kazar on 07/01/17.
//  Copyright © 2017 Elliot Technologies. All rights reserved.
//

import UIKit
import FacebookLogin
import FacebookCore
import SwiftyUserDefaults

class LoginViewController: UIViewController, LoginButtonDelegate {

    @IBOutlet weak var previewLabel: UILabel!
    @IBOutlet weak var previewImageView: UIImageView!
    @IBOutlet weak var loginWrapperView: UIView!
    @IBOutlet weak var pageControl: UIPageControl!
    @IBOutlet weak var nextButton: UIButton!
    
    var loginButton: LoginButton!
    var loadingIndicator: UIActivityIndicatorView!
    let loginManager = LoginManager()
    
    let previewNames = ["login1", "login2", "login3"]
    let previewTexts = ["Elliot suggests people and times for you to meet",
                        "As you plan your week, let Elliot know what works for you",
                        "If you and your friend can both meet, Elliot schedules"]
    
    override func viewDidLoad() {
        super.viewDidLoad()
        loginButton = LoginButton(readPermissions: [.userFriends, .publicProfile]);
        loginButton.frame = CGRect(origin: .zero, size: CGSize(width: 200, height: 50))
        loginButton.delegate = self
        var center = self.view.center
        center.y = self.view.bounds.height - 70
        loginButton.center = center
        loginButton.isHidden = true
        
        self.view.addSubview(loginButton)
        
        loadingIndicator = UIActivityIndicatorView(activityIndicatorStyle: .white)
        loadingIndicator.color = UIColor.elliotBeige()
        loadingIndicator.center = center
        self.view.addSubview(loadingIndicator)
        
        let swipeLeft = UISwipeGestureRecognizer(target: self, action: #selector(self.goLeft))
        swipeLeft.direction = .right
        let swipeRight = UISwipeGestureRecognizer(target: self, action: #selector(self.goRight))
        swipeRight.direction = .left
        
        pageControl.isEnabled = false
        self.view.addGestureRecognizer(swipeLeft)
        self.view.addGestureRecognizer(swipeRight)
    }
    
    func setPreview(index: Int) {
        pageControl.currentPage = index
        previewImageView.image = UIImage(named: previewNames[index])
        previewLabel.text = previewTexts[index]
        
        if index == 2 {
            nextButton.isHidden = true
            nextButton.isEnabled = false
            loginButton.isHidden = false
        }
    }
    
    func goLeft() {
        if pageControl.currentPage > 0 {
            setPreview(index: pageControl.currentPage - 1)
        }
    }
    
    func goRight() {
        if pageControl.currentPage < 2 {
            setPreview(index: pageControl.currentPage + 1)
        }
    }
    
    @IBAction func tappedNextButton(_ sender: Any) {
        goRight()
    }
    
    
    func loginButtonDidCompleteLogin(_ loginButton: LoginButton, result: LoginResult) {
        switch result {
        case .failed(let error):
            print("Failed to login :( with error \(error)")
        case .cancelled:
            print("User Cancelled")
        case .success(grantedPermissions: let grantedPermissions, declinedPermissions: let declinedPermissions, token: let accessToken):
            print("Logged In!")
            print("Access token: \(accessToken)")
            print(grantedPermissions.description)
            print(declinedPermissions.description)
            print("-------------")
            loadingIndicator.startAnimating()
            loginButton.isHidden = true
            loginButton.isUserInteractionEnabled = false
            AuthorizationManager.shared.loadToken(completion: { (json, success) in
                if success {
                    guard let appDelegate = UIApplication.shared.delegate as? AppDelegate else {
                        return
                    }
                    appDelegate.showViewController(identifier: "main-vc")
                } else {
                    self.loginManager.logOut()
                    self.loginButton.isHidden = false
                    self.loginButton.isUserInteractionEnabled = true
                }
                self.loadingIndicator.stopAnimating()
            })
        }
    }
    
    func loginButtonDidLogOut(_ loginButton: LoginButton) {
        print("Loggged out...")
    }
}
