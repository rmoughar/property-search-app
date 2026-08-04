export async function fetchFilteredProperties(filters, signal){
  let url = '/api/properties?'
  
  Object.entries(filters).forEach(([key, value]) => {
    if(value === '') return;
    url = url + key + '=' + value + '&';
  })

  console.log(url);
  
  const response = await fetch(url, {signal});
  
  if(!response.ok){
        throw new Error('Failed to fetch properties');
    }
  
  const result = await response.json();
  return result;
}

export async function fetchPropertyById(id) {
  let url = '/api/properties/'
  
  url += id;

  console.log(url);
  
  const response = await fetch(url);
  
  if(!response.ok){
        throw new Error('Failed to fetch property');
    }
  
  const result = await response.json();
  return result;
}

//http://localhost:4000/api/properties/1149391864/