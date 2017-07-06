//
//  AppDelegate.swift
//  Elliot
//
//  Created by Scott Wu on 1/4/17.
//  Copyright © 2017 Elliot Technologies. All rights reserved.
//

import UIKit
import FacebookLogin
import FacebookCore
import OpenSansSwift
import SwiftyJSON
import React

@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate {
    let facebookLogoutNotifName = "facebookLogoutNotif"
    
    var window: UIWindow?
    
    func shouldLogin() -> Bool {
        if let fbToken = AccessToken.current {
            return fbToken.expirationDate < Date()
        } else {
            return true
        }
    }
    
    func showViewController(identifier: String) {
        let storyboard = UIStoryboard(name: "Main", bundle: nil)
        let vc = storyboard.instantiateViewController(withIdentifier: identifier)
        window?.rootViewController = vc
        window?.makeKeyAndVisible()
    }
    
    func doLogin() {
        // log out manually first, just to make sure
        let loginManager = LoginManager()
        loginManager.logOut()
        showViewController(identifier: "login-vc")
    }
    
    func observeLogoutEvent() {
        NotificationCenter.default.addObserver(self, selector: #selector(self.doLogin),
                                               name: NSNotification.Name.init(facebookLogoutNotifName), object: nil)
    }
    
    deinit {
        NotificationCenter.default.removeObserver(self)
    }
    
    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplicationLaunchOptionsKey: Any]?) -> Bool {
        SDKApplicationDelegate.shared.application(application, didFinishLaunchingWithOptions: launchOptions)
        
        var googleError: NSError?
        GGLContext.sharedInstance().configureWithError(&googleError)
        if googleError != nil {
            print("Google initialization failed with \(googleError)")
        }
        
        UserProfile.updatesOnAccessTokenChange = true
        
        ReactFactory.shared.appLaunchOptions = launchOptions
        
        OpenSans.registerFonts()
        
        window = UIWindow(frame: UIScreen.main.bounds)
        
        observeLogoutEvent()
        
        if shouldLogin() {
            doLogin()
        } else {
            if !SMSNotifManager.hasVerifiedNumber() {
                showViewController(identifier: "verify-phone-vc")
            } else {
                showViewController(identifier: "main-vc")
            }
        }
        
        UIApplication.shared.registerForRemoteNotifications()
        
        return true
    }
    
    func application(_ application: UIApplication, open url: URL, sourceApplication: String?, annotation: Any) -> Bool {
        if SMSNotifManager.handle(url: url) {
            return true
        }
        if GIDSignIn.sharedInstance().handle(url, sourceApplication: sourceApplication, annotation: annotation) {
            return true
        }
        if SDKApplicationDelegate.shared.application(application, open: url, sourceApplication: sourceApplication, annotation: annotation) {
            return true
        }
        return RCTLinkingManager.application(application, open: url, sourceApplication: sourceApplication, annotation: annotation)
    }

    func applicationWillResignActive(_ application: UIApplication) {
        // Sent when the application is about to move from active to inactive state. This can occur for certain types of temporary interruptions (such as an incoming phone call or SMS message) or when the user quits the application and it begins the transition to the background state.
        // Use this method to pause ongoing tasks, disable timers, and invalidate graphics rendering callbacks. Games should use this method to pause the game.
    }

    func applicationDidEnterBackground(_ application: UIApplication) {
        // Use this method to release shared resources, save user data, invalidate timers, and store enough application state information to restore your application to its current state in case it is terminated later.
        // If your application supports background execution, this method is called instead of applicationWillTerminate: when the user quits.
    }

    func applicationWillEnterForeground(_ application: UIApplication) {
        guard let fbToken = AccessToken.current else {
            // Never logged in yet. Don't need to redirect or post updates to back-end.
            return
        }
        if fbToken.expirationDate < Date() {
            // FB token has expired. We need to refresh it by redirecting the user to login page.
            doLogin()
            return
        }
        if !SMSNotifManager.hasVerifiedNumber() {
            // redirect to phone-verification screen if needed
            showViewController(identifier: "verify-phone-vc")
        } else {
            NotificationCenter.default.post(name: NotificationNames.foregroundUpdate, object: self)
        }
    }

    func applicationDidBecomeActive(_ application: UIApplication) {
        // Reset the app-badge whenever app is opened
        UIApplication.shared.applicationIconBadgeNumber = 0
    }

    func applicationWillTerminate(_ application: UIApplication) {
        // Called when the application is about to terminate. Save data if appropriate. See also applicationDidEnterBackground:.
    }
}

