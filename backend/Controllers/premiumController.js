const Expense = require('../Models/expenseSchema');
const User = require('../Models/signupSchema');

const getIsPremium = async (req, res) => {

    try {

        const premiumExpense = await User.find(
            {
                isPremium: true
            },
            {
                name: 1,
                totalExpense: 1,
                _id: 0
            }
        );

        res.status(200).json(premiumExpense);

    }
    catch (err) {

        console.log(err);

        res.status(500).json({
            message: "Something goes wrong"
        });

    }
};

module.exports = getIsPremium;