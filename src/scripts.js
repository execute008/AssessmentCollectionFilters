async function fetchData() {
  const resp = await fetch("./collection.json");
  const data = await resp.json();
  const products = data.products;
  return products;
}

function formatPrice(price) {
  return (price / 100).toFixed(2).replace(".", ",") + " €";
}

function price(product) {
  const variants = product.variants;
  if (variants.length === 1) {
    return formatPrice(variants[0].price);
  }
  const prices = variants.map((variant) => variant.price);
  const minPrice = Math.min(...prices);

  return `ab ${formatPrice(minPrice)}`;
}

function createProductCard(product) {
  const card = document.createElement("div");
  card.className = "ProductItem";
  card.dataset.productId = product.id;
  card.innerHTML = `
    <div class="ProductItem__Image">
      <div class="AspectRatio">
        <img src="${product.featured_image.src}" alt="${
    product.featured_image.alt || ""
  }" />
      </div>
    </div>
    <div class="ProductItem__Content">
      <div class="ProductItem__Title">${product.title}</div>
      <div class="ProductItem__Price">${price(product)}</div>
    </div>
  `;
  return card;
}

function getPriceRange(product) {
  const minPrice = product.price_min || product.price;

  if (minPrice <= 2000) return "0-20";
  if (minPrice <= 3000) return "20-30";
  if (minPrice <= 4000) return "30-40";
  return "40plus";
}

// Define available intake forms and their detection patterns
const INTAKE_FORMS = [
  {
    id: "Kapseln",
    patterns: ["kapseln", "kapsel", "tabletten", "tablette", "pillen", "pille"],
  },
  {
    id: "Pulver",
    patterns: ["pulver", "shake", "shakes", "protein", "bulk"],
  },
  {
    id: "Tropfen",
    patterns: ["tropfen", "liquid", "öl", "oel", "tinktur"],
  },
  {
    id: "Spray",
    patterns: ["spray", "sprüh", "spruh", "nebel"],
  },
  {
    id: "Sonstiges",
    patterns: [], // Fallback option
  },
];

function getIntakeForm(product) {
  const title = product.title.toLowerCase();
  const description = product.description.toLowerCase();

  for (const form of INTAKE_FORMS) {
    if (
      form.patterns.some(
        (pattern) => title.includes(pattern) || description.includes(pattern)
      )
    ) {
      return form.id;
    }
  }

  return "Sonstiges";
}

function getTagsByPrefix(product, prefix) {
  if (!product.tags || !Array.isArray(product.tags)) return [];

  return product.tags
    .filter((tag) => tag.startsWith(prefix))
    .map((tag) => tag.replace(`${prefix}_`, ""));
}

function getDietaryPreferences(product) {
  return getTagsByPrefix(product, "Ernährungsweise");
}

function getCompatibilities(product) {
  return getTagsByPrefix(product, "Verträglichkeiten");
}

function getProperties(product) {
  return getTagsByPrefix(product, "Eigenschaften");
}

function filterProducts(products, filters) {
  return products.filter((product) => {
    if (filters.price.length > 0) {
      const priceRange = getPriceRange(product);
      if (!filters.price.includes(priceRange)) return false;
    }

    if (filters.onlyAvailable && !product.available) return false;

    if (filters.intakeForm.length > 0) {
      const intakeForm = getIntakeForm(product);
      if (!filters.intakeForm.includes(intakeForm)) return false;
    }

    if (filters.dietaryPreferences && filters.dietaryPreferences.length > 0) {
      const preferences = getDietaryPreferences(product);
      if (
        !preferences.some((pref) => filters.dietaryPreferences.includes(pref))
      )
        return false;
    }

    if (filters.compatibilities && filters.compatibilities.length > 0) {
      const compatibilities = getCompatibilities(product);
      if (
        !compatibilities.some((comp) => filters.compatibilities.includes(comp))
      )
        return false;
    }

    if (filters.properties && filters.properties.length > 0) {
      const properties = getProperties(product);
      if (!properties.some((prop) => filters.properties.includes(prop)))
        return false;
    }

    return true;
  });
}

function getAvailableFilters(products) {
  const intakeForms = new Set();
  const dietaryPreferences = new Set();
  const compatibilities = new Set();
  const properties = new Set();

  products.forEach((product) => {
    intakeForms.add(getIntakeForm(product));

    getDietaryPreferences(product).forEach((pref) => {
      dietaryPreferences.add(pref);
    });

    getCompatibilities(product).forEach((comp) => {
      compatibilities.add(comp);
    });

    getProperties(product).forEach((prop) => {
      properties.add(prop);
    });
  });

  return {
    intakeForms: Array.from(intakeForms),
    dietaryPreferences: Array.from(dietaryPreferences),
    compatibilities: Array.from(compatibilities),
    properties: Array.from(properties),
  };
}

function renderProducts(products, container) {
  container.innerHTML = "";
  if (products.length === 0) {
    container.innerHTML =
      '<div class="Collection__Empty">Keine Produkte gefunden</div>';
    return;
  }

  products.forEach((product) => {
    container.appendChild(createProductCard(product));
  });
}

function createFilterModal(products, filters, applyFilters) {
  const availableFilters = getAvailableFilters(products);

  const modal = document.createElement("div");
  modal.className = "FilterModal";

  const intakeFormOptionsHtml = INTAKE_FORMS.map((form) => {
    const isAvailable = availableFilters.intakeForms.includes(form.id);
    return `
      <label class="FilterOption ${
        !isAvailable ? "FilterOption--disabled" : ""
      }">
        <input type="checkbox" name="intakeForm" value="${form.id}" 
          ${filters.intakeForm.includes(form.id) ? "checked" : ""} 
          ${!isAvailable ? "disabled" : ""}>
        ${form.id}
      </label>
    `;
  }).join("");

  modal.innerHTML = `
    <div class="FilterModal__Overlay"></div>
    <div class="FilterModal__Content">
      <div class="FilterModal__Header">
        <h3>Filter</h3>
        <button class="FilterModal__Close">&times;</button>
      </div>
      <div class="FilterModal__Body">
        <div class="FilterGroup">
          <h4>Preis</h4>
          <div class="FilterOptions">
            <label class="FilterOption">
              <input type="checkbox" name="price" value="0-20" ${
                filters.price.includes("0-20") ? "checked" : ""
              }>
              0-20€
            </label>
            <label class="FilterOption">
              <input type="checkbox" name="price" value="20-30" ${
                filters.price.includes("20-30") ? "checked" : ""
              }>
              >20€-30€
            </label>
            <label class="FilterOption">
              <input type="checkbox" name="price" value="30-40" ${
                filters.price.includes("30-40") ? "checked" : ""
              }>
              >30€-40€
            </label>
            <label class="FilterOption">
              <input type="checkbox" name="price" value="40plus" ${
                filters.price.includes("40plus") ? "checked" : ""
              }>
              >40€
            </label>
          </div>
        </div>
        
        <div class="FilterGroup">
          <h4>Verfügbarkeit</h4>
          <div class="FilterOptions">
            <label class="FilterOption">
              <input type="checkbox" name="availability" value="available" ${
                filters.onlyAvailable ? "checked" : ""
              }>
              Zeige nur verfügbare Produkte
            </label>
          </div>
        </div>
        
        <div class="FilterGroup">
          <h4>Einnahmeform</h4>
          <div class="FilterOptions">
            ${intakeFormOptionsHtml}
          </div>
        </div>
        
        ${
          availableFilters.dietaryPreferences.length > 0
            ? `
        <div class="FilterGroup">
          <h4>Ernährungsweise</h4>
          <div class="FilterOptions">
            ${availableFilters.dietaryPreferences
              .map(
                (pref) => `
              <label class="FilterOption">
                <input type="checkbox" name="dietaryPreferences" value="${pref}" 
                  ${
                    filters.dietaryPreferences?.includes(pref) ? "checked" : ""
                  }>
                ${pref}
              </label>
            `
              )
              .join("")}
          </div>
        </div>
        `
            : ""
        }
        
        ${
          availableFilters.compatibilities.length > 0
            ? `
        <div class="FilterGroup">
          <h4>Verträglichkeiten</h4>
          <div class="FilterOptions">
            ${availableFilters.compatibilities
              .map(
                (comp) => `
              <label class="FilterOption">
                <input type="checkbox" name="compatibilities" value="${comp}" 
                  ${filters.compatibilities?.includes(comp) ? "checked" : ""}>
                ${comp}
              </label>
            `
              )
              .join("")}
          </div>
        </div>
        `
            : ""
        }
        
        ${
          availableFilters.properties.length > 0
            ? `
        <div class="FilterGroup">
          <h4>Eigenschaften</h4>
          <div class="FilterOptions">
            ${availableFilters.properties
              .map(
                (prop) => `
              <label class="FilterOption">
                <input type="checkbox" name="properties" value="${prop}" 
                  ${filters.properties?.includes(prop) ? "checked" : ""}>
                ${prop}
              </label>
            `
              )
              .join("")}
          </div>
        </div>
        `
            : ""
        }
      </div>
      <div class="FilterModal__Footer">
        <button class="FilterModal__Reset">Zurücksetzen</button>
        <button class="FilterModal__Apply">Filter anwenden</button>
      </div>
    </div>
  `;

  modal.querySelector(".FilterModal__Close").addEventListener("click", () => {
    document.body.removeChild(modal);
  });

  modal.querySelector(".FilterModal__Overlay").addEventListener("click", () => {
    document.body.removeChild(modal);
  });

  modal.querySelector(".FilterModal__Reset").addEventListener("click", () => {
    modal.querySelectorAll('input[type="checkbox"]').forEach((checkbox) => {
      checkbox.checked = false;
    });
  });

  modal.querySelector(".FilterModal__Apply").addEventListener("click", () => {
    const newFilters = {
      price: [...modal.querySelectorAll('input[name="price"]:checked')].map(
        (el) => el.value
      ),
      onlyAvailable: modal.querySelector('input[name="availability"]').checked,
      intakeForm: [
        ...modal.querySelectorAll('input[name="intakeForm"]:checked'),
      ].map((el) => el.value),
      dietaryPreferences: [
        ...modal.querySelectorAll('input[name="dietaryPreferences"]:checked'),
      ].map((el) => el.value),
      compatibilities: [
        ...modal.querySelectorAll('input[name="compatibilities"]:checked'),
      ].map((el) => el.value),
      properties: [
        ...modal.querySelectorAll('input[name="properties"]:checked'),
      ].map((el) => el.value),
    };

    applyFilters(newFilters);
    document.body.removeChild(modal);
  });

  document.body.appendChild(modal);
}

/* Filter functionality */
(() => {
  let allProducts = [];
  let filteredProducts = [];
  let filters = {
    price: [],
    onlyAvailable: false,
    intakeForm: [],
    dietaryPreferences: [],
    compatibilities: [],
    properties: [],
  };

  const productsContainer = document.querySelector(".Collection__Products");

  const activeFiltersContainer = document.createElement("div");
  activeFiltersContainer.className = "Collection__ActiveFilters";
  productsContainer.parentNode.insertBefore(
    activeFiltersContainer,
    productsContainer
  );

  function updateActiveFilters() {
    activeFiltersContainer.innerHTML = "";
    let hasActiveFilters = false;

    const addFilterPill = (label, type, value) => {
      hasActiveFilters = true;
      const pill = document.createElement("span");
      pill.className = "Filter__Pill";
      pill.innerHTML = `${label} <button class="Filter__Remove" data-type="${type}" ${
        value ? `data-value="${value}"` : ""
      }>&times;</button>`;
      activeFiltersContainer.appendChild(pill);
    };

    filters.price.forEach((range) => {
      let label;
      switch (range) {
        case "0-20":
          label = "0-20€";
          break;
        case "20-30":
          label = "20€-30€";
          break;
        case "30-40":
          label = "30€-40€";
          break;
        case "40plus":
          label = ">40€";
          break;
      }
      addFilterPill(label, "price", range);
    });

    if (filters.onlyAvailable) {
      addFilterPill("Nur verfügbare Produkte", "availability");
    }

    filters.intakeForm.forEach((form) => {
      addFilterPill(form, "intakeForm", form);
    });

    if (filters.dietaryPreferences) {
      filters.dietaryPreferences.forEach((pref) => {
        addFilterPill(pref, "dietaryPreferences", pref);
      });
    }

    if (filters.compatibilities) {
      filters.compatibilities.forEach((comp) => {
        addFilterPill(comp, "compatibilities", comp);
      });
    }

    if (filters.properties) {
      filters.properties.forEach((prop) => {
        addFilterPill(prop, "properties", prop);
      });
    }

    if (hasActiveFilters) {
      const clearButton = document.createElement("button");
      clearButton.className = "Filter__ClearAll";
      clearButton.textContent = "Alle Filter zurücksetzen";
      clearButton.addEventListener("click", () => {
        filters = {
          price: [],
          onlyAvailable: false,
          intakeForm: [],
          dietaryPreferences: [],
          compatibilities: [],
          properties: [],
        };
        filteredProducts = [...allProducts];
        renderProducts(filteredProducts, productsContainer);
        updateActiveFilters();
      });
      activeFiltersContainer.appendChild(clearButton);

      activeFiltersContainer
        .querySelectorAll(".Filter__Remove")
        .forEach((btn) => {
          btn.addEventListener("click", (e) => {
            const type = e.target.dataset.type;
            const value = e.target.dataset.value;

            if (type === "availability") {
              filters.onlyAvailable = false;
            } else if (value) {
              filters[type] = filters[type].filter((v) => v !== value);
            }

            filteredProducts = filterProducts(allProducts, filters);
            renderProducts(filteredProducts, productsContainer);
            updateActiveFilters();
          });
        });
    }

    activeFiltersContainer.style.display = hasActiveFilters ? "flex" : "none";
  }

  fetchData()
    .then((products) => {
      allProducts = products;
      filteredProducts = [...products];
      renderProducts(filteredProducts, productsContainer);
      updateActiveFilters();
    })
    .catch((error) => {
      console.error("Error fetching product data:", error);
      productsContainer.innerHTML =
        '<div class="Collection__Error">Fehler beim Laden der Produkte</div>';
    });

  document
    .querySelector('[data-action="open-filters"]')
    .addEventListener("click", () => {
      createFilterModal(allProducts, filters, (newFilters) => {
        filters = newFilters;
        filteredProducts = filterProducts(allProducts, filters);
        renderProducts(filteredProducts, productsContainer);
        updateActiveFilters();
      });
    });
})();
