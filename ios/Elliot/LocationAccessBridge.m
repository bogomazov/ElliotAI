//
//  LocationAccessBridge.m
//  Elliot
//
//  Created by Ikbal KAZAR on 6/7/17.
//  Copyright © 2017 Elliot Technologies. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(LocationAccess, NSObject)

RCT_EXTERN_METHOD(checkLocationAccess:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(requestLocation:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject)

@end
