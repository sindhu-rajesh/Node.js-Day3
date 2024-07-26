import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDb from './database/dbConfig.js';
import stuRouter from './routers/student.router.js';
import mentRouter from './routers/student.router.js' ;

const PORT = 4000;

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.get('/', (req, res) => {
    res.status(200).json({Message:"App is working fine"});
});

connectDb();
  
app.use('/api/student', stuRouter);
app.use('/api/mentor', mentRouter);



app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
})