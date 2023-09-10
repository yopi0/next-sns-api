const router = require("express").Router();
const { PrismaClient } = require("@prisma/client");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const generateIdenticon = require("../utils/generateIdenticon");

const prisma = new PrismaClient();

//新規user登録
router.post("/register", async (req,res) => {

  const { username, email, password} = req.body;

  const defaultIconImage = generateIdenticon(email);

  const hashedPassword = await bcrypt.hash(password, 10);

  //ここのprisma.user schema.prismaにあるUser->user 小文字バージョン
  const user = await prisma.user.create({
    data:{
      username,
      email,
      password: hashedPassword,
      profile: {
        create: {
          bio: "はじめまして",
          profileImageUrl: defaultIconImage,
        }
      }
    },
    include:{
      profile:true,
    }
  });
  
  return res.json({user});
});

//userログイン
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  console.log("login");

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    return res.status(401).json({ erorr: "そのユーザーは存在しません。" });
  }

  const isPasswordVaild = await bcrypt.compare(password, user.password);

  if (!isPasswordVaild) {
    return res.status(401).json({ error: "そのパスワードは間違っています" });
  }

  const token = jwt.sign({ id: user.id }, process.env.SECRET_KEY, {
    expiresIn: "1d",
  });

  console.log(token);
  
  return res.json({ token });

});

module.exports = router;
