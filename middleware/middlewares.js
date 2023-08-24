const { VerifyToken } = require("../libs/JwtToken");

exports.VerifyHeaderToken=async(req,res,next)=>{
    const token=req.headers.authorization;
    // console.log(req.headers)

    if (!token) {
        return res.status(401).json({
            success: false,
            error: true,
            message: 'Unauthorized User'
        });
    }

    const verifyToken = await VerifyToken(token.split(" ")[1]);
    
    if (!verifyToken) {
        return res.status(401).json({
            success: false,
            error: true,
            message: 'Unauthorized User'
        });
    }
    res.tokenData = verifyToken;
    next();
}

