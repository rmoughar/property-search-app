import { useState } from "react";
import "./PropertyFilters.css"

function formatPrice(value){
  const digits = value.replace(/\D/g, '');

  if (digits === '') return '';
  return Number(digits);
}


function PropertyFilters( {filters, onSearch} ){

  const [tempFilters, setTempFilters] = useState(filters);
    
  return(
    <div>
      <form className="filters" onSubmit={(e) => {
        e.preventDefault();
        onSearch(tempFilters);}}>
        
        <input 
        type="text" 
        placeholder="City"
        value={tempFilters.city}
        onChange={e => setTempFilters((prev) => ({...prev, city:e.target.value,}))}
        />

        <input 
        type="text" 
        placeholder="ZIP Code"
        value={tempFilters.zipcode}
        onChange={e => setTempFilters((prev) => ({...prev, zipcode:e.target.value,}))}
        />

        <input 
        type="text" 
        placeholder="Min Price"
        value={tempFilters.minPrice === ""
          ? ""
          : Number(filters.minPrice).toLocaleString()
        }
        onChange={e => setTempFilters((prev) => ({...prev, minPrice: formatPrice(e.target.value)}))}
        />

        <input 
        type="text" 
        placeholder="Max Price"
        value={tempFilters.maxPrice === ""
          ? ""
          : Number(filters.maxPrice).toLocaleString()
        }
        onChange={e => setTempFilters((prev) => ({...prev, maxPrice: formatPrice(e.target.value)}))}
        />

        <div>
          <label htmlFor="beds">Beds: </label>
          <select
            id="beds"
            value={tempFilters.beds}
            onChange={e => setTempFilters((prev) => ({...prev, beds:e.target.value,}))}>
            <option value={''}>Any</option>
            <option value={'1'}>1</option>
            <option value={'2'}>2</option>
            <option value={'3'}>3</option>
            <option value={'4'}>4</option>
            <option value={'5'}>5+</option>
          </select>
        </div>

        <div>
          <label htmlFor="baths">Baths: </label>
          <select
          id="baths"
          value={filters.baths}
          onChange={e => setTempFilters((prev) => ({...prev, baths:e.target.value,}))}>
            <option value={''}>Any</option>
            <option value={'1'}>1</option>
            <option value={'2'}>2</option>
            <option value={'3'}>3</option>
            <option value={'4'}>4</option>
            <option value={'5'}>5+</option>
          </select>
        </div>

        <button type="submit">Search</button>

        <button 
        type="button"
        onClick={() => onSearch({city: '', zipcode: '', minPrice: '', maxPrice: '', beds: '', baths: ''})}>Clear</button>
      </form>
    </div>
  )
}

export default PropertyFilters;