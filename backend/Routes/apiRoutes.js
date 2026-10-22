const express = require('express');
const router = express.Router();
const signupController = require('../Controllers/signupController');
const loginController = require('../Controllers/loginController');
const expenseController = require('../Controllers/expenseController');
const paymentController = require('../Controllers/paymentController');
const premiumController = require('../Controllers/premiumController');
const resetpassword = require('../Controllers/resetPassword');
const incomeController = require('../Controllers/incomeController');
const premiumExpenseIncomeTableController = require('../Controllers/premiumExpenseIncomeTableController');
const notesController = require('../Controllers/addNotesController');
const userAuthenticate = require('../Utils/authorization');

//sign-up controller
router.post('/sign-up',signupController)
//login controller
router.post('/login',loginController);
//expense controller
router.post('/expense',userAuthenticate,expenseController.postExpense);
router.get('/expense',userAuthenticate,expenseController.getExpense);
router.delete('/delete-expense/:id',userAuthenticate,expenseController.deleteExpense);
router.post('/create-category',expenseController.categoryWithAiGen);
//payment controller
router.post('/pay',userAuthenticate,paymentController.processPayment);
router.get('/payment-status/:orderId',paymentController.paymentStatus);
//premium controller
router.get('/premium',userAuthenticate,premiumController);
//resetpaasword controller
router.post('/password',resetpassword.changePassword);
router.post('/password/forgotpassword',resetpassword.linkToChangePassword);
//income controller
router.post('/add-income',userAuthenticate,incomeController.postIncome);
router.get('/income',userAuthenticate,incomeController.getIncome);
router.delete('/delete-income/:id',userAuthenticate,incomeController.deleteIncome);
//report controller
router.get('/premium/monthly-data-table',userAuthenticate,premiumExpenseIncomeTableController.monthlyTable);
router.get('/premium/yearly-data-table',userAuthenticate,premiumExpenseIncomeTableController.yearlyTable);
router.get('/premium/notes-data-table',userAuthenticate,premiumExpenseIncomeTableController.notesTable);
//notes controller
router.post('/add-note',userAuthenticate,notesController.postNotes);
router.get('/get-notes',userAuthenticate,notesController.getNotes);
router.delete('/delete-note/:id',userAuthenticate,notesController.deleteNote);

module.exports = router;