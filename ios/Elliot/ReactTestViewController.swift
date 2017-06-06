//
//  ReactTestViewController.swift
//  Elliot
//
//  Created by Ikbal KAZAR on 5/30/17.
//  Copyright © 2017 Elliot Technologies. All rights reserved.
//

import UIKit
import React
import CodePush

class ReactTestViewController: UIViewController {

    override func viewDidLoad() {
        super.viewDidLoad()
        let reactView = ReactFactory.shared.createView(name: "Elliot", props: nil)
        reactView.frame = CGRect(x: 0, y: 60, width: view.frame.width, height: view.frame.height)
        view.addSubview(reactView)
    }
    
    @IBAction func tappedBack(_ sender: Any) {
        dismiss(animated: true, completion: nil)
    }
    
    func reactTappedBack() {
        dismiss(animated: true, completion: nil)
    }
}
