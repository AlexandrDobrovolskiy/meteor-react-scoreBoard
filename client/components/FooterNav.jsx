import React from 'react';
import { Footer, Icon } from 'react-materialize';

export const FooterNav = () => (
    <Footer copyrights="©2018 Alexandr Dobrovolskiy, All rights reserved."
            moreLinks={
            <a className="grey-text text-lighten-4 right" href="#!">More Links</a>
            }
            links={
                <ul>
                  <li><a className="grey-text text-lighten-3" href="#!">Link 1</a></li>
                  <li><a className="grey-text text-lighten-3" href="#!">Link 2</a></li>
                  <li><a className="grey-text text-lighten-3" href="#!">Link 3</a></li>
                </ul>
            }
            className='main-footer'
    >
    <h5 className="white-text">Footer Content</h5>
    <p className="grey-text text-lighten-4">You can use rows and columns here to organize your footer content.</p>
</Footer>
)