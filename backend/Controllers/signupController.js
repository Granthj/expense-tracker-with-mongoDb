const User = require('../Models/signupSchema');
const bcrypt = require('bcrypt');

const signUp = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const signupExists = await User.findOne({
            email: email
        });

        if (signupExists) {
            return res.status(403).json({
                message: "email already exists",
                bool: true
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const signup = await User.create({
            name: name,
            email: email,
            password: hashedPassword
        });

        res.status(201).json({
            message: "User created with email",
            bool: false
        });
    }
    catch (err) {
        console.log(err);

        if (err.code === 11000) {
            return res.status(403).json({
                message: "email already exists",
                bool: true
            });
        }

        return res.status(500).send(
            'something wrong while creating signup'
        );
    }
};

module.exports = signUp;