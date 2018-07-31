import React, { Component } from 'react'

export default class BareFooter extends Component {
  render() {
    return (
      <div className='container z-depth-2 flow-text' style={{padding: '20px'}}>
        <p className='center'>Возникли проблемы? Очень жаль что вы никому не нужны. <a href='#'>Пойти нахуй</a> </p>
        <p className='center'>Также вы можете <a href='#'>Убить себя</a> </p>
      </div>
    )
  }
}
