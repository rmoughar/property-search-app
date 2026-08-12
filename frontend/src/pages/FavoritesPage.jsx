import { useContext, useEffect, useState } from "react";
import { FavoritesContext } from "../context/FavoritesContext";
import { fetchMultipleProperties } from "../api/client";
import { Link } from "react-router";
import PropertyCard from "../components/PropertyCard";


function FavoritesPage() {
    const {favorites} = useContext(FavoritesContext);
    const [properties, setProperties] = useState([]);

    useEffect(() => {
            async function loadProperties(){
                if(favorites.length === 0){
                    setProperties([]);
                    return;
                }
                try{
                    const propertyData = await fetchMultipleProperties(favorites);
                    setProperties(propertyData.Properties);
    
                } catch(error){
                    console.error(error.message);
                } 
            };
            loadProperties();
        }, [favorites]);    

    return(
        <div>
            <div className='properties-grid'>  
                {properties.map(property =>
                    <Link key={property.id} to={`/property/${property.L_ListingID}`}>
                        <PropertyCard property={property}></PropertyCard>
                    </Link>
                )}
          </div>
        </div>
    )
}

export default FavoritesPage;