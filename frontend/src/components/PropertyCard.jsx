import { useContext } from 'react';
import './PropertyCard.css'
import PropertyImageCarousel from "./PropertyImageCarousel";
import { FavoritesContext } from '../utils/FavoritesContext';
import PropTypes from 'prop-types';

function PropertyCard( {property} ){
  const {isFavorite, toggleFavorite} = useContext(FavoritesContext);

  function loadPhotos(){
        try{
            return property.ValidatedPhotos ? 
            JSON.parse(property.ValidatedPhotos) : 
            property.L_Photos ?
            JSON.parse(property.L_Photos) : 
            []
        }catch(error){
            console.error("Invalid JSON:", error);
            return []
        }
    }
    
    const photos = loadPhotos();

  return(
    <li className='property-card'>

      <div className='carousel-box'>
        <PropertyImageCarousel images={photos}></PropertyImageCarousel>

        <button
        className={`card-favorite-button ${isFavorite(property.L_ListingID) ? "card-favorited" : ""}`}
        onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleFavorite(property.L_ListingID);
        }}>❤︎⁠</button>
      </div>

      <div className="property-info">
        <div className="price">${property.L_SystemPrice != null ? property.L_SystemPrice.toLocaleString() : "N/A"}</div>
        <div className="details">
          <span><b>{property.L_Keyword2}</b> Bed</span>
          <span> | </span>
          <span><b>{property.LM_Dec_3}</b> Ba</span>
          <span> | </span>
          <span><b>{property.LM_Int2_3 != null ? property.LM_Int2_3.toLocaleString() : "N/A"}</b> sqft</span>
        </div>

        <div className="location">
          <span>{property.L_Address}, </span>
          <span>{property.L_City}, {property.L_State}, {property.L_Zip}</span>
        </div>
        
      </div>
    </li>
  )
}

PropertyCard.PropTypes = {
    property: PropTypes.shape({
        L_ListingID: PropTypes.string,
        L_SystemPrice: PropTypes.number,
        L_Keyword2: PropTypes.number,
        LM_Dec_3: PropTypes.string,
        LM_Int2_3: PropTypes.number,
        L_Address: PropTypes.string,
        L_City: PropTypes.string,
        L_State: PropTypes.string,
        L_Zip: PropTypes.string,
        ValidatedPhotos: PropTypes.string,
        L_Photos: PropTypes.string,
    }).isRequired,
};

export default PropertyCard;