import { Routes, Route } from 'react-router-dom';
import { SocketProvider } from './context/SocketContext';
import Login from "./components/Login";
import Signup from "./components/Signup";
import Chat from "./components/Chat";
import Contacts from "./components/Contacts";

function App() {
  
  return (
    <SocketProvider>
        <Routes>
          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<Signup />} />
          <Route path='/contacts' element={<Contacts />} />
          <Route path='/chat/:username' element={<Chat />} />
        </Routes>
    </SocketProvider>
  );
}

export default App;
