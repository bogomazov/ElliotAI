//
//  ShareAccessBridge.m
//  Elliot
//
//  Created by Ikbal KAZAR on 6/12/17.
//  Copyright © 2017 Elliot Technologies. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(ShareAccess, NSObject)
    
RCT_EXTERN_METHOD(sendSMS:(NSArray*)numbers content:(NSString*)content resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(sendMail:(NSArray*)addresses subject:(NSString*)subject content:(NSString*)content resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(shareOnMessenger:(NSString*)link initialText:(NSString*)initialText)
RCT_EXTERN_METHOD(shareOnFacebook:(NSString*)link title:(NSString*)title text:(NSString*)text)
RCT_EXTERN_METHOD(shareOnTwitter:(NSString*)link initialText:(NSString*)initialText)

@end
