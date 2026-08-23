import express from 'express';
import pool from '../config/pool.js';
import { OpenRouter } from '@openrouter/sdk'

const searchRouter = express.Router();



function outputValidation(output){
    let filters = {
    city: '', 
    zipcode: '', 
    minPrice: '', 
    maxPrice: '', 
    beds: '', 
    baths: '',
    limit: '20',
    offset: '0'
  };

    try{
        if(!output){
            return filters;
        }else{
            filters = JSON.parse(output);
        }
    }catch(error){
        console.error('Invalid JSON:', error);
        return filters;
    }

    if(typeof filters !== 'object' || filters === null || Array.isArray(filters)){
        throw new Error('AI returned an invalid filter object');
    }

    const validatedFilters = {};

    //City
    if(typeof filters.city === "string"){
        validatedFilters.city = filters.city.trim();
    } else{
        validatedFilters.city = '';
    }

    //Zipcode
    if(typeof filters.zipcode === "string"){
        validatedFilters.zipcode = filters.zipcode.trim();
    } else{
        validatedFilters.zipcode = '';
    }

    //Prices
    if(isValidNumber(filters.minPrice)){
        validatedFilters.minPrice = Number(filters.minPrice);
    }else{
        validatedFilters.minPrice = '';
    }

    if(isValidNumber(filters.maxPrice)){
        validatedFilters.maxPrice = Number(filters.maxPrice);
    }else{
        validatedFilters.maxPrice = '';
    }

    //Beds
    if(isPositiveInteger(filters.beds)){
        validatedFilters.beds = Number(filters.beds);
    }else{
        validatedFilters.beds = '';
    }

    //Baths
    if(isPositiveInteger(filters.baths)){
        validatedFilters.baths = Number(filters.baths);
    }else{
        validatedFilters.baths = '';
    }

    //Validation Funcs
    function isValidNumber(value){
        return value !== "" &&
               value !== null &&
               value !== undefined &&
               !isNaN(Number(value)) &&
               Number(value) > 0;
    }

    function isPositiveInteger(value){
        return isValidNumber(value) && Number.isInteger(Number(value));
    }

    return validatedFilters;
}

searchRouter.post('/natural', async (req,res) => {
    const userQuery = req.body.query;
    const systemPrompt = `
    You are a property search assistant. When I give you a user's query, extract these specific fields and return ONLY JSON in this exact format:
    {city, zipcode, minPrice, maxPrice, beds, baths}. If any of these fields are empty or unadressed, return '' in the JSON instead to indicate emptiness.
    Furthermore, only extract information that can be unambiguously inferred and do NOT invent numerical values. Again, if a filter cannot be determined, return ''.
    For example, if the user asks for a "cheap house" we can not infer what their metric of cheap is and therefore you must return ''.
    Extract the city as a standard full name city when applicable. Do NOT abbreviate city names. For example, if given "LA" interpret that as "Los Angeles". Do not invent a city if the user-provided city is ambiguous, instead return ''.`
    
    const client = new OpenRouter({apiKey:process.env.OPENROUTER_API_KEY})

    try{
        const message = await client.chat.send({
            chatRequest: {
                model:'cohere/north-mini-code:free',
                max_completion_tokens: 512,
                system: systemPrompt,
                messages: [
                    {role:'system', content:systemPrompt},
                    {role:'user', content:userQuery}
                ]
            }
            

        })

        const extracted = message.choices[0].message.content;
        const validatedFilters = outputValidation(extracted);

        res.json({
            filters:validatedFilters
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).send('Failed to process natural language search');
    }
})

export default searchRouter;