export async function fetchProperties(){
  const response = await fetch('/api/properties');
  
  if(!response.ok){
      throw new Error('Failed to fetch properties');
  }
  
  const result = await response.json();
  return result;
}