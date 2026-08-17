import express from 'express';
import pool from '../config/pool.js';
import { Anthropic } from '@anthropic-ai/sdk';

const searchRouter = express.Router();

// searchRouter.post('/natural', async (req,res) => {
//     const userQuery = req.body.query;
//     // const client = new Anthropic({apikey:process.env.ANTHROPIC_API_KEY})
//     // const systemPrompt = `
//     // You are a property search assistant. When I give you a user's query, extract these specific fields and return ONLY JSON in this exact format:
//     // {city, zipcode, minPrice, maxPrice, beds, baths}. If any of these fields are empty or unadressed, return '' in the JSON instead to indicate emptiness.
//     // Furthermore, only extract information that can be unambiguously inferred and do NOT invent numerical values. Again, if a filter cannot be determined, return ''.
//     // For example, if the user asks for a "cheap house" we can not infer what their metric of cheap is and therefore you must return ''.`

    

//     // const message = await client.messages.create({
//     //     model:'claude-haiku-4-5-20251001',
//     //     max_tokens: 1024,
//     //     system: systemPrompt,
//     //     messages: [{role:'user', content:userQuery}]

//     // })

//     // const extracted = JSON.parse(message.content[0].text);

//     try{
//         const [results, fields] = await pool.query(
//             'SELECT 1'
//         );

//         res.json({
//             status: 'ok',
//             database: 'connected',
//             body:userQuery
//         });
//     }
//     catch (err) {
//         console.error(err.message);
//         res.status(500).send('Error');
//     }
// })

searchRouter.post('/natural', async (req,res) => {
    const userQuery = req.body.query;
    const systemPrompt = `
    You are a property search assistant. When I give you a user's query, extract these specific fields and return ONLY JSON in this exact format:
    {city, zipcode, minPrice, maxPrice, beds, baths}. If any of these fields are empty or unadressed, return '' in the JSON instead to indicate emptiness.
    Furthermore, only extract information that can be unambiguously inferred and do NOT invent numerical values. Again, if a filter cannot be determined, return ''.
    For example, if the user asks for a "cheap house" we can not infer what their metric of cheap is and therefore you must return ''.`
    
    const client = new Anthropic({apikey:process.env.ANTHROPIC_API_KEY})

    try{
        const message = await client.messages.create({
            model:'claude-haiku-4-5-20251001',
            max_tokens: 1024,
            system: systemPrompt,
            messages: [{role:'user', content:userQuery}]

        })

        const extracted = JSON.parse(message.content[0].text);
        console.log('message:', message);
        console.log('extracted:', extracted);
        
        res.json({
            filters:extracted
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).send('Failed to process natural language search');
    }
})

export default searchRouter;