const page = document.body.dataset.page;
const navigation = [
  ["Trang chủ", "index.html", "home"],
  ["Người cao tuổi", "senior.html", "senior"],
  ["Mẹ bỉm", "mom.html", "mom"],
  ["Em bé", "baby.html", "baby"],
];

function injectLayout() {
  document.querySelector(".site-header").innerHTML =
    `<div class="container header-topline"><span>Chào mừng bạn đến với MEBE – tạp hóa nhỏ, yêu thương lớn!</span><a href="mailto:hello@mebe.vn">✉ hello@mebe.vn</a></div><div class="container nav"><a class="brand" href="index.html">ME<i></i>BE</a><button class="menu-btn" aria-label="Mở menu">☰</button><nav class="nav-links">${navigation.map(([name, href, key]) => `<a class="${page === key ? "active" : ""}" href="${href}">${name}</a>`).join("")}<a class="nav-contact ${page === "contact" ? "active" : ""}" href="contact.html">Liên hệ</a></nav></div>`;
  document.querySelector(".site-footer").innerHTML =
    `<div class="container"><div class="footer-grid"><div class="footer-about"><a class="footer-brand" href="index.html"><svg class="footer-brand-mark" viewBox="0 0 56 56" aria-hidden="true"><path d="M8 17h5l4 20h25l5-16H16M21 43a4 4 0 1 0 0 .1M40 43a4 4 0 1 0 0 .1M24 13l-2-7m9 8V4m8 11 4-7" /><path d="M17 21c7 3 17 3 26 0" /></svg><span>MEBE</span></a><p>Tạp hóa gia đình, chọn điều tử tế cho người mình thương.</p></div><div class="footer-column"><h2 class="footer-title">Ghé MEBE</h2><p>45 Đường Hoa Nắng,<br>Quận 3, TP. Hồ Chí Minh</p><a class="footer-pill" href="https://maps.google.com/?q=45+Duong+Hoa+Nang+Quan+3+TP+Ho+Chi+Minh" target="_blank" rel="noreferrer"><span aria-hidden="true">⌖</span> Xem địa chỉ</a></div><div class="footer-column"><h2 class="footer-title">Liên hệ</h2><a class="footer-pill" href="tel:+84901234567"><span aria-hidden="true">⌕</span> 090 123 4567</a><a class="footer-pill" href="mailto:hello@mebe.vn"><span aria-hidden="true">✉</span> hello@mebe.vn</a></div><div class="footer-column footer-social-column"><h2 class="footer-title">Kết nối với MEBE</h2><div class="footer-socials" aria-label="Mạng xã hội"><span role="img" aria-label="Facebook">f</span><span role="img" aria-label="Pinterest">p</span><span role="img" aria-label="Instagram"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="18" cy="6" r="1" /></svg></span></div></div></div><div class="copyright"><span>© 2026 MEBE. Tạp hóa cho cả nhà.</span><nav aria-label="Liên kết cuối trang"><a href="index.html">Trang chủ</a><a href="contact.html">Hỗ trợ</a></nav></div></div><button class="back-to-top" type="button" aria-label="Lên đầu trang">↑</button>`;
  const button = document.querySelector(".menu-btn");
  button?.addEventListener("click", () =>
    document.querySelector(".nav-links").classList.toggle("open"),
  );
  document.querySelector(".back-to-top")?.addEventListener("click", () =>
    window.scrollTo({ top: 0, behavior: "smooth" }),
  );
}

async function applySeo() {
  try {
    const seo = await fetch("seo.json").then((r) => r.json());
    const item = seo.pages[page];
    if (!item) return;
    document.title = item.title;
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute("content", item.description);
  } catch (_) {
    /* Static HTML metadata remains available when opened without a local server. */
  }
}

async function renderProducts() {
  if (!["senior", "mom", "baby"].includes(page)) return;
  const grid = document.querySelector("#product-grid");
  try {
    const data = await fetch("products.json").then((r) => r.json());
    const products = data[page].map((item, index) => ({ ...item, id: index }));
    const categories = [...new Set(products.map((p) => p.category))];
    const filter = document.querySelector("#category-filter");
    filter.insertAdjacentHTML(
      "beforeend",
      categories.map((c) => `<option value="${c}">${c}</option>`).join(""),
    );
    const search = document.querySelector("#search-input");
    const count = document.querySelector("#product-count");
    const pagination = document.querySelector("#pagination");
    let currentPage = 1;
    const perPage = 8;
    const update = () => {
      const term = search.value.trim().toLocaleLowerCase("vi");
      const filtered = products.filter(
        (p) =>
          (filter.value === "all" || p.category === filter.value) &&
          `${p.name} ${p.category}`.toLocaleLowerCase("vi").includes(term),
      );
      const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
      currentPage = Math.min(currentPage, totalPages);
      count.textContent = `${filtered.length} sản phẩm`;
      const current = filtered.slice(
        (currentPage - 1) * perPage,
        currentPage * perPage,
      );
      grid.innerHTML = current.length
        ? current
            .map(
              (p) =>
                `<article class="product-card"><div class="product-image"><img loading="lazy" src="${p.image}" alt="${p.name}"><div class="product-actions"><button class="product-action" type="button" data-favorite aria-label="Thêm vào yêu thích" aria-pressed="false"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.8 8.8c0 5.2-8.8 10-8.8 10s-8.8-4.8-8.8-10A4.8 4.8 0 0 1 12 6.2a4.8 4.8 0 0 1 8.8 2.6Z"/></svg></button><a class="product-action" href="${p.image}" target="_blank" rel="noreferrer" aria-label="Xem ảnh sản phẩm kích thước lớn"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.8" cy="10.8" r="6.8"/><path d="m16 16 4.5 4.5M10.8 8v5.6M8 10.8h5.6"/></svg></a></div></div><div class="product-info"><p class="product-type">${p.category}</p><h3 class="product-name">${p.name}</h3><div class="price">${p.price}</div><a class="product-buy" href="contact.html">Liên hệ mua</a></div></article>`,
            )
            .join("")
        : '<div class="empty-results">Chưa tìm thấy sản phẩm phù hợp. Hãy thử một từ khóa khác nhé.</div>';
      pagination.innerHTML = Array.from(
        { length: totalPages },
        (_, i) =>
          `<button class="${i + 1 === currentPage ? "active" : ""}" data-page="${i + 1}" aria-label="Trang ${i + 1}">${i + 1}</button>`,
      ).join("");
    };
    grid.addEventListener("click", (event) => {
      const favorite = event.target.closest("[data-favorite]");
      if (!favorite) return;
      const isFavorite = favorite.getAttribute("aria-pressed") !== "true";
      favorite.setAttribute("aria-pressed", String(isFavorite));
      favorite.setAttribute(
        "aria-label",
        isFavorite ? "Bỏ khỏi yêu thích" : "Thêm vào yêu thích",
      );
    });
    search.addEventListener("input", () => {
      currentPage = 1;
      update();
    });
    filter.addEventListener("change", () => {
      currentPage = 1;
      update();
    });
    pagination.addEventListener("click", (e) => {
      const next = e.target.dataset.page;
      if (next) {
        currentPage = Number(next);
        update();
        window.scrollTo({
          top: document.querySelector(".shop-toolbar").offsetTop - 80,
          behavior: "smooth",
        });
      }
    });
    update();
  } catch (_) {
    grid.innerHTML =
      '<div class="empty-results">Không thể tải dữ liệu. Vui lòng mở dự án bằng một web server cục bộ.</div>';
  }
}

function setContactForm() {
  const form = document.querySelector("#contact-form");
  form?.addEventListener("submit", (event) => {
    event.preventDefault();
    document.querySelector("#form-message").textContent =
      "Cảm ơn bạn! MEBE đã nhận được lời nhắn và sẽ liên hệ sớm.";
    form.reset();
  });
}

injectLayout();
applySeo();
renderProducts();
setContactForm();
