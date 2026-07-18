function PropertyFilters( {filters, setFilters, onSearch} ){
    
  return(
    <div>
      <form onSubmit={(e) => {
        e.preventDefault();
        onSearch();}}>
        
        <input 
        type="text" 
        placeholder="City"
        value={filters.city}
        onChange={e => setFilters((prev) => ({...prev, city:e.target.value,}))}
        />

        <input 
        type="text" 
        placeholder="ZIP Code"
        value={filters.zipcode}
        onChange={e => setFilters((prev) => ({...prev, zipcode:e.target.value,}))}
        />

        <input 
        type="text" 
        placeholder="Min Price"
        value={filters.minPrice}
        onChange={e => setFilters((prev) => ({...prev, minPrice:e.target.value,}))}
        />

        <input 
        type="text" 
        placeholder="Max Price"
        value={filters.maxPrice}
        onChange={e => setFilters((prev) => ({...prev, maxPrice:e.target.value,}))}
        />

        <label htmlFor="beds">Beds: </label>
        <select
          id="beds"
          value={filters.beds}
          onChange={e => setFilters((prev) => ({...prev, beds:e.target.value,}))}>
          <option value={''}>Any</option>
          <option value={'1'}>1+</option>
          <option value={'2'}>2+</option>
          <option value={'3'}>3+</option>
          <option value={'4'}>4+</option>
          <option value={'5'}>5+</option>
        </select>

        <label htmlFor="baths">Baths: </label>
        <select
        id="baths"
        value={filters.baths}
        onChange={e => setFilters((prev) => ({...prev, baths:e.target.value,}))}>
          <option value={''}>Any</option>
          <option value={'1'}>1+</option>
          <option value={'2'}>2+</option>
          <option value={'3'}>3+</option>
          <option value={'4'}>4+</option>
          <option value={'5'}>5+</option>
        </select>

        <button type="submit">Search</button>

        <button 
        type="submit"
        onClick={() => setFilters({city: '', zipcode: '', minPrice: '', maxPrice: '', beds: '', baths: ''})}>Clear</button>
      </form>
    </div>
  )
}

export default PropertyFilters;