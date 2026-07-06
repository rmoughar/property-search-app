import express from "express";
import pool from './pool.js';
import propertiesRouter from './properties.js'
import 'dotenv/config';

const app = express();
const port =  process.env.BACKEND_PORT || 4000;

app.get('/', (req, res) => {
    res.send(`
        Hello Word! <br>
        <h1> hi </h1>
        Testing = ${req.ip} <br>
        TestingHost = ${req.host}`);
});

app.get('/test', async (req, res) => {
    try{
        const [results, fields] = await pool.query(
            'SELECT COUNT(*) AS count FROM rets_property'
        );

        res.json({
            results,
            fields
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).send('Error');
    }
})

app.get('/api/health', async (req, res) => {
    try{
        const [results, fields] = await pool.query(
            'SELECT 1'
        );

        res.json({
            status: 'ok',
            database: 'connected'
        });
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send('Error');
    }
})

app.listen(port, (err) => {
    if (err){
        console.error(err);
        return;
    }
    console.log(`Example app listening on port ${port}`);
});

app.use('/properties', propertiesRouter);