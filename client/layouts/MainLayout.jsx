import React from 'react';
import Navigation from '../components/Navigation';

export const MainLayout = ({content, footer}) => 
    <div className="main-layout">
        <Navigation />
        {content}
        {footer}
    </div>

