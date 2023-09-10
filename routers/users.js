const router = require("express").Router();
const { PrismaClient } = require("@prisma/client");
const isAuthenticated = require("../middlewares/isAuthenticated");

const prisma = new PrismaClient();

router.get("/find", isAuthenticated, async (req,res) => {
  try{
    const user = await prisma.user.findUnique({where: {id: req.userId}});
    if(!user){
      res.status(404).json({
        error: "userがみつかりません"
      });
    }
    res.status(200).json({
      user: {id: user.id, email: user.email, username: user.username},
    });
  }catch(error){
    console.log(error);
  }
});

router.get("/hoge", async(req, res) => {
  res.json("ssssss");
})

router.get('/profile/:userId', async(req, res) => {
  const {userId} = req.params;
  console.log(userId);

  console.log('user profile');

  try{
    const profile = await prisma.profile.findUnique({
      where: {userId: parseInt(userId)},
      include:{
        user: {
          include:{
            profile: true,
          }
        }
      }
    });

    if(!profile){
      return res.status(404).json({message: "profilenotfound"})
    };

    res.status(200).json(profile);

  }catch(error){
    console.log(error);
    res.status(500).json({message: error.message});
  }

 });

module.exports = router;
