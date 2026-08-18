const grid = document.getElementById("grid");
const statusEl = document.getElementById("status");
const search = document.getElementById("search");
const filterButtons = [...document.querySelectorAll("#filters button")];
const topBtn = document.getElementById("topBtn");

let allPokemon = [];
let activeType = "all";

function cap(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function createCard(p, index) {
  const number = String(p.id).padStart(3, "0");
  const card = document.createElement("article");
  card.className = "card";
  card.style.animationDelay = `${Math.min(index * 35, 350)}ms`;

  const image = p.sprites.other["official-artwork"].front_default || p.sprites.front_default;

  card.innerHTML = `
    <div class="big-number">#${number}</div>
    <img class="poke-img" src="${image}" alt="${cap(p.name)}" loading="lazy">
    <div class="info">
      <div class="number">#${number}</div>
      <div class="name">${cap(p.name)}</div>
      <div class="types">
        ${p.types.map(t => `<span class="type type-${t.type.name}">${cap(t.type.name)}</span>`).join("")}
      </div>
      <div class="stats">
        <span>Altura <strong>${(p.height / 10).toFixed(1)} m</strong></span>
        <span>Peso <strong>${(p.weight / 10).toFixed(1)} kg</strong></span>
      </div>
    </div>
  `;
  return card;
}

function render() {
  const term = search.value.trim().toLowerCase();

  const filtered = allPokemon.filter(p => {
    const typeOk = activeType === "all" || p.types.some(t => t.type.name === activeType);
    const searchOk = !term || p.name.includes(term) || String(p.id) === term || String(p.id).padStart(3, "0") === term;
    return typeOk && searchOk;
  });

  grid.innerHTML = "";

  if (!filtered.length) {
    grid.innerHTML = '<div class="empty">No encontramos Pokémon con esa búsqueda.</div>';
  } else {
    filtered.forEach((p, i) => grid.appendChild(createCard(p, i)));
  }

  statusEl.textContent = `${filtered.length} Pokémon encontrados`;
}

async function loadPokemon() {
  try {
    const requests = Array.from({length: 151}, (_, i) =>
      fetch(`https://pokeapi.co/api/v2/pokemon/${i + 1}`).then(r => r.json())
    );
    allPokemon = await Promise.all(requests);
    render();
  } catch (e) {
    statusEl.textContent = "No se pudieron cargar los Pokémon.";
  }
}

filterButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    filterButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    activeType = btn.dataset.type;
    render();
  });
});

search.addEventListener("input", render);

window.addEventListener("scroll", () => {
  topBtn.classList.toggle("show", window.scrollY > 450);
});

topBtn.addEventListener("click", () => window.scrollTo({top: 0, behavior: "smooth"}));

loadPokemon();
