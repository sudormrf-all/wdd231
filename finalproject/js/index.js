import { fetchIngredients } from './data.js';
import { $ } from './utils.js';
const featured = $('#featured');
async function init(){
  try{
    const items = await fetchIngredients();
    const top = [...items].sort((a,b)=>b.rating-a.rating).slice(0,3);
    featured.innerHTML = top.map(item=>`
      <article class="card">
        <h3>${item.name}</h3>
        <div class="meta">
          <span class="badge">${item.category}</span>
          <span>${item.rating.toFixed(1)}★</span>
          <span>${item.origin}</span>
        </div>
        <p>${item.notes}</p>
        <div class="actions">
          <span class="badge">${item.caloriesPer100g} cal / 100g</span>
          <span class="badge">$${item.pricePer100g.toFixed(2)} / 100g</span>
          <a class="button" href="explore.html#${item.id}">View</a>
        </div>
      </article>
    `).join('');
  }catch{
    featured.innerHTML = '<p role="alert">Could not load featured items. Please refresh.</p>';
  }
}
init();
