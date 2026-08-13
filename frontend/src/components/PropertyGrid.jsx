import { Link } from "react-router";
import PropertyCard from "./PropertyCard";
import "./PropertyGrid.css"
function PropertyGrid({properties}){
    return(
        <div 
            className='properties-grid'>  
                {properties.map(property =>
                    <Link key={property.id} to={`/property/${property.L_ListingID}`}>
                        <PropertyCard property={property}></PropertyCard>
                    </Link>
                )}
        </div>
    )
}

export default PropertyGrid;