import { Link, useParams } from "react-router";
import { fetchPropertyById } from "../api/client";
import { useEffect, useState } from "react";
import PropertyCard from "../components/PropertyCard";

function PropertyDetailPage() {
    const [property, setProperty] = useState({Property: []});
    const params = useParams();

    useEffect(() => {
        async function loadProperty(){
            try{
                const data = await fetchPropertyById(params.id);
                setProperty(data.Property);
            } catch(error){
                console.error(error.message);
            }
        };
        loadProperty();
    }, [params.id]);
    console.log('property:', property);
    

    return(
        <div>
            <PropertyCard property={property}></PropertyCard>
            <Link to={'/'}>Back</Link>
        </div>
    )
}

export default PropertyDetailPage;