import React from 'react'
import {
    Input
} from 'react-materialize'

const TdCell = ({value, marked, edited}) => {
    const s = {borderRadius: '3px', width: '75px', height: '40px', display: 'flex', flexDirection: 'column', justifyContent: 'center'};
    if(!!marked) {
        s['boxShadow'] = `inset 0px 0px 25px 5px ${marked}`;
    }
    if(edited){
        s['borderBottom'] = '3px solid orange';
    }
    return (
        <div
            style={s}
            className={'td-cell'}
        >
        {value}
        </div>
    )
}

export default TdCell;
