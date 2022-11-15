import './App.css';
import { useEffect, useRef, useState } from 'react';
import socketIOClient from "socket.io-client"
import axios from 'axios';
const host = "localhost:5050"


function App() {
  const socketRef = useRef()
  const [name, setName] = useState("")
  const [message, setMessage] = useState("")
  useEffect(() => {
    socketRef.current = socketIOClient(host, {
      withCredentials: true,
      extraHeaders: {
        "my-custom-header": "abcd"
      },
      allowRequest: (req, callback) => {
        const noOriginHeader = req.headers.origin === undefined
        callback(null, noOriginHeader)
      }
    })

    socketRef.current.on("connect", () => {
      if (socketRef.current.connected) {
        console.log("connected ở đây sẽ thành công")
        console.log(socketRef.current.connected)
      }
    })

    socketRef.current.on("id", (data) => {
      console.log(data)
    })

    return () => { socketRef.current.disconnect() }
  }, [])

  const handleClickSetName = () => {
    socketRef.current.emit("setName", name)
  }

  const handleClickSendMessage = () => {
    socketRef.current.emit("sendMessageToAdmin", message)
    axios.post("http://localhost:5050/api/v1/user/add-chat-user", { name })
      .then(res => {
        console.log(res)
      })
      .catch(err => {
        console.log(err)
      })
  }

  const handleClickSend = () => {
    axios.post("http://localhost:5050/api/v1/user/send-msg-to-admin", { id: name, message })
      .then(res => {
        console.log(res)
        socketRef.current.emit("sendMessageToAdmin", message)
      })
      .catch(err => {
        console.log(err.message)
      })
  }

  return (
    <div className="App">
      <input onChange={(e) => { setName(e.target.value) }} type={"text"}></input>
      <button onClick={handleClickSetName}>Set name</button>
      <div>
        <input onChange={(e) => { setMessage(e.target.value) }} type={"text"}></input>
        <button onClick={handleClickSendMessage}>Message</button>
      </div>
      <div onClick={handleClickSend}>send message</div>
    </div>
  );
}

export default App;
