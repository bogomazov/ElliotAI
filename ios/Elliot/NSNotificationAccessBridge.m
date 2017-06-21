//
//  NSNotificationAccessBridge.m
//  Elliot
//
//  Created by Ikbal KAZAR on 6/8/17.
//  Copyright © 2017 Elliot Technologies. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(NSNotificationAccess, NSObject)

RCT_EXTERN_METHOD(post:(NSString*)name info:(NSDictionary*)info)

@end
