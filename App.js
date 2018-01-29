/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';

import {
  Platform,
  StyleSheet,
  Text,
  View,
  Alert,
  Image,
  Button,
  TextInput,
  DeviceEventEmitter,
  ProgressViewIOS,
  NavigationIOS,
  NavigatorIOS,
} from 'react-native';

class AppInfo extends Component {
  render() {
    return (
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Image 
          source={this.props.appImage} 
          style={styles.image}
          borderRadius={21}
          overflow='hidden'
        />
        <Text style={styles.h1} >{this.props.appName}</Text>
      </View>
    )
  }
}

class Item extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <View style={[ styles.element, styles.seperator ]} /*backgroundColor='lightblue'*/>
        <Text style={[ styles.h2 ]}>{this.props.title}</Text>
        <TextInput 
          style={[ styles.h3 ]}
          value={this.props.value}
          placeholder={this.props.placeholder}
          placeholderTextColor={'lightgrey'}
          onChangeText={this.props.onChangeText}
        />
      </View>
    )
  }
}

class Password extends Component {
  render() {
    return (
      <View style={[ styles.element, { height: 140 } ]} >
        <Text style={[ styles.h2 ]}>Password</Text>

        <TextInput 
          style={[ styles.h3 ]}
          placeholder={'Password'}
          placeholderTextColor={'lightgrey'}
          value={this.props.value}
          onChangeText={this.props.onChangeText}
          maxLength={this.props.maxLength}
        />

        <ProgressViewIOS
          progress={this.props.percent}
          progressTintColor={this.props.color}
        />

        <Button
          title="Generate Password"
          onPress={this.props.onGeneratePassword}
        />
      </View>
    )
  }
}

class GeneratePassword extends Component {
  constructor(props) {
    super(props) // todo: should input image, app name

    this.handleUsernameChange = this.handleUsernameChange.bind(this)
    this.handlePhonenumberChange = this.handlePhonenumberChange.bind(this)
    this.handleEmailChange = this.handleEmailChange.bind(this)
    this.handlePasswordChange = this.handlePasswordChange.bind(this)
    this.handleGeneratePassword = this.handleGeneratePassword.bind(this)
    this.onSave = this.onSave.bind(this) // todo: 笔记，不方便的地方。经常忘掉

    this.state = {
      username:'',
      phonenumber: '',
      email: '',
      password: passwordInfo('')
    }
  }

  componentDidMount() {
    this.subscription = DeviceEventEmitter.addListener('saveEvent', this.onSave)
  }

  componentWillUnmount(){
    this.subscription.remove()
  }

  onSave() {
    if (this.state.username.length == 0) {
      Alert.alert(
        'Username error',
        'Username should NOT be empty',
        [
          {text: 'OK', onPress: () => console.log('OK Pressed')},
        ]
      )
    } else if (this.state.password.value.length < passwordLength.min) {
      Alert.alert(
        'Password error',
        'The password length should be greater than '+ passwordLength.min,
        [
          {text: 'OK', onPress: () => console.log('OK Pressed')},
        ]
      )
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <AppInfo appImage={this.props.appImage} appName={this.props.appName}/>

        <Item 
          title={'Username'} 
          placeholder={'Username'} 
          value={this.state.username} 
          onChangeText={this.handleUsernameChange} 
        />

        <Item 
          title={'Phone number'} 
          placeholder={'Phone number'} 
          value={this.state.phonenumber}
          onChangeText={this.handlePhonenumberChange} 
        />

        <Item 
          title={'Email'} 
          placeholder={'Email'} 
          value={this.state.email}
          onChangeText={this.handleEmailChange}
        />

        <Password
          maxLength={passwordLength.max}
          value={this.state.password.value}
          color={this.state.password.color}
          percent={this.state.password.percent}
          onChangeText={this.handlePasswordChange}
          onGeneratePassword={this.handleGeneratePassword}
        />

      </View>
    );
  }

  handleUsernameChange(text) {
    this.setState({ username: text })
  }

  handlePhonenumberChange(text) {
    this.setState({ phonenumber: text })
  }

  handleEmailChange(text) {
    this.setState({ email: text })
  }

  handlePasswordChange(text) {
    this.setState({ password: passwordInfo(text) })
  }

  handleGeneratePassword() {
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@._";

    var text = ''

    for (var i = 0; i < passwordLength.default; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));

    this.setState({ password: passwordInfo(text) })
  }
}

export default class App extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <NavigatorIOS
        initialRoute={{
          component: GeneratePassword,
          passProps: { 
            events: this.eventEmitter,
            appImage: require('./image/Jobs.png'),
            appName: 'Apple ID'
          },

          title: 'New Login',
          barTintColor: 'lightblue',
          titleTextColor: 'white',
          leftButtonTitle: 'Cancel',
          rightButtonTitle: 'Save', // TODO: 怎么实现disable还没找到解决方案。找到解决方案了。需要做笔记。是利用event机制。可能redux也是个解决方案
          onRightButtonPress: () => { DeviceEventEmitter.emit('saveEvent', null) },
          onLeftButtonPress: () => this.handleCancel()
        }}
        
        style={{ flex: 1 }}
      />
    )
  }

  handleCancel() {

  }
}

const securityIndex = {
  strong: 0,
  normal: 1,
  weak: 2,
}

const securityInfoArray = [
  {
    color: 'green',
    min: 13
  },
  {
    color: 'yellow',
    min: 6,
  },
  {
    color: 'red',
    min: 0
  },
]

const passwordLength = {
  min: 6,
  max: 30,
  default: 13
}

function passwordInfo(password) {
  let length = password.length

  let security = securityInfoArray.find((element) => {
    return length >= element.min
  })

  return {
      value: password,
      color: security.color,
      percent: Math.min(1, length / passwordLength.max)
  }
}

const styles = StyleSheet.create({
  // Layout
  container: {
    top: 66,
    left: 20, // todo: 导致button没有居中
    backgroundColor: 'white',

    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },

  // Views
  image: {
    width: 100,
    height: 100
  },

  element: {
    height: 60,
    justifyContent: 'space-around'
  },

  seperator: {
    borderBottomColor: '#bbb',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },

  // Font
  h1: {
    color: 'black',
    fontSize: 20,
    fontWeight: 'bold',
  },

  h2: {
    color: 'gray',
    fontSize: 15,
  },

  h3: {
    color: 'black',
    fontSize: 17,
    fontWeight: 'bold',
  },

  nFont: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold'
  },
});
