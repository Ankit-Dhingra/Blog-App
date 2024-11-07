const { Router } = require('express');
const User = require('../models/user'); // Corrected import

const router = Router();

// Routes

router.get('/signin', (req, res) => {
    return res.render("signin");
});

router.get('/signup', (req, res) => {
    return res.render("signup");
});
router.post('/signin', async (req, res) => {
    const { email, password } = req.body;

    try {
        const token = await User.matchPassword(email, password);
        return res.cookie('token', token).redirect("/");
    }
    catch (error) {
        return res.render('signin', {
            error:"Incorrect password or email",
        });
    }
})

router.get("/logout" , (req , res)=>{
    return res.clearCookie("token").redirect("/");

})

router.post("/signup", async (req, res) => {
    const { fullName, email, password } = req.body;
    try {
        const user = await User.create({ // Corrected to User.create
            fullName,
            email,
            password
        });
        res.redirect("/");
    } catch (error) {
        console.error(error);
        res.status(500).send("Error creating user");
    }
});

module.exports = router;

