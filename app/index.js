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
      results: [],
      final_results: '',
      response: ''
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

  onRecognitionDone () {
    if (this.state.results && this.state.results[0]) {
      this.setState({ final_results: this.state.results[0].toString() })
    }
  }

  onStatusChange (s) {
    this.setState({ status: s })
  }

  onResponseChange (r) {
    this.setState({ response: r })
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
          done={(results) => this.onRecognitionDone()}
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
        <PylonNLU
          asr_results={this.state.final_results}
          statusChange={(status) => this.onStatusChange(status)}
          responseChange={(r) => this.onResponseChange(r)}
        />
        <Text style={styles.stat}>
          {`Response: ${this.state.response}`}
        </Text>
        <SpeakButton results={this.state.response} />
      </View>
    )
  }
}

class PylonNLU extends Component {
  /* PylonNLU
   */

  constructor (props) {
    super(props)
    this.state = {
      auth_url: 'https://d62a308c.ngrok.io/user/v1/login',
      nlu_url: 'https://d62a308c.ngrok.io/nlu/v2/pylon/pylon-bartender/development',
      auth_token: '',
      user_agent: '',
      utterance: ''
    }
  }

  // Component Events

  onNLUResponse (r) {
    this.props.responseChange(r)
  }

  // NLU

  login () {
    let promise = fetch(this.state.auth_url, {method: 'POST'})
    promise.then((response) => {
      const authToken = response.headers && response.headers.get('X-Authorization')
      const responseStream = response.json()
      responseStream.then((result) => {
        console.log('login body: ' + result.user_id)
        this.setState({ user_agent: result.user_id })
      })
      console.log('Login auth header: ' + authToken)
      this.setState({ auth_token: authToken })
    })
    promise.catch((error) => this.props.statusChange(error))
  }

  getNLUResponse (utterance) {
    let promise = fetch(this.state.nlu_url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': this.state.auth_token},
      body: JSON.stringify({
        token: this.state.auth_token,
        agentId: this.state.user_agent,
        utterance: utterance,
        bimodal: false,
        locale: 'en-US'
      })
    })
    promise.then((response) => {
      const responseStream = response.json()
      responseStream.then((result) => {
        console.log('NLU Response: ' + result.message)
        this.onNLUResponse(result.message.replace(/<\/?[^>]+(>|$)/g, ''))
      })
    })
    promise.catch((error) => this.props.statusChange(error))
  }

  // React Events

  componentDidMount () {
    this.login()
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.asr_results !== this.state.utterance) {
      this.setState({ utterance: nextProps.asr_results })
      this.getNLUResponse(nextProps.asr_results)
    }
  }

  render () {
    return (
      <Text style={styles.stat}>
        {`ASR: ${this.state.utterance}`}
      </Text>
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
  }

  // timer events

  onUtteranceTimeout () {
    Voice.stop()
    console.log('done')
    this.props.done()
  }

  // button events

  onTalk () {
    /* Performs asr */
    const error = Voice.start('en-US')
    if (error) console.log(error)
    this.utteranceTimer = setTimeout(() => this.onUtteranceTimeout(), this.utteranceTimeout)
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
    this.utteranceTimer = setTimeout(() => this.onUtteranceTimeout(), this.utteranceTimeout)
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
    console.log('volume change: ' + e.value)
  }

  render () {
    return (
      <Button title='Talk!' onPress={() => this.onTalk()} accessibilityLabel='Talk to me' />
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
      <Button title='Speak!' onPress={() => this.onSpeak(this.props.results)} accessibilityLabel='Speak to me' />
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
