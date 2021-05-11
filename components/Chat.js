import React from 'react';
import { View, StyleSheet, Platform, KeyboardAvoidingView, LogBox, Alert } from 'react-native';
import { GiftedChat, Bubble, InputToolbar } from 'react-native-gifted-chat';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import CustomActions from './CustomActions';
import MapView from 'react-native-maps';

// Google Firebase
const firebase = require('firebase');
require('firebase/firestore');

export default class Chat extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      uid: 1,
      user: {
        _id: '',
        name: '',
      },
      isConnected: false,
      image: null,
      location: null,
    }


    // Firebase configuration for the App
    if (!firebase.apps.length) {
      firebase.initializeApp({
        apiKey: "AIzaSyBfWqodqLsH0hml-7tMn80GH1NzV1W9UHQ",
        authDomain: "test-79db7.firebaseapp.com",
        projectId: "test-79db7",
        storageBucket: "test-79db7.appspot.com",
        messagingSenderId: "723612865067",
        appId: "1:723612865067:web:7844ee6f5974a43703506e",
        measurementId: "G-NFY72219NR"
      });
    }

    this.referenceChatMessages = firebase.firestore().collection("messages");
    //Ignores warnings
    LogBox.ignoreLogs([
      'Setting a timer',
      'Animated.event now requires a second argument for options',
      'expo-permissions is now deprecated',
    ]);
  }

  // Sets the state
  componentDidMount() {
    let name = this.props.route.params.name;
    this.props.navigation.setOptions({ title: name });

    // Checks for user's connection
    NetInfo.fetch().then((connection) => {
      if (connection.isConnected) {
        // connect to messages collection
        this.referenceChatMessages = firebase.firestore().collection("messages");

        // Authenticates user via Firebase
        this.authUnsubscribe = firebase.auth().onAuthStateChanged(async (user) => {
          if (!user) {
            await firebase.auth().signInAnonymously();
          }

          // Update user state
          this.setState({
            isConnected: true,
            uid: user.uid,
            user: {
              _id: user.uid,
              name: name,
            },
            messages: [],
          });

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
    // Stops listening for changes
    this.authUnsubscribe();
    // Stops listening for authentication
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
        user: {
          _id: data.user._id,
          name: data.user.name,
        },
        image: data.image || null,
        location: data.location || null,
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
      text: messages.text || '',
      uid: this.state.uid,
      createdAt: messages.createdAt,
      user: messages.user,
      image: messages.image || null,
      location: messages.location || null,
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

  renderCustomView(props) {
    const { currentMessage } = props;
    if (currentMessage.location) {
      return (
        <MapView
          style={{
            width: 150,
            height: 100,
            borderRadius: 13,
            margin: 3
          }}
          region={{
            //Adding Number() before the variables removes Warning: Failed prop type: 
            //Invalid prop `region.latitude` of type `string` supplied to `MapView`, expected `number`.
            latitude: Number(currentMessage.location.latitude),
            longitude: Number(currentMessage.location.longitude),
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        />
      );
    }
    return null;
  }

  renderActions = (props) => {
    return <CustomActions {...props} />;
  };

  render() {
    const color = this.props.route.params.color; // Color user selected in Start.js
    const styles = StyleSheet.create({
      container: {
        backgroundColor: color,
        flex: 1,
      },
    });

    const { messages, user } = this.state;
    return (
      <View style={styles.container}>
        <GiftedChat
          renderBubble={this.renderBubble.bind(this)}
          renderInputToolbar={this.renderInputToolbar.bind(this)}
          renderUsernameOnMessage={true}
          renderCustomView={this.renderCustomView}
          renderActions={this.renderActions}
          messages={messages}
          onSend={(messages) => this.onSend(messages)}
          user={user}
        />
        {/* Android keyboard fix */}
        {Platform.OS === 'android' ? (
          <KeyboardAvoidingView behavior='height' />
        ) : null}
      </View>
    );
  }
}