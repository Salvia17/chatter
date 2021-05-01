import React, { Component } from 'react';
import { View, StyleSheet, Platform, KeyboardAvoidingView, LogBox, Alert } from 'react-native';
import { GiftedChat, Bubble, InputToolbar } from 'react-native-gifted-chat';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';

// Google Firebase
const firebase = require('firebase');
require('firebase/firestore');
require('firebase/auth');

export default class Chat extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      uid: 0,
      user: {
        _id: '',
        name: '',
      },
      isConnected: false,
    }


    // Firebase configuration for the App
    var firebaseConfig = {
      apiKey: "AIzaSyD1CrYyz9KMWySTcyhk_3L-fAU-4rbf1DM",
      authDomain: "chatter-9713f.firebaseapp.com",
      projectId: "chatter-9713f",
      storageBucket: "chatter-9713f.appspot.com",
      messagingSenderId: "567153556688",
      appId: "1:567153556688:web:de23d1a476614cebf032d5",
      measurementId: "G-S86WRV6PRF"
    };

    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }

    this.referenceChatMessages = firebase.firestore().collection("messages");
    //Ignore's timer warnings
    LogBox.ignoreLogs(['Setting a timer']);
  }

  // Sets the state
  componentDidMount() {

    // Checks for user's connection
    NetInfo.fetch().then((connection) => {
      if (connection.isConnected) {
        this.setState({ isConnected: true });

        // Authenticates user via Firebase
        this.authUnsubscribe = firebase.auth().onAuthStateChanged(async (user) => {
          if (!user) {
            await firebase.auth().signInAnonymously();
          }
          let { name } = this.props.route.params;
          // Update user state
          this.setState({
            uid: user.uid,
            user: {
              _id: user.uid,
              name: name,
            },
            messages: [],
          });

          // Reference to load messages via Firebase
          this.referenceChatMessages = firebase.firestore().collection('messages');

          // Lists for collection changes of currnet user
          this.unsubscribeChatUser = this.referenceChatMessages.orderBy('createdAt', 'desc').onSnapshot(this.onCollectionUpdate);
        });
      } else {
        this.setState({ isConnected: false });
        this.getMessages();
        Alert.alert(
          'No internet connection. Unable to send messages'
        );
      }
    });
  }

  componentWillUnmount() {
    this.authUnsubscribe();
    this.unsubscribeChatUser();
  }

  // Updates messages state
  onCollectionUpdate = (querySnapshot) => {
    const messages = [];
    // go through each document
    querySnapshot.forEach((doc) => {
      // get the QueryDocumentSnapshot's data
      let data = doc.data();
      messages.push({
        _id: data._id,
        text: data.text,
        createdAt: data.createdAt.toDate(),
        user: data.user,
      });
    });
    this.setState({ messages });
  };

  // Retrieve messages from client-side storage
  async getMessages() {
    let messages = '';
    try {
      messages = await AsyncStorage.getItem('messages') || [];
      this.setState({
        messages: JSON.parse(messages)
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  // Saves messages in client-side storage
  async saveMessages() {
    try {
      await AsyncStorage.setItem('messages', JSON.stringify(this.state.messages));
    } catch (error) {
      console.log(error.message);
    }
  }

  // Delete messages in client-side storage
  async deleteMessages() {
    try {
      await AsyncStorage.removeItem('messages');
      this.setState({
        messages: []
      })
    } catch (error) {
      console.log(error.message);
    }
  }

  // Adds messages to cloud storage
  addMessages() {
    const messages = this.state.messages[0];
    this.referenceChatMessages.add({
      _id: messages._id,
      text: messages.text,
      createdAt: messages.createdAt,
      user: messages.user,
    });
  }

  // Event handler for sending user's messages
  onSend(messages = []) {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }),
      () => {
        this.addMessages();
        this.saveMessages();
      });
  }

  // Renders message input only when app is online
  renderInputToolbar(props) {
    if (this.state.isConnected == false) {
    } else {
      return <InputToolbar {...props} />;
    }
  }

  //Let's customise chat bubble color
  renderBubble(props) {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: '#7ac5cd',
          },
        }}
      />
    );
  }

  render() {
    const color = this.props.route.params.color; // Color user selected in Start.js
    const styles = StyleSheet.create({
      container: {
        backgroundColor: color,
        flex: 1,
      },
    });

    const { messages } = this.state;
    const { name } = this.props.route.params;

    return (
      <View style={styles.container}>
        <GiftedChat
          renderBubble={this.renderBubble.bind(this)}
          renderInputToolbar={this.renderInputToolbar.bind(this)}
          renderUsernameOnMessage={true}
          messages={messages}
          onSend={(messages) => this.onSend(messages)}
          user={{
            _id: this.state.uid,
            name: name,
          }}
        />
        {/* Android keyboard fix */}
        {Platform.OS === 'android' ? (
          <KeyboardAvoidingView behavior='height' />
        ) : null}
      </View>
    );
  }
}