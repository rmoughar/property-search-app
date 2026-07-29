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
    baths: ''
  });

  const [pagination, setPagination] = useState({currentPage: 1, itemsPerPage: 20});
  
  const controller = useRef(null);

  async function handleSearch(){
    if(controller.current != null){
      controller.current.abort();
    }

    controller.current = new AbortController();

    try{
      setLoading(true);
      const data = await fetchFilteredProperties(filters, controller.current.signal);
      setProperties(data);
    } catch(error){
      console.error(error.message);
      setError(error)
    }finally{
      setLoading(false);
    }
  } 

  useEffect(() => {
    async function load(){
      try{
        const data = await fetchFilteredProperties(filters)
        setProperties(data)
      }catch(error){
        console.error(error.message);
        setError(error);
      } finally{
        setLoading(false);
      }
    }

    load();
  }, [])
  
  return(
    <>
      <PropertyFilters filters={filters} setFilters={setFilters} onSearch={handleSearch}></PropertyFilters>
      
      <h2 className="property-count">Showing {properties.results.length} of {properties.total} properties</h2>
      
      {loading ? (
        <div className="info-message">loading properties...</div>
      ) : error ? (
        <div className="info-message">{error.message}</div>
      ) : properties.total === 0 ? (
        <div className="info-message">No properties found</div>
      ) : (
        <div className='properties-grid'>
          {properties.results.map(property =>
            <PropertyCard key={property.id} property={property}></PropertyCard>
          )}
        </div>
      )}

      <Pagination></Pagination>
    </>
  )
}

export default ListingsPage;