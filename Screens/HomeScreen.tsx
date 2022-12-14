import { View, Text, SafeAreaView, TextInput, StyleSheet, Image, Dimensions, Keyboard } from 'react-native'
import React, {useState} from 'react'
import useFetchData from '../CustomHooks/useFetchData'
import { TouchableOpacity } from 'react-native'
import { useEffect } from 'react'
import { Feather } from '@expo/vector-icons';
import MapView, { Marker } from 'react-native-maps'
import { useNavigation } from '@react-navigation/native'
import { MainScreenNavigationProps } from '../Navigation/RootNavigator'

export const {width, height} : {width: number, height: number} = Dimensions.get('screen')

const HomeScreen = () => {

    const navigation = useNavigation<MainScreenNavigationProps>()
    const [originInput, setOriginInput] = useState<string>('')
    const [showAutoComplete, setShowAutoComplete] = useState<boolean>(true)
    
    //state to keep track of the latitude, logitude
    const [originLat, setOriginLat] = useState<string>('40.78463')
    const [originLog, setOriginLog] = useState<string>('-73.96984')
    const [originID, setOriginID] = useState<string | null>(null)

    const data = useFetchData(originInput)

    useEffect(() => {
        setShowAutoComplete(true)
    },[originInput])

    const originDatas = showAutoComplete === true ? data : []

  return (
    <SafeAreaView className="mx-5 flex-1">
        <Text className='text-black text-5xl font-bold mt-5'>Uber</Text>
        <View style={styles.searchBox}>
            <TextInput
                placeholder = 'Where from?'
                placeholderTextColor={'gray'}
                value={originInput}
                onChangeText={value => setOriginInput(value)}
                style={{
                    fontSize: 20
                }}
                autoFocus={false}
            />
        </View>
        {
            originInput.length > 0 && originDatas.length > 0
            ? <View>
                {originDatas.map((data, index) => (
                    <TouchableOpacity
                        onPress={ () => {
                            setOriginLat(data.position.latitude)
                            setOriginLog(data.position.longitude)
                            setOriginID(data.id)
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

        <View className='flex-row items-center justify-center'>
            <Option 
                text="Set a ride" 
                onPress={() => {
                    if(originID) {
                        navigation.navigate('Order', {
                        originLat: originLat,
                        originLog: originLog,
                        originID: originID
                    })}
                }} 
                image="https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,w_956,h_537/v1568070387/assets/b5/0a5191-836e-42bf-ad5d-6cb3100ec425/original/UberX.png"
            />
            <Option 
                text="Order food" 
                image="https://food.fnr.sndimg.com/content/dam/images/food/fullset/2018/5/14/0/FNM_060118-Breaded-Fried-Chicken_s4x3.jpg.rend.hgtvcom.616.462.suffix/1526308323710.jpeg" 
            />
        </View>

        <View className='mt-10 items-center justify-center' >
            <MapView 
                region={{
                    latitude: Number(originLat),
                    longitude: Number(originLog),
                    latitudeDelta: 0.005,
                    longitudeDelta: 0.005,
                }}
                style={{
                    width: width * 0.9,
                    height: 250,
                    borderColor: 'white', borderWidth: 4, borderRadius: 10
                }}
            />
        </View>

    </SafeAreaView>
  )
}

const Option = ({text, image, onPress}: {text: string, image: string, onPress?: () => void}) => {
    return (
        <TouchableOpacity onPress={onPress} className="mx-3 bg-white p-3 mt-10" style={{borderRadius: 10}}>
            <Image
                source={{
                    uri: image
                }}
                style={{height: 100, width: 150}}
            />   
            <Text className='text-center mt-5 text-lg'>{text}</Text>
            <Feather name="arrow-right-circle" size={24} color="black" style={{alignSelf: 'center', marginTop: 10}}/>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    searchBox: {
        marginTop: 20,
        padding: 10,
        borderWidth: 0,
        borderColor: 'black',
        borderRadius: 5,
        backgroundColor: 'white',
        
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
})


export default HomeScreen