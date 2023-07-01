import React, { useState } from 'react';
import { FiHome, FiSettings } from 'react-icons/fi';
import { VscCode } from "react-icons/vsc";

const Navbar = ({ setPage, isLoggedIn, handleLogout }) => {
  const [activeLink, setActiveLink] = useState('home');

  const handleLinkClick = (page) => {
    setActiveLink(page);
    setPage(page);
  };

  const navigationItems = [
    { id: 'home', text: 'HOME', icon: <FiHome className="icon" /> },
    { id: 'problems', text: 'Problems', icon: <VscCode className="icon" /> },
    { id: 'settings', text: 'Settings', icon: <FiSettings className="icon" /> },
  ];

  const renderNavigationItems = navigationItems.map((item) => (
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
        {isLoggedIn && (
          <li className="navigation__item">
            <button className="navigation__btn" onClick={handleLogout}>
              Logout
            </button>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
