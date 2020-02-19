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
  const [errorMsg, toggleErrorMsg] = useState(false)

  useEffect(() => {
    //api call
    fetch(`http://api.openweathermap.org/data/2.5/weather?q=${query}&appid=${openWeatherKey}`)
      .then(res => {
        //check for errors
        if (!res.ok) {
          throw new Error(res.status)
        }
        return res
      })
      .then(res => res.json())
      .then(data => setForecast(data))
      //handle errors, if it is a 404 display a div instead of an alert
      .catch(err => {
        if (err.message === '404') {
          toggleErrorMsg(true)
          setTimeout(() => {
            toggleErrorMsg(false)
            setQuery('Tampa')
          }, 2500)
        } else {
          setQuery('Tampa')
          alert('Error retrieving weather: ' + err)
        }
      })
  }, [query, openWeatherKey])

  //sets query and units to whatever is in localStorage
  useEffect(() => {
    if (localStorage.getItem('location')) {
      setQuery(JSON.parse(localStorage.getItem('location') || ''))
    }
    if (localStorage.getItem('unit')) {
      setUnits(JSON.parse(localStorage.getItem('unit') || ''))
    }
  }, [])

  //on every update, the query and units are saved to local storage
  useEffect(() => {
    if (query) {
      localStorage.setItem('location', JSON.stringify(query))
    }
    if (units) {
      localStorage.setItem('unit', JSON.stringify(units))
    }
  })

  //calculate local time and cloud cover for background
  useEffect(() => {
    if (forecast.timezone || forecast.timezone === 0) {
      let offset = (forecast.timezone / 60) / 60
      function calcTime(offset) {
        const d = new Date();
        const utc = d.getTime() + (d.getTimezoneOffset() * 60000);
        const nd = new Date(utc + (3600000 * offset));
        return nd;
      }
      setLocalTime(calcTime(offset).getHours())
      setCover(forecast.clouds.all)
    }
  }, [forecast, cover])

  //determine values for background based on time
  useEffect(() => {
    if (localTime || localTime === 0) {
      const cloudCover = (cover) => {
        return 100 - cover
      }
      const lightLevel = (hours) => {
        //Morning
        if (hours > 5 && hours <= 10) {
          return 50
        }
        //Day
        if (hours > 10 && hours <= 16) {
          return 80
        }
        //Evening
        if (hours > 16 && hours <= 18) {
          return 40
        }
        //Night
        if (hours > 18 || hours <= 5 || hours === 0) {
          return 10
        }
      }
      document.body.style = `background: hsl(220, ${cloudCover(cover)}%, ${lightLevel(localTime)}%)`
    }
  }, [localTime, cover])

  return (
    <main style={(localTime > 16) || (localTime <= 10) ? { color: 'whitesmoke' } : { color: '#333' }}>
      {errorMsg ? <div className="error-404">Could not find location: {query}</div> : ''}
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
