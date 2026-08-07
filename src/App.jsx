import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AnimatedContent, ClickSpark, FadeContent, StarBorder } from "@appletosolutions/reactbits";
import {
  ArrowRight,
  Copy,
  ExternalLink,
  Mail,
  Menu,
  MessageCircle,
  Minus,
  Plus,
  Send,
  ShoppingBag,
  Camera,
  Trash2,
  X,
  ZoomIn,
} from "lucide-react";
import {
  CATEGORY_TILES,
  CONFIG,
  FEATURED_IDS,
  FAQS,
  FILTERS,
  HERO_NOTES,
  ASOLEA_ASSETS,
  INSTAGRAM_POSTS,
  NEW_COLLECTION_IDS,
  PRODUCTS,
  formatMoney,
  getColorHex,
} from "./data";

const STORAGE_KEY = "asolea-cart-v1";
const THANK_YOU_MESSAGE =
  "Gracias por tu compra. En los próximos minutos nos comunicaremos contigo para confirmar disponibilidad, el valor del envío y enviarte los datos para realizar el pago.";
const SUPPORT_MESSAGE = "Hola, tengo una duda sobre Asolea.";

const INITIAL_CHECKOUT_FORM = {
  name: "",
  phone: "",
  email: "",
  city: "",
  address: "",
  notes: "",
};

const INITIAL_PRODUCT_MODAL = {
  open: false,
  productId: null,
  imageIndex: 0,
  size: null,
  color: null,
  zoom: 1.35,
};

function loadCart() {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function buildCartKey(item) {
  return [item.productId, item.size || "-", item.color || "-"].join("|");
}

function getVariantLabel(item) {
  const parts = [];

  if (item.size) {
    parts.push(`Talla ${item.size}`);
  }

  if (item.color) {
    parts.push(item.color);
  }

  return parts.length ? parts.join(" · ") : "Sin variante";
}

function buildWhatsAppUrl(message) {
  if (CONFIG.whatsappNumber) {
    return `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`;
  }

  return `https://wa.me/?text=${encodeURIComponent(message)}`;
}

function buildEmailUrl(message) {
  const recipient = CONFIG.email || "";
  const subject = "Pedido Asolea";
  return `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
}

function buildCheckoutMessage(cartItems, form, subtotal) {
  const lines = ["Hola, quiero realizar este pedido de Asolea.", ""];

  cartItems.forEach((item) => {
    const quantity = item.qty > 1 ? ` x${item.qty}` : "";
    lines.push(`• ${item.product.name}${item.variant ? ` – ${item.variant}` : ""}${quantity}`);
  });

  lines.push("");
  lines.push(`Subtotal: ${formatMoney(subtotal)}`);
  lines.push("");
  lines.push(`Nombre: ${form.name}`);
  lines.push(`Celular: ${form.phone}`);
  lines.push(`Correo: ${form.email}`);
  lines.push(`Ciudad: ${form.city}`);
  lines.push(`Dirección: ${form.address}`);

  if (form.notes.trim()) {
    lines.push(`Observaciones: ${form.notes.trim()}`);
  }

  lines.push("");
  lines.push("Quedo atenta al valor del envío y a los datos para realizar el pago.");

  return lines.join("\n");
}

function scrollToSection(id) {
  if (typeof document === "undefined") {
    return;
  }

  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function SectionHeader({ eyebrow, title, description, right }) {
  return (
    <div className="section-head section-head--split">
      <div>
        <AnimatedContent direction="vertical" distance={24} duration={500} animateOpacity>
          <div>
            <span className="eyebrow">{eyebrow}</span>
            <h2>{title}</h2>
          </div>
        </AnimatedContent>
      </div>
      {right ?? <p>{description}</p>}
    </div>
  );
}

function App() {
  const [filter, setFilter] = useState("Todos");
  const [cart, setCart] = useState(loadCart);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [productModal, setProductModal] = useState(INITIAL_PRODUCT_MODAL);
  const [checkoutForm, setCheckoutForm] = useState(INITIAL_CHECKOUT_FORM);
  const [toast, setToast] = useState("");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const productsById = useMemo(() => new Map(PRODUCTS.map((product) => [product.id, product])), []);

  const cartItems = useMemo(
    () =>
      cart
        .map((item) => {
          const product = productsById.get(item.productId);
          if (!product) {
            return null;
          }

          return {
            ...item,
            product,
            variant: getVariantLabel(item),
            lineTotal: typeof product.price === "number" ? product.price * item.qty : 0,
          };
        })
        .filter(Boolean),
    [cart, productsById],
  );

  const subtotal = useMemo(() => cartItems.reduce((total, item) => total + item.lineTotal, 0), [cartItems]);

  const featuredProducts = useMemo(
    () => FEATURED_IDS.map((id) => productsById.get(id)).filter(Boolean),
    [productsById],
  );

  const newCollectionProducts = useMemo(
    () => NEW_COLLECTION_IDS.map((id) => productsById.get(id)).filter(Boolean),
    [productsById],
  );

  const filteredProducts = useMemo(() => {
    if (filter === "Todos") {
      return PRODUCTS;
    }

    return PRODUCTS.filter((product) => product.category === filter);
  }, [filter]);

  const selectedProduct = productModal.productId ? productsById.get(productModal.productId) : null;
  const activeOverlay = cartOpen || checkoutOpen || productModal.open;

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    const targetId = window.location.hash.replace("#", "");
    if (!targetId) {
      return;
    }

    const frame = window.requestAnimationFrame(() => {
      document.getElementById(targetId)?.scrollIntoView({ behavior: "auto", block: "start" });
    });

    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") {
      return;
    }

    document.body.classList.toggle("menu-open", activeOverlay);
    return () => {
      document.body.classList.remove("menu-open");
    };
  }, [activeOverlay]);

  useEffect(() => {
    function handleEscape(event) {
      if (event.key !== "Escape") {
        return;
      }

      if (checkoutOpen) {
        setCheckoutOpen(false);
        return;
      }

      if (productModal.open) {
        setProductModal(INITIAL_PRODUCT_MODAL);
        return;
      }

      if (cartOpen) {
        setCartOpen(false);
      }
    }

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [cartOpen, checkoutOpen, productModal.open]);

  useEffect(() => {
    if (!toast) {
      return undefined;
    }

    const timer = window.setTimeout(() => setToast(""), 3500);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const cartCount = cart.reduce((total, item) => total + item.qty, 0);

  function showToast(message) {
    setToast(message);
  }

  function openCart() {
    setProductModal(INITIAL_PRODUCT_MODAL);
    setCheckoutOpen(false);
    setCartOpen(true);
  }

  function closeCart() {
    setCartOpen(false);
  }

  function openProduct(productId) {
    const product = productsById.get(productId);
    if (!product) {
      return;
    }

    setCartOpen(false);
    setCheckoutOpen(false);
    setProductModal({
      open: true,
      productId,
      imageIndex: 0,
      size: product.sizes[0] || null,
      color: product.colors[0] || null,
      zoom: 1.35,
    });
  }

  function closeProduct() {
    setProductModal(INITIAL_PRODUCT_MODAL);
  }

  function addToCart(product, options = {}) {
    if (product.status !== "available" || typeof product.price !== "number") {
      showToast("Este producto está próximamente. Escríbenos por WhatsApp para reservarlo.");
      return;
    }

    const item = {
      productId: product.id,
      size: options.size ?? product.sizes[0] ?? null,
      color: options.color ?? product.colors[0] ?? null,
      qty: 1,
    };
    const key = buildCartKey(item);

    setCart((current) => {
      const next = [...current];
      const existingIndex = next.findIndex((currentItem) => buildCartKey(currentItem) === key);

      if (existingIndex >= 0) {
        next[existingIndex] = {
          ...next[existingIndex],
          qty: next[existingIndex].qty + 1,
        };
        return next;
      }

      return [...next, item];
    });

    showToast(`${product.name} se agregó al carrito.`);
  }

  function updateQuantity(itemKey, delta) {
    setCart((current) =>
      current
        .map((item) => {
          const key = buildCartKey(item);
          if (key !== itemKey) {
            return item;
          }

          return {
            ...item,
            qty: item.qty + delta,
          };
        })
        .filter((item) => item.qty > 0),
    );
  }

  function removeItem(itemKey) {
    setCart((current) => current.filter((item) => buildCartKey(item) !== itemKey));
  }

  function clearCart() {
    setCart([]);
    showToast("Carrito vacío.");
  }

  function handleCheckoutOpen() {
    if (!cart.length) {
      showToast("Agrega productos al carrito antes de finalizar la compra.");
      return;
    }

    setCartOpen(false);
    setToast("");
    setCheckoutOpen(true);
  }

  async function copyCheckoutMessage(message) {
    try {
      await navigator.clipboard.writeText(message);
      showToast("Resumen copiado.");
    } catch {
      showToast("No se pudo copiar el resumen.");
    }
  }

  function sendOrder(method) {
    if (!cart.length) {
      showToast("Agrega productos al carrito antes de enviar el pedido.");
      return;
    }

    if (!checkoutForm.name || !checkoutForm.phone || !checkoutForm.email || !checkoutForm.city || !checkoutForm.address) {
      showToast("Completa nombre, celular, correo, ciudad y dirección.");
      return;
    }

    const message = buildCheckoutMessage(cartItems, checkoutForm, subtotal);
    const url = method === "email" ? buildEmailUrl(message) : buildWhatsAppUrl(message);

    window.open(url, "_blank", "noopener,noreferrer");
    showToast(THANK_YOU_MESSAGE);
    setCheckoutOpen(false);
    setCartOpen(false);
  }

  function sendSupportMessage() {
    window.open(buildWhatsAppUrl(SUPPORT_MESSAGE), "_blank", "noopener,noreferrer");
  }

  function selectCategory(nextFilter) {
    setFilter(nextFilter);
    scrollToSection("shop");
  }

  function handleNavClick() {
    setMobileNavOpen(false);
  }

  return (
    <div className="page-shell">
      <header className="site-header">
        <div className="site-header__brand">
          <a className="brand-mark" href="#inicio" aria-label="Ir al inicio">
            Asolea
          </a>
          <span className="brand-subtitle">Colección resort</span>
        </div>

        <button
          className="icon-button site-header__menu-toggle"
          type="button"
          onClick={() => setMobileNavOpen((current) => !current)}
          aria-label={mobileNavOpen ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={mobileNavOpen}
        >
          <span className="icon-slot" aria-hidden="true">
            {mobileNavOpen ? <X /> : <Menu />}
          </span>
        </button>

        <nav className={`site-nav ${mobileNavOpen ? "is-open" : ""}`} aria-label="Navegación principal">
          <a href="#inicio" onClick={handleNavClick}>Inicio</a>
          <a href="#tienda" onClick={handleNavClick}>Tienda</a>
          <a href="#nosotros" onClick={handleNavClick}>Nosotros</a>
          <a href="#preguntas" onClick={handleNavClick}>Preguntas frecuentes</a>
          <a href="#instagram" onClick={handleNavClick}>Instagram</a>
        </nav>

        <button className="icon-button cart-launch" type="button" onClick={openCart} aria-label="Abrir carrito">
          <span className="icon-slot" aria-hidden="true">
            <ShoppingBag />
          </span>
          <span className="cart-count" data-cart-count>
            {cartCount}
          </span>
        </button>
      </header>

      <main>
        <section className="hero" id="inicio">
          <img
            className="hero__image"
            src={ASOLEA_ASSETS.hero}
            alt="Escena editorial de Asolea junto al mar al atardecer"
          />
          <div className="hero__overlay" aria-hidden="true" />

          <div className="hero__content">
            <div className="hero__copy">
              <span className="eyebrow">Resort luxury swimwear</span>
              <h1>Asolea</h1>
              <p className="hero__lead">
                Descubre una colección diseñada para acompañarte en cada viaje, cada atardecer y cada instante bajo
                el sol. Piezas elegantes, versátiles y atemporales, creadas para mujeres que disfrutan el verano con
                confianza, estilo y autenticidad.
              </p>
            </div>

            <div className="hero__actions">
              <ClickSpark sparkColor="#c7a46a" sparkCount={12} sparkRadius={28} duration={420}>
                <StarBorder
                  as="button"
                  type="button"
                  color="#c7a46a"
                  speed="3s"
                  className="star-border-button"
                  onClick={() => scrollToSection("destacados")}
                >
                  Comprar ahora
                  <span className="icon-slot" aria-hidden="true">
                    <ArrowRight />
                  </span>
                </StarBorder>
              </ClickSpark>

              <button className="button button--light" type="button" onClick={() => scrollToSection("coleccion")}>
                Ver nueva colección
              </button>
            </div>

            <ul className="hero__notes" aria-label="Características de Asolea">
              {HERO_NOTES.map((note) => (
                <li key={note}>{note}</li>
              ))}
            </ul>
          </div>
        </section>

        <section className="band band--sand" id="tienda">
          <div className="shell">
            <SectionHeader
              eyebrow="Tienda"
              title="Explora la colección"
              description="Una experiencia visual, limpia y muy clara para descubrir bikinis, enterizos, pareos y lo que viene después."
            />

            <FadeContent blur duration={700} threshold={0.1}>
              <div className="category-grid" id="category-grid">
                {CATEGORY_TILES.map((tile) => (
                  <button
                    key={tile.filter}
                    className={`category-tile ${tile.wide ? "category-tile--wide" : ""} ${
                      filter === tile.filter ? "is-active" : ""
                    }`}
                    type="button"
                    onClick={() => selectCategory(tile.filter)}
                  >
                    <img src={tile.image} alt="" aria-hidden="true" loading="lazy" />
                    <span className="category-tile__overlay">
                      <span className="category-tile__eyebrow">{tile.eyebrow}</span>
                      <strong>{tile.title}</strong>
                    </span>
                  </button>
                ))}
              </div>
            </FadeContent>
          </div>
        </section>

        <section className="band band--ivory" id="destacados">
          <div className="shell">
            <SectionHeader
              eyebrow="Productos destacados"
              title="Las piezas que definen la temporada"
              description="Selecciones pensadas para abrir la colección con el tono de Asolea: sofisticación, calma y una sensación inmediata de vacaciones."
            />

            <FadeContent blur duration={700} threshold={0.08}>
              <div className="product-grid">
                {featuredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onOpen={openProduct}
                    onQuickAdd={addToCart}
                  />
                ))}
              </div>
            </FadeContent>
          </div>
        </section>

        <section className="band band--collection" id="coleccion">
          <div className="shell collection-layout">
            <div className="collection-layout__visual">
              <img
                className="collection-layout__image"
                src={ASOLEA_ASSETS.enterizos}
                alt="Nueva colección Asolea en una piscina infinita"
                loading="lazy"
              />
            </div>

            <div className="collection-layout__copy">
              <span className="eyebrow">Nueva colección</span>
              <h2>Piezas pensadas para el viaje perfecto</h2>
              <p>
                Una selección que mezcla marfil, arena, coral y azul océano para construir una colección serena,
                luminosa y muy visual.
              </p>

              <FadeContent blur duration={650} threshold={0.12}>
                <div className="product-grid product-grid--compact">
                  {newCollectionProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onOpen={openProduct}
                      onQuickAdd={addToCart}
                    />
                  ))}
                </div>
              </FadeContent>
            </div>
          </div>
        </section>

        <section className="band band--shop" id="shop">
          <div className="shell">
            <SectionHeader
              eyebrow="Tienda"
              title="Compra por categoría"
              description="Filtra la colección y revisa cada pieza con sus fotos, tallas, colores, precio y disponibilidad."
              right={
                <div className="segmented-control" id="category-filters" role="tablist" aria-label="Filtrar productos">
                  {FILTERS.map((item) => (
                    <button
                      key={item}
                      className={`segmented-control__item ${filter === item ? "is-active" : ""}`}
                      type="button"
                      onClick={() => setFilter(item)}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              }
            />

            <FadeContent blur duration={700} threshold={0.08}>
              <div className="product-grid product-grid--shop" id="shop-grid" aria-live="polite">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onOpen={openProduct}
                    onQuickAdd={addToCart}
                  />
                ))}
              </div>
            </FadeContent>
          </div>
        </section>

        <section className="band band--about" id="nosotros">
          <div className="shell about-layout">
            <div className="about-layout__copy">
              <span className="eyebrow">Nosotros</span>
              <h2>Elegancia que acompaña cada viaje</h2>
              <p>
                Creemos que cada mujer merece vivir el verano con confianza, elegancia y libertad. Por eso diseñamos
                piezas que realzan la belleza natural, combinando siluetas atemporales, detalles cuidadosamente
                seleccionados y una calidad pensada para acompañarte en cada destino.
              </p>
              <p>
                Más que vestidos de baño, creamos experiencias para esos momentos que se convierten en recuerdos: un
                amanecer frente al mar, una tarde bajo el sol, una escapada inesperada o unas vacaciones soñadas.
              </p>
              <p>
                Cada colección está inspirada en la sofisticación, la calidez del verano y la esencia de una mujer que
                disfruta cada instante con autenticidad.
              </p>
              <p>
                En Asolea creemos que la elegancia no necesita exagerar; se refleja en los pequeños detalles, en la
                calidad de cada prenda y en la confianza con la que la llevas.
              </p>
              <p>Bienvenida a Asolea, donde el sol viste elegancia y cada mujer brilla con luz propia.</p>
            </div>

            <div className="about-layout__visual">
              <img
                className="about-layout__image"
                src={ASOLEA_ASSETS.pareos}
                alt="Asolea en una terraza frente al mar durante el atardecer"
                loading="lazy"
              />
            </div>
          </div>
        </section>

        <section className="band band--faq" id="preguntas">
          <div className="shell">
            <div className="section-head">
              <div>
                <span className="eyebrow">Preguntas frecuentes</span>
                <h2>Todo lo que necesitas antes de comprar</h2>
              </div>
              <p>Respuestas rápidas para que el proceso sea claro, elegante y sin fricción.</p>
            </div>

            <div className="faq-list">
              {FAQS.map((faq) => (
                <details key={faq.question}>
                  <summary>{faq.question}</summary>
                  <p>{faq.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="band band--instagram" id="instagram">
          <div className="shell">
            <div className="section-head section-head--split">
              <div>
                <span className="eyebrow">Instagram</span>
                <h2>Lo último de Asolea</h2>
              </div>

              <a
                className="button button--dark button--inline"
                href={CONFIG.instagramUrl}
                target="_blank"
                rel="noreferrer"
              >
                <span className="icon-slot" aria-hidden="true">
                  <Camera />
                </span>
                Seguir la marca
                <span className="icon-slot" aria-hidden="true">
                  <ExternalLink />
                </span>
              </a>
            </div>

            <FadeContent blur duration={700} threshold={0.1}>
              <div className="instagram-grid" id="instagram-grid" aria-live="polite">
                {INSTAGRAM_POSTS.map((post) => (
                  <article className="instagram-card" key={post.title}>
                    <img src={post.image} alt={post.title} loading="lazy" />
                    <div className="instagram-card__overlay">
                      <strong>{post.title}</strong>
                      <span>{post.caption}</span>
                    </div>
                  </article>
                ))}
              </div>
            </FadeContent>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="shell site-footer__inner">
          <div>
            <strong className="brand-mark brand-mark--footer">Asolea</strong>
            <p>Pedidos por WhatsApp, revisión manual y atención personalizada para cada compra.</p>
          </div>
          <div className="site-footer__links">
            <a href="#inicio">Inicio</a>
            <a href="#tienda">Tienda</a>
            <a href="#preguntas">Preguntas frecuentes</a>
          </div>
        </div>
      </footer>

      <button className="whatsapp-fab" type="button" onClick={sendSupportMessage} aria-label="Abrir WhatsApp">
        <span className="icon-slot" aria-hidden="true">
          <MessageCircle />
        </span>
      </button>

      <AnimatePresence>
        {activeOverlay ? (
          <motion.button
            className="overlay"
            type="button"
            aria-label="Cerrar capas abiertas"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              if (checkoutOpen) {
                setCheckoutOpen(false);
                return;
              }

              if (productModal.open) {
                setProductModal(INITIAL_PRODUCT_MODAL);
                return;
              }

              setCartOpen(false);
            }}
          />
        ) : null}
      </AnimatePresence>

      <aside
        className={`cart-drawer ${cartOpen ? "is-open" : ""} ${checkoutOpen ? "is-checkout-hidden" : ""}`}
        aria-hidden={!cartOpen}
      >
        <div className="drawer__header">
          <div>
            <span className="eyebrow">Carrito</span>
            <h2>Tu selección</h2>
          </div>
          <button className="icon-button" type="button" onClick={closeCart} aria-label="Cerrar carrito">
            <span className="icon-slot" aria-hidden="true">
              <X />
            </span>
          </button>
        </div>

        <div className="drawer__body">
          {!cartItems.length ? (
            <div className="drawer__empty">
              <p>No has agregado productos todavía.</p>
              <p>Explora la colección y vuelve aquí cuando quieras finalizar tu pedido.</p>
            </div>
          ) : (
            cartItems.map((item) => (
              <div className="drawer-item" key={buildCartKey(item)}>
                <img className="drawer-item__image" src={item.product.images[0]} alt={item.product.name} loading="lazy" />

                <div className="drawer-item__body">
                  <h3 className="drawer-item__title">{item.product.name}</h3>
                  <p className="drawer-item__meta">{item.variant}</p>
                  <p className="drawer-item__meta">
                    Cantidad: {item.qty}
                    <br />
                    <span className="drawer-item__price">{formatMoney(item.lineTotal)}</span>
                  </p>
                  <button className="card-action" type="button" onClick={() => openProduct(item.product.id)}>
                    Ver producto
                  </button>
                </div>

                <div className="drawer-item__actions">
                  <div className="quantity-stepper">
                    <button
                      className="icon-button"
                      type="button"
                      onClick={() => updateQuantity(buildCartKey(item), -1)}
                      aria-label={`Disminuir cantidad de ${item.product.name}`}
                    >
                      <span className="icon-slot" aria-hidden="true">
                        <Minus />
                      </span>
                    </button>
                    <span>{item.qty}</span>
                    <button
                      className="icon-button"
                      type="button"
                      onClick={() => updateQuantity(buildCartKey(item), 1)}
                      aria-label={`Aumentar cantidad de ${item.product.name}`}
                    >
                      <span className="icon-slot" aria-hidden="true">
                        <Plus />
                      </span>
                    </button>
                  </div>

                  <button
                    className="icon-button"
                    type="button"
                    onClick={() => removeItem(buildCartKey(item))}
                    aria-label={`Eliminar ${item.product.name}`}
                  >
                    <span className="icon-slot" aria-hidden="true">
                      <Trash2 />
                    </span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="drawer__footer">
          <div className="drawer__total">
            <span>Subtotal</span>
            <strong>{formatMoney(subtotal)}</strong>
          </div>
          <p className="drawer__note">
            Al finalizar compra generamos el pedido para revisarlo contigo y confirmar disponibilidad, envío y pago.
          </p>
          <div className="drawer__actions">
            <button className="button button--dark" type="button" onClick={handleCheckoutOpen}>
              Finalizar compra
              <span className="icon-slot" aria-hidden="true">
                <Send />
              </span>
            </button>
            <button className="button button--light" type="button" onClick={clearCart}>
              Vaciar carrito
            </button>
          </div>
        </div>
      </aside>

      <AnimatePresence>
        {productModal.open && selectedProduct ? (
          <div className="modal modal--product" aria-hidden="false">
            <motion.div
              className="modal__panel"
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.98 }}
              transition={{ duration: 0.22 }}
            >
              <button className="icon-button modal__close" type="button" onClick={closeProduct} aria-label="Cerrar detalle">
                <span className="icon-slot" aria-hidden="true">
                  <X />
                </span>
              </button>

              <div className="modal__content">
                <div className="modal__grid">
                  <div className="modal__media">
                    <div
                      className={`modal__media-main ${productModal.zoom > 1.02 ? "is-zooming" : ""}`}
                      style={{ cursor: "zoom-in" }}
                    >
                      <img
                        src={selectedProduct.images[productModal.imageIndex] || selectedProduct.images[0]}
                        alt={selectedProduct.name}
                        style={{ transform: `scale(${productModal.zoom})` }}
                      />
                      <span className="modal__zoom-hint">
                        <span className="icon-slot" aria-hidden="true">
                          <ZoomIn />
                        </span>
                        Zoom
                      </span>
                    </div>

                    <div className="modal__thumbs">
                      {selectedProduct.images.map((image, index) => (
                        <button
                          key={image}
                          className={`modal__thumb ${productModal.imageIndex === index ? "is-active" : ""}`}
                          type="button"
                          onClick={() => setProductModal((current) => ({ ...current, imageIndex: index }))}
                          aria-label={`Ver foto ${index + 1} de ${selectedProduct.name}`}
                        >
                          <img src={image} alt="" aria-hidden="true" loading="lazy" />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="modal__info">
                    <div>
                      <span className="modal__section-label">{selectedProduct.category}</span>
                      <h2>{selectedProduct.name}</h2>
                    </div>

                    <div className="modal__price">
                      {typeof selectedProduct.price === "number"
                        ? formatMoney(selectedProduct.price)
                        : "Próximamente"}
                    </div>

                    <p className="modal__description">{selectedProduct.description}</p>

                    <span
                      className={`modal__stock ${selectedProduct.status === "soon" ? "is-soon" : ""}`}
                    >
                      {selectedProduct.availability}
                    </span>

                    <div>
                      <span className="modal__section-label">Colores disponibles</span>
                      <div className="variant-group">
                        {selectedProduct.colors.map((color) => (
                          <button
                            key={color}
                            className={`swatch ${productModal.color === color ? "is-selected" : ""}`}
                            type="button"
                            style={{ backgroundColor: getColorHex(color) }}
                            onClick={() => setProductModal((current) => ({ ...current, color }))}
                            aria-label={`Seleccionar color ${color}`}
                            title={color}
                          />
                        ))}
                      </div>
                    </div>

                    <div>
                      <span className="modal__section-label">Tallas</span>
                      <div className="variant-group">
                        {(selectedProduct.sizes.length ? selectedProduct.sizes : ["Única"]).map((size) => (
                          <button
                            key={size}
                            className={`size-chip ${productModal.size === size ? "is-selected" : ""}`}
                            type="button"
                            onClick={() => setProductModal((current) => ({ ...current, size }))}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="zoom-control">
                      <div className="zoom-control__header">
                        <span className="modal__section-label" style={{ marginBottom: 0 }}>
                          Zoom
                        </span>
                        <strong>{Math.round(productModal.zoom * 100)}%</strong>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="2.2"
                        step="0.05"
                        value={productModal.zoom}
                        onChange={(event) =>
                          setProductModal((current) => ({
                            ...current,
                            zoom: Number(event.target.value),
                          }))
                        }
                      />
                    </div>

                    <div className="modal__footer-actions">
                      {selectedProduct.status === "soon" ? (
                        <button
                          className="button button--dark"
                          type="button"
                          onClick={() => openWhatsAppMessage(`Hola, me interesa ${selectedProduct.name} de Asolea.`)}
                        >
                          Consultar lanzamiento
                          <span className="icon-slot" aria-hidden="true">
                            <MessageCircle />
                          </span>
                        </button>
                      ) : (
                        <button
                          className="button button--dark"
                          type="button"
                          onClick={() =>
                            addToCart(selectedProduct, {
                              size: productModal.size || selectedProduct.sizes[0] || null,
                              color: productModal.color || selectedProduct.colors[0] || null,
                            })
                          }
                        >
                          Agregar al carrito
                          <span className="icon-slot" aria-hidden="true">
                            <ShoppingBag />
                          </span>
                        </button>
                      )}

                      <button className="button button--light" type="button" onClick={closeProduct}>
                        Cerrar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {checkoutOpen ? (
          <div className="modal modal--checkout" aria-hidden="false">
            <motion.div
              className="modal__panel modal__panel--checkout"
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.98 }}
              transition={{ duration: 0.22 }}
            >
              <button
                className="icon-button modal__close"
                type="button"
                onClick={() => setCheckoutOpen(false)}
                aria-label="Cerrar checkout"
              >
                <span className="icon-slot" aria-hidden="true">
                  <X />
                </span>
              </button>

              <div className="modal__content">
                <span className="eyebrow">Finalizar compra</span>
                <h2>Datos de contacto</h2>
                <p className="drawer__note" style={{ marginTop: 12 }}>
                  No hay pago automático. Enviamos el pedido para revisarlo contigo y confirmar disponibilidad, envío
                  y pago.
                </p>

                <div className="checkout-summary">
                  <strong>Resumen del pedido</strong>
                  <div className="checkout-summary__items">
                    {cartItems.map((item) => (
                      <div className="checkout-summary__row" key={buildCartKey(item)}>
                        <span>
                          {item.product.name}
                          {item.variant ? ` · ${item.variant}` : ""}
                        </span>
                        <strong>{formatMoney(item.lineTotal)}</strong>
                      </div>
                    ))}
                  </div>
                  <div className="checkout-summary__row">
                    <span>Subtotal</span>
                    <strong>{formatMoney(subtotal)}</strong>
                  </div>
                </div>

                <form
                  className="checkout-form"
                  onSubmit={(event) => {
                    event.preventDefault();
                    sendOrder("whatsapp");
                  }}
                >
                  <div className="checkout-form__grid">
                    <label className="field">
                      <span>Nombre</span>
                      <input
                        value={checkoutForm.name}
                        onChange={(event) =>
                          setCheckoutForm((current) => ({ ...current, name: event.target.value }))
                        }
                        required
                      />
                    </label>

                    <label className="field">
                      <span>Celular</span>
                      <input
                        value={checkoutForm.phone}
                        onChange={(event) =>
                          setCheckoutForm((current) => ({ ...current, phone: event.target.value }))
                        }
                        required
                      />
                    </label>

                    <label className="field">
                      <span>Correo</span>
                      <input
                        type="email"
                        value={checkoutForm.email}
                        onChange={(event) =>
                          setCheckoutForm((current) => ({ ...current, email: event.target.value }))
                        }
                        required
                      />
                    </label>

                    <label className="field">
                      <span>Ciudad</span>
                      <input
                        value={checkoutForm.city}
                        onChange={(event) =>
                          setCheckoutForm((current) => ({ ...current, city: event.target.value }))
                        }
                        required
                      />
                    </label>
                  </div>

                  <label className="field">
                    <span>Dirección</span>
                    <input
                      value={checkoutForm.address}
                      onChange={(event) =>
                        setCheckoutForm((current) => ({ ...current, address: event.target.value }))
                      }
                      required
                    />
                  </label>

                  <label className="field">
                    <span>Observaciones</span>
                    <textarea
                      value={checkoutForm.notes}
                      onChange={(event) =>
                        setCheckoutForm((current) => ({ ...current, notes: event.target.value }))
                      }
                    />
                  </label>

                  <div className="checkout-actions">
                    <button className="button button--dark" type="submit">
                      Enviar por WhatsApp
                      <span className="icon-slot" aria-hidden="true">
                        <Send />
                      </span>
                    </button>

                    <button className="button button--light" type="button" onClick={() => sendOrder("email")}>
                      Enviar por correo
                      <span className="icon-slot" aria-hidden="true">
                        <Mail />
                      </span>
                    </button>

                    <button
                      className="button button--light"
                      type="button"
                      onClick={() => copyCheckoutMessage(buildCheckoutMessage(cartItems, checkoutForm, subtotal))}
                    >
                      Copiar resumen
                      <span className="icon-slot" aria-hidden="true">
                        <Copy />
                      </span>
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>

      <div className={`toast ${toast ? "is-visible" : ""}`} role="status" aria-live="polite" aria-atomic="true">
        {toast}
      </div>
    </div>
  );
}

function ProductCard({ product, onOpen, onQuickAdd }) {
  const quickAddDisabled = product.status !== "available" || typeof product.price !== "number";

  return (
    <article className="product-card">
      <button
        className="product-card__media"
        type="button"
        onClick={() => onOpen(product.id)}
        aria-label={`Ver detalles de ${product.name}`}
      >
        <img src={product.images[0]} alt={product.name} loading="lazy" />
        <span className="product-card__badge">
          {product.status === "soon" ? "Próximamente" : product.featured ? "Destacado" : product.availability}
        </span>
      </button>

      <div className="product-card__body">
        <span className="product-card__category">{product.category}</span>
        <h3 className="product-card__title">{product.name}</h3>
        <p className="product-card__description">{product.description}</p>

        <div className="product-card__meta">
          {product.colors.slice(0, 3).map((color) => (
            <span className="chip" key={color}>
              {color}
            </span>
          ))}
          {(product.sizes.length ? product.sizes : ["Única"]).slice(0, 3).map((size) => (
            <span className="chip" key={size}>
              {size}
            </span>
          ))}
        </div>

        <div className="product-card__footer">
          <div>
            <strong className="price">{formatMoney(product.price)}</strong>
            <span className={`status ${product.status === "soon" ? "is-soon" : "is-available"}`}>
              {product.availability}
            </span>
          </div>

          <div style={{ display: "flex", gap: 8 }}>
            <button className="card-action" type="button" onClick={() => onOpen(product.id)}>
              Detalles
            </button>
            <button
              className="icon-button"
              type="button"
              disabled={quickAddDisabled}
              onClick={() => onQuickAdd(product)}
              aria-label={`Agregar ${product.name} al carrito`}
            >
              <span className="icon-slot" aria-hidden="true">
                <ShoppingBag />
              </span>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

function openWhatsAppMessage(message) {
  window.open(buildWhatsAppUrl(message), "_blank", "noopener,noreferrer");
}

export default App;
