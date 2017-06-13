//
//  ShareAccess.swift
//  Elliot
//
//  Created by Ikbal KAZAR on 6/12/17.
//  Copyright © 2017 Elliot Technologies. All rights reserved.
//

import Foundation
import MessageUI
import FacebookShare
import Social
import React

protocol ShareRequestRemover: class {
    func remove(id: String)
}

class ShareRequest: NSObject {
    var id: String!
    var resolver: RCTPromiseResolveBlock
    var rejecter: RCTPromiseRejectBlock
    weak var remover: ShareRequestRemover?
    
    init(resolver: @escaping RCTPromiseResolveBlock,
         rejecter: @escaping RCTPromiseRejectBlock) {
        self.id = UUID().uuidString
        self.resolver = resolver
        self.rejecter = rejecter
    }
}

class MFMessageRequest: ShareRequest, MFMessageComposeViewControllerDelegate {
    func getReason(_ result: MessageComposeResult) -> String {
        switch result {
        case .cancelled:
            return "cancelled"
        case .failed:
            return "failed"
        default:
            return "unknown"
        }
    }
    
    func messageComposeViewController(_ controller: MFMessageComposeViewController, didFinishWith result: MessageComposeResult) {
        controller.dismiss(animated: true) { 
            if result == .sent {
                self.resolver("success")
            } else {
                self.rejecter("failure", self.getReason(result), nil)
            }
            self.remover?.remove(id: self.id)
        }
    }
}

class MFMailRequest: ShareRequest, MFMailComposeViewControllerDelegate {
    func getReason(_ result: MFMailComposeResult) -> String {
        switch result {
        case .cancelled:
            return "cancelled"
        case .failed:
            return "failed"
        case .saved:
            return "saved"
        default:
            return "unknown"
        }
    }
    
    func mailComposeController(_ controller: MFMailComposeViewController, didFinishWith result: MFMailComposeResult, error: Error?) {
        controller.dismiss(animated: true) { 
            if result == .sent {
                self.resolver("success")
            } else {
                self.rejecter("failure", self.getReason(result), error)
            }
            self.remover?.remove(id: self.id)
        }
    }
}

@objc(ShareAccess)
class ShareAccess: NSObject {
    var bridge: RCTBridge!
    var requestMap: [String: ShareRequest] = [:]
    
    func getViewController(for reactTag: NSNumber) -> UIViewController? {
        guard let view = self.bridge.uiManager.view(forReactTag: reactTag) else { return nil }
        return view.reactViewController()
    }
    
    // MARK - SMS and Email
    
    @objc func sendSMS(_ reactTag: NSNumber, numbers: [String], content: String,
                       resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        guard let viewController = getViewController(for: reactTag),
            MFMessageComposeViewController.canSendText() else {
            reject("failure", "can't send text", nil)
            return
        }
        let request = MFMessageRequest(resolver: resolve, rejecter: reject)
        requestMap[request.id] = request
        let composeVC = MFMessageComposeViewController()
        composeVC.messageComposeDelegate = request
        composeVC.recipients = numbers
        composeVC.body = content
        viewController.present(composeVC, animated: true, completion: nil)
    }
    
    @objc func sendMail(_ reactTag: NSNumber, addresses: [String], subject: String, content: String,
                        resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        guard let viewController = getViewController(for: reactTag),
            MFMailComposeViewController.canSendMail() else {
            reject("failure", "can't send email", nil)
            return
        }
        let request = MFMailRequest(resolver: resolve, rejecter: reject)
        requestMap[request.id] = request
        let composeVC = MFMailComposeViewController()
        composeVC.mailComposeDelegate = request
        composeVC.setSubject(subject)
        composeVC.setToRecipients(addresses)
        composeVC.setMessageBody(content, isHTML: false)
        viewController.present(composeVC, animated: true, completion: nil)
    }
    
    // MARK - Social Media
    
    @objc func shareWithSocialKit(reactTag: NSNumber, link: String, initialText: String, serviceType: String) {
        guard let viewController = getViewController(for: reactTag),
            let shareVC = SLComposeViewController(forServiceType: serviceType),
            let url = URL(string: link) else {
                return
        }
        shareVC.add(url)
        shareVC.setInitialText(initialText)
        viewController.present(shareVC, animated: true, completion: nil)
    }
    
    @objc func shareOnMessenger(_ reactTag: NSNumber, link: String, initialText: String) {
        shareWithSocialKit(reactTag: reactTag, link: link,
                           initialText: initialText, serviceType: "com.facebook.Messenger.ShareExtension")
    }
    
    @objc func shareOnFacebook(_ reactTag: NSNumber, link: String, title: String, text: String) {
        guard let url = URL(string: link) else {
            return
        }
        let content = LinkShareContent(url: url, title: title,
                                       description: text, quote: nil, imageURL: nil)
        let dialog = ShareDialog(content: content)
        do {
            try dialog.show()
        } catch {
            return
        }
    }
    
    @objc func shareOnTwitter(_ reactTag: NSNumber, link: String, initialText: String) {
        shareWithSocialKit(reactTag: reactTag, link: link,
                           initialText: initialText, serviceType: SLServiceTypeTwitter)
    }
}

extension ShareAccess: ShareRequestRemover {
    func remove(id: String) {
        requestMap.removeValue(forKey: id)
    }
}
