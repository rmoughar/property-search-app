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

  if(loading)return <p>loading properties...</p>
  if(error) return <p>{error.message}</p>

  return(
    <>
      <span>Showing {properties.results.length} of {properties.total} properties</span>
      <section className="topBar">
        <PropertyFilters filters={filters} setFilters={setFilters} onSearch={handleSearch}></PropertyFilters>
      </section>
      
      {properties.total === 0 ? (
        <div>No properties found</div>
      ): (
        <div className='grid'>
          {properties.results.map(property =>
            <PropertyCard key={property.id} property={property}></PropertyCard>
          )}
      </div>
      )}
    </>
  )
}

export default ListingsPage;