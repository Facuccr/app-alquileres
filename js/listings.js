// js/listings.js

// Obtener el contenedor donde se mostrarán las propiedades
const propertyListings = document.getElementById("propertyListings");
const filterForm = document.getElementById("filterForm");
const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");

// Función principal para obtener y mostrar propiedades
async function fetchProperties(filters = {}) {
  let url = "http://localhost:3000/api/properties"; // URL de tu endpoint backend

  const queryParams = new URLSearchParams();

  // Añadir filtros a los parámetros de la URL
  if (filters.type) {
    queryParams.append("type", filters.type);
  }
  if (filters.priceRange) {
    queryParams.append("priceRange", filters.priceRange);
  }
  if (filters.location) {
    queryParams.append("location", filters.location);
  }
  if (filters.urbanization) {
    queryParams.append("urbanization", filters.urbanization);
  }
  if (filters.security) {
    queryParams.append("security", filters.security);
  }
  if (filters.ambientes && filters.ambientes.length > 0) {
    filters.ambientes.forEach((ambiente) =>
      queryParams.append("ambienteFilter", ambiente)
    );
  }
  if (filters.searchTerm) {
    queryParams.append("searchTerm", filters.searchTerm);
  }

  // Construir la URL completa con los parámetros de consulta
  if (queryParams.toString()) {
    url += `?${queryParams.toString()}`;
  }

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const properties = await response.json();
    displayProperties(properties);
  } catch (error) {
    console.error("Error fetching properties:", error);
    propertyListings.innerHTML =
      '<p class="text-danger">No se pudieron cargar las propiedades. Intenta de nuevo más tarde.</p>';
  }
}

// Función para mostrar las propiedades en el HTML
function displayProperties(properties) {
  propertyListings.innerHTML = ""; // Limpiar listados existentes

  if (properties.length === 0) {
    propertyListings.innerHTML =
      '<p class="text-center text-muted col-12">No se encontraron propiedades que coincidan con los filtros.</p>';
    return;
  }

  properties.forEach((property) => {
    const imageUrl =
      property.mediaUrls && property.mediaUrls.length > 0
        ? `http://localhost:3000${property.mediaUrls[0]}`
        : "https://via.placeholder.com/400x200?text=Imagen+No+Disponible";

    const cardCol = document.createElement("div");
    cardCol.className = "col";
    cardCol.innerHTML = `
            <div class="card h-100 shadow-sm border-0">
                <img
                    src="${imageUrl}"
                    class="card-img-top"
                    alt="${property.type} en ${property.barrio}, ${
      property.city
    }"
                    style="object-fit: cover; height: 200px"
                />
                <div class="card-body d-flex flex-column">
                    <h5 class="card-title text-primary">${property.type} en ${
      property.barrio
    }</h5>
                    <p class="card-text text-muted">
                        ${property.description || "Sin descripción disponible."}
                    </p>
                    <ul class="list-unstyled mt-2 small text-muted">
                        <li><strong>Ciudad:</strong> ${property.city}</li>
                        <li><strong>Provincia:</strong> ${
                          property.province
                        }</li>
                        <li><strong>Superficie Cubierta:</strong> ${
                          property.coveredSurface || "N/A"
                        } m²</li>
                        <li><strong>Ambientes:</strong> ${
                          property.ambientes && property.ambientes.length > 0
                            ? property.ambientes.join(", ")
                            : "N/A"
                        }</li>
                        <li><strong>Servicios:</strong> ${
                          property.services && property.services.length > 0
                            ? property.services.join(", ")
                            : "N/A"
                        }</li>
                        <li><strong>Condición:</strong> ${
                          property.condition || "N/A"
                        }</li>
                        <li><strong>Antigüedad:</strong> ${
                          property.antiquity || "N/A"
                        } años</li>
                    </ul>
                    <div class="mt-auto d-flex flex-column align-items-start">
                        <span class="badge bg-success fs-5 mb-2">$${
                          property.price
                        }/mes</span>
                        <a href="property-detail.html?id=${
                          property.id
                        }" class="btn btn-primary w-100">
                            Ver detalles <i class="fas fa-chevron-right ms-1"></i>
                        </a>
                    </div>
                </div>
            </div>
        `;
    propertyListings.appendChild(cardCol);
  });
}

// Event Listeners para filtros y búsqueda
document.addEventListener("DOMContentLoaded", () => {
  fetchProperties(); // Cargar propiedades al cargar la página por primera vez

  filterForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(filterForm);
    const filters = {};
    for (let [key, value] of formData.entries()) {
      if (key === "ambienteFilter") {
        if (!filters[key]) {
          filters[key] = [];
        }
        filters[key].push(value);
      } else {
        filters[key] = value;
      }
    }
    console.log("Filtros aplicados:", filters);
    fetchProperties(filters);
  });

  searchButton.addEventListener("click", () => {
    const searchTerm = searchInput.value.trim();
    fetchProperties({ searchTerm: searchTerm });
  });

  searchInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      const searchTerm = searchInput.value.trim();
      fetchProperties({ searchTerm: searchTerm });
    }
  });
});
