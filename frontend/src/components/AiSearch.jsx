import { useEffect, useState } from 'react';
import { fetchNaturalFilters } from '../api/client';
import './AiSearch.css'

function AiSearch( {filters, onSearch} ) {
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false)
    const [error, setError] = useState(null);

    async function searchWithAI(){
        try{
            setLoading(true);
            setSearched(false)
            const result = await fetchNaturalFilters(query);
            onSearch(result.filters)
            setSearched(true)
        }catch(error){
            console.error(error);
            setError(error);
        }finally{
            setLoading(false)
        }

    }

    useEffect(() => {
        const isEmpty = Object.values(filters).every(value => value === '');

        //This effect intentionally resets the AI search when the parent clears filters
        //State is loacal to this component, so it can't be derived directly from filters
        if (isEmpty) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setQuery('');
            setSearched(false);
        }
        
    }, [filters]);

    return (
        <div
        className='ai-search-container'>
            <form
            className='ai-search'
            onSubmit={(e) => {
                e.preventDefault();
                searchWithAI();
            }}>

                <div className='input-container'>
                    <input
                        className='ai-search-input'
                        disabled={loading}
                        type='text'
                        placeholder='What kind of property are you looking for?'
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}>
                    </input>

                    {searched ? (
                        <div className='completed-search'>Filters Applied ✔</div>
                    ) : error ?(
                        <div className='failed-search'>Couldn't Apply Filters, Try Again ❌</div>
                    ) : (
                        <></>
                    )}
                    
                </div>

                <button
                className='search-button' 
                disabled={loading}
                type='submit'>{loading ? 'Thinking...' : 'Search'}</button>
            </form>
        </div>
    )
}

export default AiSearch;