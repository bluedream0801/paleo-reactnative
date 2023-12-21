//
//  my2c2p.h
//  test3
//
//  Created by david janssens on 20/3/2565 BE.
//

#ifndef my2c2p_h
#define my2c2p_h

#import <React/RCTBridgeModule.h>
#import <PGW/PGW.h>

@interface My2c2pModule : NSObject <RCTBridgeModule>

@property (nonatomic,strong) My2c2pSDK *sdk;

@end


#endif /* my2c2p_h */
