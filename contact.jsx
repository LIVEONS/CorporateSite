/* contact.jsx — お問い合わせページ（フォーム + バリデーション + 送信完了） */

const TYPES = ["事業に関するお問い合わせ", "取材・協業のご相談", "その他"];
const TURNSTILE_SITE_KEY = "0x4AAAAAADiidKoYsm0RVERD";

function Field({ id, label, required, error, children }) {
  return (
    <div className="field">
      <label htmlFor={id}>{label}{required ? <span className="req">必須</span> : <span className="opt">任意</span>}</label>
      {children}
      <p className={"err-msg" + (error ? " show" : "")}>{error}</p>
    </div>
  );
}

function TurnstileWidget({ error, onVerify, onReset, resetKey }) {
  const boxRef = React.useRef(null);
  const widgetIdRef = React.useRef(null);
  const callbacksRef = React.useRef({ onVerify, onReset });
  callbacksRef.current = { onVerify, onReset };

  React.useEffect(() => {
    let cancelled = false;
    let timer = null;

    const render = () => {
      if (cancelled || widgetIdRef.current || !boxRef.current || !window.turnstile) return;
      widgetIdRef.current = window.turnstile.render(boxRef.current, {
        sitekey: TURNSTILE_SITE_KEY,
        theme: "light",
        callback: (token) => callbacksRef.current.onVerify(token),
        "expired-callback": () => callbacksRef.current.onReset("認証の有効期限が切れました。もう一度お試しください。"),
        "error-callback": () => callbacksRef.current.onReset("認証に失敗しました。もう一度お試しください。"),
      });
    };

    render();
    timer = window.setInterval(render, 300);

    return () => {
      cancelled = true;
      if (timer) window.clearInterval(timer);
      if (widgetIdRef.current && window.turnstile) window.turnstile.remove(widgetIdRef.current);
      widgetIdRef.current = null;
    };
  }, []);

  React.useEffect(() => {
    if (!resetKey || !widgetIdRef.current || !window.turnstile) return;
    window.turnstile.reset(widgetIdRef.current);
  }, [resetKey]);

  return (
    <div className="turnstile-wrap">
      <div ref={boxRef} className="turnstile-box" />
      <p className={"err-msg" + (error ? " show" : "")}>{error}</p>
    </div>
  );
}

function ContactForm() {
  const [v, setV] = React.useState({ name: "", company: "", email: "", tel: "", type: "", body: "", agree: false, website: "" });
  const [errs, setErrs] = React.useState({});
  const [formError, setFormError] = React.useState("");
  const [sent, setSent] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);
  const [stableHeight, setStableHeight] = React.useState(null);
  const [turnstileToken, setTurnstileToken] = React.useState("");
  const [turnstileResetKey, setTurnstileResetKey] = React.useState(0);
  const shellRef = React.useRef(null);
  const restoreScrollRef = React.useRef(null);
  const set = (k) => (e) => setV(s => ({ ...s, [k]: e.target.type === "checkbox" ? e.target.checked : e.target.value }));

  React.useLayoutEffect(() => {
    if (!sent || !restoreScrollRef.current) return;
    const { x, y } = restoreScrollRef.current;
    const restore = () => window.scrollTo({ left: x, top: y, behavior: "auto" });
    restore();
    let raf2 = 0;
    const raf1 = window.requestAnimationFrame(() => {
      restore();
      raf2 = window.requestAnimationFrame(restore);
    });
    const timer1 = window.setTimeout(restore, 0);
    const timer2 = window.setTimeout(() => {
      restore();
      restoreScrollRef.current = null;
    }, 80);
    return () => {
      window.cancelAnimationFrame(raf1);
      if (raf2) window.cancelAnimationFrame(raf2);
      window.clearTimeout(timer1);
      window.clearTimeout(timer2);
    };
  }, [sent]);

  const validate = () => {
    const e = {};
    if (!v.name.trim()) e.name = "お名前を入力してください。";
    if (!v.email.trim()) e.email = "メールアドレスを入力してください。";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email)) e.email = "メールアドレスの形式が正しくありません。";
    if (!v.type) e.type = "お問い合わせ種別を選択してください。";
    if (!v.body.trim()) e.body = "お問い合わせ内容を入力してください。";
    if (!v.agree) e.agree = "個人情報の取扱いに同意してください。";
    if (!turnstileToken) e.turnstile = "認証を完了してください。";
    return e;
  };
  const resetTurnstile = (message = "") => {
    setTurnstileToken("");
    setTurnstileResetKey(k => k + 1);
    if (message) setErrs(e => ({ ...e, turnstile: message }));
  };
  const onSubmit = async (ev) => {
    ev.preventDefault();
    if (submitting) return;
    const e = validate();
    setErrs(e);
    setFormError("");
    if (Object.keys(e).length !== 0) return;

    setSubmitting(true);
    try {
      const res = await fetch("api/contact.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...v, turnstileToken }),
      });
      const result = await res.json().catch(() => ({}));
      if (!res.ok || result.ok !== true) {
        throw new Error(result.message || "送信に失敗しました。時間をおいて再度お試しください。");
      }
      restoreScrollRef.current = { x: window.scrollX, y: window.scrollY };
      if (shellRef.current) setStableHeight(Math.ceil(shellRef.current.getBoundingClientRect().height));
      setSent(true);
    } catch (error) {
      setFormError(error.message || "送信に失敗しました。時間をおいて再度お試しください。");
      resetTurnstile();
    } finally {
      setSubmitting(false);
    }
  };

  if (sent) {
    return (
      <div ref={shellRef} className="contact-form-shell" style={stableHeight ? { minHeight: stableHeight } : undefined}>
        <div className="thanks reveal in">
          <div className="thanks__icon"><svg viewBox="0 0 24 24"><path d="M4 12.5l5 5L20 6.5" strokeLinecap="round" strokeLinejoin="round" /></svg></div>
          <h2>お問い合わせありがとうございます</h2>
          <p>内容を確認のうえ、担当者よりスピード感を持ってご返信いたします。今しばらくお待ちください。</p>
          <a className="btn btn--dark" href="index.html">トップページへ戻る<Arrow /></a>
        </div>
      </div>
    );
  }

  return (
    <div ref={shellRef} className="contact-form-shell">
      <form className="contact-form" onSubmit={onSubmit} noValidate>
        {formError && <p className="form-error" role="alert">{formError}</p>}
        <div className="hp-field" aria-hidden="true">
          <label htmlFor="website">Webサイト</label>
          <input id="website" type="text" value={v.website} onChange={set("website")} tabIndex="-1" autoComplete="off" />
        </div>
        <Field id="name" label="お名前" required error={errs.name}>
          <input id="name" className={"input" + (errs.name ? " err" : "")} type="text" value={v.name} onChange={set("name")} placeholder="山田 太郎" autoComplete="name" />
        </Field>
        <Field id="company" label="会社名／屋号" error={errs.company}>
          <input id="company" className="input" type="text" value={v.company} onChange={set("company")} placeholder="株式会社○○" autoComplete="organization" />
        </Field>
        <Field id="email" label="メールアドレス" required error={errs.email}>
          <input id="email" className={"input" + (errs.email ? " err" : "")} type="email" value={v.email} onChange={set("email")} placeholder="example@live-ons.com" autoComplete="email" />
        </Field>
        <Field id="tel" label="電話番号" error={errs.tel}>
          <input id="tel" className="input" type="tel" value={v.tel} onChange={set("tel")} placeholder="03-0000-0000" autoComplete="tel" />
        </Field>
        <Field id="type" label="お問い合わせ種別" required error={errs.type}>
          <select id="type" className={"select" + (errs.type ? " err" : "")} value={v.type} onChange={set("type")}>
            <option value="" disabled>選択してください</option>
            {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </Field>
        <Field id="body" label="お問い合わせ内容" required error={errs.body}>
          <textarea id="body" className={"textarea" + (errs.body ? " err" : "")} value={v.body} onChange={set("body")} placeholder="お問い合わせ内容をご記入ください。" />
        </Field>
        <div className="field">
          <label className="check">
            <input type="checkbox" checked={v.agree} onChange={set("agree")} />
            <span><a href="privacy.html" target="_blank" rel="noopener">プライバシーポリシー</a>に同意します。</span>
          </label>
          <p className={"err-msg" + (errs.agree ? " show" : "")}>{errs.agree}</p>
        </div>
        <TurnstileWidget
          error={errs.turnstile}
          resetKey={turnstileResetKey}
          onVerify={(token) => {
            setTurnstileToken(token);
            setErrs(e => ({ ...e, turnstile: "" }));
          }}
          onReset={resetTurnstile}
        />
        <div className="form-actions">
          <button type="submit" className="btn btn--primary" disabled={submitting}>
            {submitting ? "送信中..." : "送信する"}<Arrow />
          </button>
        </div>
      </form>
    </div>
  );
}

function ContactPage() {
  return (
    <main>
      <section className="page-hero page-hero--sub">
        <span className="page-hero__ghost latin" aria-hidden="true">CONTACT</span>
        <div className="wrap page-hero__inner">
          <nav className="crumb latin"><a href="index.html">HOME</a><span>/</span><span>CONTACT</span></nav>
          <p className="eyebrow latin">Contact</p>
          <h1 className="page-hero__title">お問い合わせ</h1>
          <p className="page-hero__lead">事業に関するご相談、取材・協業のお問い合わせはこちらから。下記フォームよりお気軽にご連絡ください。</p>
        </div>
      </section>

      <section className="section">
        <div className="wrap form-grid">
          <div className="form-aside reveal">
            <h2>まずはお気軽に<br />ご相談ください。</h2>
            <p>いただいたお問い合わせは内容を確認のうえ、担当者より順次ご返信いたします。お急ぎの場合はメールにて直接ご連絡ください。</p>
            <a className="mail" href="mailto:info@live-ons.com">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></svg>
              info@live-ons.com
            </a>
          </div>
          <div className="reveal d1"><ContactForm /></div>
        </div>
      </section>
    </main>
  );
}

function App() { return <PageApp active="contact.html">{<ContactPage />}</PageApp>; }
ReactDOM.createRoot(document.getElementById("root")).render(<App />);
