import React from 'react'

const DetailedReport = (props) => {
    //display detailed report of api data, normally hidden
    return (
        <React.Fragment>
            {props.forecast.main ?
                <ul>
                    <li>Humidity: {props.forecast.main.humidity}%</li>
                    <li>Pressure: {props.forecast.main.pressure}</li>
                    <li>Feels Like: {props.units === 'C' ? Math.round(props.forecast.main.feels_like - 273.15) : Math.floor((props.forecast.main.feels_like - 273.15) * 9 / 5 + 32)}{props.units}</li>
                    <li>Cloud Cover: {props.forecast.clouds.all}%</li>
                    <li>Wind: {props.forecast.wind.speed}m/s {props.forecast.wind.deg ? props.forecast.wind.deg + '°' : ''}</li>
                    <li>Visibility: {props.forecast.visibility ? props.forecast.visibility + 'm' : 'Unavailible'}</li>
                    <li>Sunrise: {new Date(props.forecast.sys.sunrise * 1000).toLocaleString()}</li>
                    <li>Sunset: {new Date(props.forecast.sys.sunset * 1000).toLocaleString()}</li>
                </ul> : 'Loading...'
            }
        </React.Fragment>
    )
}

export default DetailedReport
