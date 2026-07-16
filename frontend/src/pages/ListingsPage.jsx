import { useState, useEffect } from "react";
import { fetchProperties } from "../api/client";
import PropertyCard from "../components/PropertyCard";

function ListingsPage() {
  const [properties, setProperties] = useState({results: []});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function load(){
      try{
        const data = await fetchProperties()
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
      <span>Showing {properties.limit} of {properties.total} properties</span>
      <div className='grid'>
        {properties.results.map(property =>
          <PropertyCard key={property.id} property={property}></PropertyCard>
        )}
      </div>
    </>
  )
}

export default ListingsPage;