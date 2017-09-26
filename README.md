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
Platform-supplied. Tested using Google Voice and Apple Siri.

## Frontend
React Native, using React Native Voice and React Native TTS.

## Platforms

OS  | ASR | TTS | Status | Devices
--- | --- | --- | ------ | -------
iOS | ✅ | ✅ | Fully Supported | iPhone 6S, iPad Mini 2
Android 7+ | ✅ | ✅ | Fully Supported | Google Pixel
FireOS | ✅ | ✅ | Android SpeechRecognizer unsupported because they want you to use AVS. Sideloaded Google Play + Google app adds Google ASR | Kindle Fire 7
RTAndroid	| ❌ | ✅ | Audio system unsupported | Raspberry Pi 3
Geek Till It Hertz 7.1.1 | ❌ | ✅ | Audio system unsupported | Raspberry Pi 3
emteria.OS | ❌ | ✅ | Audio system unsupported | Raspberry Pi 3
Android Things | ❌ | ✅ | Voice system unsupported | Raspberry Pi 3
