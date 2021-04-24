import React, { Component } from 'react';
// import react native gesture handler
import 'react-native-gesture-handler';
// import react Navigation
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// import the screens
import Start from './components/Start';
import Chat from './components/Chat';

//Allows users to navigate to other screens
const Stack = createStackNavigator();

export default class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = { text: '' };
  }
  render() {
    return (
      //To navigate return needs to be wrapped in NavigationContainer and Stack.Navigator,
      //with Stack.Sreen specifying where to navigate
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Start"
        >
          <Stack.Screen
            name="Start"
            component={Start}
          />
          <Stack.Screen
            name="Chat"
            component={Chat}
          />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}