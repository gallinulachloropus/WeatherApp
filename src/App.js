import React, { useState, useEffect } from 'react'

import Location from './components/Location'
import Weather from './components/Weather'

import config from './config.json'

import './App.css'


function App() {
  const openWeatherKey = config.apiKey //put api key here

  const [forecast, setForecast] = useState({})
  const [query, setQuery] = useState('Tampa')
  const [units, setUnits] = useState('C')
  const [localTime, setLocalTime] = useState()
  const [cover, setCover] = useState()

  useEffect(() => {
    fetch(`http://api.openweathermap.org/data/2.5/weather?q=${query}&appid=${openWeatherKey}`)
      .then(res => {
        if (!res.ok) {
          throw new Error(res.status)
        }
        return res
      })
      .then(res => res.json())
      .then(data => setForecast(data))
      .catch(err => alert('Could not connect to weather: ' + err))
  }, [query, openWeatherKey])


  useEffect(() => {
    if (localStorage.getItem('location')) {
      setQuery(JSON.parse(localStorage.getItem('location') || ''))
    }
    if (localStorage.getItem('unit')) {
      setUnits(JSON.parse(localStorage.getItem('unit') || ''))
    }
  }, [])

  useEffect(() => {
    if (query) {
      localStorage.setItem('location', JSON.stringify(query))
    }
    if (units) {
      localStorage.setItem('unit', JSON.stringify(units))
    }
  })

  useEffect(() => {
    if (forecast.timezone || forecast.timezone === 0) {
      setLocalTime((new Date().getUTCHours() + ((forecast.timezone / 60) / 60)) % 24)
      setCover(forecast.clouds.all)
    }
  }, [forecast, cover])

  useEffect(() => {
    if (localTime) {
      const cloudCover = (cover) => {
        return 100 - cover
      }
      const lightLevel = (hours) => {
        //Morning
        if (hours > 5 && hours <= 10) {
          return 50
        }
        //Day
        if (hours > 10 && hours <= 17) {
          return 80
        }
        //Evening
        if (hours > 17 && hours <= 20) {
          return 40
        }
        //Night
        if (hours > 20 || hours <= 5) {
          return 10
        }
      }
      document.body.style = `background: hsl(220, ${cloudCover(cover)}%, ${lightLevel(localTime)}%)`
    }
  }, [localTime, cover])

  return (
    <main style={localTime > 16 || localTime <= 5 ? { color: 'whitesmoke' } : { color: '#333' }}>
      <Location
        setQuery={setQuery}
        setUnits={setUnits}
        units={units}
        location={forecast.main ? { name: forecast.name, country: forecast.sys.country } : false}
      />

      <Weather
        forecast={forecast}
        units={units}
        localTime={localTime}
      />
    </main>
  )
}

export default App
