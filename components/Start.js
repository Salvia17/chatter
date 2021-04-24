import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  KeyboardAvoidingView, //This will allow not to cover input field by the keyboard
  Platform
} from 'react-native';

import { TextInput } from 'react-native-gesture-handler';

const image = require('../assets/img/Background_Image.png');

export default class Start extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      color: ''
    };
  }

  render() {
    return (
      <ImageBackground source={image} style={styles.image}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? 50 : 'height'}
          style={styles.container}>
          <Text style={styles.appTitle}>Welcome to Chatter!</Text>
          <View style={styles.nameContainer}>
            <View style={styles.inputContainer}>
              <TextInput style={styles.textInput}
                //Sets the state to display the user’s name in the navigation bar at the top of the chat screen.
                onChangeText={(name) => this.setState({ name })}
                value={this.state.name}
                placeholder='Your name'
              />
            </View>

            <Text style={styles.text}>Choose Background Color:</Text>

            <View style={styles.backgroundColor}>
              <TouchableOpacity
                style={styles.color1}
                //sets background state to selected color
                onPress={() => { this.setState({ color: '#090C08' }) }}
              ></TouchableOpacity>
              <TouchableOpacity
                style={styles.color2}
                onPress={() => { this.setState({ color: '#474056' }) }}
              ></TouchableOpacity>
              <TouchableOpacity
                style={styles.color3}
                onPress={() => { this.setState({ color: '#8A95A5' }) }}
              ></TouchableOpacity>
              <TouchableOpacity
                style={styles.color4}
                onPress={() => { this.setState({ color: '#B9C6AE' }) }}
              ></TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.chatBtn}
              title="Start Chattering"
              // Let's you navigate to the Chat screen and sets the state to the name user entered in text input
              onPress={() => this.props.navigation.navigate('Chat', { name: this.state.name, color: this.state.color })}
            >
              <Text style={styles.chatBtnTxt}>
                Start Chattering
                </Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </ImageBackground>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
  },

  nameContainer: {
    flex: 1,
    borderWidth: 2,
    borderColor: 'transparent',
    borderRadius: 10,
    margin: 20,
    padding: 10,
    width: '88%',
    backgroundColor: '#fff',
    textAlign: 'left',
    position: 'absolute',
    bottom: 10,
  },

  appTitle: {
    fontSize: 45,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 10,
  },

  image: {
    flex: 1,
  },

  inputContainer: {
    flex: 0.3,
    width: '100%',
    marginBottom: 10,
  },

  textInput: {
    height: 50,
    width: '90%',
    borderColor: '#2A323C',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    fontSize: 16,
    fontWeight: '300',
    color: '#757083',
    opacity: 50,
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: 10,
  },

  backgroundColor: {
    flex: 0.5,
    flexDirection: 'row',
    marginBottom: 20,
    marginLeft: 20,
  },

  text: {
    fontSize: 16,
    fontWeight: '300',
    color: '#757083',
    opacity: 100,
    marginTop: 20,
    marginBottom: 10,
    marginLeft: 20,
  },

  color1: {
    width: 40,
    height: 40,
    borderRadius: 25,
    backgroundColor: '#090C08',
    marginRight: 10,
    marginTop: 10,
  },

  color2: {
    width: 40,
    height: 40,
    borderRadius: 25,
    backgroundColor: '#474056',
    marginRight: 10,
    marginTop: 10,
  },

  color3: {
    width: 40,
    height: 40,
    borderRadius: 25,
    backgroundColor: '#8A95A5',
    marginRight: 10,
    marginTop: 10,
  },

  color4: {
    width: 40,
    height: 40,
    borderRadius: 25,
    backgroundColor: '#B9C6AE',
    marginRight: 10,
    marginTop: 10,
  },

  chatBtn: {
    backgroundColor: '#757083',
    width: '88%',
    borderWidth: 2,
    borderColor: 'transparent',
    borderRadius: 1,
    marginRight: 'auto',
    marginLeft: 'auto',
    marginTop: 10,
    marginBottom: 10,
  },

  chatBtnTxt: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    padding: 20,
    textAlign: 'center',
  }
})