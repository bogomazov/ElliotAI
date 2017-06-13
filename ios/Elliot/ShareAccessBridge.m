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
    
RCT_EXTERN_METHOD(sendSMS:(NSNumber*)reactTag numbers:(NSArray*)numbers content:(NSString*)content resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(sendMail:(NSNumber*)reactTag addresses:(NSArray*)addresses subject:(NSString*)subject content:(NSString*)content resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(shareOnMessenger:(NSNumber*)reactTag link:(NSString*)link initialText:(NSString*)initialText)
RCT_EXTERN_METHOD(shareOnFacebook:(NSNumber*)reactTag link:(NSString*)link title:(NSString*)title text:(NSString*)text)
RCT_EXTERN_METHOD(shareOnTwitter:(NSNumber*)reactTag link:(NSString*)link initialText:(NSString*)initialText)

@end
