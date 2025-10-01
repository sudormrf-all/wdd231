export async function fetchIngredients(){
  try{
    const res = await fetch('data/ingredients.json', { cache: 'no-store' });
    if(!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  }catch(err){
    console.error('Failed to load ingredients:', err);
    throw err;
  }
}
