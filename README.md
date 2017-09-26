# 1998
https://www.reddit.com/r/pics/comments/5oyhfy/salt_squared/dcn6dk1/

## Run
```
npm install
npm link
react-native {run-ios || run-android} # NB asr and tts don't work in simulators
```

## Lint
`npm run lint`

## Motivation

The experiment had a two-fold purpose:
1. Proof of concept for in-app companion voice support using react native.
2. Explore platform support for a retail kiosk assistant.

## Backend
The experiment relied on platform-provided ASR and TTS services, and did not attempt to implement such itself. The implementation was simply a copy cat (perform Automated Speech Recognition on via a microphone, and repeat the ASR'd speech back via Text to Speech). No natural language understanding was attempted.

### NLU 
Unimplemented

### ASR
Platform-supplied. Tested using [Google Voice](https://developer.android.com/reference/android/speech/RecognitionService.html) and Apple Siri.

Other native ASR options: [Alexa on Android](https://github.com/alexa/alexa-avs-sample-app/blob/master/samples/javaclient/src/main/java/com/amazon/alexa/avs/AVSController.java), [Pocketsphinx](http://nilhcem.com/android-things/control-your-devices-through-voice-with-usb-audio-support).

### TTS
Platform-supplied. Tested using [Google's Android.speech.tts](https://developer.android.com/reference/android/speech/tts/TextToSpeech.html) and Apple Speech

## Frontend
React Native, using [React Native Voice](https://github.com/wenkesj/react-native-voice) and [React Native TTS](https://github.com/ak1394/react-native-tts).

Other react options: [React Native STT](https://github.com/anto2318/ReactNativeSTT), [React Native Speech](https://github.com/naoufal/react-native-speech), [react-native-bluemix](https://github.com/pwcremin/react-native-bluemix)

## Platforms

OS  | ASR | TTS | Status | Devices
--- | --- | --- | ------ | -------
iOS 10, 11 | ✅ | ✅ | Fully Supported | iPhone 6S, iPad Mini 2
Android 7, 8 | ✅ | ✅ | Fully Supported | Google Pixel
FireOS 5.4 | ✅ | ✅ | Android SpeechRecognizer unsupported because they want you to use AVS. Sideloaded Google Play + Google app adds Google ASR | Kindle Fire 7
[RTAndroid	7.1](https://rtandroid.embedded.rwth-aachen.de/downloads/raspberry-pi/) | ❌ | ✅ | Audio system unsupported | Raspberry Pi 3
[Geek Till It Hertz 7.1.1](http://geektillithertz.com/wordpress/index.php/2017/01/23/and-7-1-1-tablet-raspberry-pi/) | ❌ | ✅ | Audio system unsupported | Raspberry Pi 3
[emteria.OS](https://emteria.com/)  | ❌ | ✅ | Audio system unsupported | Raspberry Pi 3
[Android Things](https://developer.android.com/things/sdk/index.html) 0.5.1 | ❌ | ✅ | Voice system unsupported | Raspberry Pi 3
Raspbian Linux | ❌ | ❌ | Audio system unsupported | Raspberry Pi 3
