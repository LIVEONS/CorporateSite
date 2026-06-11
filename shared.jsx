/* =========================================================================
   shared.jsx — site-wide shell: helpers, Header, Footer, PageApp
   Loaded on every page before the page script.
   ========================================================================= */

/* ---------- image asset paths ---------- */
const IMAGE_ASSETS = Object.freeze({
  logo: "assets/images/liveons-logo.svg",
  heroMain: "assets/images/liveons-hero-main.jpg",
  heroPoster: "assets/images/liveons-hero-poster.jpg",
  serviceInfluence: "assets/images/liveons-service-influence.jpg",
  servicePromotion: "assets/images/liveons-service-promotion.jpg",
  serviceSystem: "assets/images/liveons-service-system.jpg",
  representativePortrait: "assets/images/liveons-representative-portrait.jpg",
});

/* ---------- video asset paths ---------- */
const VIDEO_ASSETS = Object.freeze({
  heroMain: "assets/videos/liveons-hero-main.mp4",
  heroMainMobile: "assets/videos/liveons-hero-main-mobile.mp4",
});

/* ---------- tiny helpers ---------- */
const Ph = ({ label, className = "", dark = false, style, src, alt, position = "center" }) => {
  const [failed, setFailed] = React.useState(false);
  const showImage = !!src && !failed;
  return (
    <div className={"ph" + (dark ? " ph--dark" : "") + (showImage ? " ph--image" : "") + (className ? " " + className : "")}
         data-label={label} style={style} aria-label={showImage ? (alt || label) : "画像プレースホルダー: " + label} role="img">
      {showImage && (
        <img src={src} alt={alt || ""} style={{ objectPosition: position }} onError={() => setFailed(true)} />
      )}
    </div>
  );
};

const Logo = ({ footer = false }) => (
  <a className={"logo" + (footer ? " logo--footer" : "")} href="index.html" aria-label="LIVEONS ホーム">
    <img className="logo__image" src={IMAGE_ASSETS.logo} alt="LIVEONS" width="790" height="164" />
  </a>
);

const Arrow = () => (
  <svg className="arr" width="16" height="12" viewBox="0 0 16 12" fill="none" aria-hidden="true">
    <path d="M1 6h13M10 1l5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/* ---------- social icons ---------- */
const IconYT = () => (<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M23 7.5a3 3 0 0 0-2.1-2.1C19 4.9 12 4.9 12 4.9s-7 0-8.9.5A3 3 0 0 0 1 7.5 31 31 0 0 0 .5 12 31 31 0 0 0 1 16.5a3 3 0 0 0 2.1 2.1c1.9.5 8.9.5 8.9.5s7 0 8.9-.5a3 3 0 0 0 2.1-2.1 31 31 0 0 0 .5-4.5 31 31 0 0 0-.5-4.5ZM9.8 15.3V8.7l5.7 3.3-5.7 3.3Z" /></svg>);
const IconIG = () => (<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.2c3.2 0 3.6 0 4.9.07 1.2.06 1.8.26 2.2.43.6.22 1 .48 1.4.9.43.43.7.83.9 1.4.18.45.38 1.06.44 2.26.06 1.3.07 1.7.07 4.9s0 3.6-.07 4.9c-.06 1.2-.26 1.8-.43 2.2-.22.6-.48 1-.9 1.4-.43.43-.83.7-1.4.9-.45.18-1.06.38-2.26.44-1.3.06-1.7.07-4.9.07s-3.6 0-4.9-.07c-1.2-.06-1.8-.26-2.2-.43-.6-.22-1-.48-1.4-.9-.43-.43-.7-.83-.9-1.4-.18-.45-.38-1.06-.44-2.26C2.2 15.6 2.2 15.2 2.2 12s0-3.6.07-4.9c.06-1.2.26-1.8.43-2.2.22-.6.48-1 .9-1.4.43-.43.83-.7 1.4-.9.45-.18 1.06-.38 2.26-.44C8.4 2.2 8.8 2.2 12 2.2Zm0 1.8c-3.1 0-3.5 0-4.7.07-1.1.05-1.7.24-2.1.4-.5.2-.9.43-1.3.83-.4.4-.64.8-.83 1.3-.16.4-.35 1-.4 2.1C2.6 9.5 2.6 9.9 2.6 13s0 3.5.07 4.7c.05 1.1.24 1.7.4 2.1.2.5.43.9.83 1.3.4.4.8.64 1.3.83.4.16 1 .35 2.1.4 1.2.07 1.6.07 4.7.07s3.5 0 4.7-.07c1.1-.05 1.7-.24 2.1-.4.5-.2.9-.43 1.3-.83.4-.4.64-.8.83-1.3.16-.4.35-1 .4-2.1.07-1.2.07-1.6.07-4.7s0-3.5-.07-4.7c-.05-1.1-.24-1.7-.4-2.1-.2-.5-.43-.9-.83-1.3-.4-.4-.8-.64-1.3-.83-.4-.16-1-.35-2.1-.4C15.5 4 15.1 4 12 4Zm0 3.05A4.95 4.95 0 1 1 7.05 12 4.95 4.95 0 0 1 12 7.05Zm0 1.8A3.15 3.15 0 1 0 15.15 12 3.15 3.15 0 0 0 12 8.85Zm5.15-3.2a1.16 1.16 0 1 1-1.16 1.15 1.16 1.16 0 0 1 1.16-1.15Z" /></svg>);
const IconTT = () => (<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M16.6 2h-3v13.6a2.7 2.7 0 1 1-2.3-2.7v-3a5.7 5.7 0 1 0 5.3 5.7V8.5a7 7 0 0 0 4 1.3v-3a4 4 0 0 1-4-3.8Z" /></svg>);

const NAV = [
  ["事業内容", "services.html"],
  ["代表メッセージ", "message.html"],
  ["会社概要", "company.html"],
];

/* ---------- Header ---------- */
function Header({ active = "" }) {
  const [scrolled, setScrolled] = React.useState(false);
  const [onDark, setOnDark] = React.useState(false);
  const [menu, setMenu] = React.useState(false);
  React.useEffect(() => {
    const hero = document.getElementById("hero-sentinel");
    const onScroll = () => {
      setScrolled(window.scrollY > 30);
      if (hero) setOnDark(hero.dataset.dark === "1" && window.scrollY < window.innerHeight - 120);
      else setOnDark(false);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  React.useEffect(() => {
    if (!menu) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [menu]);
  const close = () => setMenu(false);
  return (
    <header className={"site-header" + (scrolled ? " scrolled" : "") + (onDark ? " on-dark" : "")}>
      <div className="wrap">
        <Logo />
        <button className={"nav-toggle" + (menu ? " open" : "")} aria-label="メニュー" aria-expanded={menu}
                onClick={() => setMenu(m => !m)}><span /><span /><span /></button>
        <nav className={"nav" + (menu ? " open" : "")}>
          {NAV.map(([l, h]) => (
            <a key={h} href={h} onClick={close} className={active === h ? "active" : ""}
               aria-current={active === h ? "page" : undefined}>{l}</a>
          ))}
          <a className="btn btn--primary btn--sm nav-cta" href="contact.html" onClick={close}>お問い合わせ<Arrow /></a>
        </nav>
        <div className={"nav-scrim" + (menu ? " open" : "")} onClick={close} />
      </div>
    </header>
  );
}

/* ---------- Footer ---------- */
function Footer() {
  const cols = [["事業内容", "services.html"], ["代表メッセージ", "message.html"],
    ["会社概要", "company.html"], ["お問い合わせ", "contact.html"]];
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="footer__top">
          <div className="footer__brand">
            <Logo footer />
            <p>東京都渋谷区宇田川町3-7 ヒューリック渋谷公園通りビル5F-146<br />info@live-ons.com</p>
            <div className="footer__sns" style={{ marginTop: "22px" }}>
              <a href="#" aria-label="YouTube"><IconYT /></a>
              <a href="#" aria-label="Instagram"><IconIG /></a>
              <a href="#" aria-label="TikTok"><IconTT /></a>
            </div>
          </div>
          <div className="footer__col">
            <h4>Sitemap</h4>
            <ul>{cols.map(([l, h]) => <li key={h}><a href={h}>{l}</a></li>)}</ul>
          </div>
          <div className="footer__col">
            <h4>Legal</h4>
            <ul>
              <li><a href="privacy.html">プライバシーポリシー</a></li>
              <li><a href="mailto:info@live-ons.com">info@live-ons.com</a></li>
            </ul>
          </div>
        </div>
        <div className="footer__bottom">
          <span className="latin">© 2026 LIVEONS Inc.</span>
          <span>株式会社ライブオンズ</span>
        </div>
      </div>
    </footer>
  );
}

/* ---------- shared CTA band ---------- */
function ContactCTA() {
  return (
    <section className="cta">
      <span className="cta__ghost latin" aria-hidden="true">CONTACT</span>
      <div className="wrap cta__inner reveal">
        <h2 className="cta__title">次の挑戦を、<span className="accent">一緒に。</span></h2>
        <p className="cta__sub">事業に関するご相談、取材・協業のお問い合わせはお気軽にどうぞ。担当者よりスピード感を持ってご返信いたします。</p>
        <div className="cta__btns">
          <a className="btn btn--primary" href="contact.html">お問い合わせフォームへ<Arrow /></a>
          <a className="btn btn--ghost" href="mailto:info@live-ons.com">info@live-ons.com</a>
        </div>
      </div>
    </section>
  );
}

/* ---------- hooks ---------- */
function useReveal(dep) {
  React.useEffect(() => {
    const els = document.querySelectorAll(".reveal:not(.in)");
    if (!("IntersectionObserver" in window)) { els.forEach(e => e.classList.add("in")); return; }
    const io = new IntersectionObserver((ents) => {
      ents.forEach(en => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    els.forEach(e => io.observe(e));
    return () => io.disconnect();
  }, [dep]);
}

/* ---------- PageApp: wraps a page in shell ---------- */
function PageApp({ active, children }) {
  useReveal(true);
  return (
    <>
      <Header active={active} />
      {children}
      <Footer />
    </>
  );
}

Object.assign(window, {
  IMAGE_ASSETS, VIDEO_ASSETS, Ph, Logo, Arrow, IconYT, IconIG, IconTT, NAV,
  Header, Footer, ContactCTA, useReveal, PageApp,
});
