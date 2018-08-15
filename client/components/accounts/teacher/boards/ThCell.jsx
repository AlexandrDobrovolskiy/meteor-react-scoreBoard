import React from 'react'
import { Input } from 'react-materialize'

const ThCell = ({onChange, value, caption}) => {
    return (
            <div className='th-cell-container'>
                {caption}
                <Input
                    type='date'
                    className='th-cell'
                    onChange={onChange}
                    placeholder={new Date(value).toLocaleDateString()}
                />
            </div>
    )
}

export default ThCell;