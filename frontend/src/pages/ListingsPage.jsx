import { useState, useEffect } from "react";
import { fetchFilteredProperties} from "../api/client";
import PropertyCard from "../components/PropertyCard";
import PropertyFilters from "../components/PropertyFilters";



function ListingsPage() {
  const [properties, setProperties] = useState({results: []});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({city: '', zipcode: '', minPrice: '', maxPrice: '', beds: '', baths: ''});

  async function handleSearch(){
    try{
      setLoading(true);
      const data = await fetchFilteredProperties(filters);
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

  if(loading)return <div className="info-message">loading properties...</div>
  if(error) return <div className="info-message">{error.message}</div>

  return(
    <>
      <PropertyFilters filters={filters} setFilters={setFilters} onSearch={handleSearch}></PropertyFilters>
      
      <h2 className="property-count">Showing {properties.results.length} of {properties.total} properties</h2>
      
      {properties.total === 0 ? (
        <div className="info-message">No properties found</div>
      ): (
        <div className='properties-grid'>
          {properties.results.map(property =>
            <PropertyCard key={property.id} property={property}></PropertyCard>
          )}
      </div>
      )}
    </>
  )
}

export default ListingsPage;