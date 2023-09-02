const userRouter = require("express").Router();
// ------ Connection between MOngoDB Atlas
const ConnectDB = require("../middleware/ConnectDB");
// ------ Generate HashPassword Function
const { GenerateHashPassword } = require("../libs/HashPassword");
// ------ Generate JWT Token
const { GenerateToken } = require("../libs/JwtToken");
// ------ MongoDB UserModel
const userModel = require("../models/userModel");
// ------ User controller
const {
	AddNewUser,
	LoginUser,
	UpdateUserData,
	VerifyUserLink,
	GetUserProfile,
	GetAnotherUserProfile,
	UpdateSaved,
	UpdateFollowers,
} = require("../controllers/user");
const { VerifyHeaderToken } = require("../middleware/middlewares");

// ------- User Router Paths
userRouter.get("/", GetAnotherUserProfile);
userRouter.get("/profile", VerifyHeaderToken, GetUserProfile);
userRouter.get("/login", LoginUser);
userRouter.post("/create", AddNewUser);
userRouter.put("/verify", VerifyUserLink);
userRouter.put("/update", VerifyHeaderToken, UpdateUserData);
userRouter.put("/updatesaved", VerifyHeaderToken, UpdateSaved);
userRouter.put("/updatefollow", VerifyHeaderToken, UpdateFollowers);

module.exports = userRouter;
