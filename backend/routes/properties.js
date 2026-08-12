import express from 'express';
import pool from '../config/pool.js';
import e from 'express';


const propertiesRouter = express.Router();

let sqlQuery = "SELECT * FROM rets_property"

propertiesRouter.get('/', async (req,res) => {
    try{
        let sqlQuery = "SELECT * FROM rets_property";
        let countQuery = "SELECT COUNT(*) FROM rets_property";
        const conditions = [];
        const values = [];

        //Confirms param validity and adds to query
        function handleNum(input, condition){
            if(!(typeof input === 'number')){
                return res.status(400).send(`${condition} must be a valid number!`)
            }
            if(!(Number.isFinite(input))){
                return res.status(400).send(`${condition} must be a finite number!`)
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
            if(req.query.beds == 5){
                conditions.push('L_Keyword2 >= ?')
            }
            else{
                conditions.push('L_Keyword2 = ?')
            }
            
            handleNum(Number(req.query.beds), 'beds');
        }

        if(req.query.baths){
            if(req.query.baths == 5){
                conditions.push('LM_Dec_3 >= ?')
            }
            else{
                conditions.push('LM_Dec_3 = ?')
            }
            handleNum(Number(req.query.baths), 'baths');
        }

        if (conditions.length !== 0){
            sqlQuery += ' WHERE ' + conditions.join(' AND ');
            countQuery += ' WHERE ' + conditions.join(' AND ');
        }


        //console.log("count query:", countQuery);
        const [countRows] = await pool.query(
            countQuery,values
        )

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

            if(!column || !validDirections.includes(direction)) {
                return res.status(400).send('Must use acceptable sorting parameters');
            }

            sqlQuery += ` ORDER BY ${column} ${direction}`;
            
        }
        
        console.log('query:', sqlQuery);

        //Add limit and offset for pagination
        sqlQuery += ' LIMIT ? OFFSET ?';
        let limit = 20;
        let offset = 0;

        if(req.query.limit){
            limit = Number(req.query.limit);
            if(limit <= 0){
                return res.status(400).send(`Limit must be greater than 0!`);
            }
            handleNum(limit, 'limit');
        }
        else values.push(limit);

        if(req.query.offset){
            offset = Number(req.query.offset);
            handleNum(offset, 'offset');
        }
        else values.push(offset); 

        /*console.log("query:", sqlQuery);
        console.log("values:", values);*/

        //Uses parameterized query to defend against SQLi
        const [results] = await pool.query(
            sqlQuery,values
        )
        
        res.json({
            total: countRows[0]["COUNT(*)"],
            limit: req.query.limit ?? limit,
            offset: req.query.offset ?? offset,
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

        //Confirms param validity and adds to query
        function handleNum(input, condition){
            if(!(Number.isInteger(input))){
                return res.status(400).send(`${condition} must be a valid number!`);
            }
            if(!(Number.isFinite(input))){
                return res.status(400).send(`${condition} must be a finite number!`);
            }

            if(input <= 0){
                return res.status(400).send(`${condition} must be a positive number!`)
            }
        };

        handleNum(Number(id), 'id');

        /*console.log("query:", sqlQuery);
        console.log("id:", Number(id));*/

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
        function handleNum(input, condition){
            if(!(typeof input === 'number')){
                return res.status(400).send(`${condition} must be a valid number!`)
            }
            if(!(Number.isFinite(input))){
                return res.status(400).send(`${condition} must be a finite number!`)
            }
        };

        handleNum(Number(id), 'id');

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

        const ids = req.params.ids.split(',');
        //Confirms param validity
        if (ids.some(id => !Number.isFinite(Number(id)))) {
            return res.status(400).send("IDs must be valid numbers!");
        }

        const marks = ids.map(() => '?').join(',');

        let limit = 20;
        let offset = 0;

        if(req.query.offset){
            offset = Number(req.query.offset);
            handleNum(offset, 'offset');
        }

        if(req.query.limit){
            limit = Number(req.query.limit);
            if(limit <= 0){
                return res.status(400).send(`Limit must be greater than 0!`);
            }
            handleNum(limit, 'limit');
        }

        const sqlQuery = ` 
            SELECT * 
            FROM rets_property 
            WHERE L_ListingID IN (${marks})
            ORDER BY FIELD(L_ListingID, ${marks})
            LIMIT ?
            OFFSET ?
        `;

        //Uses parameterized query to defend against SQLi
        const [results] = await pool.query(
            sqlQuery,[...ids,...ids, limit, offset]
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