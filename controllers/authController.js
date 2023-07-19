const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");

// Login
exports.login = asyncHandler(async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Please provide username and password" });
  }

  const user = await User.findOne({ username });
  if (!user || !user.active) {
    return res.status(400).json({ message: "Unauthorized" });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ message: "Unauthorized" });
  }

  const accessToken = jwt.sign(
    {
      username: user.username,
      role: user.role,
    },
    process.env.ACCESS_JWT_SECRET,
    { expiresIn: "15m" }
  );

  const refreshToken = jwt.sign(
    {
      username: user.username,
    },
    process.env.REFRESH_JWT_SECRET,
    { expiresIn: "7d" }
  );

  res.cookie("jwt", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "None",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.json({ accessToken });
});

exports.refresh = (req, res) => {
  const cookies = req.cookies;
  if (!cookies.jwt) {
    return res.status(400).json({ message: "Unauthorized" });
  }

  const refreshToken = cookies.jwt;

  jwt.verify(
    refreshToken,
    process.env.REFRESH_JWT_SECRET,
    asyncHandler(async (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: "Forbidden" });
      }

      const user = await User.findOne({ username: decoded.username });
      if (!user) {
        return res.status(400).json({ message: "Unauthorized" });
      }

      const accessToken = jwt.sign(
        {
          UserInfo: {
            username: user.username,
            role: user.role,
          },
        },
        process.env.ACCESS_JWT_SECRET,
        { expiresIn: "15m" }
      );
      res.json({ accessToken });
    })
  );
};

exports.logout = (req, res) => {
  const cookies = req.cookies;
  if (!cookies.jwt) {
    return res.status(204);
  }
  res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
  res.json({ message: "Cookie cleared" });
};
