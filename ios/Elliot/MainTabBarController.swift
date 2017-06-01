//
//  MainTabBarController.swift
//  Elliot
//
//  Created by ikbal kazar on 13/01/17.
//  Copyright © 2017 Elliot Technologies. All rights reserved.
//

import UIKit

class MainTabBarController: UITabBarController {
    static let suggestionTab = 0
    static let meetingsTab = 1
    static let inviteTab = 2
    
    var badgeView: UILabel!
    let iconNames = ["home", "calendar", "invite"]
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        let appDelegate = UIApplication.shared.delegate as! AppDelegate
        appDelegate.tabBarVC = self
        
        tabBar.barTintColor = UIColor.navigationAndTabBar()
        
        for i in 0 ..< iconNames.count {
            let item = tabBar.items![i]
            item.image = UIImage(named: iconNames[i] + "-passive")?.withRenderingMode(.alwaysOriginal)
            item.selectedImage = UIImage(named: iconNames[i] + "-active")?.withRenderingMode(.alwaysOriginal)
            item.imageInsets = UIEdgeInsets(top: 8, left: 0, bottom: -8, right: 0)
            item.title = ""
        }
        
        // Show suggestions page first
        self.selectedIndex = MainTabBarController.suggestionTab
        
        // post location and calendar events to back-end.
        // This code gets executed every time app is launched. (i.e. opened first time or after a kill)
        LocationManager.shared.postUpdate()
        CalendarManager.shared.postUpdate()
        UsageStats.reportSession()
        
        // Touch to meetings page's view to make it load
        if let meetingNavController = self.viewControllers?[MainTabBarController.meetingsTab] as? UINavigationController {
            meetingNavController.topViewController?.view
        }
        
        NotificationCenter.default.addObserver(self, selector: #selector(showInviteTab), name: NotificationNames.showInvite, object: nil)
    }
    
    func showInviteTab() {
        self.selectedIndex = MainTabBarController.inviteTab
    }
    
    func refreshBadgeView(str: String) {
        if badgeView != nil {
            badgeView.removeFromSuperview()
        }
        badgeView = UILabel()
        badgeView.text = str
        badgeView.textAlignment = .center
        badgeView.textColor = UIColor.white
        badgeView.font = UIFont.systemFont(ofSize: 12)

        badgeView.sizeToFit()
        var extendedSize = badgeView.frame.size
        extendedSize.width = max(extendedSize.width + 6, 16)
        extendedSize.height += 2
        badgeView.frame.size = extendedSize
        
        let tabWidth = tabBar.frame.width
        badgeView.center.x = tabWidth / 6 + tabWidth / 3 * CGFloat(MainTabBarController.meetingsTab) + 20
        badgeView.center.y = 12
        badgeView.layer.cornerRadius = badgeView.frame.height / 2
        badgeView.clipsToBounds = true
        badgeView.backgroundColor = UIColor.buttonGreen()
        badgeView.isHidden = false
        self.tabBar.addSubview(badgeView)
    }
    
    func setTabBarBadge(n: Int) {
        if #available(iOS 10.0, *) {
            self.tabBar.items![MainTabBarController.meetingsTab].badgeColor = UIColor.buttonGreen()
            self.tabBar.items![MainTabBarController.meetingsTab].badgeValue = (n == 0 ? nil : "\(n)")
            return
        }
        // For iOS 9.0 draw a label to create a custom colored badge.
        if n == 0 {
            if badgeView != nil {
                badgeView.isHidden = true
            }
        } else {
            refreshBadgeView(str: "\(n)")
        }
    }
}
