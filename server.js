const express = require("express");
const app = express();
const authRoute = require("./routers/auth");


require("dotenv").config;

const PORT = 5000;

// //root 適当にAPI
// app.get("/",(req, res) => {
//   res.send("<h1>Hello</h1>");
// });



app.use(express.json());

app.use("/api/auth", authRoute)



app.listen(PORT, () => console.log(`server is runnning on port ${PORT}`));
