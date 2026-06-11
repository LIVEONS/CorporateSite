/* company.jsx — 会社概要ページ */

const ROWS = [
  ["会社名", <span>株式会社ライブオンズ　<span className="latin" style={{ color: "var(--ink-3)" }}>LIVEONS Inc.</span></span>],
  ["代表取締役", "金子 侑司"],
  ["設立", <span>登記手続き中 <span style={{ color: "var(--ink-3)", fontSize: "13px" }}>（登記完了後に確定）</span></span>],
  ["資本金", "300万円"],
  ["所在地", "東京都渋谷区宇田川町3-7\nヒューリック渋谷公園通りビル 5F-146"],
  ["事業内容", (
    <a href="services.html" className="tlink company-service-link" style={{ fontSize: "15px" }}>
      <span>インフルエンス</span>
      <span>プロモーション支援</span>
      <br className="company-service-break" />
      <span>システム開発</span>
      <Arrow />
    </a>
  )],
  ["メールアドレス", <a href="mailto:info@live-ons.com" style={{ color: "var(--accent)", fontWeight: 600 }}>info@live-ons.com</a>],
];

function CompanyPage() {
  const q = encodeURIComponent("東京都渋谷区宇田川町3-7 ヒューリック渋谷公園通りビル");
  return (
    <main>
      <section className="page-hero page-hero--sub">
        <span className="page-hero__ghost latin" aria-hidden="true">COMPANY</span>
        <div className="wrap page-hero__inner">
          <nav className="crumb latin"><a href="index.html">HOME</a><span>/</span><span>COMPANY</span></nav>
          <p className="eyebrow latin">Company</p>
          <h1 className="page-hero__title">会社概要</h1>
          <p className="page-hero__lead">挑戦・スピード・人とのつながりを大切に、社会へ新たな価値を生み出す会社です。</p>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <dl className="dl dl--full reveal">
            {ROWS.map(([k, v]) => (
              <div className="dl__row" key={k}><dt>{k}</dt><dd style={{ whiteSpace: "pre-line" }}>{v}</dd></div>
            ))}
          </dl>
        </div>
      </section>

      <section className="section section--sub">
        <div className="wrap">
          <p className="eyebrow latin reveal">Access</p>
          <h2 className="h-md reveal" style={{ marginBottom: "26px" }}>アクセス</h2>
          <div className="reveal d1">
            <iframe className="map-embed" title="所在地マップ" loading="lazy"
              src={"https://maps.google.com/maps?q=" + q + "&z=16&output=embed"}
              referrerPolicy="no-referrer-when-downgrade"></iframe>
            <p className="map-note">※ 地図は所在地周辺の参考表示です。正式な区画は登記完了後に確定します。</p>
          </div>
        </div>
      </section>

      <ContactCTA />
    </main>
  );
}

function App() { return <PageApp active="company.html">{<CompanyPage />}</PageApp>; }
ReactDOM.createRoot(document.getElementById("root")).render(<App />);
