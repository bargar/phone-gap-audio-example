phone-gap-audio-example
=======================

Jeremiah Bargar
@bargar

Updated example of phone gap audio playback and recording intended for iOS.  This example has been tested on an iPhone (iOS 5) as well as the iOS Simulator.

Original inspiration here, from Todd Blanchard:
http://wiki.phonegap.com/w/page/21488260/iPhone%3A%20Record%20and%20Playback%20Audio

This new version works with Cordova 1.7 (The api has changed again for 1.8).  Notable changes from the original approach:

* console.log instead of the deprecated debug.log
* removed references to activityStart/Stop
* replace image dependencies with simple buttons
* code passes jshint
* main example shows record/playback to device's Documents directory
* separate example (on same page) of playback of wav file in www directory

To run this example, create a helloworld style application, as shown here:

http://wiki.phonegap.com/w/page/52010495/Getting%20Started%20with%20PhoneGap-Cordova%20and%20Xcode%204

Put the example files in the app's www directory and deploy to your iOS device.

