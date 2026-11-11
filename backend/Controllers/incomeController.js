const Income = require('../Models/incomeSchema');


const postIncome = async (req, res) => {

    const { amount, description } = req.body;

    const now = new Date();

    const currentMonth = now.getMonth() + 1;

    const currentYear = now.getFullYear();

    const monthString = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
    ];

    const monthName = monthString[currentMonth - 1];

    const localDate = new Date(
        now.getTime() - now.getTimezoneOffset() * 60000
    );

    try {

        const incomeData = await Income.create({

            amount: amount,

            description: description,

            date: new Date(),

            month: monthName,

            year: currentYear,

            userId: req.userId

        });

        if (!incomeData) {

            return res.status(400).json({
                message: 'Income not created'
            });

        }

        res.status(200).json({
            message: 'income created',
            data: incomeData
        });

    }
    catch (err) {

        console.log(err);

        res.status(500).json({
            message: 'Something went wrong'
        });

    }
};


const getIncome = async (req, res) => {

    try {

        const incomeData = await Income.find({
            userId: req.userId
        }).sort({
            year: -1,
            month: -1
        });

        res.status(200).json({
            data: incomeData
        });

    }
    catch (err) {

        console.log(err);

        res.status(500).json({
            message: 'Something went wrong'
        });

    }
};


const deleteIncome = async (req, res) => {

    try {

        const id = req.params.id;

        const income = await Income.findOne({
            _id: id,
            userId: req.userId
        });

        if (!income) {

            return res.status(404).json({
                message: 'Income not found'
            });

        }

        await income.deleteOne();

        res.status(200).json({
            message: 'Income deleted'
        });

    }
    catch (err) {

        console.log(err);

        res.status(500).json({
            message: 'Something went wrong'
        });

    }
};


module.exports = {
    postIncome,
    getIncome,
    deleteIncome
};