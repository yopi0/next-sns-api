const router = require("express").Router();
const { PrismaClient } = require("@prisma/client");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const isAuthenticated = require("../middlewares/isAuthenticated");

const prisma = new PrismaClient();

//つぶやき投稿
router.post("/post", isAuthenticated, async (req,res) => {

  const {content} = req.body;

  if(!content){
    return res.status(400).json({
      message:"投稿内容がありません",
    });
  }
  console.log('post api ');

  try{
    const newPost = await prisma.post.create({
      data:{
        content,
        authorId: req.userId,
      },
      include:{
        author:{
          include:{
            profile: true,
          }
        }
      },
    });

    res.status(201).json(newPost);

  }catch(error){
    console.log(error);
    res.status(500).json({
      message:"サーバーエラー",
    });
  }
  
  // return res.json({newPost});
});

//最新つぶやき取得
router.get("/get_latest_post", async (req, res) => {
  try{
    const latestPosts = await prisma.post.findMany({
      take: 10,
      orderBy: {createdAt: "desc"},
      include: {
        author: {
          include: {
            profile: true,
          }   
        }
      },
    });
    return res.json(latestPosts);
  }catch(error){
    console.log(error);
    res.status(500).json({
      message: "server error",
    })
  }
});
//閲覧しているuserの投稿内容
router.get('/:userId', async(req, res) =>{
  const {userId} = req.params;

  console.log(userId);

  try{
    const userpost = await prisma.post.findMany({
      where:{
        authorId: parseInt(userId),
      },
      orderBy:{
        createdAt: "desc",
      },
      include:{
        author: true,
      },
    });
    return res.status(200).json(userpost);
  }catch(err){
    console.log(err);
    res.status(500).json({
      message: "server error",
    })
  }
})

module.exports = router;
