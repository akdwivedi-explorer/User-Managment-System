import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import connectDB from './src/config/db.js';

import authRoute from './src/routes/authRoute.js';
import userRoute from './src/routes/userRoute.js';
import adminRoute from './src/routes/adminRoute.js';

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

app.use('/api/auth', authRoute);   
app.use('/api/users', userRoute);  
app.use('/api/admin', adminRoute);

app.get('/', (req, res) => {
    res.send('API is running...');
});

if (process.env.NODE_ENV !== 'test') {
    connectDB().then(() => {
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    }).catch(err => console.error(err));
}


export default app;

