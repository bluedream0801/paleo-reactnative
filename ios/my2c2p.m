//
//  my2c2p.m
//  test3
//
//  Created by david janssens on 20/3/2565 BE.
//

#import <Foundation/Foundation.h>

#import <React/RCTLog.h>
#import "my2c2p.h"

@implementation My2c2pModule


RCT_EXPORT_METHOD(tokenizeCreditCard: (NSDictionary *)params resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
{
    RCTLogInfo(@"Tokenize credit card");
  NSString *priv_key=[params objectForKey:@"priv_key"];
    _sdk = [[My2c2pSDK alloc] initWithPrivateKey:priv_key];
      _sdk.merchantID = [params objectForKey:@"merchantID"];
      _sdk.pan = [params objectForKey:@"pan"];
      _sdk.cardExpireMonth = [[params objectForKey:@"cardExpireMonth"] intValue];
      _sdk.uniqueTransactionCode = [params objectForKey:@"uniqueTransactionCode"];
      _sdk.cardExpireYear = [[params objectForKey:@"cardExpireYear"] intValue];
      _sdk.cardHolderName = [params objectForKey:@"cardHolderName"];
      _sdk.secretKey = [params objectForKey:@"secretKey"];
      _sdk.tokenizeWithoutAuthorization = true;
      _sdk.paymentLoadingIndicator = false;
    _sdk.productionMode = YES;


      //optional
      _sdk.paymentUI = false;
      //_sdk.cardHolderEmail = @"user@domain.com";
      _sdk.panCountry = @"TH";
      //_sdk.panBank = @"2c2p Bank";
      _sdk.request3DS = @"N";

      //proceed payment
      //_sdk.proceed(MainActivity.this, REQUEST_SDK);

  [self sendRequestWithResolver: resolve rejecter: reject];
}

RCT_EXPORT_METHOD(payCreditCard: (NSDictionary *)params resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
{
    RCTLogInfo(@"Card payment");
  NSString *priv_key=[params objectForKey:@"priv_key"];
    _sdk = [[My2c2pSDK alloc] initWithPrivateKey:priv_key];
  _sdk.merchantID = [params objectForKey:@"merchantID"];
  _sdk.uniqueTransactionCode = [params objectForKey:@"uniqueTransactionCode"];
  _sdk.desc = [params objectForKey:@"desc"];
  _sdk.amount = [[params objectForKey:@"amount"] doubleValue];
  _sdk.currencyCode = [params objectForKey:@"currencyCode"];
  _sdk.secretKey = [params objectForKey:@"secretKey"];
  _sdk.storeCardUniqueID = [params objectForKey:@"storeCardUniqueID"];
  _sdk.securityCode = [params objectForKey:@"securityCode"];
  _sdk.paymentUI = NO;
  _sdk.paymentLoadingIndicator = false;

    _sdk.productionMode = YES;


      //optional
      _sdk.paymentUI = false;
      //_sdk.cardHolderEmail = @"user@domain.com";
      _sdk.panCountry = @"TH";
      //_sdk.panBank = @"2c2p Bank";
      _sdk.request3DS = @"N";

      //proceed payment
      //_sdk.proceed(MainActivity.this, REQUEST_SDK);

  [self sendRequestWithResolver: resolve rejecter: reject];
}


- (void)sendRequestWithResolver: (RCTPromiseResolveBlock)resolve rejecter: (RCTPromiseRejectBlock)reject
{
    // Determine what controller is in the front based on if the app has a navigation controller or a tab bar controller
    UIWindow *window = [[[UIApplication sharedApplication] delegate] window];
    UIViewController* showingController;
    if([window.rootViewController isKindOfClass:[UINavigationController class]]){

        showingController = ((UINavigationController*)window.rootViewController).visibleViewController;
    } else if ([window.rootViewController isKindOfClass:[UITabBarController class]]) {

        showingController = ((UITabBarController*)window.rootViewController).selectedViewController;
    } else {

        showingController = (UIViewController*)window.rootViewController;
    }
    _sdk.delegate = showingController;

    dispatch_async(dispatch_get_main_queue(), ^{
        [_sdk requestWithTarget: showingController onResponse:^(NSDictionary *response)
         {
             RCTLogInfo(@"%@",response);
             resolve(response);

         } onFail:^(NSError *error) {

             if (error) {
                 RCTLogInfo(@"%@", error);
                 reject(@"payment error", error.localizedDescription, error);
             } else {
                 reject(@"TRANSACTION_CANCELED", @"Transaction is canceled", error);
             }
         }];
    });
}


RCT_EXPORT_MODULE(My2c2pModule);

@end
