import { View, Text, TouchableOpacity, Keyboard, TextInput, StyleSheet, Modal, Image, Alert } from 'react-native'
import React, { useEffect, useMemo, useRef, useState, useLayoutEffect} from 'react'
import { OrderScreenNavigationProps, OrderScreenProps } from '../Navigation/RootNavigator'
import MapView, {Marker, Polyline} from 'react-native-maps'
import { width, height } from './HomeScreen'
import useFetchData from '../CustomHooks/useFetchData'
import { Feather, Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native'
import { TOMTOM_KEY } from '@env'
import Animated, { 
  useAnimatedStyle, 
  useDerivedValue, 
  useSharedValue, 
  withRepeat, 
  withSequence, 
  withTiming 
} from 'react-native-reanimated'
import numbro from 'numbro'
import useTravelTime from '../CustomHooks/useTravelTime'
import { useSelector } from 'react-redux'
import { selectDriver } from '../redux/addDriverReducer'
import { Directions } from 'react-native-gesture-handler'

type direction = {
  latitude: number,
  longitude: number
}

const UberOrder = ({route}: OrderScreenProps) => {

  const {originLat, originLog, originID} = route.params;
  const navigation = useNavigation<OrderScreenNavigationProps>()
  
  const [destinationLat, setDestinationLat] = useState<string>('')
  const [destinationLog, setDestinationLog] = useState<string>('')
  const [destinationID, setDestinationID] = useState<string | null>(null)
  const [direction, setDirection] = useState<direction[]>([])
  const [roadLength, setRoadLength] = useState<string>('')
  const [travelTime, setTravelTime] = useState<string>('')
  const [destinationInput, setDestinationInput] = useState('')
  const [showAutoComplete, setShowAutoComplete] = useState<boolean>(true)

  const driver = useSelector(selectDriver)

  const data = useFetchData(destinationInput)
  const destinationDatas = showAutoComplete === true ? data : []

  useEffect(() => {
    setShowAutoComplete(true)
  },[destinationInput])

  const mapRef = useRef(null)

  useEffect(() => {
    if(!originID && destinationID) return
    if (mapRef.current && originID && destinationID && driver.length == 0) {
      mapRef.current.fitToSuppliedMarkers([originID, destinationID], {
        edgePadding: {top: 50, right: 200, bottom: 50, left: 100}
      })
    }
    if (mapRef.current && originID && destinationID && driver.length > 0) {
      mapRef.current.fitToSuppliedMarkers([originID, driver], {
        edgePadding: {top: 50, right: 100, bottom: 50, left: 100}
      })
    }
  }, [originID, destinationID, driver])

  const location: string = originLat + ',' + originLog + ':' + destinationLat + ',' + destinationLog

  //fetch data to render direction from origin to
   const directionURL = `https://api.tomtom.com/routing/1/calculateRoute/${location}/json?key=${TOMTOM_KEY}`

   const fetchDirection = () => {
    return fetch(directionURL)
    .then(response => response.json())
    .then(response => {
      //console.log(response);
      const direction = response.routes[0].legs[0].points
      const roadLength = response.routes[0].summary.lengthInMeters
      const travelTime = response.routes[0].summary.travelTimeInSeconds
      //console.log("dirction is", direction)
      setDirection(direction)
      setRoadLength((Number(roadLength) / 1000).toString())
      setTravelTime(travelTime) 
    })
    .catch(err => console.log(err))
   }

   const formatTravelTime = useTravelTime(travelTime)
   const formatRoadLength = numbro(Number(roadLength)).format({thousandSeparated: true, mantissa: 2})

   useEffect(() => {
    if(destinationID) {
      fetchDirection();
    }
   }, [originLat, originLog, destinationLat, destinationLog])
   

   const ConfirmAnimatedStyle = useAnimatedStyle(() => {
    return {
      color: withRepeat(withSequence(withTiming('red'), withTiming('black'), withTiming('red')), -1, true)
    }
   })

   //show driver from the Booking Screen on the map as well as the route it
   //take for the driver to get to the user's location
   const driverLocationLat = originLat + 0.003
   const driverLocationLog = originLog + 0.003
   const [driverDirections, setDriverDirection] = useState<direction[]>([])
   const [driverTravelTime, setDriverTravelTime] = useState<string>('')
   //console.log(driverTravelTime)
   const [movingCar, setMovingCar] = useState<direction>(
    {latitude: Number(driverLocationLat), longitude: Number(driverLocationLog)}
    )
   const driverlocation: string = originLat + ',' + originLog + ':' + driverLocationLat + ',' + driverLocationLog
   const driverDirectionURL = `https://api.tomtom.com/routing/1/calculateRoute/${driverlocation}/json?key=${TOMTOM_KEY}`

   const fetchDriverDirection = () => {
    return fetch(driverDirectionURL)
    .then(response => response.json())
    .then(response => {
      //console.log(response);
      const direction = response.routes[0].legs[0].points
      const travelTime = response.routes[0].summary.travelTimeInSeconds
      //console.log("dirction is", direction)
      setDriverDirection(direction)
      setDriverTravelTime(travelTime) 
    })
    .catch(err => console.log(err))
   }

   useEffect(() => {
    if(driver.length > 0) fetchDriverDirection()
   }, [originLat, originLog, driver])

   let index = driverDirections.length - 1;
   const [service, setService] = useState(false)
   useEffect(() => {
    if(driverDirections.length > 0 && driver.length > 0 ) {
      //setMovingCar(driverDirections[index]);
      
      const interval = setInterval(() => {
        if(index === 0) {
          index = 0   
          setMovingCar(driverDirections[index]);
          setService(true)
          return
        }
        index--
        setMovingCar(driverDirections[index])
      }, 2000)
      return () => {
        clearInterval(interval)
        
      }
    }
    
   },[index])

   useEffect(() => {
    if(service === true) Alert.alert('Thank you for choosing our service')
   },[service])

  return (
    <View style={{position: 'relative'}}>
      <View style={{flex: 1}}>
        <MapView
          ref={mapRef}
          mapType="mutedStandard"
          showsCompass={false} 
          initialRegion={{
            latitude: Number(originLat),
            longitude: Number(originLog),
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          }}
          style={{
              width: width ,
              height: height,
          }} 
        >
          {originID && 
            (
              <Marker
                identifier={originID}
                title="Location"
                description={`Length: ${formatRoadLength}km`}
                coordinate={{
                  latitude: Number(originLat ),
                  longitude: Number(originLog )
                }}
              />
            )
          }
          
          {destinationID &&
            (<Marker
            identifier= {destinationID}
            title= 'Destination '
            description={`Time: ${formatTravelTime}`} 
            pinColor="blue"
              coordinate={{
                latitude: Number(destinationLat),
                longitude: Number(destinationLog)
              }}
            />)
          }

          {driver.length > 0 && originID && destinationID &&
                <Marker
                  identifier= {driver}
                  title= {service === false ? "your driver's coming" : "Let's go"}
                  description={ service === false ? "arrival time: 5 mins" : "hope you'd enjoy"}
                  pinColor="blue"
                  coordinate={{
                      latitude: movingCar.latitude,
                      longitude: movingCar.longitude
                    }}
                  >
                    <View >
                      <Image
                      style={{width: 50, height: 50}}
                      source={{uri: 'https://cdn-icons-png.flaticon.com/512/171/171241.png'}} 
                      />
                    </View>
                  </Marker>
          }

          {
            originID && destinationID && 
              ( 
                <Polyline
                  coordinates={direction}
                  strokeColor='black'
                  strokeWidth={4}
                  tappable={true}
                />
              )
          }
          
        </MapView>
      </View>
      
      <View style={{marginHorizontal: 20}}>
        <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' , marginTop: 40}}>
          <TouchableOpacity  onPress={() => navigation.goBack()}>
            <Feather name="arrow-left-circle" size={30} color="black" />
          </TouchableOpacity>
          {
            originID && destinationID &&
            (
              <TouchableOpacity 
                onPress={() => navigation.navigate('Booking', {
                  roadLength: roadLength,
                  travelTime: travelTime
                })}
              >
                <Animated.Text style={[{ fontWeight: 'bold', fontSize: 17}, ConfirmAnimatedStyle]}>
                  Confirm
                </Animated.Text>
              </TouchableOpacity>
            )
          }
          
        </View>
        
        <View style={styles.searchBox}>
          <TextInput
            placeholder = 'Where to?'
            placeholderTextColor={'black'}
            value={destinationInput}
            onChangeText={value => setDestinationInput(value)}
            style={{
              fontSize: 20,
              fontWeight: 'bold'
            }}
            autoFocus={false}
          />
        </View>
        {
        destinationInput.length > 0 && destinationDatas.length > 0
        ? <View>
            {destinationDatas.map((data, index) => (
                <TouchableOpacity
                    onPress={ () => {
                        setDestinationLat(data.position.latitude)
                        setDestinationLog(data.position.longitude)
                        setDestinationID(data.id)
                        setShowAutoComplete(false) //touch event to show the position of the pressed address on the map
                        Keyboard.dismiss()
                    }}  
                    key={index} 
                    style={styles.autoComplete}
                >
                    <Text>{data.address}</Text>
                </TouchableOpacity>
            ))}
          </View>
        : <View></View>
        }
      </View>
      
      
    </View>
  )
}

const styles = StyleSheet.create({
  searchBox: {
      marginTop: 10,
      padding: 10,
      borderWidth: 3,
      borderColor: 'black',
      borderRadius: 5,
      backgroundColor: 'transparent',
  },
  autoComplete: {
      padding: 10,
      marginTop: 2,
      borderBottomWidth: 1,
      borderLeftWidth: 1,
      borderRightWidth: 1,
      borderColor: 'black',
      borderRadius: 5,
      backgroundColor: 'white'
  },
  box: {
    backgroundColor: 'black',
    paddingVertical: 10,
    borderRadius: 20,
    paddingHorizontal: 30,
    marginHorizontal: 30,
    alignItems:'center',
    justifyContent: 'center'
  },
})

export default UberOrder