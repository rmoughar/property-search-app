import { useState, useEffect } from "react";
import { fetchFilteredProperties} from "../api/client";
import PropertyFilters from "../components/PropertyFilters";
import { useRef } from "react";
import './ListingsPage.css'
import Pagination from "../components/Pagination";
import PropertyGrid from "../components/PropertyGrid";
import PropertyListControls from "../components/PropertyListControls";
import usePagination from "../hooks/usePagination";

function ListingsPage() {
  const [properties, setProperties] = useState({results: []});
  
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

  function handleSearch(tempFilters){
    setFilters(tempFilters);
    setSort('');
    changeCurrentPage(1);
  } 

  const [sort, setSort] = useState('');

  const {
    pagination,
    totalPages,
    offset,
    changeCurrentPage,
    changeItemsPerPage
  } = usePagination(properties.total);

  const controller = useRef(null);
  useEffect(() => {

    if(controller.current != null){
      controller.current.abort();
    }

    controller.current = new AbortController();

    async function loadProperties(){
      try{
        setLoading(true);
        
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
    <div className="listings-page">
      <PropertyFilters filters={filters} setFilters={setFilters} onSearch={handleSearch}></PropertyFilters>
     
      
      {loading ? (
        <div className="info-message">loading properties...</div>
      ) : error ? (
        <>
          {console.log('error:',error)}
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


      {totalPages > 1 && (
        <Pagination currentPage={pagination.currentPage} totalPages={totalPages} changeCurrentPage={changeCurrentPage}></Pagination>
      )}
      
    </div>
  )
}

export default ListingsPage;