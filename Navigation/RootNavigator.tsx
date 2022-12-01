import { View, Text } from 'react-native'
import React from 'react'
import { 
  createNativeStackNavigator, 
  NativeStackNavigationProp, 
  NativeStackScreenProps 
} from '@react-navigation/native-stack'
import HomeScreen from '../Screens/HomeScreen'
import UberOrder from '../Screens/UberOrder'
import BookingScreen from '../Screens/BookingScreen'

export type RootStackParamsType = {
    Home: undefined,
    Order: {
      originLat: string,
      originLog: string,
      originID: string | null,
    },
    Booking: {
      roadLength: string,
      travelTime: string
    }
}
export type MainScreenNavigationProps = NativeStackNavigationProp<RootStackParamsType, 'Order'>
export type OrderScreenProps = NativeStackScreenProps<RootStackParamsType, 'Order'>
export type OrderScreenNavigationProps = NativeStackNavigationProp<RootStackParamsType, 'Booking'>
export type BookingScreenProps = NativeStackScreenProps<RootStackParamsType, 'Booking'>

const RootStack = createNativeStackNavigator<RootStackParamsType>()

const RootNavigator = () => {
  return (
    <RootStack.Navigator 
        initialRouteName='Home'
        screenOptions={{
            headerShown: false
        }}
    >
        <RootStack.Screen name="Home" component={HomeScreen} />
        <RootStack.Screen name="Order" component={UberOrder} />
        <RootStack.Screen name="Booking" component={BookingScreen} 
          options={{
            presentation: 'modal'
          }}
        />
    </RootStack.Navigator>
  )
}

export default RootNavigator