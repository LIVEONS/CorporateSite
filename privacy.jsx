/* privacy.jsx — プライバシーポリシー */

function PrivacyPage() {
  return (
    <main>
      <section className="page-hero page-hero--sub">
        <span className="page-hero__ghost latin" aria-hidden="true">PRIVACY</span>
        <div className="wrap page-hero__inner">
          <nav className="crumb latin"><a href="index.html">HOME</a><span>/</span><span>PRIVACY</span></nav>
          <p className="eyebrow latin">Privacy Policy</p>
          <h1 className="page-hero__title">プライバシーポリシー</h1>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <article className="legal reveal">
            <p className="updated">最終更新日：2026年6月1日</p>
            <p>株式会社ライブオンズ（以下「当社」といいます）は、お客様の個人情報の保護を重要な責務と認識し、個人情報の保護に関する法律および関連法令・ガイドラインを遵守するとともに、以下の方針に基づき個人情報を適切に取り扱います。</p>

            <h2>1. 個人情報の定義</h2>
            <p>本ポリシーにおける「個人情報」とは、個人情報保護法に定める個人情報、すなわち生存する個人に関する情報であって、氏名、住所、電話番号、メールアドレスその他の記述等により特定の個人を識別できる情報を指します。</p>

            <h2>2. 個人情報の取得</h2>
            <p>当社は、お問い合わせフォームの送信、サービスのお申し込み、その他適法かつ公正な手段により、必要な範囲で個人情報を取得します。</p>

            <h2>3. 利用目的</h2>
            <p>当社は、取得した個人情報を以下の目的の範囲内で利用します。</p>
            <ul>
              <li>お問い合わせ・ご相談への対応およびご連絡のため</li>
              <li>当社サービスの提供、運営および品質向上のため</li>
              <li>取材・協業など事業上のご連絡・調整のため</li>
              <li>法令に基づく対応その他上記に付随する業務のため</li>
            </ul>

            <h2>4. 第三者への提供</h2>
            <p>当社は、次のいずれかに該当する場合を除き、あらかじめご本人の同意を得ることなく個人情報を第三者に提供しません。</p>
            <ul>
              <li>法令に基づく場合</li>
              <li>人の生命、身体または財産の保護のために必要があり、本人の同意を得ることが困難な場合</li>
              <li>業務委託先に対し、利用目的の達成に必要な範囲で取り扱いを委託する場合</li>
            </ul>

            <h2>5. 安全管理措置</h2>
            <p>当社は、取り扱う個人情報の漏えい、滅失またはき損の防止その他の安全管理のために、必要かつ適切な措置を講じます。</p>

            <h2>6. 開示・訂正・利用停止等の請求</h2>
            <p>ご本人から、個人情報の開示、訂正、追加、削除、利用停止等のご請求があった場合には、ご本人であることを確認のうえ、法令に従い適切に対応いたします。お手続きの詳細は下記お問い合わせ窓口までご連絡ください。</p>

            <h2>7. Cookie等の利用について</h2>
            <p>当社のウェブサイトでは、サービスの利便性向上やアクセス状況の把握のためにCookie等を利用する場合があります。Cookieによって個人を特定できる情報を取得することはありません。ブラウザの設定によりCookieの送受信を拒否することができます。</p>

            <h2>8. お問い合わせ窓口</h2>
            <div className="box">
              <b>株式会社ライブオンズ</b><br />
              東京都渋谷区宇田川町3-7 ヒューリック渋谷公園通りビル5F-146<br />
              メール：<a href="mailto:info@live-ons.com" style={{ color: "var(--accent)" }}>info@live-ons.com</a>
            </div>

            <h2>9. 本ポリシーの改定</h2>
            <p>当社は、法令の変更や事業内容の変化等に応じて、本ポリシーを予告なく改定することがあります。改定後の内容は本ページに掲載した時点から効力を生じるものとします。</p>

            <p style={{ marginTop: "40px", color: "var(--ink-3)", fontSize: "13px" }}>※ 本ポリシーは構成確認用のドラフトです。公開前に法務確認のうえ内容を確定してください。</p>
          </article>
        </div>
      </section>
    </main>
  );
}

function App() { return <PageApp active="privacy.html">{<PrivacyPage />}</PageApp>; }
ReactDOM.createRoot(document.getElementById("root")).render(<App />);
