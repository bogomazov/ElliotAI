//
//  ReactTestConnectorBridge.m
//  Elliot
//
//  Created by Ikbal KAZAR on 5/30/17.
//  Copyright © 2017 Elliot Technologies. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(ReactTestConnector, NSObject)

RCT_EXTERN_METHOD(tappedBack:(nonnull NSNumber *)reactTag)

@end
