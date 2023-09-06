/* 
"""
The Login (or Home) screen is the primary landing page of the application, accessible through the '/' route.
This screen incorporates icon styling to enhance visual appeal and usability.
"""
*/
import React from 'react'
import { useState } from 'react'
import {Form, Button, Row, Col, Image} from 'react-bootstrap'
import FormContainer from '../../components/FormContainer/FormContainer'
import './LoginScreen.css'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import fetchPlain from '../../images/fetch-rewards-plain.png'

interface LoginInfo {
    name?: string,
    email?: string;
  }

const Login = () => {
    localStorage.clear();
    const[name, setName] = useState('')
    const[email, setEmail] = useState('')
    const[password, setPassword] = useState('')

    const navigate = useNavigate()
    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
    
        const payload: LoginInfo = { name, email };
    
        try {
            const response = await axios.post(
              'https://frontend-take-home-service.fetch.com/auth/login',
              payload,
              {
                withCredentials: true,
              }
            );

            console.log('Response Headers:', response.headers);
        
            if (response.status === 200) {
              console.log('Login success!');
              //localStorage.setItem('authToken', response.headers['fetch-access-token']);
              navigate('/dogs')
              console.log('Stored auth token:', localStorage.getItem('authToken'));
            } else {
              console.error('Login failed. Status:', response.status);
            }
        } catch (error) {
          console.error(error);
        }
      };
    


   
  return (
    <div className='login'>
        <div className='loginleft'>
        <Image className ='leftLogo' src = {fetchPlain}/>
        </div>

        <div className='loginright'>
        <div className='frmcontlogin'>
    <FormContainer>
        <h1>Log in </h1>
                <Form onSubmit={handleLogin}>
                <Form.Group controlId='name' className='frmgrp'>
                        <Form.Label className='frmlog text-dark'>
                            Name
                        </Form.Label>
                        <Form.Control
                            className='frmcontrol'
                            placeholder='Enter your name'
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        >
                        </Form.Control>
                    </Form.Group>
                    <Form.Group controlId='email' className='frmgrp'>
                        <Form.Label className='frmlog text-dark'>
                            Email Address
                        </Form.Label>
                        <Form.Control
                            className='frmcontrol'
                            type='email'
                            placeholder='Enter your email address'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        >
                        </Form.Control>
                    </Form.Group>
                    
                    <Button type ='submit' variant = 'primary' className='btn btn-block btn-primary loginbutt'>
                        Log in 
                    </Button>
                </Form>
    </FormContainer>
</div>
          
        
        </div>
    </div>
  )
}

export default Login

export {};