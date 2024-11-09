const express = require("express");
const router = express.Router();  // Fix: Router() should be used like this.
const {registerUser, loginUser}  = require("../../controllers/auth-controller/index");
const authenticateMiddleware = require("../../middleware/auth-middleware.js")

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/check-auth', authenticateMiddleware, (req,res)=>{
    const user = req.user
    res.status(200).json({
        success: true,
        message: "User is authenticated",
        data:{
            user
        }
    })
})

module.exports = router;
