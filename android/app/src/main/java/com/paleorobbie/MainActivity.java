// package com.paleorobbie;

// import android.content.Intent;
// import android.os.Bundle;

// import com.facebook.react.ReactActivity;
// import com.facebook.react.ReactActivityDelegate;
// import com.facebook.react.ReactRootView;

// import expo.modules.ReactActivityDelegateWrapper;
// import expo.modules.splashscreen.singletons.SplashScreen;
// import expo.modules.splashscreen.SplashScreenImageResizeMode;

// public class MainActivity extends ReactActivity {

//   @Override
//   protected void onCreate(Bundle savedInstanceState) {
//     // Set the theme to AppTheme BEFORE onCreate to support
//     // coloring the background, status bar, and navigation bar.
//     // This is required for expo-splash-screen.
//     setTheme(R.style.AppTheme);
//     super.onCreate(null);
//     SplashScreen.show(this, SplashScreenImageResizeMode.COVER, ReactRootView.class, true);
//   }

//   @Override
//   public void onNewIntent(Intent intent) {
//     super.onNewIntent(intent);
//     setIntent(intent);
//   }
//   /**
//    * Returns the name of the main component registered from JavaScript.
//    * This is used to schedule rendering of the component.
//    */
//   @Override
//   protected String getMainComponentName() {
//       return "main";
//   }
// }

package com.paleorobbie;

import android.content.Intent;
import android.os.Bundle;

import com.facebook.react.ReactActivity;
import com.facebook.react.ReactRootView;

import expo.modules.splashscreen.singletons.SplashScreen;
import expo.modules.splashscreen.SplashScreenImageResizeMode;

public class MainActivity extends ReactActivity {

  @Override
  protected void onCreate(Bundle savedInstanceState) {
    // Set the theme to AppTheme BEFORE onCreate to support
    // coloring the background, status bar, and navigation bar.
    // This is required for expo-splash-screen.
    setTheme(R.style.AppTheme);
    super.onCreate(null);
    SplashScreen.show(this, SplashScreenImageResizeMode.COVER, ReactRootView.class, true);
  }

  @Override
  public void onNewIntent(Intent intent) {
    super.onNewIntent(intent);
    setIntent(intent);
  }

  /**
   * Returns the name of the main component registered from JavaScript.
   * This is used to schedule rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
      return "main";
  }
}

