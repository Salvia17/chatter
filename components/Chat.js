import React, { Component } from 'react';
import { View, StyleSheet, Platform, KeyboardAvoidingView, LogBox } from 'react-native';
import { GiftedChat, Bubble } from 'react-native-gifted-chat';

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
    LogBox.ignoreLogs(['Setting a timer']);
  }

  // Sets the state, and shows static message with the user's name
  componentDidMount() {
    let { name } = this.props.route.params;
    this.authUnsubscribe = firebase.auth().onAuthStateChanged(async (user) => {
      if (!user) {
        try {
          await firebase.auth().signInAnonymously();
        } catch (error) {
          console.error(error.message);
        }
      }

      // Update user state
      this.setState({
        _id: user.uid,
        name: name,
        messages: [],
      });

      this.referenceChatMessages = firebase.firestore().collection('messages');
      // Lists for collection changes of currnet user
      this.unsubscribeChatUser = this.referenceChatMessages
        .orderBy('createdAt', 'desc')
        .onSnapshot(this.onCollectionUpdate);
    });
  }

  componentWillUnmount() {
    this.unsubscribeChatUser();
    this.authUnsubscribe();
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

  addMessages() {
    const messages = this.state.messages[0];
    this.referenceChatMessages.add({
      _id: messages._id,
      text: messages.text,
      createdAt: messages.createdAt,
      user: messages.user,
    });
  }

  // Event handler for when chat message is sent
  onSend(messages = []) {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }),
      () => {
        this.addMessages();
      });
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