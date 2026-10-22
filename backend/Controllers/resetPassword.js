const User = require('../Models/signupSchema');
const ForgotPassword = require('../Models/forgotPasswordRequestSchema');
const sendEmail = require('../Services/nodeMailer');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');

const changePassword = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email: email });

        if (!user) {
            return res.status(404).json({
                message: 'User not found with this email'
            });
        }

        const forgotPassword = await ForgotPassword.create({
            _id: uuidv4(),
            userId: user._id,
            isActive: true
        });

        const resetLink =
            `http://localhost:3000/forgotpassword?id=${forgotPassword._id}`;

        await sendEmail(
            email,
            'Forgot Password Link',
            resetLink
        );

        res.status(201).json({
            message: 'Link send',
            success: true
        });
    }
    catch (err) {
        console.log(err);

        return res.status(500).json({
            message: 'Something went wrong',
            success: false
        });
    }
};


const linkToChangePassword = async (req, res) => {
    try {
        const { id, password, newPassword } = req.body;

        if (password !== newPassword) {
            return res.status(400).json({
                message: 'Passwords do not match'
            });
        }

        const passChange = await ForgotPassword.findById(id);

        if (!passChange || !passChange.isActive) {
            return res.status(404).json({
                message: 'Link is expired or not found'
            });
        }

        const user = await User.findById(passChange.userId);

        if (!user) {
            return res.status(404).json({
                message: 'User not found'
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        user.password = hashedPassword;

        await user.save();

        // Mark the reset link as used.
        passChange.isActive = false;

        await passChange.save();

        res.status(200).json({
            message: 'Password changed'
        });
    }
    catch (err) {
        console.log(err);

        return res.status(500).json({
            message: 'Something went wrong'
        });
    }
};


module.exports = {
    changePassword,
    linkToChangePassword
};