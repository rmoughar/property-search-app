import express from 'express';
import pool from '../config/pool.js';

const healthRouter = express.Router();

healthRouter.get('/', async (req,res) => {
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

export default healthRouter;