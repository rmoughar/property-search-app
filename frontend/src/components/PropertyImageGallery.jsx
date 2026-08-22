import { useState, useRef, useEffect } from "react";
import './PropertyImageGallery.css'

function PropertyImageGallery({images}) {
    const [currentImage, setCurrentImage] = useState(0);
    const [failedImagaes, setFailedImages] = useState(new Set());
    const image = images[currentImage]
    const [lightbox, setLightBox] = useState(false);
    const thumbnailRef = useRef(null);

    function handleImageError(url){
        setFailedImages(prev => {
            const updated = new Set(prev);
            updated.add(url);
            return updated;
        })
    }
    useEffect(() => {
        const activeThumbnail = thumbnailRef.current?.querySelector(".active-thumbnail");

        activeThumbnail?.scrollIntoView({
            behavior: "smooth",
            block: "nearest",
            inline: "center"
        });
    }, [currentImage])

    useEffect(() => {
        if(!lightbox) return;

        function handleKeyDown(e){
            if(e.key === "ArrowLeft") {
                currentImage === 0 ? setCurrentImage(images.length - 1) : setCurrentImage(prev => prev - 1);
            }

            if(e.key === "ArrowRight"){
                currentImage === images.length - 1 ? setCurrentImage(0) : setCurrentImage(prev => prev + 1);
            }

            if (e.key === "Escape"){
                setLightBox(false);
            }
        }

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        }
    }, [currentImage, images.length, lightbox])


    return(
        <div className="gallery">

            <div className="main-image-container">



                {image && !failedImagaes.has(image) ? (
                    <img
                        className="main-image"
                        src={image} 
                        onError={() => handleImageError(image)}
                        onClick={() => setLightBox(true)}/>
                ) : (
                    <div className="noImage">No Image Available</div>
                )}
                
                <button className="gallery-left-arrow"
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        currentImage === 0 ? setCurrentImage(images.length - 1) : setCurrentImage(prev => prev - 1);
                    }}> {'<'}
                </button>

                <button className="gallery-right-arrow"
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        currentImage === images.length - 1 ? setCurrentImage(0) : setCurrentImage(prev => prev + 1);
                    }}>{'>'}
                </button>
                
                {images.length !== 0 ? (
                    <div className="gallery-counter">
                            {currentImage + 1} / {images.length}
                    </div>
                ) : (<></>)}

            </div>
            
            {images.length > 1 ? (
                <div className="thumbnail-container">
                    <button
                        className="thumbnail-button"
                        onClick={() =>
                            thumbnailRef.current.scrollBy({
                                left: -300,
                                behavior: "smooth"
                            })
                    }>{'<'}</button>

                    <div 
                    ref={thumbnailRef}
                    className="thumbnail-strip">
                        {images.map((image,index) => (
                            image && !failedImagaes.has(image) ? (
                                <img
                                    key={index}
                                    className={`thumbnail-image ${currentImage === index ? "active-thumbnail" : ""}`}
                                    src={image} 
                                    onError={() => handleImageError(image)}
                                    onClick={() => setCurrentImage(index)}/>
                                ) : (
                                    <div className="noImage">No Image Available</div>
                                )
                        ))}
                    </div>

                    <button
                        className="thumbnail-button"
                        onClick={() =>
                            thumbnailRef.current.scrollBy({
                                left: 300,
                                behavior: "smooth"
                            })
                    }>{'>'}</button>

                </div>
            ) : (<></>)}
            
            
            {lightbox && (
                <div className="lightbox" 
                onClick={() => setLightBox(false)}>

                    <div className="lightbox-container">

                        <button
                            className="lightbox-left-arrow"
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    currentImage === 0 ? setCurrentImage(images.length - 1) : setCurrentImage(prev => prev - 1);
                                }}> {'<'}
                        </button>

                        <div className="lightbox-image-wrapper">
                            

                            <img 
                                className="lightbox-image"
                                src={image}></img>

                            <div className="lightbox-counter">
                                {currentImage + 1} / {images.length}
                            </div>
                            
                        </div>

                        <button 
                            className="lightbox-right-arrow"
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    currentImage === images.length - 1 ? setCurrentImage(0) : setCurrentImage(prev => prev + 1);
                                }}>{'>'}
                        </button>
                    </div>
                </div>
                
            )}

        </div>
    )
}

export default PropertyImageGallery;


{/* <div className="thumbnail-strip">
                {images.map((image,index) =>
                    <img
                    key={index}
                    className="thumbnail-image" 
                    src={image}
                    onClick={() =>
                        setCurrentImage(index)
                    }></img>
                )}
            </div> */}