import {React, useEffect} from "react";
import chuck from "./assets/chuck.png"
import  "./css/login.css"
import { ChakraProvider } from "@chakra-ui/react"
import { Input, Stack, Button } from '@chakra-ui/react'

function Login() {

  useEffect(() => {
    const socket = new WebSocket("ws://127.0.0.1:5000/auth")

    // Connection opened
    socket.addEventListener("open", (event) => {
      socket.send("Connection established")
      socket.send("suka");

    })

    // Listen for messages
    socket.addEventListener("message", (event) => {
      console.log("Message from server ", event.data)
    })

    // connection.current = ws

    return () => socket.close()
  }, []);

  return (
      // <a> hah </a>
      <>
        {/* <title>  </title> */}
        {/* <ChakraProvider> */}
          <div className="whole-page">

          <div className="card">

            <img className="logo" src={chuck} alt="" />
            {/* <label htmlFor="mail"></label> */}
            <p className="slogan">Hello I'm Chuck</p>
            <input type="mail" placeholder="Email Address / Username" className="mail" />
            <button className="next">Next</button>
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
