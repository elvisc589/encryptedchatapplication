import {Routes, Route} from 'react-router-dom'
import io from "socket.io-client";
import { useEffect, useState } from "react";
import CryptoJS from 'crypto-js';
import Login from "./components/Login"
import Signup from "./components/Signup"
import Chat from "./components/Chat"

const socket = io.connect("http://localhost:3001");

function App() {


  return (
    <div>
      <Routes>
        <Route path='/' element={< Login />}/>
        <Route path='/signup' element = {<Signup/>}/>
        <Route path='/chat' element = {<Chat/>}/>
      </Routes>
  </div>
  );
}

export default App