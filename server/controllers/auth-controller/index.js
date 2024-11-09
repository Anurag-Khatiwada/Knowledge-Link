const User = require("../../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const registerUser = async (req, res) => {
  const { userName, userEmail, password, role } = req.body;

  try {
    const existingUser = await User.findOne({
      $or: [{ userName }, { userEmail }],
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      userName,
      userEmail,
      password: hashedPassword,
      role,
    });

    const savedUser = await newUser.save();

    return res.status(200).json({
      success: true,
      message: "User registered successfully",
      data: savedUser, // Optional: return user details if needed
    });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

const loginUser = async (req, res) => {
  const { userEmail, password } = req.body;
  try {
    const checkUser = await User.findOne({ userEmail });
    if (!checkUser || !bcrypt.compare(password, checkUser.password)) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }
    const accessToken = jwt.sign(
      {
        _id: checkUser._id,
        userEmail: checkUser.userEmail,
        userName: checkUser.userName,
        role: checkUser.role,
      },
      "JWT_SECRET",
      {expiresIn: "120m"}
    );
    return res.status(200).json({
      success: true,
      message: "Logged in successfully",
      data: {
        accessToken,
        user: {
          _id: checkUser._id,
          userEmail: checkUser.userEmail,
          userName: checkUser.userName,
          role: checkUser.role,
        },
      },
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports = { registerUser, loginUser };


