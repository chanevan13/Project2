const router = require("express").Router()
const {List, Item, User} = require("../models")

router.get("/", async (req,res) => {
  try {
    const listData = await List.findAll()
    const lists = listData.map((list) => list.get({ plain: true }));
    console.log(lists)
    res.render('homepage', { lists: lists })
  } catch (error) {
    console.log(error)
    res.status(500).json(error);
  }
})

router.get('/login', async (req, res) => {
  let logged_in = false;
  try {
    if (logged_in) {
      res.redirect('/')
    }
    res.render('login')
  } catch (error) {
    console.log(error)
    res.status(500).json(error);
  }
})

router.get("/listGen", async (req,res) => {
  try {
    const listData = await List.findAll()
    const lists = listData.map((list) => list.get({ plain: true }));
    console.log(lists)
    res.render('listGen')
  } catch (error) {
    console.log(error)
    res.status(500).json(error);
  }
})

router.get("/lists", async (req,res) => {
  try {
    const listData = await List.findAll()
    const lists = listData.map((list) => list.get({ plain: true }));
    console.log(lists)
    res.render('lists')
  } catch (error) {
    console.log(error)
    res.status(500).json(error);
  }
})




router.get('/new-user', (req, res) => {
  try {
    if (!req.session.userId) {
      res.redirect('/login')
    }
    res.render('signup', { user: req.session.userId, islistItems: req.session.islistItems })
  } catch (error) {
    console.log(error)
    res.status(500).json(error);
  }
})
router.get('/lists', (req, res) => {
  try {
    console.log('hello')
    // if (!req.session.userId) {
      //   res.redirect('/login')
      // }
      res.render('lists', { user: req.session.userId, islistItems: req.session.islistItems })
    } catch (error) {
      console.log(error)
      res.status(500).json(error);
    }
  })

  module.exports = router
