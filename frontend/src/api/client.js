export async function fetchFilteredProperties(filters, signal){
  let url = '/api/properties?'
  
  Object.entries(filters).forEach(([key, value]) => {
    if(value === '') return;
    url = url + key + '=' + value + '&';
  })
  
  const response = await fetch(url, {signal});
  
  if(!response.ok){
        const message = await response.text();
        throw new Error(message);
    }
  
  const result = await response.json();
  return result;
}

export async function fetchPropertyById(id) {
  let url = '/api/properties/'
  
  url += id;
  
  const response = await fetch(url);
  
  if(!response.ok){
        const message = await response.text();
        throw new Error(message);
    }
  
  const result = await response.json();
  return result;
}

export async function fetchOpenHouseById(id) {
  let url = `/api/properties/${id}/openhouses`
  
  const response = await fetch(url);
  
  if(!response.ok){
        const message = await response.text();
        throw new Error(message);
    }
  
  const result = await response.json();
  return result;
}

export async function fetchMultipleProperties(ids, filters, signal) {
  const queryIDS = ids.join(',')
  let url = `/api/properties/ids/${queryIDS}?`;

  Object.entries(filters).forEach(([key, value]) => {
    if(value === '') return;
    url = url + key + '=' + value + '&';
  })
  
  const response = await fetch(url, {signal});
  
  if(!response.ok){
        const message = await response.text();
        throw new Error(message);
    }
  
  const result = await response.json();
  return result;
}

export async function fetchNaturalFilters(query){
    const url = '/api/search/natural';

    const response = await fetch(url, {
        method:'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            query:query
        })
    });

    if(!response.ok){
        const message = await response.text();
        throw new Error(message);
    }

    const result = await response.json();
    return result;
}


//http://localhost:4000/api/properties/1149391864/
//http://localhost:4000/api/properties/1149391864/openhouses