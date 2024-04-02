import { useState } from 'react'
// import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
// import './App.css'
import { ChakraProvider } from "@chakra-ui/react"
import { Input, Stack } from '@chakra-ui/react'

import Login from "./Login.jsx"
import AppHome from "./AppHome.jsx"

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from "react-router-dom";

// window.test = "Fuck";


function Home() {
  const token = localStorage.getItem("token");
  // console.log(token == null)
  if (token == null) {

    return (
      <>

      {/* <h2>Suka </h2> */}
      
      <Login />
      </>
    );
  } else {
    return (
      <AppHome />
    )
  }
  }


function App() {
  // const [count, setCount] = useState(0)

  return (
    <>
      <Router>
        <Routes>
          
          <Route path="/" element={ <Home /> } />
          
        </Routes>
      </Router>
    </>
  )
}

export default App
