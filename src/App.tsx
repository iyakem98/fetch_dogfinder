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
function App() {
  const [dogId, setDogId] = useState('');
  return (
    <div className="App">
      
      <Router>
        <NavBar/>
       <Routes>
         <Route path = "/login" element= {<Login/>}/>
         <Route path = "/register" element= {<Register/>}/>
         <Route path = "/dogs" element= {<DogList/>}/>
         <Route path="/match/:dogId" element={<MatchedDog dogId={dogId}/>} />
       </Routes>
     </Router>
    </div>
  );
}

export default App;
