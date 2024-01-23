const { User } = require("../../model/dbConnection");
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');

dotenv.config();
const jwtSecret = process.env.JWT_SECRET;


const homePage = (req, res) => {
  req.session.logged = true
  res.status(201).json({ isLoggedIn: req.user ? true : false }); // Access user from req.user
};



const login = async (req, res) => {
  const sendData = { Logged: true };      //////////////////////////////////    remove ///
  const { Email, Password } = req.body;
  const userData = await User.findOne({ Email });

  if (userData) {
    if (userData.Password === Password) {

      const token = jwt.sign({ Email }, jwtSecret, { expiresIn: '1h' });
      sendData.userData = userData
      sendData.token = token
      req.session.userlogged = true
      res.status(200).json(sendData)
    } else {
      sendData.passwordErr = "Password is incorrect";
      res.status(200).json(sendData);
    }
  } else {
    sendData.emailErr = "User email not found";
    res.status(200).json(sendData);
  }
};



const isAuthenticated = async (req, res) => {
  const isLoggedIn = req.session.userlogged
  console.log(isLoggedIn, 'this is auth midd', req.session.logged);
  res.status(200).json({ isLoggedIn })
}




const signUp = async (req, res) => {
  console.log(req.body);
  try {
    const data = await User.insertMany({
      FName: req.body.Fname,
      LName: req.body.Lname,
      FullName: req.body.Fname + ' ' + req.body.Lname,
      Email: req.body.Email,
      Password: req.body.Password,
      isAdmin: false,
      isBlocked: false
    });
    console.log(data)
    res.status(200).json({ status: "okay done", data });

  } catch (e) {
    console.error(e);
  }
};


module.exports = {
  homePage, login, signUp, isAuthenticated
};
