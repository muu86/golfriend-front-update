import React from 'react';
import  { 
    View, 
    StyleSheet, 
    Text, 
    Button 
} from "react-native";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icon from 'react-native-vector-icons/Ionicons';

import UserLatestSwingScreen from '../Screens/Main/UserLatestSwingScreen';
import CameraStackNavigator from './Main/CameraStackNavigator';
import CameraButton from '../Components/Buttons/CameraButton';
import SocialScreen from './Main/SocialScreen';
// import VideoRecord from '../Screens/VideoRecordScreen';

const MainStack = createBottomTabNavigator();
const MainNavigator = () => {

  return(
    <MainStack.Navigator 
      //   screenOptions={({ route }) => ({
      //     tabBarIcon: ({ focused, color, size }) => {
      //       let iconName;

      //       if (route.name === 'UserLatestSwing') {
      //         iconName = focused ? 'ios-trending-up' : 'ios-trending-up-outline';
              
      //       } else if (route.name === 'Camera'){
      //         iconName = focused ? 'camera-outline' : 'camera';
      //       } else if (route.name === 'UserSwingData'){
      //         iconName = focused ? 'ios-timer-outline' : 'ios-timer-sharp';
      //       } 
      //       return <Icon name={iconName} size={size}  color={color}/>;
      //     },
      // })}

        tabBarOptions={{ 
          // 활성화 되면 검정색 비 활성화 되면 검정색
          activeTintColor: '#90ee90',
          inactiveTintColor: 'gray',
          style: {
            height: 70,
          }
        }} 
    >
      <MainStack.Screen name = "UserLatestSwing" component ={UserLatestSwingScreen} 
        options={{ 
          title: "최근 분석",
          tabBarIcon: ({ focused, color }) => {
            if (focused) {
              return (
                <Icon name="bar-chart" size={30} color={color} />
              )
            } else {
              return (
                <Icon name="bar-chart-outline" size={30} color={color} />
              )
            }
          },
        }} 
      />
      <MainStack.Screen 
        name = "Camera" 
        component ={CameraStackNavigator}
        options={{
          title: "",
          tabBarIcon: ({color, size, focused}) => (
            <CameraButton focused={focused} />
          )
          , tabBarVisible: false 
        }}
      />
      
      <MainStack.Screen name="Social" component={SocialScreen} 
        options={{ 
          title: "소셜",
          tabBarIcon: ({ focused, color }) => {
            if (focused) {
              return (
                <Icon name="md-people" size={30} color={color} />
              )
            } else {
              return (
                <Icon name="md-people-outline" size={30} color={color} />
              )
            }
          },
        }}  
      />
    </MainStack.Navigator>
  );
};

export default MainNavigator;


const styles =  StyleSheet.create({
  contaier:{
    flex:1,
    alignItems:'center'
  }
})