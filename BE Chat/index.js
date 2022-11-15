const express = require("express")
const cors = require("cors")
const PORT = process.env.PORT || 5050
const app = express()
const bodyParser = require("body-parser")
var cookieParser = require("cookie-parser")
const connectDB = require("./src/config/dbConfig")
const http = require("http").Server(app)
const route = require("./src/routers/index")

const io = require("socket.io")(http, {
  cors: {
    credentials: true,
    origin: ["http://localhost:3000", "http://localhost:3001", "http://localhost"],
    methods: ["GET", "POST"],
  }
})

const users = {
  user: []
}

const addUser = (id) => {
  const user = users.user.filter(user => user.id === id)
  console.log(user)
  if (user.length === 0) {
    users.user.push({
      id
    })
  }
}

const deleteUser = (id) => {
  users.user = users.user.filter(user => user.id !== id)
}

io.on("connection", socket => {
  console.log("someone connected " + socket.id);
  addUser(socket.id)

  socket.on("setName", fullname => {
    users.user = users.user.map(user => {
      if (user.id === socket.id) {
        user.fullname = fullname
      }
      return user
    })
    console.log(users)
  })

  socket.on("sendMessageToAdmin", (message) => {
    const user = users.user.filter(user => user.id === socket.id)
    // socket.to(users.admin).emit("getMessageFromUser", { message, user })
    io.emit("getMessageFromUser", { message, user })
  })

  socket.on("disconnect", () => {
    console.log("someone disconnected " + socket.id);
    deleteUser(socket.id)
  });
});

app.use(cookieParser())
app.use(
  cors({
    credentials: true,
    origin: "*"
  })
)

app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static("public"))
connectDB()
route(app)

http.listen(PORT, () => {
  console.log("Server is running at port " + PORT)
})
