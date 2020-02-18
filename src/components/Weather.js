import React, { useState, useEffect } from 'react'

const Weather = (props) => {

    const [temp, setTemp] = useState({ cur: 0, high: 0, low: 0 })
    const [status, setStatus] = useState({ type: '', description: '' })
    const [emoji, setEmoji] = useState('')
    const [report, toggleReport] = useState(false)

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

    useEffect(() => {
        if (status) {
            if (status.type === 'Clouds') { setEmoji('🌥️') }
            if (status.type === 'Clear' && ((props.localTime > 5) && (props.localTime <= 17))) { setEmoji('☀️') }
            if (status.type === 'Clear' && ((props.localTime > 17) || (props.localTime <= 5))) { setEmoji('🌙') }
            if (status.type === 'Rain') { setEmoji('🌧️') }
            if (status.type === 'Snow') { setEmoji('🌨️') }
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
                {props.forecast.main ?
                    <ul>
                        <li>Humidity: {props.forecast.main.humidity}</li>
                        <li>Pressure: {props.forecast.main.pressure}</li>
                        <li>Feels Like: {props.forecast.main.feels_like}</li>
                        <li>Cloud Cover: {props.forecast.clouds.all}%</li>
                        <li>Wind: {props.forecast.wind.speed}m/s {props.forecast.wind.deg}°</li>
                        <li>Visibility: {props.forecast.visibility}</li>
                        <li>Sunrise: {new Date(props.forecast.sys.sunrise * 1000).toLocaleString()}</li>
                        <li>Sunset: {new Date(props.forecast.sys.sunset * 1000).toLocaleString()}</li>
                    </ul> : ''
                }
            </div>
        </div>
    )
}

export default Weather
