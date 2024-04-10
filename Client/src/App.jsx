import { useState } from 'react'
// import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
// import './App.css'
import { ChakraProvider } from "@chakra-ui/react"
import { Input, Stack } from '@chakra-ui/react'

import Login from "./Login.jsx"
import AppHome from "./AppHome.jsx"

const API_ENDPOINT = "192.168.0.179:5000";


import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from "react-router-dom";
import axios from "axios"

// import {useState} from
// window.test = "Fuck";


function Home() {
  const token = localStorage.getItem("token");
  // console.log(token == null)
  if (token == null) {

    return (
      <>

      {/* <h2>Suka </h2> */}
      <meta name="viewport" content="width=device-width,user-scalable=no"></meta>
      {/* <meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1"></meta> */}
      <Login api={API_ENDPOINT} />
      </>
    );
  } else {
    return (
      <AppHome />
    )
  }
  }


const Logout = () => {
  axios.post("http://"+API_ENDPOINT+"/logout", {token: localStorage.getItem("token")}).then((response) => {
    console.log( response.data)
    localStorage.removeItem("token")
  }).catch(()=> {
    console.log("we fckd")
  });
  return (
    "done"
    
  )
}


const Dick = () => {
  const [grape, setGrape] = useState("");

  return (
    <>
      <b>Works</b>
      <i>{grape}</i>
      <button onClick={() => {
        setGrape("banana");
        console.log(grape);
      }} >a</button>
    </>
  )
}

function App() {
  // const [count, setCount] = useState(0)

  return (
    <>
      <Router>
        <Routes>
          
          <Route path="/" element={ <Home /> } />
          
          <Route path="/logout" element={ <Logout /> } />

          <Route path="/dick" element={ <Dick />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
