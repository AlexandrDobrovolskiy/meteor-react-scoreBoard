import React from 'react'
import { Input } from 'react-materialize'

const ThCell = ({onChange, value, caption, onChangeCaption}) => {
    return (
            <div className='th-cell-container'>
                <Input
                    type='text'
                    className='th-cell'
                    onChange={onChangeCaption}
                    placeholder={caption}
                />
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