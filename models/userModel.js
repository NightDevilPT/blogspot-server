const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
	avtar: {
		type: String,
		default: "",
	},
	firstname: {
		type: String,
		required: [true, "Firstname is required"],
	},
	lastname: {
		type: String,
		required: [true, "Lastname is required"],
	},
	gender: {
		type: String,
		default: "",
	},
	email: {
		type: String,
		required: [true, "Email is required"],
	},
	password: {
		type: String,
		required: [true, "Password is required"],
	},
	token: {
		type: String || null,
		default: null,
	},
	verified: {
		type: Boolean,
		default: false,
	},
	facebook: {
		type: String,
		default: "",
	},
	instagram: {
		type: String,
		default: "",
	},
	youtube: {
		type: String,
		default: "",
	},
	thread: {
		type: String,
		default: "",
	},
	github: {
		type: String,
		default: "",
	},
	portfolio: {
		type: String,
		default: "",
	},
	followers: {
		type: Array,
		default: [],
	},
	following: {
		type: Array,
		default: [],
	},
	blogs: {
		type: Array,
		default: [],
	},
	saved: {
		type: Array,
		default: [],
	},
	liked: {
		type: Array,
		default: [],
	},
});

const userModel = mongoose.models.users || mongoose.model("users", userSchema);
module.exports = userModel;
