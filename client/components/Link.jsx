import React, { Component } from 'react'

export default class Link extends Component {
  constructor(){
    super();

    this.onClick = this.onClick.bind(this);
  }
  
  onClick(){
    const { to } = this.props;
    FlowRouter.go(to);
  }

  render() {
      const { children } = this.props;
    return (
      <div 
        className='link'
        onClick={this.onClick}
      >
        {children}
      </div>
    )
  }
}
