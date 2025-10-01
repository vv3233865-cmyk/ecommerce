import React from 'react'
import login_banner from  "../../assets/login-banner.avif"
import '../auth/auth.css'
import { Form, Link, Links, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useState } from 'react'


const Login = () => {


  const navigate = useNavigate()
  const [login, setlogin] = useState({
    email: "",
    password: ""
  })

  const handlechange = (e) => {
    const { name, value } = e.target
    setlogin({ ...login, [name]: value })

  }

  const handlelogin = async (e) => {
    e.preventDefault();

    if (login.email == "" || login.password == "") {
      alert("please fill all field")
      return
    }



    try {

      const res = await axios.post("http://localhost:4000/api/user/login", login)

      console.log("login response :", res.data);

     
      
      if(res.data.success){
        localStorage.setItem('token',res.data.token)
        localStorage.setItem('user', JSON.stringify(res.data.userdetail));
        if (res.data.userdetail.role === 'admin') {
          navigate("/admin/dashboard");
          return;  // stop here
        } else {
          navigate("/");
          return;
        }
      }else{
        alert(res.data.message)
      }

    }
    catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        alert(error.response?.data?.message)
      } else {
        alert("failed to login, please try again")
      }
    }
  }

  console.log(login);



  return (
    <div className='login_container2'>
      <div className='login_main2'>
        <div className='login_banner2'>
          <img src={login_banner} alt="" srcset="" />
        </div>
        <div className='login_content2'>
          <h1>Login</h1>
          <div className='login_input'>
            <input type="text"
              placeholder='Enter a Email'
              value={login.email}
              name='email'
              onChange={(e) => handlechange(e)} />
            <input type="password"
              placeholder='Enter a Password'
              value={login.password}
              name='password'
              onChange={(e) => handlechange(e)} />
          </div>

          <button onClick={(e) => handlelogin(e)}>Login</button> <br /> <br />

          <Link className='create' to={'/register'}>Create Account</Link>


        </div>
      </div>

    </div>
  )
}

export default Login
