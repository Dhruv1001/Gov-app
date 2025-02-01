import React from 'react';
import image from "../images/img";
import '../header.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faList, faInfoCircle, faGavel, faFileAlt, faFile, faBalanceScale, faFileUpload, faBullhorn, faUsers } from '@fortawesome/free-solid-svg-icons';

const Home = () => (
    <>
        <section>
            {/* <header className="header">
                <img src={image.img1} alt="logo" className='logo' />
                <div className="container">
                    <p>भारत का सर्वोच्च न्यायालय</p>
                    <h1>Supreme Court of India</h1>
                    <p>|| यतो धर्मस्ततो जय: ||</p>
                </div>
            </header> */}

            <section className="hero">
                <img src={image.img2} alt="Supreme Court" className="hero-image" />
                <div className="hero-links">
                    <a href="/">
                        <FontAwesomeIcon icon={faList} /> Cause List
                    </a>
                    <a href="/">
                        <FontAwesomeIcon icon={faInfoCircle} /> Case Status
                    </a>
                    <a href="/">
                        <FontAwesomeIcon icon={faGavel} /> Daily Orders
                    </a>
                    <a href="/">
                        <FontAwesomeIcon icon={faFileAlt} /> Judgments
                    </a>
                    <a href="/">
                        <FontAwesomeIcon icon={faFile} /> Office Report
                    </a>
                    <a href="/">
                        <FontAwesomeIcon icon={faBalanceScale} /> Caveat
                    </a>
                    <a href="/">
                        <FontAwesomeIcon icon={faFileUpload} /> e-Filing
                    </a>
                    <a href="/">
                        <FontAwesomeIcon icon={faBullhorn} /> Display Boards
                    </a>
                    <a href="/">
                        <FontAwesomeIcon icon={faUsers} /> Special Lok Adalat
                    </a>
                </div>
            </section>
        </section>
    </>
);

export default Home;
