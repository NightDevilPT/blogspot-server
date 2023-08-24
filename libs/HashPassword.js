const bcrypt = require("bcrypt");
const SALT = 10;


const GenerateHashPassword = async (password) => {
    const hashPassword = await bcrypt.hash(password, SALT);
    return hashPassword;
}


const VerifyHashPassword = async (password, hashPassword) => {
    const isVerified = await bcrypt.compare(password, hashPassword);
    return isVerified;
}


module.exports = {
    GenerateHashPassword, VerifyHashPassword
}