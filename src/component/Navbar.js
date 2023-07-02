import React, { useState } from 'react';
import './../styles/Navbar.css';
import { FiHome, FiSettings } from 'react-icons/fi';
import { VscCode } from "react-icons/vsc";

const Navbar = ({ setPage, isLoggedIn }) => { // This component will render the navbar
  const [activeLink, setActiveLink] = useState('home'); // This state will contain the active link

  const handleLinkClick = (page) => { // This function will handle the link click
    setActiveLink(page);
    setPage(page);
  };

  const navigationItems = [ // This array will contain the navigation items
    { id: 'home', text: 'HOME', icon: <FiHome className="icon" /> }, 
    { id: 'problems', text: 'Problems', icon: <VscCode className="icon" /> },
    { id: 'settings', text: 'Settings', icon: <FiSettings className="icon" /> },
  ];

  const renderNavigationItems = navigationItems.map((item) => ( // This function will render the navigation items
    <li className="navigation__item" key={item.id}>
      <button
        className={`navigation__btn ${activeLink === item.id ? 'active' : ''}`}
        onClick={() => handleLinkClick(item.id)}
      >
        {activeLink !== item.id && item.icon}
        <span className="navigation__text">{item.text}</span>
      </button>
    </li>
  ));

  return (
    <nav className="navigation">
      <ul className="navigation__list">
        {renderNavigationItems}
      </ul>
    </nav>
  );
};

export default Navbar;
