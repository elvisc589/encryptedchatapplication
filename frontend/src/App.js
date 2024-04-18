import "./App.css";
import io from "socket.io-client";
import { useEffect, useState } from "react";
import CryptoJS from 'crypto-js';


const socket = io.connect("http://localhost:3001");

function App() {


  //Room State
  const [room, setRoom] = useState("");

  // Messages States
  const [message, setMessage] = useState("");
  const [messageReceived, setMessageReceived] = useState("");
  const secretKey = "uI2ooxtwHeI6q69PS98fx9SWVGbpQohO"

  const joinRoom = () => {
    if (room !== "") {
      socket.emit("join_room", room);
    }
  };

  const sendMessage = () => {
    const encryptedMessage = CryptoJS.AES.encrypt(message, secretKey).toString()
    socket.emit("send_message", { encryptedMessage, room });
  };


  useEffect(() => {
    socket.on("receive_message", (data) => {
      console.log("Received data:", data); // Check received data
      if (data && data.encryptedMessage) {
        console.log("Encrypted message:", data.encryptedMessage); // Check encrypted message
        try {
          const decryptedBytes = CryptoJS.AES.decrypt(data.encryptedMessage, secretKey);
          const decryptedMessage = decryptedBytes.toString(CryptoJS.enc.Utf8);
          console.log("Decrypted message:", decryptedMessage);
          setMessageReceived(decryptedMessage);
        } catch (error) {
          console.error("Error decrypting message:", error);
          setMessageReceived("Error decrypting message");
        }
      } else {
        console.warn("Invalid data received:", data);
        setMessageReceived("Invalid data received");
      }
    });
}, [socket]);
  return (
    <div className="App">
      <input
        placeholder="Room Number..."
        onChange={(event) => {
          setRoom(event.target.value);
        }}
      />
      <button onClick={joinRoom}> Join Room</button>
      <input
        placeholder="Message..."
        onChange={(event) => {
          setMessage(event.target.value);
        }}
      />
      <button onClick={sendMessage}> Send Message</button>
      <h1> Message:</h1>
      {messageReceived}
    </div>
  );
}

export default App