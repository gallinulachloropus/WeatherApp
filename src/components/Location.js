import React, { useState } from 'react'

const Location = (props) => {

    const [value, setValue] = useState('')
    const [hidden, toggleHide] = useState(true)

    const handleChange = (event) => {
        const { value } = event.target
        setValue(value)
    }

    const handleSubmit = (event) => {
        props.setQuery(value)
        event.preventDefault()
    }

    const toggleUnits = () => {
        if (props.units === "C") {
            props.setUnits('F')
        }
        if (props.units === "F") {
            props.setUnits('C')
        }
    }

    return (
        <div className="location-container">
            <h1 className="location">{props.location ? props.location.name : 'Loading...'}</h1>
            <span role="img" aria-label="settings" onClick={() => toggleHide(!hidden)} className="settings"> ⚙️</span>
            <h4>{props.location ? props.location.country : 'Loading...'}</h4>
            <div style={hidden ? { display: 'none' } : { display: 'block' }}>
                <form onSubmit={handleSubmit}>
                    <input type="text" name="location" onChange={handleChange} placeholder="Paris, US" /><button>Set location</button>
                    <span className="toggle-units" title="Toggle units" onClick={toggleUnits}>{props.units}</span>
                </form>
            </div>
        </div>
    )
}

export default Location
