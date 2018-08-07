import React from 'react'
import { Input } from 'react-materialize'

const ThCell = ({onChange, value, caption, marked}) => {
    const s = {
        display: 'flex', 
        flexDirection: 'column', 
        width: '100%'
    };

    return (
            <div style={s}>
                {caption}
                <Input
                    type='date'
                    className='th-cell'
                    value={(value) => new Date(value).toLocaleDateString()}
                    onChange={onChange}
                    placeholder={value}
                />
            </div>
    )
}

export default ThCell;