const express = require("express");
const app = express();
const authRoute = require("./routers/auth");
const postsRoute = require("./routers/post");
const usersRoute = require("./routers/users");
const cors = require("cors");


require("dotenv").config;

const PORT = 5000;

// //root 適当にAPI
// app.get("/",(req, res) => {
//   res.send("<h1>Hello</h1>");
// });

//cors対策
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoute);
app.use("/api/posts", postsRoute);
app.use("/api/users", usersRoute);



app.listen(PORT, () => console.log(`server is runnning on port ${PORT}`));
