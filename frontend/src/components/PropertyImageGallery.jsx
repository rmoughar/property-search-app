import { useState, useRef, useEffect } from "react";
import './PropertyImageGallery.css'

function PropertyImageGallery({images}) {
    const [currentImage, setCurrentImage] = useState(0);
    const [imageError, setImageError] = useState(null)
    const image = images[currentImage]
    const [lightbox, setLightBox] = useState(false);
    const thumbnailRef = useRef(null);

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
                setImageError(false);

                currentImage === 0 ? setCurrentImage(images.length - 1) : setCurrentImage(prev => prev - 1);
            }

            if(e.key === "ArrowRight"){
                setImageError(false);
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

                <button
                    className="gallery-left-arrow"
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setImageError(false);
                        currentImage === 0 ? setCurrentImage(images.length - 1) : setCurrentImage(prev => prev - 1);
                    }}> {'<'}
                </button>

                {image && !imageError ? (
                    <img
                        className="main-image"
                        src={image} 
                        onError={() => setImageError(true)}
                        onClick={() => setLightBox(true)}/>
                ) : (
                    <div className="noImage">No Image Available</div>
                )}

                <button 
                    className="gallery-right-arrow"
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setImageError(false);
                        currentImage === images.length - 1 ? setCurrentImage(0) : setCurrentImage(prev => prev + 1);
                    }}>{'>'}
                </button>

                <div
                    className="gallery-counter">
                        {currentImage + 1} / {images.length}
                </div>

            </div>
            
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
                        image && !imageError ? (
                            <img
                                key={index}
                                className={`thumbnail-image ${currentImage === index ? "active-thumbnail" : ""}`}
                                src={image} 
                                onError={() => setImageError(true)}
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
            
            {lightbox && (
                <div className="lightbox" 
                onClick={() => setLightBox(false)}>

                    <div className="lightbox-container">

                        <button
                            className="lightbox-left-arrow"
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setImageError(false);
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
                                    setImageError(false);
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