import { useState } from 'react';
import { fetchNaturalFilters } from '../api/client';

function AiSearch( {filters, onSearch} ) {
    const [tempFilters, setTempFilters] = useState(filters);
    const [query, setQuery] = useState('');

    async function getFilters(){
        try{
            const result = await fetchNaturalFilters(query);
            setTempFilters(result.filters)
        }catch(err){
            console.error(err);
        }

    }

    return (
        <div>
            <form
            className='ai-search'
            onSubmit={(e) => {
                e.preventDefault();
                getFilters();
                onSearch(tempFilters);
            }}>

                <input
                type='text'
                placeholder='What kind of property are you looking for?'
                value={query}
                onChange={(e) => setQuery(e.target.value)}>
                </input>

                <button type='submit'>Search</button>
            </form>
        </div>
    )
}

export default AiSearch;

{/* const result = await fetchNatural(testinput);
        setTest(result.body)*/}