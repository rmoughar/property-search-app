import { useState } from "react";
import './PropertyImageCarousel.css'

function PropertyImageCarousel({images}) {
    const [currentImage, setCurrentImage] = useState(0);
    const [imageError, setImageError] = useState(null)

    // Show the fallback message if the current image fails to load
    const image = images[currentImage]

    return(
        <div className="carousel">
            {images.length > 1 ? (
                <>
                    <button
                        className="left-arrow"
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setImageError(false);
                            currentImage === 0 ? setCurrentImage(images.length - 1) : setCurrentImage(prev => prev - 1);
                        }}> {'<'}
                    </button>

                    <button 
                        className="right-arrow"
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setImageError(false);
                            currentImage === images.length - 1 ? setCurrentImage(0) : setCurrentImage(prev => prev + 1);
                        }}>{'>'}
                    </button>
                </>
            ) : (<></>)}

            {images.length !== 0 ? (
                <div
                    className="counter">
                        {currentImage + 1} / {images.length}
                </div>
            ) : (<></>)}

            {/* // Display the current image when available and fall back if it fails to load */}
            {image && !imageError ? (
                <img
                    className="current-image"
                    src={image} 
                    onError={() => setImageError(true)}/>
            ) : (
                <div className="noImage">No Image Available</div>
            )}

        </div>
    )
}

export default PropertyImageCarousel;