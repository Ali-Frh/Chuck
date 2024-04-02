import {React, useEffect, useState, useRef} from "react";
import chuck from "./assets/chuck.png"
import  "./css/login.css"
import { ChakraProvider } from "@chakra-ui/react"
import { Input, Stack, Button } from '@chakra-ui/react'
import io from "socket.io-client"
import axios from "axios"

function Login() {
  const [UserLogin, setUserLogin] = useState()
  const UserLoginElement = useRef();
  const NextButt = useRef()
  const EditButt = useRef()
  const LoginElement = useRef()
  const PassBox = useRef () 
  const ShowHide = useRef()     
  const Baloon = useRef() 

  const ShowHideFunc = (el) => {
    // console.log(el)
    if ( el.target.innerHTML == "Show") {
      el.target.innerHTML = "Hide";
      PassBox.current.type="text";
    } else {
      el.target.innerHTML = "Show";
      PassBox.current.type="password";

    }
  }

  const EditMail = () => {
    UserLoginElement.current.disabled=false;
    LoginElement.current.style.display="none";
    NextButt.current.style.display="block"
    // ShowHide.current.st
    EditButt.current.style.display = "none";
    PassBox.current.value = "";
  }

  const LoginHandler = () => {
    axios.post("http://127.0.0.1:5000/login",{
        payload: UserLogin,
        password: PassBox.current.value
    }).then((response)=> {
      console.log(response.data)
      if (response.data == "wrong") {
        alert("Wrong Pass")
      } else {
        localStorage.setItem("token", response.data)
        window.location.reload()
      }
    }).catch(()=>{
      console. log("Fuxk")
    })
  }

  const nextHandle = () => {
    
    axios.post("http://127.0.0.1:5000/auth",{
        payload: UserLogin
    }).then((response)=> {
      if (response.data == "found") {
          UserLoginElement.current.disabled=true;
          LoginElement.current.style.display="block";
          NextButt.current.style.display="none"
          // ShowHide.current.st
          EditButt.current.style.display = "Block";
      } else {

      }
    }).catch(()=>{
      console. log("Fuxk")
    })
    // this.setSocketListeners = this.setSocketListeners.bind(this)

    // const socket = new WebSocket("ws://127.0.0.1:5000");
    // socket.addEventListener("open", () => {

      // socket.send("suka")
    // }
    // );
    // 
    // state.socket.on('connect', () => {
    //   console.log("Websocket connected: " + state.socket.connected)
    // })
    // state.socket.on('custom-server-msg', (data) => {
    //   console.log("Data received: " + data.data)
    // })

  }

  return (
      // <a> hah </a>
      <>
        {/* <title>  </title> */}
        {/* <ChakraProvider> */}
          <div className="whole-page">

          <div className="card">
            <div className="logo-wrapp"
            onMouseEnter={() => {
              Baloon.current.style.display="block";
            }}

            onMouseLeave={
              ()=> {
                Baloon.current.style.display = "none"; 
              }
            }
            >

              <img className="logo" src={chuck} alt=""
              
              />
              <div ref={Baloon} className="baloon">
                DONT MOLEST ME!
              </div>
            </div>
            {/* <label htmlFor="mail"></label> */}
            {/* <p className="slogan">Hello I'm Chuck</p> */}
              <div class="mail-holder">

                <input type="mail" ref={UserLoginElement} onChange={(e)=>setUserLogin(e.target.value)} placeholder="Email Address / Username" className="mail" />
                <i ref={EditButt } onClick={EditMail } class="edit">Edit</i>
              </div>

            <div className="stage-1">
              <button className="next" ref={NextButt} onClick={nextHandle}>Next</button>
            </div>

            <div className="log-in" ref={LoginElement}>
              <input ref={PassBox} type="password" placeholder="Password" className="mail password" />
              <i ref={ShowHide} onClick={(e) => ShowHideFunc(e)} class="show edit">Show</i>
              <button className="next login" onClick={LoginHandler}>Login</button>
              <i className="forgoot">i'm so silly that i forgot my password</i>
            </div>

          </div>

          </div>
        {/* </ChakraProvider> */}

        <style>
          <textarea name="" id="" cols="30" rows="10"></textarea>
        </style>
      </>

    );

}

export default Login;
