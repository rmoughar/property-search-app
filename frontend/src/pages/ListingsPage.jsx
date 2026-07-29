import { useState, useEffect } from "react";
import { fetchFilteredProperties} from "../api/client";
import PropertyCard from "../components/PropertyCard";
import PropertyFilters from "../components/PropertyFilters";
import { useRef } from "react";
import './ListingsPage.css'
import Pagination from "../components/Pagination";

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

  const [pagination, setPagination] = useState({currentPage: 1, itemsPerPage: 20});
  const totalPages = Math.ceil(properties.total / pagination.itemsPerPage);
  

  const controller = useRef(null);

  function changeCurrentPage(page){
    setPagination(prev => ({...prev, currentPage:page}))
  }

  function handleSearch(tempFilters){
    setFilters(tempFilters);
    changeCurrentPage(1);
  } 

  useEffect(() => {

    if(controller.current != null){
      controller.current.abort();
    }

    controller.current = new AbortController();

    async function loadProperties(){
      try{
        setLoading(true);

        const offset = (pagination.currentPage - 1) * pagination.itemsPerPage;
        const params = {...filters, offset: offset, limit: pagination.itemsPerPage};

        const data = await fetchFilteredProperties(params, controller.current.signal);
        setProperties(data);

        setError(null)
        setLoading(false);
      } catch(error){
        if(error.name === "AbortError") return;

        console.error(error.message);
        setError(error)
        setLoading(false);
      }
    };

    loadProperties();
  },[filters, pagination.currentPage, pagination.itemsPerPage])

  return(
    <>
      <PropertyFilters filters={filters} setFilters={setFilters} onSearch={handleSearch}></PropertyFilters>
      
      <h2 className="property-count">Showing {properties.results.length} of {properties.total} properties</h2>
      
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
        <div className='properties-grid'>
          {properties.results.map(property =>
            <PropertyCard key={property.id} property={property}></PropertyCard>
          )}
        </div>
      )}

      <Pagination currentPage={pagination.currentPage} totalPages={totalPages} changeCurrentPage={changeCurrentPage}></Pagination>
    </>
  )
}

export default ListingsPage;