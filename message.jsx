/* message.jsx — 代表メッセージページ */

function MessagePage() {
  return (
    <main>
      <section className="page-hero page-hero--sub">
        <span className="page-hero__ghost latin" aria-hidden="true">MESSAGE</span>
        <div className="wrap page-hero__inner">
          <nav className="crumb latin"><a href="index.html">HOME</a><span>/</span><span>MESSAGE</span></nav>
          <p className="eyebrow latin">Message</p>
          <h1 className="page-hero__title">代表メッセージ</h1>
          <p className="page-hero__lead">人のために、全力で走り切る挑戦。トップアスリートとして培った経験と想いを、事業を通じて社会へ。</p>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="profile">
            <div className="profile__photo reveal">
              <Ph label="代表ポートレート（縦長・差し替え）" src={IMAGE_ASSETS.representativePortrait} alt="代表取締役 金子侑司のポートレート" />
              <div className="profile__id">
                <b>金子 侑司</b>
                <div className="role">代表取締役</div>
                <div className="romaji latin">KANEKO YUJI</div>
              </div>
            </div>

            <div className="profile__body reveal d1">
              <blockquote className="profile__quote">
                「人のために、<br /><span className="accent">全力で走り切る挑戦。</span>」
              </blockquote>

              <h3 className="block-h">経歴 <span className="latin" style={{ color: "var(--ink-3)", fontWeight: 600, fontSize: "13px", letterSpacing: ".1em", marginLeft: "8px" }}>CAREER</span></h3>
              <p>京都府出身。立命館大学卒業後、プロ野球選手として埼玉西武ライオンズに入団。12年間にわたりトップアスリートとして第一線で活躍し、俊足を武器に2度の盗塁王を獲得しました。</p>

              <div className="stats">
                <div className="stat"><b className="latin">12</b><span>年間、プロの第一線で活躍</span></div>
                <div className="stat"><b className="latin">×2</b><span>盗塁王を獲得</span></div>
              </div>

              <h3 className="block-h">メッセージ <span className="latin" style={{ color: "var(--ink-3)", fontWeight: 600, fontSize: "13px", letterSpacing: ".1em", marginLeft: "8px" }}>MESSAGE</span></h3>
              <p>現役時代は、自らの限界に挑み続ける一方で、多くの監督、コーチ、チームメイト、そしてファンの皆様の支えがあったからこそ、人間として成長できたと確信しています。個人の力だけで大きな成果は生まれません。人とのつながりや信頼関係こそが、新たな可能性を切り拓く原動力であるというこの気づきは、今の私の活動においても最も大切な価値観となっています。</p>
              <p>引退後、私は新たなフィールドへ挑戦をはじめました。スポーツを通じて培った行動力、継続力、そして変化を恐れず前進する姿勢を活かし、現在は事業を展開しています。スピード感を持った意思決定と挑戦する文化を大切にしながら、人との縁や支えへの感謝を忘れず、社会に新たな価値を生み出すことが私の使命です。</p>
              <p style={{ color: "var(--ink)", fontWeight: 700 }}>「挑戦することでしか見えない景色がある。そして、その挑戦は決して一人では成し遂げられない。」</p>
              <p>これまで支えてくださったすべての方々への感謝を胸に、今度は私自身が「人と人とのつながり」を生み出す起点となり、社会に恩返しをしていきたいと考えています。これまでの競技人生で培った経験を礎に、社員、パートナー、そしてお客様とともに成長し、新たな価値を創造し続けます。</p>
            </div>
          </div>
        </div>
      </section>

      <ContactCTA />
    </main>
  );
}

function App() { return <PageApp active="message.html">{<MessagePage />}</PageApp>; }
ReactDOM.createRoot(document.getElementById("root")).render(<App />);
