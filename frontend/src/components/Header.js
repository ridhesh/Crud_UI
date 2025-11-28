import React from 'react'; 
import { Link } from 'react-router-dom'; 
 
const Header = () =
  return ( 
    React.createElement('header', {style: styles.header}, 
      React.createElement('div', {style: styles.container}, 
        React.createElement('h1', {style: styles.logo}, 'LaundryPro'), 
        React.createElement('nav', {style: styles.nav}, 
          React.createElement(Link, {to: '/customers', style: styles.navLink}, 'Customers'), 
          React.createElement(Link, {to: '/orders', style: styles.navLink}, 'Orders'), 
          React.createElement(Link, {to: '/create-order', style: styles.navLink}, 'New Order') 
        ) 
      ) 
    ) 
  ); 
}; 
 
const styles = { 
  header: { 
    backgroundColor: '#2c3e50', 
    color: 'white', 
    padding: '1rem 0', 
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)', 
  }, 
  container: { 
    maxWidth: '1200px', 
    margin: '0 auto', 
    padding: '0 20px', 
    display: 'flex', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
  }, 
  logo: { 
    margin: 0, 
    fontSize: '1.8rem', 
    fontWeight: 'bold', 
  }, 
  nav: { 
    display: 'flex', 
    gap: '2rem', 
  }, 
  navLink: { 
    color: 'white', 
    textDecoration: 'none', 
    padding: '0.5rem 1rem', 
    borderRadius: '4px', 
  }, 
}; 
 
export default Header; 
