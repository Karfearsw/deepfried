// DEEPFRIEDPHARZ — static ecommerce with local cart and variants

const VARIANTS = {
  sticker: { label: "Sticker", price: 8 },
  poster: { label: "Poster", price: 25 },
  tshirt: { label: "T-shirt", price: 32 },
  hoodie: { label: "Hoodie", price: 65 },
};
const DEFAULT_VARIANT = "poster";

const state = {
  products: [],
  cart: [],
  selection: {}, // per-product selected variant
};

// Helper: format currency in USD
const fmt = (n) => `$${n.toFixed(2)}`;

// Define product catalog using images from /shop
// Default price for a poster; variants could be added later.
const PRODUCT_CATALOG = [
  { name: "CHEECH", image: "shop/CHEECH.PNG", price: 25 },
  { name: "DFHOTLINE", image: "shop/DFHOTLINE.PNG", price: 25 },
  { name: "DFJAKE", image: "shop/DFJAKE.PNG", price: 25 },
  { name: "Megaman", image: "shop/Megaman.PNG", price: 25 },
  { name: "Untitled-1", image: "shop/Untitled-1.PNG", price: 25 },
  { name: "Gooey Monk", image: "shop/gooeymonk.PNG", price: 25 },
  { name: "Llama 2", image: "shop/llama2.PNG", price: 25 },
  { name: "Monkey Stash", image: "shop/monkeystash.PNG", price: 25 },
  { name: "Osmo", image: "shop/osmo.PNG", price: 25 },
  { name: "Peepz 22", image: "shop/peepz22.PNG", price: 25 },
  { name: "Purple Ape", image: "shop/purple-ape.PNG", price: 25 },
  { name: "Recess", image: "shop/recess.PNG", price: 25 },
  { name: "Runtz", image: "shop/runtz.PNG", price: 25 },
  { name: "Scooby", image: "shop/scooby.PNG", price: 25 },
  { name: "Stranger", image: "shop/stranger.PNG", price: 25 },
  // JPGs — label as Photo Prints (generic names)
  { name: "Design Photo A", image: "shop/0CA77E6F-CAB2-4DC3-853E-168CE3BFED45.JPG", price: 25 },
  { name: "Design Photo B", image: "shop/A9BAF035-F09B-477E-B92B-FD546AAB1AD2.JPG", price: 25 },
  { name: "Design Photo C", image: "shop/B42F6D47-B3E4-4069-BCC9-1C75C3DCBEFC.JPG", price: 25 },
  { name: "Design Photo D", image: "shop/B446DB6A-BA33-462A-9EE8-F1BD65375253.JPG", price: 25 },
  { name: "Design Photo E", image: "shop/B9DC971F-7A55-4CEB-8578-1B0B47DFEEE9.JPG", price: 25 },
];

// Initialize
function init() {
  // ID all products and prepare state
  state.products = PRODUCT_CATALOG.map((p, idx) => ({ id: idx + 1, availableVariants: Object.keys(VARIANTS), ...p }));
  // Restore cart from localStorage
  try {
    const saved = localStorage.getItem("dfp_cart");
    state.cart = saved ? JSON.parse(saved) : [];
  } catch (e) {
    state.cart = [];
  }
  // Restore selection
  try {
    const savedSel = localStorage.getItem("dfp_selection");
    state.selection = savedSel ? JSON.parse(savedSel) : {};
  } catch (e) {
    state.selection = {};
  }
  // Ensure defaults
  state.products.forEach((p) => {
    if (!validateVariant(p.id, state.selection[p.id])) {
      state.selection[p.id] = DEFAULT_VARIANT;
    }
  });
  renderYear();
  renderProducts();
  renderCart();
  bindUI();
}

function bindUI() {
  const cartBtn = document.getElementById("cart-button");
  const cartPanel = document.getElementById("cart-panel");
  const cartClose = document.getElementById("cart-close");
  const checkout = document.getElementById("checkout");

  cartBtn.addEventListener("click", () => {
    cartPanel.classList.add("open");
    cartPanel.setAttribute("aria-hidden", "false");
  });
  cartClose.addEventListener("click", () => {
    cartPanel.classList.remove("open");
    cartPanel.setAttribute("aria-hidden", "true");
  });
  checkout.addEventListener("click", onCheckout);
}

function renderYear() {
  const y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();
}

function renderProducts() {
  const grid = document.getElementById("product-grid");
  grid.innerHTML = "";
  state.products.forEach((p) => {
    const card = document.createElement("div");
    card.className = "card";

    const media = document.createElement("div");
    media.className = "card-media";
    const img = document.createElement("img");
    img.src = p.image;
    img.alt = p.name;
    // Open quick view on media click
    media.addEventListener("click", () => openProductModal(p.id));
    media.tabIndex = 0;
    media.setAttribute("role", "button");
    media.setAttribute("aria-label", `View ${p.name}`);
    media.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openProductModal(p.id); }
    });
    media.appendChild(img);

    const body = document.createElement("div");
    body.className = "card-body";
    const title = document.createElement("div");
    title.className = "card-title";
    title.textContent = p.name;
    title.tabIndex = 0;
    title.setAttribute("role", "button");
    title.setAttribute("aria-label", `View ${p.name}`);
    title.addEventListener("click", () => openProductModal(p.id));
    title.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openProductModal(p.id); }
    });
    // Variant selector
    const variantGroup = document.createElement("div");
    variantGroup.className = "variant-group";
    variantGroup.setAttribute("role", "radiogroup");
    variantGroup.setAttribute("aria-label", "Select variant");

    const currentVariant = getSelectedVariant(p.id);
    p.availableVariants.forEach((key) => {
      const variantId = `var-${p.id}-${key}`;
      const wrapper = document.createElement("div");
      wrapper.className = "variant-wrapper";
      const input = document.createElement("input");
      input.type = "radio";
      input.name = `variant-${p.id}`;
      input.id = variantId;
      input.value = key;
      input.checked = key === currentVariant;
      input.setAttribute("aria-label", VARIANTS[key].label);
      const label = document.createElement("label");
      label.className = `variant-option ${key === currentVariant ? "selected" : ""}`;
      label.setAttribute("for", variantId);
      label.textContent = VARIANTS[key].label;
      input.addEventListener("change", () => {
        setSelectedVariant(p.id, key);
        price.textContent = fmt(getVariantPrice(getSelectedVariant(p.id)));
        // update styles
        variantGroup.querySelectorAll(".variant-option").forEach((el) => el.classList.remove("selected"));
        label.classList.add("selected");
      });
      wrapper.appendChild(input);
      wrapper.appendChild(label);
      variantGroup.appendChild(wrapper);
    });

    const price = document.createElement("div");
    price.className = "card-price";
    price.textContent = fmt(getVariantPrice(currentVariant));
    const actions = document.createElement("div");
    actions.className = "card-actions";

    const qtyInput = document.createElement("input");
    qtyInput.type = "number";
    qtyInput.min = "1";
    qtyInput.value = "1";
    qtyInput.className = "qty-input";

    const addBtn = document.createElement("button");
    addBtn.className = "btn secondary";
    addBtn.textContent = "Add to Cart";
    addBtn.addEventListener("click", () => {
      addToCart(p.id, parseInt(qtyInput.value, 10) || 1, getSelectedVariant(p.id));
    });

    const viewBtn = document.createElement("button");
    viewBtn.className = "btn primary";
    viewBtn.textContent = "Quick View";
    viewBtn.addEventListener("click", () => openProductModal(p.id));

    actions.appendChild(qtyInput);
    actions.appendChild(addBtn);
    actions.appendChild(viewBtn);

    body.appendChild(title);
    body.appendChild(variantGroup);
    body.appendChild(price);
    body.appendChild(actions);

    card.appendChild(media);
    card.appendChild(body);
    grid.appendChild(card);
  });
}

function addToCart(productId, qty = 1, variantKey) {
  const product = state.products.find((p) => p.id === productId);
  if (!product) return;
  const variant = validateVariant(productId, variantKey) ? variantKey : getSelectedVariant(productId);
  const existing = state.cart.find((c) => c.productId === productId && c.variant === variant);
  if (existing) {
    existing.qty += qty;
  } else {
    state.cart.push({ productId, variant, qty });
  }
  persistCart();
  renderCart();
}

function removeFromCart(productId, variantKey) {
  state.cart = state.cart.filter((c) => !(c.productId === productId && c.variant === variantKey));
  persistCart();
  renderCart();
}

function updateQty(productId, variantKey, qty) {
  const item = state.cart.find((c) => c.productId === productId && c.variant === variantKey);
  if (!item) return;
  item.qty = Math.max(1, qty || 1);
  persistCart();
  renderCart();
}

function cartSubtotal() {
  return state.cart.reduce((sum, c) => {
    const p = state.products.find((x) => x.id === c.productId);
    const vPrice = c && VARIANTS[c.variant] ? VARIANTS[c.variant].price : (p ? p.price : 0);
    return sum + vPrice * c.qty;
  }, 0);
}

function renderCart() {
  const list = document.getElementById("cart-items");
  const subtotalEl = document.getElementById("cart-subtotal");
  const countEl = document.getElementById("cart-count");
  list.innerHTML = "";
  state.cart.forEach((c) => {
    const p = state.products.find((x) => x.id === c.productId);
    if (!p) return;
    const row = document.createElement("div");
    row.className = "cart-item";

    const img = document.createElement("img");
    img.src = p.image;
    img.alt = p.name;

    const info = document.createElement("div");
    const title = document.createElement("div");
    title.className = "cart-item-title";
    title.textContent = p.name;
    const meta = document.createElement("div");
    meta.className = "cart-item-meta";
    const vLabel = VARIANTS[c.variant] ? VARIANTS[c.variant].label : "Variant";
    const vPrice = VARIANTS[c.variant] ? VARIANTS[c.variant].price : (p ? p.price : 0);
    meta.textContent = `${vLabel} — ${fmt(vPrice)} each`;
    info.appendChild(title);
    info.appendChild(meta);

    const actions = document.createElement("div");
    actions.className = "cart-item-actions";
    const qty = document.createElement("input");
    qty.type = "number";
    qty.min = "1";
    qty.value = String(c.qty);
    qty.className = "qty-input";
    qty.addEventListener("change", (e) => updateQty(p.id, c.variant, parseInt(e.target.value, 10)));
    const remove = document.createElement("button");
    remove.className = "remove-button";
    remove.textContent = "Remove";
    remove.addEventListener("click", () => removeFromCart(p.id, c.variant));
    actions.appendChild(qty);
    actions.appendChild(remove);

    row.appendChild(img);
    row.appendChild(info);
    row.appendChild(actions);
    list.appendChild(row);
  });

  const sub = cartSubtotal();
  subtotalEl.textContent = fmt(sub);
  const totalItems = state.cart.reduce((n, c) => n + c.qty, 0);
  countEl.textContent = String(totalItems);
}

function persistCart() {
  try {
    localStorage.setItem("dfp_cart", JSON.stringify(state.cart));
  } catch (e) {}
}

function onCheckout() {
  if (state.cart.length === 0) return alert("Your cart is empty.");
  const lines = state.cart.map((c) => {
    const p = state.products.find((x) => x.id === c.productId);
    const vLabel = VARIANTS[c.variant] ? VARIANTS[c.variant].label : "Variant";
    const vPrice = VARIANTS[c.variant] ? VARIANTS[c.variant].price : (p ? p.price : 0);
    return `${p ? p.name : "Item"} (${vLabel}) x${c.qty} — ${fmt(vPrice * c.qty)}`;
  });
  const total = fmt(cartSubtotal());
  const subject = encodeURIComponent("DEEPFRIEDPHARZ Order");
  const body = encodeURIComponent(`Hi DFP team,%0D%0A%0D%0AI'd like to order:%0D%0A- ${lines.join("%0D%0A- ")}%0D%0A%0D%0ASubtotal: ${total}%0D%0A%0D%0AShipping address:%0D%0AName:%0D%0AAddress:%0D%0ACity, State, ZIP:%0D%0A%0D%0APayment preference (PayPal/CashApp/Venmo):%0D%0A%0D%0AThanks!`);
  // Update this email to your preferred inbox
  window.location.href = `mailto:orders@deepfriedpharz.com?subject=${subject}&body=${body}`;
}

// Start
document.addEventListener("DOMContentLoaded", init);

// Modal logic
let modalState = { open: false, productId: null, lastFocus: null };

function openProductModal(productId) {
  const p = state.products.find((x) => x.id === productId);
  if (!p) return;
  modalState.open = true;
  modalState.productId = productId;
  modalState.lastFocus = document.activeElement;
  const modal = document.getElementById("product-modal");
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
  document.getElementById("modal-title").textContent = p.name;
  const img = document.getElementById("modal-image");
  img.src = p.image;
  img.alt = p.name;
  // Build modal variant selector
  buildModalVariants(p);
  document.getElementById("modal-price").textContent = fmt(getVariantPrice(getSelectedVariant(p.id)));
  const qty = document.getElementById("modal-qty");
  qty.value = "1";
  const add = document.getElementById("modal-add");
  add.onclick = () => addToCart(p.id, parseInt(qty.value, 10) || 1, getSelectedVariant(p.id));
  const closeBtn = document.getElementById("modal-close");
  closeBtn.onclick = closeProductModal;
  // Backdrop click
  const backdrop = modal.querySelector(".modal-backdrop");
  backdrop.onclick = closeProductModal;
  // Trap focus
  setTimeout(() => closeBtn.focus(), 0);
  document.addEventListener("keydown", handleModalKeydown);
}

function closeProductModal() {
  const modal = document.getElementById("product-modal");
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
  modalState.open = false;
  document.removeEventListener("keydown", handleModalKeydown);
  if (modalState.lastFocus) modalState.lastFocus.focus();
}

// Variant helpers
function getSelectedVariant(productId) {
  const key = state.selection[productId];
  return validateVariant(productId, key) ? key : DEFAULT_VARIANT;
}

function setSelectedVariant(productId, variantKey) {
  const product = state.products.find((p) => p.id === productId);
  if (!product) return;
  if (!product.availableVariants.includes(variantKey)) return;
  state.selection[productId] = variantKey;
  persistSelection();
}

function validateVariant(productId, variantKey) {
  const product = state.products.find((p) => p.id === productId);
  return !!(product && product.availableVariants.includes(variantKey));
}

function getVariantPrice(variantKey) {
  return VARIANTS[variantKey] ? VARIANTS[variantKey].price : VARIANTS[DEFAULT_VARIANT].price;
}

function persistSelection() {
  try { localStorage.setItem("dfp_selection", JSON.stringify(state.selection)); } catch (e) {}
}

function buildModalVariants(p) {
  const info = document.querySelector(".modal-info");
  let container = document.getElementById("modal-variants");
  if (!container) {
    container = document.createElement("div");
    container.id = "modal-variants";
    container.className = "variant-group";
    container.setAttribute("role", "radiogroup");
    container.setAttribute("aria-label", "Select variant");
    info.insertBefore(container, document.getElementById("modal-price").parentElement);
  }
  container.innerHTML = "";
  const currentVariant = getSelectedVariant(p.id);
  p.availableVariants.forEach((key) => {
    const variantId = `modal-var-${p.id}-${key}`;
    const wrapper = document.createElement("div");
    wrapper.className = "variant-wrapper";
    const input = document.createElement("input");
    input.type = "radio";
    input.name = `modal-variant-${p.id}`;
    input.id = variantId;
    input.value = key;
    input.checked = key === currentVariant;
    input.setAttribute("aria-label", VARIANTS[key].label);
    const label = document.createElement("label");
    label.className = `variant-option ${key === currentVariant ? "selected" : ""}`;
    label.setAttribute("for", variantId);
    label.textContent = VARIANTS[key].label;
    input.addEventListener("change", () => {
      setSelectedVariant(p.id, key);
      document.getElementById("modal-price").textContent = fmt(getVariantPrice(getSelectedVariant(p.id)));
      container.querySelectorAll(".variant-option").forEach((el) => el.classList.remove("selected"));
      label.classList.add("selected");
    });
    wrapper.appendChild(input);
    wrapper.appendChild(label);
    container.appendChild(wrapper);
  });
}

function handleModalKeydown(e) {
  if (e.key === "Escape") {
    e.preventDefault();
    closeProductModal();
  }
  if (e.key === "Tab") {
    const modal = document.getElementById("product-modal");
    const focusables = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    const list = Array.from(focusables).filter(el => !el.hasAttribute("disabled"));
    if (!list.length) return;
    const first = list[0];
    const last = list[list.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault(); last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault(); first.focus();
    }
  }
}