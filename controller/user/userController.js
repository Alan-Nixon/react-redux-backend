const { User } = require("../../model/dbConnection");
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');

dotenv.config();
const jwtSecret = process.env.JWT_SECRET;


const homePage = (req, res) => {
  res.status(201).json({ isLoggedIn: req.user ? true : false }); // Access user from req.user
};



const login = async (req, res) => {
  const sendData = { Logged: true };
  const { Email, Password, isAdminLogin } = req.body;
  const userData = await User.findOne({ Email });
  if (userData) {
    if (userData.Password === Password) {
      if (isAdminLogin) {
        if (!userData.isAdmin) {
          sendData.emailErr = "sorry authorized person only";
          return res.status(200).json(sendData);
        }
      } if (userData.isBlocked) {
        sendData.emailErr = "sorry user blocked"
        return re.status(200).json(sendData)
      }
      const token = jwt.sign({ Email, userId: userData._id }, jwtSecret, { expiresIn: '4h' });
      sendData.userData = userData
      sendData.token = token

      res.cookie('token', token, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

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
  console.log(req.cookies.token);
  res.status(200).json({ isLoggedIn: req.cookies.token })
}




const signUp = async (req, res) => {
  console.log(req.body);
  try {
    if (!await User.findOne({Email:req.body.Email})) {

      const data = await User.insertMany({
        FName: req.body.Fname,
        LName: req.body.Lname,
        FullName: req.body.Fname + ' ' + req.body.Lname,
        Email: req.body.Email,
        Password: req.body.Password,
        Phone: -1,
        profileImage: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRCJoVnuKWv43i_Tti7OWhbBsfeyYDCi7KjYxcyXP--Qg&s",
        isAdmin: false,
        isBlocked: false
      });
      console.log(data)
      res.status(200).json({ status: false, data });
    } else {
      res.status(200).json({ status: false,data:null });

    }


  } catch (e) {
    console.error(e);
  }
};




const getUser = async (req, res) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  jwt.verify(token, jwtSecret, async (err, decoded) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(200).json({ message: 'Token has expired' });
      } else {
        return res.status(200).json({ message: 'Token is not valid' });
      }
    }

    try {

      const userData = await User.findById(decoded.userId);

      if (!userData) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.status(200).json({ userData });
    } catch (error) {
      console.error('Error fetching user data:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });
};

const logout = (req, res) => {
  console.log("this is logout");
  res.clearCookie('token');
  res.status(200).json()
}

const formidable = require('formidable');
const uploadImage = require("./multerCloundinary");

const editUser = async (req, res) => {
  try {
    const form = new formidable.IncomingForm();

    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.log(err);
      } else {

        const Data = {
          FName: fields.FName[0],
          LName: fields.LName[0],
          FullName: fields.FullName[0],
          Phone: fields.Phone[0]
        }

        if (files) {
          const imageDetails = await uploadImage(files.profileImage[0].filepath).catch((err) => console.log(err))
          Data.profileImage = imageDetails.url
        }
        await User.findByIdAndUpdate(fields._id[0], Data)
      }

    });


  } catch (error) {
    console.log(error);
  }
  res.status(200).json()
}

module.exports = {
  homePage, login, signUp, isAuthenticated, getUser, logout, editUser
};
