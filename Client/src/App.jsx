import { useState } from 'react'
// import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
// import './App.css'
import { ChakraProvider } from "@chakra-ui/react"
import { Input, Stack } from '@chakra-ui/react'

import Login from "./Login.jsx"
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from "react-router-dom";



function Home() {
  return (
      <>

      {/* <h2>Suka </h2> */}
      <Login />
      </>
    );
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
