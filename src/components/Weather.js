import React, { useState, useEffect } from 'react'
import DetailedReport from './DetailedReport'

const Weather = (props) => {

    const [temp, setTemp] = useState({ cur: 0, high: 0, low: 0 })
    const [status, setStatus] = useState({ type: '', description: '' })
    const [emoji, setEmoji] = useState('')
    const [report, toggleReport] = useState(false)

    //Sets temperature to state depending on unit selected
    useEffect(() => {
        if (props.forecast.main) {
            setStatus({ type: props.forecast.weather[0].main, description: props.forecast.weather[0].description })
            if (props.units === 'C') {
                setTemp(
                    {
                        cur: Math.round(props.forecast.main.temp - 273.15),
                        high: Math.round(props.forecast.main.temp_max - 273.15),
                        low: Math.round(props.forecast.main.temp_min - 273.15)
                    }
                )
            }
            if (props.units === "F") {
                setTemp(
                    {
                        cur: Math.floor((props.forecast.main.temp - 273.15) * 9 / 5 + 32),
                        high: Math.floor((props.forecast.main.temp_max - 273.15) * 9 / 5 + 32),
                        low: Math.floor((props.forecast.main.temp_min - 273.15) * 9 / 5 + 32)
                    }
                )
            }
        }
    }, [props.forecast, props.units])

    //select and emoji based on weather and set to state
    useEffect(() => {
        if (status) {
            switch (status.type) {
                case 'Clouds':
                    setEmoji('🌥️')
                    break
                case 'Clear':
                    if ((props.localTime > 5) && (props.localTime <= 17)) { setEmoji('☀️') }
                    if ((props.localTime > 16) || (props.localTime <= 5)) { setEmoji('🌙') }
                    break
                case 'Rain':
                    setEmoji('🌧️')
                    break
                case 'Thunderstorm':
                    setEmoji('⛈️')
                    break
                case 'Drizzle':
                    setEmoji('🌦️')
                    break
                case 'Snow':
                    setEmoji('🌨️')
                    break
                case 'Mist':
                case 'Fog':
                case 'Haze':
                    setEmoji('🌫️')
                    break
                default:
                    setEmoji('❗')
            }
        }
    }, [status, props.localTime])



    return (
        <div className="weather">
            <h1 className="emoji">{emoji}</h1>
            <h2>{temp ? temp.cur + props.units : 'Loading...'}</h2>
            <h5>{temp ? temp.low + props.units + ' • ' + temp.high + props.units : 'Loading...'}</h5>
            <h3><span role="img" aria-label={status.type} title={status.type}>{status.description}</span></h3>
            <span className="report-button" onClick={() => toggleReport(!report)}>Detailed Report</span>
            <div className="report" style={report ? { display: 'block' } : { display: 'none' }}>
                <DetailedReport forecast={props.forecast} />
            </div>
        </div>
    )
}

export default Weather
