import { useState } from "react";
import './PropertyCard.css'

function PropertyCard( {property} ){
  const [imageError, setImageError] = useState(false);
  let photos;

  try{
    if(property.L_Photos === ''){
      photos = []
    }else{
      photos = JSON.parse(property.L_Photos)
    }
  }catch(error){
    console.error("Invalid JSON:", error);
    photos = []
  }

  const image = photos[0];

  return(
    <li className='property-card'>

      {image && !imageError ? (
        <img src={image} 
        alt={property.L_Address}
        onError={() => setImageError(true)}/>
      ) : (
        <div className="noImage">No Image Available</div>
      )}

      <div className="property-info">
        <div className="price">${property.L_SystemPrice.toLocaleString()}</div>
        <div className="details">
          <span><b>{property.L_Keyword2}</b> Bed</span>
          <span> | </span>
          <span><b>{property.LM_Dec_3}</b> Ba</span>
          <span> | </span>
          <span><b>{property.LM_Int2_3.toLocaleString()}</b> sqft</span>
        </div>

        <div className="location">
          <span>{property.L_Address}, </span>
          <span>{property.L_City}, {property.L_State}, {property.L_Zip}</span>
        </div>
        
      </div>
    </li>
  )
}

export default PropertyCard;