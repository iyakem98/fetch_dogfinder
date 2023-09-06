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
      // Send a POST request to the logout endpoint
      const response = await axios.post('https://frontend-take-home-service.fetch.com/auth/logout', null, {
        withCredentials: true, // Include credentials (cookies) with the request
      });
  
      if (response.status === 200) {
        // Logout successful, you can perform further actions here if needed
        console.log('Logout successful');
        navigate('/');
      } else {
        console.error('Logout failed. Status:', response.status);
        // Handle specific logout failure cases if needed
      }
    } catch (error) {
      console.error('An error occurred during logout:', error);
      // Handle network errors or other issues
    }
  }

// Usage:
// Call the logout function when you want to log the user out
// logout();

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
            <Button className='bg-dark' style={{borderWidth: '0', fontSize: '22px', paddingBottom: '15px', marginLeft: '10px'}}>
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
