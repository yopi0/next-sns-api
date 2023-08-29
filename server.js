const express = require("express");
const app = express();
const { PrismaClient } = require("@prisma/client");
const bcrypt = require('bcrypt');

const PORT = 5000;

// //root 適当にAPI
// app.get("/",(req, res) => {
//   res.send("<h1>Hello</h1>");
// });

const prisma = new PrismaClient();

app.use(express.json());

//新規user登録
app.post("/api/auth/register", async (req,res) => {
  const { username, email, password} = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  //ここのprisma.user schema.prismaにあるUser->user 小文字バージョン
  const user = await prisma.user.create({
    data:{
      username,
      email,
      password: hashedPassword,
    },
  });
  
  return res.json({user});
});

app.listen(PORT, () => console.log(`server is runnning on port ${PORT}`));
