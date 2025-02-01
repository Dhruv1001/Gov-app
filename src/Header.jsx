import React from 'react';
import image from "./images/img";
import './header.css';

const Header = () => (
    <>
        <header className="header">
            <img src={image.img1} alt="logo" className='logo' />
            <div className="container">
                <p>भारत का सर्वोच्च न्यायालय</p>
                <h1>Supreme Court of India</h1>
                <p>|| यतो धर्मस्ततो जय: ||</p>
            </div>
        </header>
    </>
);

export default Header;
