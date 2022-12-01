import { View, Text, Image } from 'react-native'
import React, { useLayoutEffect, useState, useEffect, useCallback } from 'react'
import LottieView from 'lottie-react-native';
import { width, height } from './HomeScreen';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import { BookingScreenProps, MainScreenNavigationProps } from '../Navigation/RootNavigator';
import useTravelTime from '../CustomHooks/useTravelTime';
import numbro from 'numbro'
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { addDriver } from '../redux/addDriverReducer';

type SpecificUberCarProps = {
  price: string,
  travelTime: string,
  uberName: string,
  uber: string,
  setUberName: React.Dispatch<React.SetStateAction<string>>,
  image: string,
  setDriver: React.Dispatch<React.SetStateAction<string>>
}

const BookingScreen = ({route}: BookingScreenProps) => {

    const {travelTime, roadLength} = route.params

    const LottieViewAnimated = Animated.createAnimatedComponent(LottieView)
    const scaleXAnimation = useSharedValue<number>(1)
    const scaleYAnimation = useSharedValue<number>(1)
    const translateYAnimation = useSharedValue<number>(0)
    const textOpacity = useSharedValue<number>(1)

    const changeLottieView = useCallback(
      () => {
        setTimeout(() => {
          scaleXAnimation.value = withTiming(0.5, {duration: 1000})
          scaleYAnimation.value = withTiming(0.5, {duration: 1000})
          translateYAnimation.value = withTiming(-height * 0.25, {duration: 2000})
          textOpacity.value = withTiming(0, {duration: 1500})
        }, 5000)
      },
      [],
    )
    
    useLayoutEffect(() => {
      changeLottieView()
    }, [])

    const LottieAnimatedStyle = useAnimatedStyle(() => {
          return {
            transform: [
              {scaleX: scaleXAnimation.value},
              {scaleY: scaleYAnimation.value},
              {translateY: translateYAnimation.value}
            ]
          }
        })

    const TextAnimatedStyle = useAnimatedStyle(() => {
      return {
        opacity: textOpacity.value
      }
    })

  return (
    <View style={{backgroundColor: '#162C4B', flex: 1}}>
      <View style={{
          alignItems: 'center',
          justifyContent: 'center',
          //flex: 1,
          
      }}>
        <Animated.Text 
          className='text-3xl text-white font-bold mb-2 ' 
          style={TextAnimatedStyle}
        >
          Finding your Uber...
        </Animated.Text>
        <LottieViewAnimated
          source={require('../assets/67725-cars.json')}
          autoPlay
          loop
          style={[{
              width: width * 0.65,
              height: height * 0.5,
            }, LottieAnimatedStyle]}
        />
        
      </View>
      <UberCar 
        travelTime={travelTime}
        roadLength={roadLength} 
      />
    </View>
  )
}

const UberCar = ({travelTime, roadLength}: {travelTime: string, roadLength: string}) => {

  const translateYUberCarAnimation = useSharedValue<number>(height)
  const [uber, setUberName] = useState<string>('')
  const [driver, setDriver] = useState<string>('')
  const navigation = useNavigation()
  const Dispatch = useDispatch()

  useEffect(() => {
    setTimeout(() => {
      translateYUberCarAnimation.value = withTiming(-height * 0.25, {duration: 1000})
    }, 6000)
  },[])

  const UberCarAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {translateY: translateYUberCarAnimation.value}
      ]
    }
  })

  const UberXTimeTravel = useTravelTime(travelTime)
  const UberXLTimeTravel = useTravelTime((Number(travelTime) - 900).toString())
  const UberLUXTravelTime = useTravelTime((Number(travelTime) - 1800).toString())

  const UberXPrice = (numbro(parseFloat(roadLength) * 0.75).format({thousandSeparated: true, mantissa: 2})).toLocaleString() + "$"
  const UberLXPrice = (numbro(parseFloat(roadLength) * 1.25).format({thousandSeparated: true, mantissa: 2})).toLocaleString() + "$"
  const UberULXPrice = (numbro(parseFloat(roadLength) * 1.5).format({thousandSeparated: true, mantissa: 2})).toLocaleString() + "$"

  return(
    <Animated.View style={UberCarAnimatedStyle}>
      <Text className='text-3xl text-white font-bold text-center'>Choose your driver</Text>
      <View className=" mt-5 px-3" style={{borderRadius: 20}}>
        <SpecificUberCar
          uber={uber}
          setDriver={setDriver}
          setUberName={setUberName}
          price= {UberXPrice}
          travelTime={UberXTimeTravel}
          uberName="UberX"
          image="https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/chris-hemsworth-natalie-portman-thor-love-and-thunder-poster-1653464519.jpg?crop=0.434xw:0.293xh;0.250xw,0.108xh&resize=640:*" 
        />
        <SpecificUberCar
          uber={uber}
          setDriver={setDriver}
          setUberName={setUberName}
          price={UberLXPrice}
          travelTime={UberXLTimeTravel}
          uberName="UberXL"
          image='https://www.aiesec.in/wp-content/uploads/2018/08/Captain-america-1.jpg' 
        />
        <SpecificUberCar
          uber={uber}
          setDriver={setDriver}
          setUberName={setUberName} 
          price={UberULXPrice}
          travelTime={UberLUXTravelTime}
          uberName="UberLUX"
          image="https://images.complex.com/complex/images/c_fill,f_auto,g_center,w_1200/fl_lossy,pg_1/k71r66uwuefpivemgxsz/iron-man-armor"
        />
      </View>
      <TouchableOpacity 
        className='mt-10 bg-slate-100 py-3 mx-5'
        onPress={() => {
          if(uber.length > 0) {
            navigation.goBack()
            Dispatch(
              addDriver(driver)
            )
          }
        }}
      >
        <Text className='text-center text-black text-lg font-bold'>Confirm</Text>
      </TouchableOpacity>
    </Animated.View>
  )
}

const SpecificUberCar = (props: SpecificUberCarProps) => {
  return (
    <>
      <TouchableOpacity
        onPress={() => {
          props.setUberName(props.uberName)
          props.setDriver(props.image)
        }} 
        style={{
          flexDirection: 'row', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          backgroundColor: props.uber === props.uberName ? 'gray' : 'transparent',
          paddingHorizontal: 10,
          paddingVertical: 10
        }}
      >
        <View>
          <Image
            style={{height: 60, width: 60, resizeMode: 'cover', borderRadius: 50, borderWidth: 2, borderColor: 'white'}} 
            source={{uri: props.image}}
          />
        </View>
        <View >
          <Text className='text-xl text-white font-bold text-center'>{props.uberName}</Text>
          <Text className='text-lg text-white text-center'>{props.travelTime}</Text>
        </View>
        <View>
          <Text className='text-xl text-white font-bold'>{props.price}</Text>
        </View>
      </TouchableOpacity>
    </>
  )
}

export default BookingScreen