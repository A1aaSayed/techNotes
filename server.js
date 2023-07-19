const dbConnection = require('./config/dbConnection');
const dotenv = require('dotenv');
const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const path = require('path');
const { logEvents, logger } = require('./middleware/logger')
const errorHandler = require('./middleware/errorHandler');
const cors = require('cors')
const corsOptions = require('./config/corsOptions')
const noteRoute = require('./routes/noteRoute');
const userRoute = require('./routes/userRoute');
const authRoute = require('./routes/authRoute');

dotenv.config({ path: 'config.env' });


// Connect to the database
dbConnection();

// app.use(logEvents());
app.use(logger)
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use('/', express.static(path.join(__dirname, 'public')));
// app.use('/', require('./routes/route'));

app.use('/auth', authRoute);
app.use('/users', userRoute);
app.use('/notes', noteRoute);

app.use(errorHandler);

const port = process.env.PORT || 5000
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});