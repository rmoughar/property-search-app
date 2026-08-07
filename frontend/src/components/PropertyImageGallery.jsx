import { useState } from "react";
import './PropertyImageGallery.css'

function PropertyImageGallery({images}) {
    const [currentImage, setCurrentImage] = useState(0);
    const [imageError, setImageError] = useState(null)
    const image = images[currentImage]
    const [lightbox, setLightBox] = useState(false);
    


    return(
        <div className="gallery">

            {image && !imageError ? (
                <img
                    className="main-image"
                    src={image} 
                    onError={() => setImageError(true)}
                    onClick={() => setLightBox(true)}/>
            ) : (
                <div className="noImage">No Image Available</div>
            )}

            <div className="gallery-controls">
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setImageError(false);
                        currentImage === 0 ? setCurrentImage(images.length - 1) : setCurrentImage(prev => prev - 1);
                    }}> {'<'}
                </button>
                
                <div
                    className="">
                        {currentImage + 1} / {images.length}
                </div>

                <button 
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setImageError(false);
                        currentImage === images.length - 1 ? setCurrentImage(0) : setCurrentImage(prev => prev + 1);
                    }}>{'>'}
                </button>
            </div>

            <div className="thumbnail-strip">
                {images.map((image,index) =>
                    <img
                    key={index}
                    className="thumbnail-image" 
                    src={image}
                    onClick={() =>
                        setCurrentImage(index)
                    }></img>
                )}
            </div>

            {/* <div className="thumbnail-strip">
                {images.map((image,index) => (
                    image && !imageError ? (
                        <img
                            key={index}
                            className="main-image"
                            src={image} 
                            onError={() => setImageError(true)}/>
                        ) : (
                            <div className="noImage">No Image Available</div>
                        )
                ))}
            </div> */}
            
                {lightbox && (
                    <div className="lightbox" onClick={() => setLightBox(false)}>
                        
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setImageError(false);
                                currentImage === 0 ? setCurrentImage(images.length - 1) : setCurrentImage(prev => prev - 1);
                            }}> {'<'}
                        </button>

                        <img 
                            className="lightbox-image"
                            src={image}></img>

                        <button 
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setImageError(false);
                                currentImage === images.length - 1 ? setCurrentImage(0) : setCurrentImage(prev => prev + 1);
                            }}>{'>'}
                        </button>
                    </div>
                )}
            

        </div>
    )
}

export default PropertyImageGallery;