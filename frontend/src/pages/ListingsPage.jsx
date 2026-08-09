import { useState, useEffect } from "react";
import { fetchFilteredProperties} from "../api/client";
import PropertyCard from "../components/PropertyCard";
import PropertyFilters from "../components/PropertyFilters";
import { useRef } from "react";
import './ListingsPage.css'
import Pagination from "../components/Pagination";
import {Link} from "react-router"

function ListingsPage() {
  const [properties, setProperties] = useState({results: []});
  
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

  const [pagination, setPagination] = useState({currentPage: 1, itemsPerPage: 20});
  const totalPages = Math.ceil(properties.total / pagination.itemsPerPage);
  const offset = (pagination.currentPage - 1) * pagination.itemsPerPage;
  
  const [sort, setSort] = useState('');

  

  function changeCurrentPage(page){
    setPagination(prev => ({...prev, currentPage:page}))
  }

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
      try{
        setLoading(true);
        
        const params = {...filters, offset: offset, limit: pagination.itemsPerPage, sort: sort};

        const data = await fetchFilteredProperties(params, controller.current.signal);
        setProperties(data);

        setError(null)
        setLoading(false);
      } catch(error){
        if(error.name === "AbortError") return;

        console.error(error.message);
        setError(error)
        setLoading(false);
      }
    };

    loadProperties();
  },[filters, pagination.currentPage, pagination.itemsPerPage, offset, sort])

  return(
    <div className="listings-page">
      <PropertyFilters filters={filters} setFilters={setFilters} onSearch={handleSearch}></PropertyFilters>
     
      
      {loading ? (
        <div className="info-message">loading properties...</div>
      ) : error ? (
        <>
          {console.log('error:',error)}
          <div className="info-message">{error.message}</div>
        </>
      ) : properties.total === 0 ? (
        <div className="info-message">No properties found</div>
      ) : (
        <div>
          <div className="page-count-display"> 
            <div className="property-count"> Showing {offset + 1} - {(offset + Number(pagination.itemsPerPage)) > properties.total ? properties.total : (offset + Number(pagination.itemsPerPage))} of {properties.total} Properties</div>
            
            <div className="selects">
              <label className="ipp-label">
                  <span className="ipp-text">Per Page: </span>
                  <select
                  className="items-per-page"
                  value={pagination.itemsPerPage}
                  onChange={(e) => {
                    changeCurrentPage(1);
                    setPagination(prev => ({...prev, itemsPerPage:e.target.value}));
                    }}>
                    <option value={20}>20</option>
                    <option value={40}>40</option>
                    <option value={60}>60</option>
                    <option value={80}>80</option>
                    <option value={100}>100</option>
                  </select>
              </label>

              <label className="sort-label">
                  <span className="sort-text">Sort By: </span>
                  <select
                    className="sort-by"
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                  >
                    <option value={''}>Default</option>

                    <option value={'date:DESC'}>Newest</option>
                    <option value={'date:ASC'}>Oldest</option>

                    <option value={'price:DESC'}>Price ↓</option>
                    <option value={'price:ASC'}>Price ↑</option>

                    <option value={'sqft:DESC'}>SQFT ↓</option>
                    <option value={'sqft:ASC'}>SQFT ↑</option>

                    <option value={'beds:DESC'}>Beds ↓</option>
                    <option value={'beds:ASC'}>Beds ↑</option>

                  </select>
              </label>
            </div>

          </div>  
          <div className='properties-grid'>  
            {properties.results.map(property =>
                <Link key={property.id} to={`/property/${property.L_ListingID}`}>
                    <PropertyCard property={property}></PropertyCard>
                </Link>
            )}
          </div>
        </div>
      )}


      {totalPages > 1 && (
        <Pagination currentPage={pagination.currentPage} totalPages={totalPages} changeCurrentPage={changeCurrentPage}></Pagination>
      )}
      
    </div>
  )
}

export default ListingsPage;