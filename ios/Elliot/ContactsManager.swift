//
//  ContactsManager.swift
//  Elliot
//
//  Created by ikbal kazar on 07/01/17.
//  Copyright © 2017 Elliot Technologies. All rights reserved.
//

import UIKit
import Contacts

// TODO: Fetch contacts once, listen to contacts-did-chance notification

class ContactsManager: NSObject, AccessRequired {
    static let shared = ContactsManager()
    
    var contacts: [CNContact] = []
    
    static func getAccessStatus() -> AccessStatus {
        switch CNContactStore.authorizationStatus(for: .contacts) {
        case .authorized:
            return .granted
        case .notDetermined:
            return .notDetermined
        default:
            return .denied
        }
    }
    
    static func requestAccess(completion: @escaping () -> ()) {
        let store = CNContactStore()
        store.requestAccess(for: .contacts) { (granted, error) in
            completion()
        }
    }
    
    func fetchContacts() {
        if ContactsManager.getAccessStatus() != .granted {
            print("Contacts access status is not granted")
            return
        }
        // Fetching full name, email addresses, phone numbers and image data for each contact
        let keysToFetch: [CNKeyDescriptor] = [CNContactFormatter.descriptorForRequiredKeys(for: .fullName),
                                               CNContactEmailAddressesKey as CNKeyDescriptor,
                                               CNContactPhoneNumbersKey as CNKeyDescriptor,
                                               CNContactThumbnailImageDataKey as CNKeyDescriptor]
        let store = CNContactStore()
        guard let containers = try? store.containers(matching: nil) else {
            print("Contacts Manager - container fetch error")
            return
        }
        
        self.contacts = []
        for container in containers {
            let predicate = CNContact.predicateForContactsInContainer(withIdentifier: container.identifier)
            if let contactsInContainer = try? store.unifiedContacts(matching: predicate, keysToFetch: keysToFetch) {
                self.contacts.append(contentsOf: contactsInContainer)
            } else {
                print("Contacts Manager - contact fetch error for container \(container.name)")
            }
        }
    }
    
    static func findBestNumberForSMS(contact: CNContact) -> CNPhoneNumber? {
        // labels are ordered decreasing by score
        let weights = [CNLabelPhoneNumberiPhone,
                       CNLabelPhoneNumberMobile,
                       CNLabelPhoneNumberMain,
                       CNLabelOther,
                       CNLabelHome,
                       CNLabelWork]
        // labels for fax numbers and pagers are ommited to be not used ever for sms.
        let blackList = [CNLabelPhoneNumberOtherFax,
                         CNLabelPhoneNumberWorkFax,
                         CNLabelPhoneNumberHomeFax,
                         CNLabelPhoneNumberPager]
        func getScore(number: CNLabeledValue<CNPhoneNumber>) -> Int {
            guard let label = number.label else {
                // same as CNLabelOther
                return 3
            }
            if let index = weights.index(of: label) {
                return weights.count - index
            }
            if blackList.contains(label) {
                return -1
            }
            // unknown label, give CNLabelOther's score
            return 3
        }
        guard let best = contact.phoneNumbers.max(by: {getScore(number: $0) < getScore(number: $1)}) else {
            return nil
        }
        if getScore(number: best) < 0 {
            return nil
        }
        return best.value
    }
    
    static func findNumberForFullName(fullName: String) -> String? {
        if shared.contacts.count == 0 {
            shared.fetchContacts()
        }
        for contact in shared.contacts {
            guard let phoneNumber = findBestNumberForSMS(contact: contact) else {
                continue
            }
            let contactFullName = CNContactFormatter.string(from: contact, style: .fullName)
            if (contactFullName?.lowercased() == fullName.lowercased()) {
                return phoneNumber.stringValue
            }
        }
        return nil
    }
}
