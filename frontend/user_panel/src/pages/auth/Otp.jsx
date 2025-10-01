import React from 'react'
import '../auth/auth.css'
import { useState, useRef, useEffect } from 'react'
import axios from 'axios'
import { Navigate, useNavigate } from 'react-router-dom'


const Otp = () => {

  const navigate = useNavigate()
  const [otp, setotp] = useState(["", "", "", "", "", ""])
  const [activationToken, setactivationToken] = useState(localStorage.getItem('activationToken'))
  const [email, setemail] = useState(localStorage.getItem('useremail'))
  const ref = useRef([])




  const handlechange = (e, i) => {

    const value = e.target.value

    const newotp = [...otp];
    newotp[i] = value;
    setotp(newotp)


    if (value && i < otp.length - 1) {
      ref.current[i + 1]?.focus();
    }

  }

  const handlekeydown = (e, i) => {
    if (e.key === 'Backspace') {
      if (otp[i] === '') {
        if (i > 0) {
          ref.current[i - 1]?.focus()
        } 
      }
    }
  }


  const handleverify = async (e) => {
    e.preventDefault();



    const otpValue = otp.join('');

    if (otpValue.length !== 6) {
      alert("Please enter all 6 digits.");
      return;
    }

    try {

     const res =  await axios.post('http://localhost:4000/api/user/verify', {
        otp: otpValue,
        activationToken,
      })

      const email = res.data.email
      console.log(email)

      if(res.data.success){
        navigate('/')
      }else{
        alert(res.data.message,"verification failed")
      }

      // alert(Response.data.message)
    } catch (error) {
      if(error.response && error.response.data && error.response.data.message){
        alert(error.response.data.message)
      }else{

        alert(error.Response?.data?.message)
      }

    }
  }

  const handleregister =( ) => {
    navigate('/register')
  }

 
  useEffect(() => {
ref.current[0].focus()
  }, [])



  return (
    <div className='otp_main'>
      <div className='otp_content'>
        <h1>verify Your Account</h1>
        <h6>We email you six digit code to <strong> {email}</strong> <br />
          Enter the code below to confirm your email address</h6>

        <div className='otp_input_main'>
          {otp.map((digit, i) => (
            <input
              key={i}
              type='text'
              ref={(el) => (ref.current[i] = el)}
              maxLength={1}
              value={digit}
              onChange={(e) => handlechange(e, i)}
              onKeyDown={(e) => handlekeydown(e, i)}
              className='otp_input'
            />
          ))}
        </div>

        <button className='verify_btn' onClick={handleverify}>Verify</button>

        <p>if you didn't receive a code!! <button className='resend_btn' onClick={(e) => handleregister(e)}> REGISTER</button></p>
      </div>


    </div>
  )
}

export default Otp
