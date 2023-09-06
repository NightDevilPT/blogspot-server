const userModel = require("../models/userModel");
const blogModel = require("../models/blogModel");

const {
	GenerateHashPassword,
	VerifyHashPassword,
} = require("../libs/HashPassword");
const { GenerateToken, VerifyToken } = require("../libs/JwtToken");
const { SendVerifyLink } = require("../SendMail/VerifySendMail");
const { UpdatePasswordLink } = require("../SendMail/UpdateSendLink");

// ------ Add New User
exports.AddNewUser = async (req, res) => {
	const data = req.body;

	try {
		const findUser = await userModel.findOne({ email: data.email });
		if (findUser) {
			return res.status(422).json({
				success: false,
				error: true,
				message: "user already exists with this email",
			});
		}
		const hashPassword = await GenerateHashPassword(data.password);
		const token = await GenerateHashPassword(`${new Date().getTime()}`);
		const createUser = await userModel.create({
			...data,
			password: hashPassword,
			token,
		});

		if (!createUser) {
			return res.status(500).json({
				success: false,
				error: true,
				message: "Internal Server Error",
			});
		}

		const verifyLink = `${process.env.ORIGIN_HOST}/auth/verify?token=${token}`;
		const sendMail = await SendVerifyLink(
			data.email,
			`${data.firstname} ${data.lastname}`,
			verifyLink
		);

		return res.status(201).json({
			success: true,
			error: false,
			message: `verification link sended to ${data.email}`,
		});
	} catch (err) {
		return res.status(500).json({
			success: false,
			error: true,
			message: "Internal Server Error",
		});
	}
};

// ------ Verify User Email ID
exports.VerifyUserLink = async (req, res) => {
	const { token } = req.query;
	if (!token) {
		return res.status(498).json({
			success: false,
			error: true,
			message: "Invalid Token",
		});
	}

	try {
		const verifyUser = await userModel.findOneAndUpdate(
			{ token },
			{ verified: true, token: null }
		);
		if (!verifyUser) {
			return res.status(498).json({
				success: false,
				error: true,
				message: "Invalid Token",
			});
		}

		return res.status(201).json({
			success: true,
			error: false,
			message: `${verifyUser.email} Successfully Verified`,
		});
	} catch (err) {
		return res.status(500).json({
			success: false,
			error: true,
			message: "Invalid Server Error",
		});
	}
};

// ------ LOgin User
exports.LoginUser = async (req, res) => {
	const { email, password } = req.body;

	try {
		const findUser = await userModel.findOne({ email });
		if (!findUser) {
			return res.status(401).json({
				success: false,
				error: true,
				message: "Invalid Username or Password",
			});
		}

		if (!findUser.verified) {
			return res.status(401).json({
				success: false,
				error: true,
				message: "First Verify Your Email-ID",
			});
		}

		const verifyPassword = await VerifyHashPassword(
			password,
			findUser.password
		);
		if (!verifyPassword) {
			return res.status(401).json({
				success: false,
				error: true,
				message: "Invalid Username or Password",
			});
		}

		const tokenData = {
			id: findUser._id,
			email: findUser.email,
		};
		const jwtToken = await GenerateToken(tokenData);

		return res.status(200).json({
			success: true,
			error: false,
			token: jwtToken,
			message: "User successfully logined",
		});
	} catch (err) {
		return res.status(500).json({
			success: false,
			error: true,
			message: "Internal Server Error",
		});
	}
};

// ------ Sending Update Password Link
exports.SendUpdatePasswordLink = async (req, res) => {
	const { email } = req.body;

	try {
		const findUser = await userModel.findOne({ email });
		if (!findUser) {
			return res.status(401).json({
				success: false,
				error: true,
				message: "Invalid Username or Password",
			});
		}

		if (!findUser.verified) {
			return res.status(401).json({
				success: false,
				error: true,
				message: "First Verify Your Email-ID",
			});
		}

		const token = await GenerateHashPassword(`${new Date().getTime()}`);
		const updateToken = await userModel.findOneAndUpdate(
			{ email },
			{ token }
		);

		if (!updateToken) {
			return res.status(500).json({
				success: false,
				error: true,
				message: "Internal Server Error",
			});
		}
		const updateLink = `${process.env.ORIGIN_HOST}/auth/updatePassword?token=${token}`;
		const sendMail = await UpdatePasswordLink(
			updateToken.email,
			`${updateToken.firstname} ${updateToken.lastname}`,
			updateLink
		);

		return res.status(201).json({
			success: true,
			error: false,
			message: `Update link sended to ${updateToken.email}`,
		});
	} catch (err) {
		console.log(err);
		return res.status(500).json({
			success: false,
			error: true,
			message: "Internal Server Error",
		});
	}
};

exports.UpdatePassword = async (req, res) => {
	const { password } = req.body;
	const { token } = req.query;

	if (!token) {
		return res.status(401).json({
			success: false,
			error: true,
			message: "User not found",
		});
	}

	try {
		const hashPassword = await GenerateHashPassword(password);
		const updatePassword = await userModel.findOneAndUpdate(
			{ token },
			{ password: hashPassword, token: null }
		);

		if (!updatePassword) {
			return res.status(401).json({
				success: false,
				error: true,
				message: "User not found",
			});
		}

		return res.status(201).json({
			success: true,
			error: false,
			message: "Password successfully updated.",
		});
	} catch (err) {
		console.log(err);
		return res.status(500).json({
			success: false,
			error: true,
			message: "Internal Server Error",
		});
	}
};


// ------ Update User Data
exports.UpdateUserData = async (req, res) => {
	const { tokenData } = res;
	const data = req.body;

	try {
		const updateUser = await userModel.findByIdAndUpdate(tokenData.id, {
			...data,
		});

		if (!updateUser) {
			return res.status(500).json({
				success: false,
				error: true,
				message: "Internal Server Error",
			});
		}

		return res.status(200).json({
			success: true,
			error: false,
			message: "Data Successfully Updated",
		});
	} catch (err) {
		return res.status(500).json({
			success: false,
			error: true,
			message: "Internal Server Error",
		});
	}
};

// ------ Fetching User Profile Data Using Token
exports.GetUserProfile = async (req, res) => {
	const { tokenData } = res;

	try {
		const findUser = await userModel.findById(tokenData.id, {
			password: 0,
			verified: 0,
			token: 0,
		});
		if (!findUser) {
			return res.status(404).json({
				success: false,
				error: true,
				message: "User not exists",
			});
		}

		return res.status(200).json({
			success: true,
			error: false,
			data: findUser,
			message: "successfuly fetched data",
		});
	} catch (err) {
		return res.status(500).json({
			success: false,
			error: true,
			message: "Internal Server Error",
		});
	}
};

// ------ Fetching ANother User Data UsingID
exports.GetAnotherUserProfile = async (req, res) => {
	const { userId } = req.query;

	if (!userId) {
		return res.status(401).json({
			success: false,
			error: true,
			message: "User not found",
		});
	}

	try {
		const searchUser = await userModel.findById(userId, {
			password: 0,
			verified: 0,
			token: 0,
			saved: 0,
			liked: 0,
		});
		if (!searchUser) {
			return res.status(401).json({
				success: false,
				error: true,
				message: "User not found",
			});
		}

		return res.status(200).json({
			success: true,
			error: false,
			data: searchUser,
			message: "Successfully fetched user data",
		});
	} catch (err) {
		return res.status(500).json({
			success: false,
			error: true,
			message: "Internal Server Error",
		});
	}
};

// ------ Add or Remove Saved Blog
exports.UpdateSaved = async (req, res) => {
	const { tokenData } = res;
	const { blogId } = req.query;

	if (!blogId) {
		return res.status(404).json({
			success: false,
			error: true,
			message: "blog not found",
		});
	}

	try {
		const findBlog = await blogModel.findById(blogId);
		const findUser = await userModel.findById(tokenData.id);
		// console.log(findBlog);
		if (!findBlog) {
			return res.status(404).json({
				success: false,
				error: true,
				message: "blog not found",
			});
		}

		if (findUser.saved.includes(blogId)) {
			const indexOfSavedBlog = findUser.saved.indexOf(blogId);
			const removeSavedBlog = findUser.saved.filter((items, index) => {
				if (items !== blogId && index !== indexOfSavedBlog) {
					return items;
				}
			});

			const updateSaved = await userModel.findByIdAndUpdate(
				findUser._id,
				{ saved: removeSavedBlog }
			);

			return res.status(200).json({
				success: true,
				error: false,
				message: "blog successfully removed from saved",
			});
		}

		const saveBlog = await userModel.findByIdAndUpdate(findUser._id, {
			saved: [...findUser.saved, findBlog._id],
		});

		return res.status(200).json({
			success: true,
			error: false,
			message: "blog successfully added in saved",
		});
	} catch (err) {
		return res.status(500).json({
			success: false,
			error: true,
			message: "Internal Server Error",
		});
	}
};

// ------Add or Remove Followers and Following
exports.UpdateFollowers = async (req, res) => {
	const { tokenData } = res;
	const { userId } = req.query;

	if (!userId) {
		return res.status(404).json({
			success: false,
			error: true,
			message: "User not found",
		});
	}

	try {
		const Request = await userModel.findById(userId);
		if (!Request) {
			return res.status(404).json({
				success: false,
				error: true,
				message: "User not found",
			});
		}
		const Sender = await userModel.findById(tokenData.id);

		if (Request.followers.includes(Sender._id)) {
			console.log("done");
			const indexOfSenderInRequest = Request.followers.indexOf(
				Sender._id
			);
			const removeSenderFromRequest = Request.followers.filter(
				(items, index) => {
					return (
						items !== Sender._id && index !== indexOfSenderInRequest
					);
				}
			);
			const updateRequestFollowers = await userModel.findByIdAndUpdate(
				Request._id,
				{ followers: removeSenderFromRequest }
			);

			const indexOfRequestInSender = Sender.following.indexOf(
				Request._id
			);
			const removeRequestFromSender = Sender.following.filter(
				(items, index) => {
					return (
						items !== Request._id &&
						index !== indexOfRequestInSender
					);
				}
			);
			const updateSenderFollowing = await userModel.findByIdAndUpdate(
				Sender._id,
				{ following: removeRequestFromSender }
			);

			return res.status(200).json({
				success: true,
				error: false,
				message: `You unfollowed ${Request.firstname} ${Request.lastname}`,
			});
		}

		const addFollowingInSender = await userModel.findByIdAndUpdate(
			Sender._id,
			{ following: [...Sender.following, Request._id] }
		);
		const addFollowersInRequest = await userModel.findByIdAndUpdate(
			Request._id,
			{ followers: [...Request.followers, Sender._id] }
		);

		return res.status(200).json({
			success: true,
			error: false,
			message: `You now following ${Request.firstname} ${Request.lastname}`,
		});
	} catch (err) {
		return res.status(500).json({
			success: false,
			error: true,
			message: "Internal Server Error",
		});
	}
};
