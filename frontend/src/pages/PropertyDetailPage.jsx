import { Link, useParams } from "react-router";
import { fetchOpenHouseById, fetchPropertyById } from "../api/client";
import { useContext, useEffect, useState } from "react";
import './PropertyDetailPage.css'
import PropertyImageGallery from "../components/PropertyImageGallery";
import PropertyMap from "../components/PropertyMap";
import PropertyOpenHouse from "../components/PropertyOpenHouse";
import { FavoritesContext } from "../context/FavoritesContext";

function PropertyDetailPage() {
    const [property, setProperty] = useState(null);
    const [invalidProperty, setInvalidProperty] = useState(false);
    const params = useParams();
    const [openhouses, setOpenHouses] = useState([]);
    const {isFavorite, toggleFavorite} = useContext(FavoritesContext);
    const [loading, setLoading] = useState(true);

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
    
    useEffect(() => {
        async function loadData(){
            try{
                setLoading(true);
                setInvalidProperty(false);

                const propertyData = await fetchPropertyById(params.id);
                setProperty(propertyData.Property);

                const openHouseData = await fetchOpenHouseById(propertyData.Property.L_ListingID);
                setOpenHouses(openHouseData.Openhouses);

            } catch(error){
                setInvalidProperty(true);
                console.error(error.message);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [params.id]);    

    function validateDetail(detail){
        return detail != null ? detail : "N/A"
    };

    if(loading){
        return(
            <div className="info-message">Loading property...</div>
        )
    }

    const propertyDetails = [
        {label: "Property Type", value: property.L_Type_},
        {label: "Status", value: property.L_Status},
        {label: "Architectural", value: property.ArchitecturalStyle },
        {label: "Stories", value: property.StoriesTotal},
        {label: "Lot Size", value: property.LotSizeAcres},
        {label: "Flooring", value: property.Flooring},
        {label: "Garage", value: property.GarageYN},
        {label: "Parking Spaces", value: property.OpenParkingSpaces},
        {label: "Fireplace", value: property.FireplaceYN},
        {label: "Pool", value: property.PoolFeatures},
        {label: "Spa", value: property.SpaFeatures},
        {label: "View", value: property.View},
        {label: "Interior Features", value: property.InteriorFeatures},
        {label: "Appliances", value: property.Appliances},
        {label: "Heating", value: property.Heating},
        {label: "Cooling", value: property.Cooling},
    ]

    const listingDetails = [
        {label: "MLS ID", value: property.L_ListingID},
        {label: "Listed On", value: property.L_ListingContractDate},
        {label: "Last Price Change", value: property.PriceChangeTimestamp},
        {label: "Listing Agent", value: property.ListAgentFullName},
        {label: "Brokerage", value: property.L01_OrganizationName},
    ]

    if(invalidProperty){
        return (
            <div className="error-page">
                <div className="error-message">Property Not Found</div>
                
                <p>Sorry, we couldn't find the property you're looking for</p>
                
                <div className="link-box">
                    <Link className='link' to={'/'}>Back to Listings</Link>
                </div>
            </div>
        )
    }



    const photos = loadPhotos();

    return(
        <div className="detail-page">

            <div className="link-box">
                <Link className='link' to={'/'}>Back to Listings</Link>
            </div>

            <div className="hero">

                <div className="gallery-box">
                    <PropertyImageGallery images={photos}></PropertyImageGallery>

                    <button
                        className={`detail-favorite-button ${isFavorite(property.L_ListingID) ? "detail-favorited" : ""}`}
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            toggleFavorite(property.L_ListingID);
                        }}>❤︎⁠
                    </button>

                </div>
                
                <div className="hero-details">
                    <div className="hero-price">${property.L_SystemPrice != null ? property.L_SystemPrice.toLocaleString() : "N/A"}</div>
                    
                    <div className="hero-location-details">
                        <div className="hero-address">{property.L_Address}</div>
                        <div className="hero-location">{property.L_City}, {property.L_State}, {property.L_Zip}</div>
                    </div>
                    
                    <div className="hero-house-details">
                        <div><b>{validateDetail(property.L_Keyword2)}</b> Bed</div>
                        <div><b>{validateDetail(property.LM_Dec_3)}</b> Ba</div>
                        <div><b>{property.LM_Int2_3 != null ? property.LM_Int2_3.toLocaleString() : "N/A"}</b> sqft</div>
                        <div><b>{validateDetail(property.YearBuilt)}</b> year built</div>

                    </div>

                    
                </div>

            </div>

            <div className="description-box">
                <div className="description-title"><b>Description</b></div>
                <div className="description">{property.L_Remarks}</div>
            </div>

            <div className="details-dropdowns">
                <details>
                    <summary>Property Details</summary>
                    <div className="property-detail-grid">
                        {propertyDetails.map(detail =>
                            <div className="property-detail-row" key={detail.label}>
                                <b>{validateDetail(detail.label)}:</b>
                                <span>{validateDetail(detail.value)}</span>
                            </div>
                        )}
                    </div>
                </details>

                <details>
                    <summary>Listing Details</summary>
                    <div className="listing-detail-grid">
                        {listingDetails.map(detail =>
                            <div className="listing-detail-row" key={detail.label}>
                                <b>{validateDetail(detail.label)}:</b>
                                <span>{validateDetail(detail.value)}</span>
                            </div>
                        )}
                    </div>
                </details>
            </div>

            <h2>Map:</h2>
            <PropertyMap LAT={property.LMD_MP_Latitude} LNG={property.LMD_MP_Longitude}></PropertyMap>

            <h2>Openhouses:</h2>
            {openhouses.length === 0 ? (
                <div className="no-open-house">No open houses scheduled</div>
            ) : (
            <PropertyOpenHouse openhouses={openhouses}></PropertyOpenHouse>
            )}

        </div>
    )
}

export default PropertyDetailPage;