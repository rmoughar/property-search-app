import { useContext } from "react";
import { Link } from "react-router";
import { FavoritesContext } from "../context/FavoritesContext";
import './Header.css'

function Header(){
    const {favorites} = useContext(FavoritesContext);
    return (
        <header className='app-header'>
            <div className='header-box'>
                <Link className='title-link' to={'/'}><h1>Property Search |</h1></Link>
                <Link className='favorites-link' to={'/favorites'}><h1>Favorites ({favorites.length}) |</h1></Link>
                <Link className='ai-search-link' to={'/ai-search'}><h1>AI Search</h1></Link>
            </div>
      </header>
    )
}

export default Header;