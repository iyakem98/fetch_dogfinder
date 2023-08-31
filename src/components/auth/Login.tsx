import React from 'react'
import { useState } from 'react'

const Login = () => {
    const[email, setEmail] = useState('')
    const[password, setPassword] = useState('')
  return (
    <div>
        <p>
            Login here brother
        </p>
    </div>
  )
}

export default Login