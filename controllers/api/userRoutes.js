const router = require('express').Router()
const {User, List} = require('../../models')
const bcrypt = require('bcrypt')

router.get("/", async (req, res) => {
  try {
    const users = await User.findAll({
    })
    res.status(200).json(users)
  } catch (error) {
    console.log(error)
    res.status(500).json(error)
  }

})

// New User Sign Up
router.post("/", async (req, res) => {
  try {
    console.log("inside post route")
    console.log(req.body);
    const newUser = await User.create(req.body);
    req.session.userId = newUser.id
    req.session.username = newUser.username
    res.status(200).json(newUser)
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

router.post("/login", async (req,res) => {
  console.log(req.body)
  try {
    // try to find user with inputted username
    const foundUser = await User.findOne({
      where: {username: req.body.username}
    })
    if (!foundUser) {
      console.log("user failed")
      res.status(403).json({msg: "no user with that id" })
      // if found, check password
    } else {
      // if password matches, log them in!
      if (bcrypt.compareSync(req.body.password, foundUser.password)) {
        req.session.userId = foundUser.id
        req.session.username = foundUser.username
        res.status(200).json(foundUser)
      } else {
        console.log("password failed")
        res.status(403).json({msg: "wrong password buddy"})
      }
    }
  } catch (error) {
    console.log(error)
    res.status(500).json(error)
  }
})

module.exports = router