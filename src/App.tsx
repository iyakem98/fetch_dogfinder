/* This is the App.tsx file with routes to access the different pages and our FilterProvider global state for filters.
I have also declared the ToastContainer her to access react-toast in the app." */
import './bootstrap.min.css'
import React from 'react';
import { useState } from 'react';
import './App.css';
import {BrowserRouter as Router, Routes, Route, Link} from 'react-router-dom'
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import DogList from './pages/dogs/DogList';
import MatchedDog from './pages/dogs/MatchedDog'
import NavBar from './components/navbar/NavBar';
import { FilterProvider } from './context/FilterContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import the toast styles

function App() {
  const [dogId, setDogId] = useState('');
  return (
    <FilterProvider>
      <div className="App">
            <ToastContainer />
            <Router>
              <NavBar/>
            <Routes>
              <Route path = "/" element= {<Login/>}/>
              <Route path = "/register" element= {<Register/>}/>
              <Route path = "/dogs" element= {<DogList/>}/>
              <Route path="/match/:dogId" element={<MatchedDog dogId={dogId}/>} />
            </Routes>
          </Router>
          </div>
    </FilterProvider>
   
  );
}

export default App;
