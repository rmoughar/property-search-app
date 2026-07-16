function PropertyCard( {property} ){
  let photos;

  try{
    photos = JSON.parse(property.L_Photos ?? "[]")
  }catch(error){
    console.error("Invalid JSON:", error);
    photos = []
  }

  const image = photos[0];

  return(
    <li className='gridItem'>

      {image ? (
        <img src={image} alt={property.L_Address}/>
      ) : (
        <div>No Image Available</div>
      )}

      <span>${property.L_SystemPrice.toLocaleString()}</span>
      <span>{property.L_Address}</span>
      <span>{property.L_City}, {property.L_State}</span>
      <span>{property.L_Keyword2} Beds</span>
      <span>{property.LM_Dec_3} Baths</span>
      <span>{property.LM_Int2_3} SQFT</span>
      
    </li>
  )
}

export default PropertyCard;