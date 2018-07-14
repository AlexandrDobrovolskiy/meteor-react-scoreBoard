import React, { Component } from 'react';
import TrackerReact from 'meteor/ultimatejs:tracker-react';

export default class App extends TrackerReact(Component) {

  render() {
    return (
      <div>
        <div className="container">

          <h1>Hello whoever you are</h1>

          <p>
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Eaque repudiandae atque inventore quae, est rerum recusandae reiciendis vitae, perferendis maxime incidunt voluptate ipsum quos sapiente at sequi praesentium dolores et.
          </p>
        </div>
      </div>
    )
  }
}
      
