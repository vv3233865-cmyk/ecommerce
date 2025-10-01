import React from 'react'
import '../auth/auth.css'
import axios from "axios"
import { useState, } from 'react'
import { Link,useNavigate } from 'react-router-dom'




const Register = () => {

    const navigate = useNavigate()

    const [forminput, setforminput] = useState({
        name: "",
        email: "",
        password: "",
        contact: ""
    })

    const handlechange = (e) => {
        setforminput({ ...forminput, [e.target.name]: e.target.value })
    }

    const handlesubmit = async (e) => {
        e.preventDefault()
        
        try {
            if(!forminput.name||!forminput.email||!forminput.password||!forminput.contact){
                alert("please fill all fields")
                return
            }
            const res = await axios.post("http://localhost:4000/api/user/register", forminput)
            
            console.log("received token :", res.data.activationToken );
            
            
            localStorage.setItem('activationToken',res.data.activationToken)
            localStorage.setItem("useremail",forminput.email)
            
            
            
            alert("otp will sent to your gmail")
            setforminput({ name: "",
                email: "",
                password: "",
                contact: ""})

                navigate('/register/otp')
               

            console.log(forminput);
            

        } catch (error) {
            if(error.response&& error.response.data && error.response.data.message){
                alert(error.response.data.message)
            }
            alert("failed to register")

        }

    }

    const handlelogin = () => {
        navigate('/login')
    }



    return (
        <div className='auth_main'>
            <div className='login_main'>
                <p>DreamCart</p>

                <div className='login_content'>
                    <h1>welcome Back!</h1>
                    <p>To Keep connect With Us Please <br />
                        Login with Your Personal Info</p>
                    <button onClick={handlelogin}>login</button>
                </div>
            </div>


            <div className='register_main'>
                <h1>Create Account</h1>
                <p>use your Email For Registration</p>
                <div className='register_input'>
                    <input type="text"
                        placeholder='Name'
                        name='name'
                        value={forminput.name}
                        onChange={handlechange} /> <br />
                    <input type="text"
                        placeholder='Email'
                        name='email'
                        value={forminput.email}
                        onChange={handlechange} /><br />
                    <input type="text"
                        placeholder='Password'
                        name='password'
                        value={forminput.password}
                        onChange={handlechange} /><br />
                    <input type="text"
                        placeholder='Contact'
                        name='contact'
                        value={forminput.contact}
                        onChange={handlechange} /><br />
                </div>


                <button onClick={handlesubmit}>Sign Up</button>
            </div>


        </div>
    )
}

export default Register