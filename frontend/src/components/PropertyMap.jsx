function PropertyMap({LAT, LNG}){
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    const url = `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${LAT},${LNG}&zoom=15`
    return(
        <iframe src={url} title="Google Maps Preview"></iframe>
    )
}

export default PropertyMap;