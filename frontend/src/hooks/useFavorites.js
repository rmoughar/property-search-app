import { useLocalStorage } from "./useLocalStorage";

export const useFavorites = () => {
    const [favorites, setfavorites] = useLocalStorage("favorites", []);

    // Add or remove a property ID from the saved favorites
    function toggleFavorite(id){

        if(isFavorite(id)){
            setfavorites(prev => prev.filter(favorite => favorite !== id))
        } else{
            setfavorites(prev => [...prev, id])
        }

    }

    // Check whether a property ID is currently saved as a favorite
    function isFavorite(id){
        return favorites.includes(id);
    }

    return [favorites, isFavorite, toggleFavorite];
}

export default useFavorites;