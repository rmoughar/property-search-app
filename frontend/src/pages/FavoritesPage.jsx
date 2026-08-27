import { useContext, useEffect, useRef, useState } from "react";
import { FavoritesContext } from "../utils/FavoritesContext";
import { fetchMultipleProperties } from "../api/client";
import PropertyGrid from "../components/PropertyGrid";
import usePagination from "../hooks/usePagination";
import PropertyFilters from "../components/PropertyFilters";
import PropertyListControls from "../components/PropertyListControls";
import Pagination from "../components/Pagination";


function FavoritesPage() {
    const {favorites} = useContext(FavoritesContext);
    const [favoriteProperties, setFavoriteProperties] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [filters, setFilters] = useState({
        city: '', 
        zipcode: '', 
        minPrice: '', 
        maxPrice: '', 
        beds: '', 
        baths: '',
        limit: '20',
        offset: '0'
    });


    const [sort, setSort] = useState('');

    const {
        pagination,
        totalPages,
        offset,
        changeCurrentPage,
        changeItemsPerPage
      } = usePagination(favorites.length);

    function handleSearch(tempFilters){
        setFilters(tempFilters);
        setSort('');
        changeCurrentPage(1);
    } 

    const controller = useRef(null);
    useEffect(() => {

        if(controller.current != null){
        controller.current.abort();
        }

        controller.current = new AbortController();
            async function loadProperties(){
                if(favorites.length === 0){
                    setFavoriteProperties([]);
                    setLoading(false);
                    return;
                }
                try{
                    setLoading(true);

                    const params = {...filters, offset:offset, limit: pagination.itemsPerPage, sort:sort};
                    const slicedFavorites = favorites.slice(offset, offset+pagination.itemsPerPage);



                    const propertyData = await fetchMultipleProperties(slicedFavorites, params, controller.current.signal);
                    setFavoriteProperties(propertyData.Properties);
                    
                    setError(null);
                    setLoading(false);
                } catch(error){
                    if(error.name === "AbortError") return;

                    console.error(error.message);
                    setError(error);
                    setLoading(false);
                }
            };
            loadProperties();
        }, [favorites, offset, pagination.itemsPerPage, sort, filters, pagination.currentPage]);    

    //Keep the current page valid when favorites are removed
    useEffect(() => {
        const maxPage = Math.max(1, Math.ceil(favorites.length / pagination.itemsPerPage));

        if(pagination.currentPage > maxPage)changeCurrentPage(maxPage);
    }, [changeCurrentPage, favorites.length, pagination.currentPage, pagination.itemsPerPage])

    return(
        <div className="favorites-page">
            <PropertyFilters filters={filters} setFilters={setFilters} onSearch={handleSearch}></PropertyFilters>

            {loading ? (
                <div className="info-message">loading properties...</div>
            ) : error ? (
                <>
                    {console.error('error:', error)}
                    <div className="info-message">{error.message}</div>
                </>
            ) : (
                <div>
                    <PropertyListControls
                        offset={offset}
                        itemsPerPage={pagination.itemsPerPage}
                        total={favorites.length}
                        changeCurrentPage={changeCurrentPage}
                        changeItemsPerPage={changeItemsPerPage}
                        sort={sort}
                        setSort={setSort}>
                    </PropertyListControls>
                    <PropertyGrid properties={favoriteProperties}></PropertyGrid>
                </div>
            )}

            <Pagination currentPage={pagination.currentPage} totalPages={totalPages} changeCurrentPage={changeCurrentPage}></Pagination>
          
        </div>
    )
}

export default FavoritesPage;