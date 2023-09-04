import React from 'react';
import { Navbar, Nav, NavDropdown, Image, Button } from 'react-bootstrap';
import fetchLogo from '../../images/fetchLogo.png'
import fetchIcon from '../../images/fetch-rewards-icon.webp'
import {Link, useNavigate} from 'react-router-dom'
import './NavBar.css'
import axios from 'axios'

const NavBar: React.FC = () => {

  const navigate = useNavigate()
  
  async function handleLogOut() {
    try {
      // Send a POST request to the logout endpoint
      const response = await axios.post('https://frontend-take-home-service.fetch.com/auth/logout', null, {
        withCredentials: true, // Include credentials (cookies) with the request
      });
  
      if (response.status === 200) {
        // Logout successful, you can perform further actions here if needed
        console.log('Logout successful');
        navigate('/login');
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
      <a className="navbar-brand" href="#">Fetch Rewards</a>
      <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarColor02" aria-controls="navbarColor02" aria-expanded="false" aria-label="Toggle navigation">
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarColor02">
        <ul className="navbar-nav me-auto">
          <li className="nav-item">
            <a className="nav-link active" href="#">Dogs
              <span className="visually-hidden">(current)</span>
            </a>
          </li>
         {/* <li className="nav-item">
            <a className="nav-link" href="#">Features</a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="#">Pricing</a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="#">About</a>
          </li>
          <li className="nav-item dropdown">
            <a className="nav-link dropdown-toggle" data-bs-toggle="dropdown" href="#" role="button" aria-haspopup="true" aria-expanded="false">Dropdown</a>
            <div className="dropdown-menu">
              <a className="dropdown-item" href="#">Action</a>
              <a className="dropdown-item" href="#">Another action</a>
              <a className="dropdown-item" href="#">Something else here</a>
              <div className="dropdown-divider"></div>
              <a className="dropdown-item" href="#">Separated link</a>
            </div>
  </li> */}
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
