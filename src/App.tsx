import './bootstrap.min.css'

import React from 'react';
import './App.css';
import {BrowserRouter as Router, Routes, Route, Link} from 'react-router-dom'

import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import DogList from './pages/dogs/DogList';
function App() {
  return (
    <div className="App">
      
      <Router>
       <Routes>
         <Route path = "/login" element= {<Login/>}/>
         <Route path = "/register" element= {<Register/>}/>
         <Route path = "/dogs" element= {<DogList/>}/>
       </Routes>
     </Router>
    </div>
  );
}

export default App;
