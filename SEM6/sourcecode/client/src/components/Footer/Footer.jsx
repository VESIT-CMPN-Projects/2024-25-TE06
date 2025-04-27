import React from 'react';
import { FaInstagram, FaFacebook, FaTwitter, FaLinkedin, FaYoutube } from 'react-icons/fa';
import './Footer.css'; 
import Logo from '../../assets/Logo_png.png';

function Footer() {
  return (
    <footer className="footer-container">
      <div className="logo-container">
        <img src={Logo} alt="Map My Forest Logo" className="logo" />
        <span className="logo-text">Map My Forest</span>
      </div>

      <nav className="menu-container">
        <div className="menu-column">
          <h4 className="menu-title">About Us</h4>
          <a href="#blog" className="menu-item">Blog</a>
        </div>
        <div className="menu-column">
          <h4 className="menu-title">Contact</h4>
          <a href="#faq" className="menu-item">F.A.Q</a>
          <a href="#contact" className="menu-item">Contact</a>
          <a href="#newsroom" className="menu-item">Newsroom</a>
        </div>
        <div className="menu-column">
          <h4 className="menu-title">Legal</h4>
          <a href="#terms" className="menu-item">Terms</a>
          <a href="#privacy" className="menu-item">Privacy Policy</a>
        </div>
      </nav>

      <div className="social-media-container">
        <a href="https://instagram.com" className="icon" aria-label="Instagram" target="_blank" rel="noopener noreferrer">
          <FaInstagram />
        </a>
        <a href="https://facebook.com" className="icon" aria-label="Facebook" target="_blank" rel="noopener noreferrer">
          <FaFacebook />
        </a>
        <a href="https://twitter.com" className="icon" aria-label="Twitter" target="_blank" rel="noopener noreferrer">
          <FaTwitter />
        </a>
        <a href="https://linkedin.com" className="icon" aria-label="LinkedIn" target="_blank" rel="noopener noreferrer">
          <FaLinkedin />
        </a>
        <a href="https://youtube.com" className="icon" aria-label="YouTube" target="_blank" rel="noopener noreferrer">
          <FaYoutube />
        </a>
      </div>
    </footer>
  );
}

export default Footer;
