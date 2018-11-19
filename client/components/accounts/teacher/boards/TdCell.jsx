import React from 'react'
import {
    Input
} from 'react-materialize'

const TdCell = ({value, edited, onChange}) => {
    const s = {borderRadius: '3px', width: '75px', height: '40px', display: 'flex', flexDirection: 'column', justifyContent: 'center'};
    
    if(edited){
        s['borderBottom'] = '3px solid orange';
    }
    return (
        <div
            style={s}
            className={'td-cell'}
        >
        <Input
            type='text'
            placeholder={value}
            onChange={onChange}
        />
        </div>
    )
}

export default TdCell;
