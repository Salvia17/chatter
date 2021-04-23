import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

/*Palcing following code in render 

  let name = this.props.route.params.name;
  this.props.navigation.setOptions({ title: name });

produced error 
'Warning: Cannot update a component from inside the function body of a different component.'
 To avoid this, componentDidMount was used instead

The warning comes from React. Params/options here are being updated in constructor/render 
which React warns against, since it updates state of parent component.
Do not change navigation properties in the constructor, and best way is to use componentDidMount*/

export default class Chat extends React.Component {
  constructor() {
    super();
    this.state = {
      name: '',
      color: ''
    }
  };

  user() {
    let name = this.props.route.params.name;
    this.props.navigation.setOptions({ title: name });
  }

  componentDidMount() {
    this.user(); // here is the right place to change header title
  }

  render() {
    //Didn't manage to remove that error for background color. It still sets the color
    //but produces the error described above. Trying the same as for name didn't work.
    //Not sure what I'm doing wrong
    let color = this.props.route.params.color;
    this.props.navigation.setOptions({ backgroundColor: color });
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: color }}>
        <Text style={styles.text}>Hello Chat!</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({

  text: {
    flex: 1,
    textAlign: 'center',
  }
});