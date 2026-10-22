const User = require('../Models/signupSchema');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const generateToken = (userId) => {

    const token = jwt.sign(
        {
            data: userId
        },
        'expense_userId',
        {
            expiresIn: '1h'
        }
    );

    return token;
};


const login = async (req, res) => {

    try {

        const { email, password } = req.body;

        const login = await User.findOne({
            email: email
        });

        if (login === null) {

            return res.status(404).json({
                emailError: true,
                passwordError: false,
                message: "Email not found",
                success: false,
                token: null
            });

        }

        const hashedPassword = await bcrypt.compare(
            password,
            login.password
        );

        if (!hashedPassword) {

            return res.status(403).json({
                emailError: false,
                passwordError: true,
                message: "Password not matched",
                success: false,
                token: null
            });

        }

        return res.status(200).json({
            emailError: false,
            passwordError: false,
            message: "All Good",
            success: true,
            token: generateToken(login._id)
        });

    }
    catch (err) {

        console.log(err);

        return res.status(500).send('Something wrong');

    }
};


module.exports = login;