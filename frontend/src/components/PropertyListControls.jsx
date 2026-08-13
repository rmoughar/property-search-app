function PropertyListControls({offset, itemsPerPage, total, changeCurrentPage, changeItemsPerPage, sort, setSort}){
    return(
    <div className="page-count-display"> 
            <div className="property-count"> Showing {total !== 0 ? offset + 1 : 0} - {(offset + Number(itemsPerPage)) > total ? total : (offset + Number(itemsPerPage))} of {total} Properties</div>
            
            <div className="selects">
              <label className="ipp-label">
                  <span className="ipp-text">Per Page: </span>
                  <select
                  className="items-per-page"
                  value={itemsPerPage}
                  onChange={(e) => {
                    changeCurrentPage(1);
                    changeItemsPerPage(e.target.value);
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
    )
}

export default PropertyListControls;