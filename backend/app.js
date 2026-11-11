const path = require('path');
const fs = require('fs');
const apiRoutes = require('./Routes/apiRoutes');
const auth = require('./Utils/authorization');
const https = require('https');
const compression = require('compression');
const morgan = require('morgan');
const cors = require('cors');
require('dotenv').config();

const express = require('express');
const connectDb = require('./Utils/db');

const app = express();
app.use(cors());
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'),{ flags: 'a' });

app.use(compression());
app.use(morgan('combined', { stream: accessLogStream }));

app.use(express.json());

app.use(express.static(path.join(__dirname, '../frontend')));

app.use('/api', apiRoutes);

app.use((req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

const startServer = async () => {
    try {
        await connectDb();

        app.listen(process.env.PORT || 3000, () => {
            console.log(`Connected to server ${process.env.PORT || 3000}`);
        });

    } catch (error) {
        console.log('Server startup failed:', error.message);
        process.exit(1);
    }
};

startServer();