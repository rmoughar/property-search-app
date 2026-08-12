import { useLocalStorage } from "./useLocalStorage";

export const useFavorites = () => {
    const [favorites, setfavorites] = useLocalStorage("favorites", []);

    function toggleFavorite(id){

        if(isFavorite(id)){
            setfavorites(prev => prev.filter(favorite => favorite !== id))
        } else{
            setfavorites(prev => [...prev, id])
        }

    }

    function isFavorite(id){
        return favorites.includes(id);
    }

    return [favorites, isFavorite, toggleFavorite];
}

export default useFavorites;