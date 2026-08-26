import express from 'express';
import pool from '../config/pool.js';
import e from 'express';
import { RestartProcess } from 'concurrently';
import { isValidNumber } from '../utils/validation.js';


const propertiesRouter = express.Router();

let sqlQuery = "SELECT * FROM rets_property"

function handleFiltering(req, res){
    const conditions = [];
    const values = [];
    let limit = 20;
    let offset = 0;

    //Confirms param validity and adds to values
    function handleNum(input, condition){
        if(!(typeof input === 'number')){
            return `${condition} must be a valid number!`
        }
        if(!(Number.isFinite(input))){
            return `${condition} must be a finite number!`
        }

        values.push(input);
        return null;
    };
    
    if(req.query.city){
            conditions.push('LOWER(TRIM(L_City)) = LOWER(TRIM(?))')
            values.push(req.query.city)
        }

    if(req.query.zipcode){
        conditions.push('L_Zip = ?')
        const error = handleNum(Number(req.query.zipcode), 'zipCode')

        if(error) return {error};
    }

    if(req.query.minPrice){
        conditions.push('L_SystemPrice >= ?')
        const error = handleNum(Number(req.query.minPrice), 'minPrice');
        
        if(error) return {error};
    }

    if(req.query.maxPrice){
        conditions.push('L_SystemPrice <= ?')
        const error = handleNum(Number(req.query.maxPrice), 'maxPrice');
        if(error) return {error};
    }

    if(req.query.beds){
        if(req.query.beds == 5){
            conditions.push('L_Keyword2 >= ?')
        }
        else{
            conditions.push('L_Keyword2 = ?')
        }
        
        const error = handleNum(Number(req.query.beds), 'beds');
        if(error) return {error};
    }

    if(req.query.baths){
        if(req.query.baths == 5){
            conditions.push('LM_Dec_3 >= ?')
        }
        else{
            conditions.push('LM_Dec_3 = ?')
        }

        const error = handleNum(Number(req.query.baths), 'baths');
        if(error) return {error};
    }

    if(req.query.limit){
        limit = Number(req.query.limit);
        if(limit <= 0){
            return {error: `Limit must be greater than 0!`};
        }
        const error = handleNum(limit, 'limit');
        if(error) return {error};
    }
    else values.push(limit);

    if(req.query.offset){
        offset = Number(req.query.offset);
        const error = handleNum(offset, 'offset');
        if(error) return {error};
    }
    else values.push(offset); 

    

    return [conditions, values, limit, offset];
};

function handleSorting(req, res){
    //add order by for sorting to api call
    if(req.query.sort){
        const sortColumns = {
            date: "ListingContractDate",
            price: "L_SystemPrice",
            beds: "L_Keyword2",
            sqft: "LM_Int2_3"
        };

        const [field, direction] = req.query.sort.split(":");
        const column = sortColumns[field];

        const validDirections = ["ASC", "DESC"];

        if(!column || !validDirections.includes(direction)){
            return res.status(400).send('Must use acceptable sorting parameters');
        }

        return [column, direction];
    }
    else{
        return ['','']
    }

    
}

propertiesRouter.get('/', async (req,res) => {
    try{
        let sqlQuery = "SELECT * FROM rets_property";
        let countQuery = "SELECT COUNT(*) FROM rets_property";
        
        const filtering = handleFiltering(req, res);

        if(filtering.error) return res.status(400).send(filtering.error);

        const [conditions, values, limit, offset] = filtering;

        if (conditions.length !== 0){
            sqlQuery += ' WHERE ' + conditions.join(' AND ');
            countQuery += ' WHERE ' + conditions.join(' AND ');
        }

        const [countRows] = await pool.query(
            countQuery,values
        )

        if(req.query.sort){
            const [column, direction] = handleSorting(req, res);
            sqlQuery += ` ORDER BY ${column} ${direction}`;
        }

        sqlQuery += ' LIMIT ? OFFSET ?';

        //Uses parameterized query to defend against SQLi
        const [results] = await pool.query(
            sqlQuery,values
        )
        
        res.json({
            total: countRows[0]["COUNT(*)"],
            limit: limit,
            offset: offset,
            results: results
        });
    }
    catch (err){
        console.error(err);
        res.status(500).send('Error')
    }
    
})

propertiesRouter.get('/:id/openhouses', async (req,res) => {
    try{
        const sqlQuery = " select * from rets_openhouse where L_ListingID = ? ORDER BY OpenHouseDate, OH_StartTime;";
        const validQuery = 'SELECT 1 FROM rets_property WHERE L_ListingID = ?';
        const id = req.params.id;

        //Confirms param validity
        if(!isValidNumber(Number(id))){
            return res.status(400).send('id must be a valid number!')
        }

        if(Number(id) <= 0){
            return res.status(400).send('id must be a positive number!');
        }

        const [property] = await pool.query(
            validQuery,[id]
        );

        if (property.length === 0) {
            return res.status(404).send("Property ID not recognized!");
        }

        const [results] = await pool.query(
            sqlQuery,[id]
        );

        
        res.json({
            Openhouses: results
        });
    }
    catch (err){
        console.error(err);
        res.status(500).send('Error')
    }
})

propertiesRouter.get('/:id', async (req,res) => {
    try{
        let sqlQuery = " select * from rets_property where L_ListingID = ?;";
        let id = req.params.id;

        //Confirms param validity
        if(!isValidNumber(Number(id))){
            return res.status(400).send('id must be a valid number!');
        }

        //Uses parameterized query to defend against SQLi
        const [results] = await pool.query(
            sqlQuery,id
        )

        if (results.length === 0){
            return res.status(404).send('Property ID not recognized!')
        }
        
        res.json({
            Property: results[0]
        });
    }
    catch (err){
        console.error(err);
        res.status(500).send('Error')
    }
})

propertiesRouter.get('/ids/:ids', async (req,res) => {
    try{
        //Pull and confirm ids validity
        const ids = req.params.ids.split(',');
        if (ids.some(id => !isValidNumber(Number(id)))) {
            return res.status(400).send("IDs must be valid numbers!");
        }

        const marks = ids.map(() => '?').join(',');

        let sqlQuery = ` 
            SELECT * 
            FROM rets_property 
            WHERE L_ListingID IN (${marks})
        `;
        
        const [conditions, values, limit, offset] = handleFiltering(req, res);

        //construct query
        if (conditions.length !== 0){
            sqlQuery += '   AND '
            sqlQuery += conditions.join(' AND ');
        }

        if(req.query.sort){
            const [column, direction] = handleSorting(req, res);
            sqlQuery += ` ORDER BY ${column} ${direction}`;
        }

        //Uses parameterized query to defend against SQLi
        const [results] = await pool.query(
            sqlQuery,[...ids, ...values]
        )

        if (results.length === 0){
            return res.status(404).send('No properties found!')
        }
        
        res.json({
            total: ids.length,
            limit: limit,
            offset: offset,
            Properties: results
        });

    }
    catch (err){
        console.error(err);
        res.status(500).send('Error')
    }
})



export default propertiesRouter;