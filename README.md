# Chat App

This is React Native app, that's developed using Expo, that will
provide users with a chat interface and options to share images and their
location.
<br><br>

## Key Features

- A page where users can enter their name and choose a background color for the chat screen before joining chat.
- A page displaying the conversation, as well as an input field and submit button.
- The chat must provide users with two additional communication features: sending images and location data.
- Data gets stored online and offline.

## Key Technologies

- React Native
- Expo
- Google Firestore
- Gifted Chat library

## Get Started 🚀

- You will need to have Node installed on your computer. You can check which version is installed by typing node -v in your terminal.
- Next you will need expo cli 

```
npm install expo-cli --global
```

- If you would like to run the app on your mobile device, you'll need to install the Expo app through your device's app store (iOS or Android)
- You will also need an Expo account which can be created via [Expo.io](https://expo.io)
- You will need to login into Expo in order to access the App

  - Logging into Expo through the CLI on your machine
  - Logging into Expo on your mobile device in the Expo app

- If you would like to run the app on your machine through a simulator/emulator, you will either need
  - [Android Studio](https://docs.expo.io/workflow/android-studio-emulator/)
  - [iOS Simulator](https://docs.expo.io/workflow/ios-simulator/)

  ### Installing Dependencies

  - Start by downloading/cloning this repository
  - Then in the project directory install the application's dependencies.

```
npm install
```

### Running the App

- To start the project, run the following in your terminal:

```
expo start
```

#### Running the App on Your Mobile Device

After using the "expo start" command to run the app, you can use 'e' to send yourself an email with a link to the app. This can then be opened in your mobile device to run the app through your mobile device's Expo app. Alternatively, you can use your mobile device to scan the provided QR code displayed in the command line interface.

#### Running the App with Emulator/Simulator

With the command line interface open after using the 'expo start' command, press 'a' to run the app with an Android emulator, or press 'i' to run the app with iOS simulator. Make sure the emulator/simulator is already open. I found that the Android emulator, albeit being a very useful software, drains too much of my computer's resources. 