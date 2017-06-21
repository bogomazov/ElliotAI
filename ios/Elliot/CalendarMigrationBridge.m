//
//  CalendarMigrationBridge.m
//  Elliot
//
//  Created by Ikbal KAZAR on 6/15/17.
//  Copyright © 2017 Elliot Technologies. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(CalendarMigration, NSObject)

RCT_EXTERN_METHOD(getAllStored:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject)

@end
