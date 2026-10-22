const Expense = require('../Models/expenseSchema');
const User = require('../Models/signupSchema');
const generateResponse = require('../Services/gemini_api');

const mongoose = require('mongoose');


const postExpense = async (req, res) => {

    const session = await mongoose.startSession();

    try {

        const { expenseAmount, category, description, note } = req.body;

        if (!expenseAmount || !category || !description || !note) {
            return res.status(400).json({
                message: 'All fields are required'
            });
        }

        const userId = req.userId;

        let expense;

        await session.withTransaction(async () => {

            const user = await User.findById(userId).session(session);

            if (!user) {
                throw new Error('User not found');
            }

            user.totalExpense =
                Number(user.totalExpense) + Number(expenseAmount);

            await user.save({ session });

            const now = new Date();

            const localDate = new Date(
                now.getTime() - now.getTimezoneOffset() * 60000
            );

            expense = await Expense.create([{
                date: localDate,
                expenseAmount: expenseAmount,
                category: category,
                description: description,
                note: note,
                UserId: userId
            }], { session });

        });

        res.status(201).json(expense);

    }
    catch (err) {

        console.log(err);

        return res.status(500).send('Something wrong');

    }
    finally {
        await session.endSession();
    }
};


const getExpense = async (req, res) => {

    try {

        const limit = parseInt(req.query.limit) || 10;

        const page = parseInt(req.query.page) || 1;

        const offSet = (page - 1) * limit;

        const filter = {
            UserId: req.userId
        };

        const [expenses, count] = await Promise.all([

            Expense.find(filter)
                .sort({ createdAt: -1 })
                .skip(offSet)
                .limit(limit),

            Expense.countDocuments(filter)

        ]);

        res.status(200).json({

            expenses: expenses,

            totalItems: count,

            currentPage: page,

            totalPages: Math.ceil(count / limit)

        });

    }
    catch (err) {

        console.log(err);

        return res.status(500).send('Something wrong');

    }
};


const deleteExpense = async (req, res) => {

    const session = await mongoose.startSession();

    try {

        const { id } = req.params;

        let deletedExpense;

        await session.withTransaction(async () => {

            const user = await User.findById(req.userId).session(session);

            if (!user) {
                throw new Error('User not found');
            }

            const expense = await Expense.findOne({
                _id: id,
                UserId: req.userId
            }).session(session);

            if (!expense) {
                throw new Error('Expense not found');
            }

            if (user.isPremium === true) {

                user.totalExpense =
                    Number(user.totalExpense) -
                    Number(expense.expenseAmount);

                if (user.totalExpense <= 0) {
                    user.totalExpense = 0;
                }

                await user.save({ session });

            }

            deletedExpense = await Expense.findByIdAndDelete(
                id,
                { session }
            );

        });

        res.status(200).json({
            message: 'Delete is done'
        });

    }
    catch (err) {

        console.log(err);

        if (err.message === 'Expense not found') {
            return res.status(404).json({
                message: 'Expense not found'
            });
        }

        return res.status(500).send('Something wrong');

    }
    finally {
        await session.endSession();
    }
};


const categoryWithAiGen = async (req, res) => {

    try {

        const { description } = req.body;

        const response = await generateResponse(description);

        console.log(response, 'ai data');

        if (!response) {

            return res.status(400).json({
                message: 'Give a correct description or name',
                response: response
            });

        }

        res.status(200).json({
            message: 'All good',
            response: response
        });

    }
    catch (err) {

        console.log(err, 'full');

        return res.status(500).send('Something wrong');

    }
};


module.exports = {
    postExpense,
    getExpense,
    deleteExpense,
    categoryWithAiGen
};