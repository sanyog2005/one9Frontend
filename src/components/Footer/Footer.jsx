// src/components/Footer.jsx
import React from 'react';
import { 
  FaPhone, 
  FaEnvelope, 
  FaMapMarkerAlt, 
  FaFacebookF, 
  FaTwitter, 
  FaInstagram, 
  FaLinkedinIn, 
  FaYoutube,
  FaShoppingBag
} from 'react-icons/fa';
import { MdSecurity } from 'react-icons/md';
import { Link } from 'react-router-dom';
import { footerStyles as styles } from '../../assets/dummyStyles';

const Footer = () => {
  return (
    <footer className={styles.container}>
      {/* Decorative top elements */}
      <div className={styles.topElements}>
        <div className={styles.circle1} />
        <div className={styles.circle2} />
        {/* Kept roadLine as it fits parking themes too */}
        <div className={styles.roadLine} />
      </div>
      
      <div className={styles.innerContainer}>
        <div className={styles.grid}>
          {/* Brand section */}
          <div className={styles.brandSection}>
            <Link to="/" className="flex items-center">
              <div className={styles.logoContainer}>
                <FaShoppingBag className="text-3xl text-orange-500 mr-2" />
                <span className={styles.logoText}>Arise The Run Club</span>
              </div>
            </Link>
            <p className={styles.description}>
              Premium fitness merchandise for training, travel, and everyday performance. Discover the latest bags, bottles, shoes, and essentials.
            </p>
            <div className={styles.socialIcons}>
              {[FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaYoutube].map((Icon, i) => (
                <a key={i} href="/" aria-label="Social link" className={styles.socialIconLink}>
                  <Icon />
                </a>
              ))}
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className={styles.sectionTitle}>
              Quick Links
              <span className={styles.underline} />
            </h3>
            <ul className={styles.linkList}>
              {[
                { name: 'Home', path: '/' },
                { name: 'Shop', path: '/merchandise' },
                { name: 'Orders', path: '/bookings' },
                { name: 'Support', path: '/contact' }
              ].map((link, i) => (
                <li key={i}>
                  <Link 
                    to={link.path}
                    className={styles.linkItem}
                  >
                    <span className={styles.bullet} />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Contact Info */}
          <div>
            <h3 className={styles.sectionTitle}>
              Contact Support
              <span className={styles.underline} />
            </h3>
            <ul className={styles.contactList}>
              <li className={styles.contactItem}>
                <FaMapMarkerAlt className={styles.contactIcon} />
                <span>New Delhi</span>
              </li>
              <li className={styles.contactItem}>
                <FaPhone className={styles.contactIcon} />
                <span>+91 9999999</span>
              </li>
              <li className={styles.contactItem}>
                <FaEnvelope className={styles.contactIcon} />
                <span>support@me.com</span>
              </li>
            </ul>
            <div className={styles.hoursContainer}>
              <h4 className={styles.hoursTitle}>Store Support Hours</h4>
              <div className={styles.hoursText}>
                <p>24/7 order help</p>
                <p>Office: Mon - Fri: 9:00 AM - 6:00 PM</p>
              </div>
            </div>
          </div>
          
          {/* Newsletter */}
          <div>
            <h3 className={styles.sectionTitle}>
              Stay Updated
              <span className={styles.underline} />
            </h3>
            <p className={styles.newsletterText}>
              Get alerts on new drops, restocks, and limited-time offers.
            </p>
            <form className="space-y-3">
              <input
                type="email"
                placeholder="Your Email Address"
                className={styles.input}
              />
              <button
                type="submit"
                className={styles.subscribeButton}
              >
                <MdSecurity className="mr-2 text-lg sm:text-xl" />
                Subscribe
              </button>
            </form>
          </div>
        </div>
        
        {/* Bottom copyright */}
        <div className={styles.copyright}>
          <p>© {new Date().getFullYear()} Arise The Run Club. All rights reserved.</p>
          <p className="mt-3 md:mt-0">
            Designed by <a 
              href="https://hexagondigitalservices.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className={styles.designerLink}
            >
              sanyog sharma
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;