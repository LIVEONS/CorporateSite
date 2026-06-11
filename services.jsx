/* services.jsx — 事業内容ページ */

const SVC = [
  {
    no: "01", cat: "Influence", title: "インフルエンス事業",
    desc: "代表取締役 金子侑司を中心に、YouTube・Instagram・TikTok などのSNSを活用した情報発信を行っています。独自のコンテンツ制作を通じて多くのフォロワーとのつながりを築き、ユーザーのニーズに合わせた企画やプロモーションを展開。企業や商品の認知拡大、ファンコミュニティの形成を支援します。",
    list: ["SNSアカウント運用・コンテンツ企画", "商品・サービスのPR／タイアップ", "ファンコミュニティの形成支援", "アンバサダー・出演・イベント"],
    ph: "事業イメージ / SNS・動画配信（差し替え）", img: IMAGE_ASSETS.serviceInfluence, alt: "SNSや動画配信をイメージした事業写真", sns: true,
  },
  {
    no: "02", cat: "Promotion", title: "プロモーション支援事業",
    desc: "企業や個人事業主の商品・サービスのプロモーションを支援します。マーケティング戦略の立案から、広告運用、SNS活用、コンテンツ制作まで幅広くサポートし、ターゲットユーザーへ価値を届けるための施策を提供します。",
    list: ["マーケティング戦略の立案", "Web・SNS広告の運用", "SNSアカウント運用支援", "クリエイティブ・コンテンツ制作"],
    ph: "事業イメージ / マーケティング（差し替え）", img: IMAGE_ASSETS.servicePromotion, alt: "マーケティングやプロモーションをイメージした事業写真", sns: false,
  },
  {
    no: "03", cat: "System Development", title: "システム開発事業",
    desc: "企業やサービスが顧客へ提供したい価値を、より確実に届けるためのシステム・アプリケーションを開発しています。お客様の課題や利用者の声を丁寧にヒアリングし、業務効率化や顧客体験の向上につながる最適なソリューションを設計・開発。企画から設計、開発、運用まで一貫してサポートし、事業成長を支える仕組みづくりを支援します。",
    list: ["要件定義・企画立案", "Webアプリ・業務システム開発", "UI / UX 設計", "運用・保守・改善"],
    ph: "事業イメージ / 開発・プロダクト（差し替え）", img: IMAGE_ASSETS.serviceSystem, alt: "システム開発やプロダクトをイメージした事業写真", sns: false,
  },
];

const SNS_LINKS = [
  ["YouTube", <IconYT />, "#"],
  ["Instagram", <IconIG />, "#"],
  ["TikTok", <IconTT />, "#"],
];

function ServicesPage() {
  return (
    <main>
      <section className="page-hero page-hero--sub">
        <span className="page-hero__ghost latin" aria-hidden="true">SERVICES</span>
        <div className="wrap page-hero__inner">
          <nav className="crumb latin"><a href="index.html">HOME</a><span>/</span><span>SERVICES</span></nav>
          <p className="eyebrow latin">Services</p>
          <h1 className="page-hero__title">事業内容</h1>
          <p className="page-hero__lead">「発信」「支援」「開発」――3つの事業で、企業や個人の伝えたい価値を、確かな成果へとつなげます。スピード感ある実行力で、お客様とともに次の挑戦を形にします。</p>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          {SVC.map((s, i) => (
            <div className={"svc reveal" + (i % 2 ? " svc--rev" : "")} key={s.no}>
              <div className="svc__media">
                <span className="svc__no latin">{s.no}</span>
                <Ph label={s.ph} src={s.img} alt={s.alt} />
              </div>
              <div className="svc__copy">
                <p className="svc__cat latin">{s.cat}</p>
                <h2 className="svc__title">{s.title}</h2>
                <p className="svc__desc">{s.desc}</p>
                <ul className="svc__list">{s.list.map(li => <li key={li}>{li}</li>)}</ul>
                {s.sns && (
                  <div className="svc__sns">
                    {SNS_LINKS.map(([l, ic, h]) => (
                      <a key={l} href={h} aria-label={l + " 公式アカウント"}>{ic}{l}</a>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      <ContactCTA />
    </main>
  );
}

function App() {
  return <PageApp active="services.html">{<ServicesPage />}</PageApp>;
}
ReactDOM.createRoot(document.getElementById("root")).render(<App />);
