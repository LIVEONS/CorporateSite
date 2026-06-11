/* =========================================================================
   home.jsx — Top page
   ========================================================================= */

const HERO_TITLE = ["人のために、", "全力で走り切る", "挑戦。"];
const HERO_SUB = "挑戦・スピード・人とのつながり。スポーツの第一線で培った価値観を礎に、社会に新たな価値を生み出します。";

const HeroCopy = () => (
  <div className="hero__copy">
    <p className="eyebrow latin hero__fade">株式会社ライブオンズ</p>
    <h1 className="hero__title">
      {HERO_TITLE.map((line, i) => (
        <span className="ja" key={i}>
          <span className={i === 2 ? "accent" : ""}>{line}</span>
        </span>
      ))}
    </h1>
    <p className="hero__sub hero__fade">{HERO_SUB}</p>
    <div className="hero__cta hero__fade">
      <a className="btn btn--primary" href="contact.html">お問い合わせ<Arrow /></a>
      <a className="btn btn--ghost" href="services.html">事業内容を見る</a>
    </div>
  </div>
);

const ScrollCue = () => (<div className="hero__scroll latin"><span>Scroll</span><i /></div>);
const HeroVideo = () => {
  const videoRef = React.useRef(null);
  React.useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = true;
    video.defaultMuted = true;

    const play = () => {
      const promise = video.play();
      if (promise?.catch) promise.catch(() => {});
    };
    const onVisibility = () => { if (!document.hidden) play(); };

    if (video.readyState >= 2) play();
    else video.addEventListener("canplay", play, { once: true });
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      video.removeEventListener("canplay", play);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <video
      ref={videoRef}
      className="hero__video"
      autoPlay
      muted
      defaultMuted
      loop
      playsInline
      preload="auto"
      poster={IMAGE_ASSETS.heroPoster}
      aria-hidden="true"
    >
      <source src={VIDEO_ASSETS.heroMainMobile} media="(max-width: 640px)" type="video/mp4" />
      <source src={VIDEO_ASSETS.heroMain} type="video/mp4" />
    </video>
  );
};
const Streaks = () => (
  <div className="streaks" aria-hidden="true">
    <i style={{ top: "22%", animationDelay: "0s" }} />
    <i style={{ top: "46%", animationDelay: ".5s" }} />
    <i style={{ top: "63%", animationDelay: "1.1s" }} />
    <i style={{ top: "81%", animationDelay: "1.7s" }} />
  </div>
);

function Hero() {
  return (
    <section className="hero hero--photo" id="top">
      <span id="hero-sentinel" data-dark="1" style={{ position: "absolute", inset: 0, pointerEvents: "none" }} />
      <div className="hero__bg">
        <HeroVideo />
        <Ph className="hero__fallback" label="ヒーロー / 光の流れを表現した背景画像" src={IMAGE_ASSETS.heroPoster} alt="光の流れを表現した背景画像" dark />
      </div>
      <Streaks />
      <div className="wrap"><HeroCopy /></div>
      <ScrollCue />
    </section>
  );
}

/* ---- Intro ---- */
function Intro() {
  return (
    <section className="section section--sub">
      <div className="wrap intro__grid">
        <div className="reveal">
          <p className="eyebrow latin">Our Stance</p>
          <h2 className="intro__big">挑戦と<em>スピード</em>、<br />そして人との<em>つながり</em>で、<br />新たな価値を。</h2>
        </div>
        <div className="intro__body reveal d1">
          <p>スポーツの第一線で培った行動力と継続力を礎に、当社はスピード感ある意思決定と、変化を恐れず前進する挑戦の文化を大切にしています。</p>
          <p>大きな成果は、個人の力だけでは生まれません。人とのつながりと信頼関係こそが新たな可能性を切り拓く原動力であると信じ、社員・パートナー・お客様とともに成長し続けます。</p>
          <div className="intro__values"><span>Challenge</span><span>Speed</span><span>Connection</span><span>Trust</span></div>
        </div>
      </div>
    </section>
  );
}

/* ---- Services preview ---- */
const SERVICES = [
  { no: "01", cat: "Influence", title: "インフルエンス事業", desc: "代表 金子侑司を中心に、YouTube・Instagram・TikTok などSNSを活用した情報発信。企業や商品の認知拡大、ファンコミュニティの形成を支援します。", ph: "事業イメージ / SNS・配信", img: IMAGE_ASSETS.serviceInfluence, alt: "SNSや動画配信をイメージした事業写真" },
  { no: "02", cat: "Promotion", title: "プロモーション支援事業", desc: "戦略立案から広告運用、SNS活用、コンテンツ制作まで。ターゲットへ価値を届けるプロモーション施策をワンストップで提供します。", ph: "事業イメージ / マーケティング", img: IMAGE_ASSETS.servicePromotion, alt: "マーケティングやプロモーションをイメージした事業写真" },
  { no: "03", cat: "System Development", title: "システム開発事業", desc: "届けたい価値を確実に届けるシステム・アプリを開発。企画・設計・開発・運用まで一貫して事業成長を支えます。", ph: "事業イメージ / 開発・UI", img: IMAGE_ASSETS.serviceSystem, alt: "システム開発やUIをイメージした事業写真" },
];
function ServicesPreview() {
  return (
    <section className="section">
      <div className="wrap">
        <div className="sec-head reveal">
          <div>
            <p className="eyebrow latin">Services</p>
            <h2 className="h-lg">3つの事業で、<br />価値を届ける。</h2>
          </div>
          <p className="lede sec-head__lead">発信・支援・開発――それぞれの強みを掛け合わせ、企業や個人の「伝えたい」「届けたい」を、確かな成果へとつなげます。</p>
        </div>
        <div className="cards">
          {SERVICES.map((s, i) => (
            <a className={"card reveal d" + (i + 1)} key={s.no} href="services.html">
              <div className="card__media"><span className="card__no latin">{s.no}</span><Ph label={s.ph} src={s.img} alt={s.alt} /></div>
              <div className="card__body">
                <p className="card__cat latin">{s.cat}</p>
                <h3 className="card__title">{s.title}</h3>
                <p className="card__desc">{s.desc}</p>
                <span className="tlink">詳しく見る<Arrow /></span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---- Message preview ---- */
function MessagePreview() {
  return (
    <section className="section section--sub">
      <div className="wrap">
        <div className="sec-head reveal" style={{ marginBottom: "clamp(34px,5vw,56px)" }}>
          <div><p className="eyebrow latin">Message</p><h2 className="h-lg">代表メッセージ</h2></div>
        </div>
        <div className="msg__grid">
          <div className="msg__photo reveal">
            <Ph label="代表ポートレート（差し替え）" src={IMAGE_ASSETS.representativePortrait} alt="代表取締役 金子侑司のポートレート" />
          </div>
          <div className="reveal d1">
            <blockquote className="msg__quote">「挑戦することでしか<br />見えない景色がある。」<br /><span className="accent">その挑戦は、一人では成し遂げられない。</span></blockquote>
            <div className="msg__text">
              <p>京都府出身。立命館大学卒業後、プロ野球選手として埼玉西武ライオンズに入団。12年間にわたりトップアスリートとして第一線で活躍し、俊足を武器に2度の盗塁王を獲得しました。</p>
              <p>個人の力だけで大きな成果は生まれません。人とのつながりや信頼関係こそが新たな可能性を切り拓く原動力である――その想いを胸に、社会に新たな価値を生み出していきます。</p>
            </div>
            <div className="msg__name"><b>金子 侑司</b><span>代表取締役</span><span className="ja-name latin">KANEKO YUJI</span></div>
            <a className="tlink" href="message.html">メッセージ全文を読む<Arrow /></a>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---- Company preview ---- */
const COMPANY = [
  ["会社名", <span>株式会社ライブオンズ <span className="latin" style={{ color: "var(--ink-3)" }}>/ LIVEONS Inc.</span></span>],
  ["代表取締役", "金子 侑司"],
  ["設立", "登記手続き中"],
  ["所在地", "東京都渋谷区宇田川町3-7\nヒューリック渋谷公園通りビル 5F-146"],
];
function CompanyPreview() {
  return (
    <section className="section">
      <div className="wrap company__grid">
        <div className="reveal">
          <p className="eyebrow latin">Company</p>
          <h2 className="h-lg" style={{ marginBottom: "28px" }}>会社概要</h2>
          <dl className="dl">
            {COMPANY.map(([k, v]) => (
              <div className="dl__row" key={k}><dt>{k}</dt><dd style={{ whiteSpace: "pre-line" }}>{v}</dd></div>
            ))}
          </dl>
          <a className="tlink" href="company.html" style={{ marginTop: "26px" }}>会社概要の詳細へ<Arrow /></a>
        </div>
      </div>
    </section>
  );
}

function App() {
  return (
    <PageApp active="">
      <main>
        <Hero />
        <Intro />
        <ServicesPreview />
        <MessagePreview />
        <CompanyPreview />
        <ContactCTA />
      </main>
    </PageApp>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
