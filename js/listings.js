// --- DATOS DE PROPIEDADES (ESTO PODRÍA VENIR DE UNA API REAL EN EL FUTURO) ---
const properties = [
  {
    id: 1,
    title: "CASA Moderna con Jardín",
    description:
      "Amplia casa de 3 habitaciones con jardín trasero en zona tranquila.",
    price: 800,
    type: "Casa",
    location: "Norte",
    image:
      "https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/c443a9e9-082b-4399-acef-7100c96253fa.png",
  },
  {
    id: 2,
    title: "Apartamento Luminoso en Centro",
    description:
      "Cómodo apartamento de 2 habitaciones en el corazón de la ciudad, cerca de todo.",
    price: 500,
    type: "Apartamento",
    location: "Centro",
    image:
      "https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/c443a9e9-082b-4399-acef-7100c96253fa.png",
  },
  {
    id: 3,
    title: "Habitación Individual para Estudiantes",
    description:
      "Habitación luminosa y amueblada, ideal para estudiantes cerca de la universidad.",
    price: 300,
    type: "Habitación",
    location: "Sur",
    image:
      "https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/c443a9e9-082b-4399-acef-7100c96253fa.png",
  },
  {
    id: 4,
    title: "Loft Moderno con Vistas",
    description: "Loft espacioso con grandes ventanales y vistas a la ciudad.",
    price: 950,
    type: "Apartamento",
    location: "Norte",
    image:
      "https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/c443a9e9-082b-4399-acef-7100c96253fa.png",
  },
  {
    id: 5,
    title: "Chalet Adosado Familiar",
    description: "Casa ideal para familias con 4 habitaciones y patio privado.",
    price: 1200,
    type: "Casa",
    location: "Sur",
    image:
      "https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/c443a9e9-082b-4399-acef-7100c96253fa.png",
  },
  // Añade más propiedades aquí si lo deseas
];

// --- FUNCIÓN PARA CREAR UNA TARJETA DE PROPIEDAD ---
function createPropertyCard(property) {
  return `
        <div class="col">
            <div class="card h-100 shadow-sm border-0">
                <img src="${property.image}" class="card-img-top" alt="${property.title}" style="object-fit: cover; height: 200px;">
                <div class="card-body d-flex flex-column">
                    <h5 class="card-title text-primary">${property.title}</h5>
                    <p class="card-text text-muted">${property.description}</p>
                    <div class="mt-auto d-flex justify-content-between align-items-center">
                        <span class="badge bg-success fs-5">$${property.price}/mes</span>
                        <a href="property-detail.html?id=${property.id}" class="btn btn-outline-primary btn-sm me-2">Ver detalles <i class="fas fa-chevron-right ms-1"></i></a>
                        <!-- Botón "Contactar" añadido aquí -->
                        <a href="mensajeria.html" class="btn btn-primary btn-sm">Contactar <i class="fas fa-comment-dots ms-1"></i></a>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// --- FUNCIÓN PARA MOSTRAR LAS PROPIEDADES EN EL HTML ---
function displayProperties(propertiesToDisplay) {
  const listingsContainer = document.getElementById("propertyListings");
  listingsContainer.innerHTML = ""; // Limpiar listado actual
  if (propertiesToDisplay.length === 0) {
    listingsContainer.innerHTML =
      '<div class="col-12 text-center text-muted">No se encontraron propiedades que coincidan con tu búsqueda.</div>';
    return;
  }
  propertiesToDisplay.forEach((property) => {
    listingsContainer.innerHTML += createPropertyCard(property);
  });
}

// --- LÓGICA DEL BUSCADOR ---
function performSearchAndFilter() {
  const searchTerm = document.getElementById("searchInput").value.toLowerCase();
  const typeFilter = document.getElementById("typeFilter").value;
  const priceFilter = document.getElementById("priceFilter").value;
  const locationFilter = document.getElementById("locationFilter").value;

  let filteredProperties = properties.filter((property) => {
    // Filtro por término de búsqueda (título o descripción)
    const matchesSearch =
      property.title.toLowerCase().includes(searchTerm) ||
      property.description.toLowerCase().includes(searchTerm);

    // Filtro por tipo
    const matchesType = typeFilter === "" || property.type === typeFilter;

    // Filtro por precio
    let matchesPrice = true;
    if (priceFilter === "Menos de $500") {
      matchesPrice = property.price < 500;
    } else if (priceFilter === "$500 - $1000") {
      matchesPrice = property.price >= 500 && property.price <= 1000;
    } else if (priceFilter === "Más de $1000") {
      matchesPrice = property.price > 1000;
    }

    // Filtro por ubicación
    const matchesLocation =
      locationFilter === "" || property.location === locationFilter;

    return matchesSearch && matchesType && matchesPrice && matchesLocation;
  });

  displayProperties(filteredProperties);
}

// --- EVENT LISTENERS (PARA CONECTAR LA LÓGICA CON EL HTML) ---
document.addEventListener("DOMContentLoaded", () => {
  // Mostrar todas las propiedades al cargar la página
  displayProperties(properties);

  // Conectar el botón de búsqueda
  const searchButton = document.getElementById("searchButton");
  if (searchButton) {
    searchButton.addEventListener("click", performSearchAndFilter);
  }

  // Conectar el input de búsqueda para buscar al presionar Enter
  const searchInput = document.getElementById("searchInput");
  if (searchInput) {
    searchInput.addEventListener("keypress", (event) => {
      if (event.key === "Enter") {
        performSearchAndFilter();
      }
    });
  }

  // Conectar el formulario de filtros (cuando cambian los selectores)
  const filterForm = document.getElementById("filterForm");
  if (filterForm) {
    // Escucha los cambios en cualquier select del formulario de filtros
    filterForm.querySelectorAll("select").forEach((selectElement) => {
      selectElement.addEventListener("change", performSearchAndFilter);
    });

    // Previene el envío del formulario (que recargaría la página)
    filterForm.addEventListener("submit", (event) => {
      event.preventDefault(); // Detiene el comportamiento predeterminado del formulario
      performSearchAndFilter();
    });
  }
});
