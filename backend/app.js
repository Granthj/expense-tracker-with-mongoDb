const db = require('./Utils/db');
const path = require('path');
const fs = require('fs');
const apiRoutes = require('./Routes/apiRoutes');
// const pageRoutes = require('./Routes/pageRoutes');
const auth = require('./Utils/authorization');
const User = require('./Models/signupSchema');
const ForgotPassword = require('./Models/forgotPasswordRequestSchema');
const Expense = require('./Models/expenseSchema');
const Income = require('./Models/incomeSchema');
const https = require('https');
const compression = require('compression');
const morgan = require('morgan');
require('dotenv').config();

const express = require('express');
const app = express();
// const privateKey = fs.readFileSync('server.key');
// const certificate = fs.readFileSync('server.cert');
// const server = https.createServer({ key: privateKey, cert: certificate }, app);
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' });
app.use(compression());
app.use(morgan('combined',{stream: accessLogStream}));

app.use(express.json());

app.use(express.static(path.join(__dirname,"../frontend")));

// app.use(auth);
User.hasMany(Income);
Income.belongsTo(User);


User.hasMany(Expense);
Expense.belongsTo(User);

User.hasMany(ForgotPassword, { foreignKey: 'userId' });
ForgotPassword.belongsTo(User, { foreignKey: 'userId' });

app.use('/api',apiRoutes);
// app.use('/',pageRoutes);

app.use((req,res)=>{
    res.sendFile(path.join(__dirname,'../frontend/index.html'));
});
// app.use((req, res, next) => {

//     // allow API
//     if (req.path.startsWith('/api')) {
//         return next();
//     }

//     // allow static files (.js, .css, images)
//     if (req.path.includes('.')) {
//         return next();
//     }

//     // fallback to SPA
//     res.sendFile(path.join(__dirname, '../frontend/index.html'));
// });
db.sync().then(()=>{
    app.listen(process.env.PORT || 3000,()=>{
        console.log('Connected to server 3000');
    });
    // https.createServer({ key: privateKey, cert: certificate }, app).listen(3000, () => {
    //     console.log('Connected to server 3000');
    // });
});