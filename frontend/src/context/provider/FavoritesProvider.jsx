import useFavorites from "../../hooks/useFavorites";
import { FavoritesContext } from "../FavoritesContext";


export function FavoritesProvider({children}) {
    const [favorites, isFavorite, toggleFavorite] = useFavorites();

    return(
        <FavoritesContext.Provider value={{favorites, isFavorite, toggleFavorite}}>
            {children}
        </FavoritesContext.Provider>
    )
}