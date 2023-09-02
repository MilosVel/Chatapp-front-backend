const express = require("express");
const connectDB = require("./config/db");
const dotenv = require("dotenv");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const path = require("path");

dotenv.config();
connectDB();
const app = express();

app.use(express.json()); // to accept json data


app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

// // --------------------------DEVELOPMENT------------------------------

// const __dirname1 = path.resolve();

// if (process.env.NODE_ENV === "production") {
//   app.use(express.static(path.join(__dirname1, "/frontend/build")));

//   app.get("*", (req, res) =>
//     res.sendFile(path.resolve(__dirname1, "frontend", "build", "index.html"))
//   );
// } else {
//   app.get("/", (req, res) => {
//     res.send("API is running..");
//   });
// }

// // --------------------------DEVELOPMENT------------------------------

// Error Handling middlewares
app.use(notFound);
app.use(errorHandler);

 
const PORT = process.env.PORT;

const server = app.listen(
  PORT,
  console.log(`Server running on PORT...`.yellow.bold)
);

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin:process.env.ORIGIN,
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("Connected to socket.io");
  socket.on("setup", (userData) => {
    console.log('On setup user joined itself id:-> ',userData._id)
    socket.join(userData._id);    //////////////////////////
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {  
    socket.join(room);            //////////////////////////
    console.log("User Joined Room (that represents ChatId): " + room);
  });
  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  socket.on("new message", (newMessageRecieved) => {
    var chat = newMessageRecieved.chat; 

    if (!chat.users) return console.log("chat.users not defined");

    chat.users.forEach((user) => {
      // console.log('Pojedinacni userID je:',user._id)
      //  if (user._id == newMessageRecieved.sender._id){ 
      //   console.log('-------   return ------')
      //    return; // ulogovani user to verovatno handluje na frontendu
      //  }


       socket.in(user._id).emit("message recieved", newMessageRecieved);  // ovo ispod je manje optimalno i ako se koristi potreban je gornji if check. A ako se koristi ova linija koda onda if check gore i nije neophodan
      // io.in(user._id).emit("message recieved", newMessageRecieved);
    });
  });

  socket.off("setup", () => { // Ovo je cleanUp
    console.log("USER DISCONNECTED");
    console.log('LOGOUT',userData._id, 'ceo objekta',userData)
    socket.leave(userData._id);
  });
});


