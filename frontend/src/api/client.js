export async function fetchFilteredProperties(filters){
  let url = '/api/properties?'
  
  Object.entries(filters).forEach(([key, value]) => {
    if(value === '') return;
    url = url + key + '=' + value + '&';
  })

  console.log(url);
  
  const response = await fetch(url);
  
  if(!response.ok){
        throw new Error('Failed to fetch properties');
    }
  
  const result = await response.json();
  return result;
}