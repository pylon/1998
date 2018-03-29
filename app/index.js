import React, { Component } from 'react'
import {
  Button,
  NativeModules,
  StyleSheet,
  Text,
  View
} from 'react-native'
import Voice from 'react-native-voice'
import Tts from 'react-native-tts'

export default class NineteenNinetyEight extends Component {
  constructor (props) {
    super(props)
    this.state = {
      status: 'waiting',
      support: '',
      results: ['In 1998 The Undertaker threw Mankind'],
      utterance: '',
      intent: ''
    }
    this.onIsAvailable = this.onIsAvailable.bind(this)
  }

  componentDidMount () {
    Voice.isAvailable(this.onIsAvailable)
  }

  onIsAvailable (result) {
    if (result && NativeModules.DeviceSettings !== undefined) {
      this.setState({ support: NativeModules.DeviceSettings.voice_recognition_service })
    } else if (result) {
      this.setState({ support: true })
    } else {
      this.setState({ support: result })
    }
  }

  onResultsChange (r) {
    this.setState({ results: r })
  }

  onStatusChange (s) {
    this.setState({ status: s })
  }

  render () {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          In 1998...
        </Text>
        <TalkButton
          statusChange={(status) => this.onStatusChange(status)}
          resultsChange={(results) => this.onResultsChange(results)}
        />
        <Text style={styles.instructions}>
          {`ASR: ${this.state.support}`}
        </Text>
        <Text style={styles.stat}>
          {`Status: ${this.state.status}`}
        </Text>
        {this.state.results.map((result, index) => {
          return (
            <Text key={`result-${index}`} style={styles.stat}>
              {index + 1}: {result}
            </Text>
          )
        })}
        <SpeakButton results={this.state.results} />
      </View>
    )
  }
}

class TalkButton extends Component {
  /* A button that performs speech to text when pressed.
     Props:
     statusChange (function): a callback for updating asr status
     resultsChange (function): a callback for updating asr results
   */

  constructor (props) {
    super(props)
    // apple fails to ever deliver a utterance-end event and instead listens
    // until timeout (1 minute). We must stop() ourselves, or wait the full minute.
    // Further, Voice.isRecognizing() isn't set correctly on iOS, so we can't be
    // smart about calling stop() ourselves. So we set an utterance timer that
    // stops if there's no words recognized for the duration of utteranceTimeout.
    this.utteranceTimeout = 2000 // milliseconds
    this.utteranceTimer = null
    // voice events
    Voice.onSpeechStart = this.onSpeechStart.bind(this)
    Voice.onSpeechRecognized = this.onSpeechRecognized.bind(this)
    Voice.onSpeechEnd = this.onSpeechEnd.bind(this)
    Voice.onSpeechError = this.onSpeechError.bind(this)
    Voice.onSpeechResults = this.onSpeechResults.bind(this)
    Voice.onSpeechPartialResults = this.onSpeechPartialResults.bind(this)
    Voice.onSpeechVolumeChanged = this.onSpeechVolumeChanged.bind(this)
  }

  componentDidMount () {
    this.setAuthToken()
  }

  // button events

  onTalk () {
    /* Performs asr */
    const error = Voice.start('en-US')
    if (error) console.log(error)
    this.utteranceTimer = setTimeout(() => Voice.stop(), this.utteranceTimeout)
  }

  // parent events

  onStatusChange (s) {
    this.props.statusChange(s)
  }

  onResultsChange (r) {
    this.props.resultsChange(r)
  }

  // voice events

  onSpeechStart (e) {
    this.onStatusChange('started')
    this.onResultsChange([])
    console.log('started')
  }
  onSpeechRecognized (e) {
    clearTimeout(this.utteranceTimer)
    this.utteranceTimer = setTimeout(() => Voice.stop(), this.utteranceTimeout)
    this.onStatusChange('recognized')
    console.log('recognized')
  }
  onSpeechEnd (e) {
    this.onStatusChange('end')
    console.log('end')
  }
  onSpeechError (e) {
    this.onStatusChange(e.error)
    console.log(e.error)
  }
  onSpeechResults (e) {
    this.onResultsChange(e.value)
    console.log('results: ' + e.value)
  }
  onSpeechPartialResults (e) {
    this.onResultsChange(e.value)
    console.log('partial results: ' + e.value)
  }
  onSpeechVolumeChanged (e) {
    this.onResultsChange(e.value)
    console.log('volume change: ' + e.value)
  }

  render () {
    return (
      <Button title='Talk!' onPress={this.onTalk} accessibilityLabel='Talk to me' />
    )
  }
}

class SpeakButton extends Component {
  /* A button performs text to speech  when pressed
     Props:
       results (array of string, sorted by confidence)
   */

  componentDidMount () {
    Tts.addEventListener('tts-start', (event) => console.log('tts-start', event))
    Tts.addEventListener('tts-finish', (event) => console.log('tts-finish', event))
    Tts.addEventListener('tts-cancel', (event) => console.log('cancel', event))
  }

  onSpeak (words) {
    /* Performs tts
       Params:  words (string)
     */
    Tts.speak(words)
  }

  render () {
    return (
      <Button title='Speak!' onPress={() => this.onSpeak(this.props.results[0])} accessibilityLabel='Speak to me' />
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF'
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5
  },
  stat: {
    textAlign: 'center',
    color: '#B0171F',
    marginBottom: 1
  }
})
