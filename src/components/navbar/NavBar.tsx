/* 
"""
This component serves as the navigation bar for the application. It maintains a minimalist design featuring three distinct buttons:
1. "Fetch Rewards" with an associated icon, which serves as a portal to the Home/Login screen.
2. "Dogs," which facilitates the rendering of a list of dogs within the application.
3. A "Log Out" button for user session management.
"""
*/

import React from 'react';
import { Navbar, Nav, NavDropdown, Image, Button } from 'react-bootstrap';
import fetchLogo from '../../images/fetchLogo.png'
import fetchIcon from '../../images/fetch-rewards-icon.webp'
import {Link, useNavigate} from 'react-router-dom'
import './NavBar.css'
import axios from 'axios'
import { useLoggedIn } from '../../context/LoggedInContext';

const NavBar: React.FC = () => {

  const navigate = useNavigate()

  const loggedIn = useLoggedIn()
  
  async function handleLogOut() {
    try {
     
      const response = await axios.post('https://frontend-take-home-service.fetch.com/auth/logout', null, {
        withCredentials: true,
      });
  
      if (response.status === 200) {
        
        console.log('Logout successful');
        navigate('/');
      } else {
        console.error('Logout failed. Status:', response.status);
        
      }
    } catch (error) {
      console.error('An error occurred during logout:', error);
     
    }
  }



  return (
    <nav className="navbar navbar-expand-lg bg-dark cont" data-bs-theme="dark">
    <div className="container-fluid">
    <Link to = '/' style={{  textDecoration: 'none' }} className='text-primary navbrand'>
        <Image className ='navLogo' src = {fetchIcon}/>
        </Link>
        <Link to = '/' style={{  textDecoration: 'none' }} className='text-primary navbrand'>
        <h3 style={{color: 'white'}}>Fetch Rewards </h3>
        </Link>
      <div className="collapse navbar-collapse" id="navbarColor02">
        <ul className="navbar-nav me-auto">
          <li className="nav-item">
          <Link to = '/dogs' style={{  textDecoration: 'none' }} className='text-primary navbrand'>
            <Button className='bg-dark' style={{borderWidth: '0', fontSize: '22px', paddingBottom: '12px', marginLeft: '10px'}}>
              Dogs
            </Button>
        </Link>
          </li>
        </ul>
        <form className="d-flex">
          <Button onClick={handleLogOut}>
            Log out
          </Button>

        </form>
      </div>
    </div>
  </nav>
  );
};

export default NavBar;
