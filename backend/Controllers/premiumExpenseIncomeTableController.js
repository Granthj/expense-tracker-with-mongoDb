const User = require('../Models/signupSchema');
const Expense = require('../Models/expenseSchema');
const Income = require('../Models/incomeSchema');
const Note = require('../Models/notesSchema');


const monthlyTable = async (req, res) => {

    try {

        const now = new Date();

        const startOfMonth = new Date(
            now.getFullYear(),
            now.getMonth(),
            1
        );

        const startOfNextMonth = new Date(
            now.getFullYear(),
            now.getMonth() + 1,
            1
        );


        const user = await User.findById(req.userId);

        if (!user) {
            return res.status(404).json({
                message: 'User not found'
            });
        }


        // if (!user.isPremium) {
        //     return res.status(403).json({
        //         message: 'User is not authorized'
        //     });
        // }


        const expense = await Expense.find(
            {
                userId: req.userId,
                date: {
                    $gte: startOfMonth,
                    $lt: startOfNextMonth
                }
            },
            {
                date: 1,
                description: 1,
                expenseAmount: 1,
                category: 1,
                _id: 0
            }
        );


        const expenseTotal = await Expense.aggregate([
            {
                $match: {
                    userId: user._id,
                    date: {
                        $gte: startOfMonth,
                        $lt: startOfNextMonth
                    }
                }
            },
            {
                $group: {
                    _id: null,
                    total: {
                        $sum: '$expenseAmount'
                    }
                }
            }
        ]);


        const totalExpense =
            expenseTotal.length > 0
                ? expenseTotal[0].total
                : 0;


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


        const income = await Income.find(
            {
                userId: req.userId,
                month: monthName,
                year: currentYear
            },
            {
                date: 1,
                description: 1,
                amount: 1,
                year: 1,
                month: 1,
                _id: 0
            }
        );


        const incomeTotal = await Income.aggregate([
            {
                $match: {
                    userId: user._id,
                    month: monthName,
                    year: currentYear
                }
            },
            {
                $group: {
                    _id: null,
                    total: {
                        $sum: '$amount'
                    }
                }
            }
        ]);


        const totalIncome =
            incomeTotal.length > 0
                ? incomeTotal[0].total
                : 0;


        const finalIncome = totalIncome || 0;


        let savings = finalIncome - totalExpense;


        if (savings <= 0) {
            savings = 0;
        }


        const expensesData = (expense || []).map((e) => ({

            date: e.date,

            type: 'Expense',

            amount: e.expenseAmount,

            description: e.description,

            category: e.category

        }));


        const incomeData = (income || []).map((i) => ({

            date: i.date,

            type: 'Income',

            amount: i.amount,

            description: i.description

        }));


        const combinedData = [
            ...expensesData,
            ...incomeData
        ];


        const groupedData = {};


        combinedData.forEach(item => {

            if (!groupedData[item.date]) {
                groupedData[item.date] = [];
            }

            groupedData[item.date].push(item);

        });


        const monthAndDate = now.toLocaleString('en-IN', {
            month: 'long',
            year: 'numeric'
        });


        res.status(200).json({

            message: 'All Good',

            data: groupedData,

            totalExpense: totalExpense,

            totalIncome: finalIncome,

            savings: savings,

            monthAndDate: monthAndDate

        });

    }
    catch (err) {

        console.log(err);

        return res.status(500).json({
            message: 'Something went wrong'
        });

    }
};


const yearlyTable = async (req, res) => {

    try {

        const now = new Date();

        const startOfMonth = new Date(
            now.getFullYear(),
            now.getMonth(),
            1
        );

        const startOfNextMonth = new Date(
            now.getFullYear(),
            now.getMonth() + 1,
            1
        );


        const user = await User.findById(req.userId);

        if (!user) {
            return res.status(404).json({
                message: 'User not found'
            });
        }


        if (user.isPremium === false) {

            return res.status(403).json({
                message: 'User is not authorized'
            });

        }


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


        const expenseTotal = await Expense.aggregate([

            {
                $match: {
                    userId: user._id,
                    date: {
                        $gte: startOfMonth,
                        $lt: startOfNextMonth
                    }
                }
            },

            {
                $group: {
                    _id: null,
                    total: {
                        $sum: '$expenseAmount'
                    }
                }
            }

        ]);


        const totalExpense =
            expenseTotal.length > 0
                ? expenseTotal[0].total
                : 0;


        const incomeTotal = await Income.aggregate([

            {
                $match: {
                    userId: user._id,
                    month: monthName,
                    year: currentYear
                }
            },

            {
                $group: {
                    _id: null,
                    total: {
                        $sum: '$amount'
                    }
                }
            }

        ]);


        const totalIncome =
            incomeTotal.length > 0
                ? incomeTotal[0].total
                : 0;


        let savings = totalIncome - totalExpense;


        if (savings <= 0) {
            savings = 0;
        }


        res.status(200).json({

            message: 'All Good',

            month: monthName,

            totalExpense: totalExpense,

            totalIncome: totalIncome,

            savings: savings,

            title: "Yearly Report"

        });

    }
    catch (err) {

        console.log(err);

        return res.status(500).json({
            message: 'Something went wrong'
        });

    }
};


const notesTable = async (req, res) => {

    try {

        const currentYear = new Date().getFullYear();


        const startOfYear = new Date(
            currentYear,
            0,
            1
        );


        const endOfYear = new Date(
            currentYear + 1,
            0,
            1
        );


        const notes = await Note.find({

            userId: req.userId,

            date: {
                $gte: startOfYear,
                $lt: endOfYear
            }

        }).sort({

            date: 1

        });


        const formattedDateNote = notes.map(note => {

            const d = new Date(note.date);

            const day = String(
                d.getDate()
            ).padStart(2, '0');

            const month = String(
                d.getMonth() + 1
            ).padStart(2, '0');

            const year = d.getFullYear();


            return {

                ...note.toObject(),

                date: `${day}/${month}/${year}`

            };

        });


        res.status(200).json({

            message: 'Notes fetched successfully',

            notes: formattedDateNote

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
    monthlyTable,
    yearlyTable,
    notesTable
};