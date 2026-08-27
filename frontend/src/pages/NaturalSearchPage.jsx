import { fetchFilteredProperties } from "../api/client";
import PropertyGrid from "../components/PropertyGrid";
import usePagination from "../hooks/usePagination";
import PropertyFilters from "../components/PropertyFilters";
import PropertyListControls from "../components/PropertyListControls";
import Pagination from "../components/Pagination";
import { useEffect, useRef, useState } from "react";
import AiSearch from "../components/AiSearch";


function NaturalSearchPage() {
    const [properties, setProperties] = useState({total: 0, results: []});

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [filters, setFilters] = useState({
        city: '', 
        zipcode: '', 
        minPrice: '', 
        maxPrice: '', 
        beds: '', 
        baths: '',
        limit: '20',
        offset: '0'
    });


    const [sort, setSort] = useState('');

    const {
        pagination,
        totalPages,
        offset,
        changeCurrentPage,
        changeItemsPerPage
      } = usePagination(properties.total);

    // Apply new filters and reset the results to the first page
    function handleSearch(tempFilters){
        setFilters(tempFilters);
        setSort('');
        changeCurrentPage(1);
    } 

    // Abort the previous request when a new search, pagination change, or sort occurs
    const controller = useRef(null);

    // Reload properties whenever the search filters, pagination, or sorting change
    useEffect(() => {
    if(controller.current != null){
        controller.current.abort();
    }

    controller.current = new AbortController();

    async function loadProperties(){
        try{
        setLoading(true);
        
        // Build the API request using the current filters, pagination, and sorting
        const params = {...filters, offset: offset, limit: pagination.itemsPerPage, sort: sort};

        const data = await fetchFilteredProperties(params, controller.current.signal);
        setProperties(data);

        setError(null)
        setLoading(false);
        } catch(error){
        if(error.name === "AbortError") return;

        console.error(error.message);
        setError(error);
        setLoading(false);
        }
    };

    loadProperties();
    },[filters, pagination.currentPage, pagination.itemsPerPage, offset, sort])

    return(
        <div className="search-page">

            {/* Natural-language search and manual filters share the same property results */}
            <AiSearch filters={filters} onSearch={handleSearch}></AiSearch>
            
            <PropertyFilters filters={filters} setFilters={setFilters} onSearch={handleSearch}></PropertyFilters>
            
            
            {loading ? (
                <div className="info-message">loading properties...</div>
            ) : error ? (
                <>
                {console.error('error:',error)}
                <div className="info-message">{error.message}</div>
                </>
            ) : properties.total === 0 ? (
                <div className="info-message">No properties found</div>
            ) : (
                <div>
                    <PropertyListControls 
                        offset={offset} 
                        pagination={pagination} 
                        itemsPerPage={pagination.itemsPerPage}
                        total={properties.total} 
                        changeCurrentPage={changeCurrentPage} 
                        changeItemsPerPage={changeItemsPerPage} 
                        sort={sort} 
                        setSort={setSort}>
                    </PropertyListControls>
                    <PropertyGrid properties={properties.results}></PropertyGrid>
                </div>
            )}


            <Pagination currentPage={pagination.currentPage} totalPages={totalPages} changeCurrentPage={changeCurrentPage}></Pagination>
      
        </div>
    )
}

export default NaturalSearchPage;