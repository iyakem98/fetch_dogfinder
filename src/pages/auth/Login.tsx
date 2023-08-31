import React from 'react'
import { useState } from 'react'
import {Form, Button, Row, Col} from 'react-bootstrap'
import FormContainer from '../../components/FormContainer/FormContainer'
import './LoginScreen.css'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'

interface LoginInfo {
    name?: string,
    email?: string;
  }

const Login = () => {
    localStorage.clear();
    const[name, setName] = useState('')
    const[email, setEmail] = useState('')
    const[password, setPassword] = useState('')


    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
    
        const payload: LoginInfo = { name, email };
    
        try {
            const response = await axios.post(
              'https://frontend-take-home-service.fetch.com/auth/login',
              payload,
              {
                withCredentials: true, // Include credentials (cookies) with the request
              }
            );

            console.log('Response Headers:', response.headers);
        
            if (response.status === 200) {
              console.log('Login success!');
              localStorage.setItem('authToken', response.headers['fetch-access-token']);
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
        <div className='loginleft bg-primary'>

        </div>

        <div className='loginright'>
        <div className='frmcontlogin'>
    <FormContainer>
        {/* Content of FormContainer */}
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
                    
                    <Link to = '/register' style={{ }} className='text-primary'>I don't have an account</Link>
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