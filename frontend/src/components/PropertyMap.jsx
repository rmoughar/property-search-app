import "./PropertyMap.css";

function PropertyMap({LAT, LNG}){
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    const url = `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${LAT},${LNG}&zoom=15`
    return(
        <div className="map-container">
            <iframe 
            className="property-map"
            src={url} 
            title="Google Maps Preview"
            loading="lazy"></iframe>
        </div>
        
    )
}

export default PropertyMap;