//
//  UIViewController+Banner.swift
//  Elliot
//
//  Created by ikbal kazar on 03/03/17.
//  Copyright © 2017 Elliot Technologies. All rights reserved.
//

import Foundation
import UIKit
import BRYXBanner

extension UIViewController {
    
    func setUpBannerOnNavigationBar() -> UIView {
        let screen = UIScreen.main.bounds.size
        let topView = UIView(frame: CGRect(x: 0, y: 20, width: screen.width, height: 40))
        topView.backgroundColor = UIColor.clear
        self.navigationController?.view.addSubview(topView)
        return topView
    }
    
    func showBanner(onView: UIView, title: String, subtitle: String) {
        let banner = Banner(title: title, subtitle: subtitle, image: nil,
                            backgroundColor: UIColor.buttonGreen(), didTapBlock: nil)
        banner.titleLabel.font = UIFont.openSansBoldFontOfSize(14)
        banner.titleLabel.numberOfLines = 1
        banner.detailLabel.font = UIFont.openSansFontOfSize(14)
        banner.detailLabel.numberOfLines = 2
        banner.dismissesOnTap = true
        banner.show(onView, duration: 5.0)
    }
}
