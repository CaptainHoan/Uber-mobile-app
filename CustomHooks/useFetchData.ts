import React from 'react'
import {TOMTOM_KEY} from "@env"
import { useState, useEffect } from 'react'

export type DataType = {
    address: string,
    id: string,
    position: {
        latitude: string,
        longitude: string
    }
}

const useFetchData = (input: string) =>  {
    const URL = `https://api.tomtom.com/search/2/search/${input}.json?limit=5&key=${TOMTOM_KEY}`

    const [data, setData] = useState<DataType[]>([])
    const options = {
        method: "GET"
    }

    const fetchData = () => {
        return fetch(URL, options)
        .then(response => response.json())
        .then(response => {
            if(input.length > 0) {
                const results = response.results;
                //console.log(results)
                const array: DataType[] = results.map((result: { 
                    address: { 
                        freeformAddress: string, 
                        countrySecondarySubdivision?: string, 
                        countrySubdivisionName?: string, 
                        country: string 
                    },
                    
                    id: string,
                    
                    position: {
                        lat: string,
                        lon: string
                    } 
                    }) => 
                        ({id: result?.id,
                            position: {
                                latitude: result.position.lat,
                                longitude: result.position.lon
                            } , 
                        address: result.address.countrySecondarySubdivision && result.address.countrySubdivisionName
                            ?(
                            result.address.freeformAddress + ', ' 
                            + result.address.countrySecondarySubdivision + ', ' 
                            + result.address.countrySubdivisionName + ', ' 
                            + result.address?.country
                            ) 
                            : (result.address.freeformAddress + ', ' + result.address?.country)
                        }))
                setData(array)
            }
                //console.log('this is', data)
        })
        .catch(err => console.error(err));
    }
    
    useEffect(() => {
      if(input.length > 0) {
        fetchData()
      }
    }, [input])
    

  return data
}

export default useFetchData