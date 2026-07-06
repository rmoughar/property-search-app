import express from 'express';
import pool from './pool.js';


const propertiesRouter = express.Router();

let sqlQuery = "SELECT * FROM rets_property"


propertiesRouter.get('/', async (req,res) => {
    try{
        let sqlQuery = "SELECT * FROM rets_property";
        const conditions = [];
        const values = [];

        function handleNum(input, condition){
            if(!(typeof input === 'number')){
                res.status(400).send(`${condition} must be a valid number!`)
            }
            if(!(Number.isFinite(input))){
                res.status(400).send(`${condition} must be a finite number!`)
            }
            values.push(input);
        };

        if(req.query.city){
            conditions.push('LOWER(TRIM(L_City)) = LOWER(TRIM(?))')
            values.push(req.query.city)
        }

        if(req.query.zipcode){
            conditions.push('L_Zip = ?')
            handleNum(Number(req.query.zipcode), 'zipCode')
        }

        if(req.query.minPrice){
            conditions.push('L_SystemPrice >= ?')
            handleNum(Number(req.query.minPrice), 'minPrice');
        }

        if(req.query.maxPrice){
            conditions.push('L_SystemPrice <= ?')
            handleNum(Number(req.query.maxPrice), 'maxPrice');
        }

        if(req.query.beds){
            conditions.push('L_Keyword2 = ?')
            handleNum(Number(req.query.beds), 'beds');
        }

        if(req.query.baths){
            conditions.push('LM_Dec_3 = ?')
            handleNum(Number(req.query.baths), 'baths');
        }

        if (conditions.length !== 0){
            sqlQuery += ' WHERE ' + conditions.join(' AND ');
        }

        sqlQuery += ' ORDER BY id LIMIT ? OFFSET ?';
        let limit = 20;
        let offset = 0;

        if(req.query.limit){
            limit = Number(req.query.limit);
            handleNum(limit, 'limit');
        }
        else values.push(limit);

        if(req.query.offset){
            offset = Number(req.query.offset);
            handleNum(offset, 'offset');
        }
        else values.push(offset); 

        console.log("query:", sqlQuery)
        console.log("values:", values)
        const [results] = await pool.query(
            sqlQuery,values
        )
        
        res.json({
            total: results.length,
            listings: results
        });
    }
    catch (err){
        console.error(err);
        res.status(500).send('Error')
    }
    
    
})

propertiesRouter.get('/test', (req,res) => {
    res.json({
        limit: req.query.limit,
        offset: req.query.offset
    });
})

export default propertiesRouter;