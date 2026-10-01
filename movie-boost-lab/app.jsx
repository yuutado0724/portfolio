const { useState, useEffect, useRef } = React;

/* ============ Photo Placeholder ============ */
function Photo({ label, className = "", style = {}, warm = false, children }) {
  return (
    <div className={`photo ${warm ? "warm" : ""} ${className}`} style={style}>
      <span className="ph-label">{label}</span>
      {children}
    </div>
  );
}

/* ============ FV ============ */
function FirstView() {
  return (
    <section className="fv">
      <div className="fv-bg-grid"></div>
      <div className="fv-top">
        <div className="brand">
          <span className="brand-dot"></span>
          <span>MOVIE&nbsp;BOOST&nbsp;LAB</span>
        </div>
        <div className="fv-badge">
          <span style={{ width: 6, height: 6, background: "#22d3ee", borderRadius: "50%", display: "inline-block" }}></span>
          月100名限定募集
        </div>
      </div>

      <div className="fv-headline reveal">
        <div className="pre">— 動画編集 × SNS収益化スクール</div>
        <h1>
          <span className="marker">未経験</span>から<br />
          <span className="hl">最短30日</span>で<br />
          月10万円稼ぐ。
        </h1>
        <p className="fv-sub">
          スマホ1台、すきま時間でOK。<br />
          動画編集の"稼ぎ方"を、SNS総フォロワー数25万人の現役クリエイターが直接お伝えします。
        </p>
      </div>

      <Photo
        label="HERO / インフルエンサー本人 縦位置写真 (推奨 1080x1440)"
        className="fv-photo reveal"
        warm
      >
        <span className="frame-tag">// HERO_01.jpg</span>
        <div className="glow-ring"></div>
      </Photo>

      <div className="fv-stats reveal">
        <div className="fv-stat">
          <div className="num">250k+</div>
          <div className="lbl">TOTAL FOLLOWERS</div>
        </div>
        <div className="fv-stat">
          <div className="num">1,800<span style={{ fontSize: 16 }}>名</span></div>
          <div className="lbl">受講生実績</div>
        </div>
        <div className="fv-stat">
          <div className="num">98<span style={{ fontSize: 16 }}>%</span></div>
          <div className="lbl">満足度</div>
        </div>
      </div>

      <div className="scroll-cue">SCROLL</div>
    </section>
  );
}

/* ============ Free Bonus ============ */
function FreeBonus() {
  const bonuses = [
    { ttl: "稼げる動画編集ロードマップ", sub: "未経験から月10万までの完全マップ (PDF 32P)" },
    { ttl: "現役クリエイターの作業実演動画", sub: "Premiere Pro / CapCut での実案件3本収録" },
    { ttl: "案件獲得テンプレ DM 集", sub: "返信率17%超え、コピペで使える文面30種" },
    { ttl: "プロ仕様 SE & トランジション集", sub: "TikTok / Reels で再生数が伸びる素材100点" },
    { ttl: "個別キャリア相談 (30分)", sub: "あなたの現状に合わせて講師が直接アドバイス" },
  ];
  return (
    <section className="block bonus">
      <div className="block-head reveal">
        <span className="eyebrow">FREE BONUS</span>
        <h2>
          LINE登録で<br />
          <span className="mark">5大特典</span>を無料プレゼント。
        </h2>
      </div>

      <div className="bonus-banner reveal">
        <span className="free-ribbon">
          <span style={{ width: 6, height: 6, background: "#0a1838", borderRadius: "50%", display: "inline-block" }}></span>
          NOW FREE
        </span>
        <h3>
          通常 <s style={{ color: "rgba(255,255,255,0.4)", fontWeight: 600 }}>¥29,800</s> 相当
          <span className="big">¥0</span>
          で受け取れる。
        </h3>
        <p style={{ margin: 0, fontSize: 12, color: "var(--ink-2)" }}>
          ※キャンペーン終了後は予告なく有料化または配布停止となる場合があります。
        </p>
      </div>

      <div className="bonus-list">
        {bonuses.map((b, i) => (
          <div className="bonus-item reveal" key={i}>
            <div className="no">{String(i + 1).padStart(2, "0")}</div>
            <div className="body">
              <div className="ttl">{b.ttl}</div>
              <div className="sub">{b.sub}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ============ Pain / Empathy ============ */
function Pain() {
  const pains = [
    "副業を始めたいけど、何から手を付けていいか分からない",
    "動画編集に興味はあるが、独学で挫折してしまった",
    "本業が忙しく、まとまった時間が確保できない",
    "高額スクールに通うほどの予算はない",
    "未経験から本当に稼げるのか半信半疑",
    "AIに仕事を奪われない武器を、いま身につけたい",
  ];
  return (
    <section className="block pain">
      <div className="block-head reveal">
        <span className="eyebrow">PROBLEM</span>
        <h2>
          こんな"モヤモヤ"<br />
          抱えていませんか？
        </h2>
      </div>

      <div className="pain-list">
        {pains.map((p, i) => (
          <div className="pain-item reveal" key={i}>
            <div className="pain-check">✓</div>
            <div>{p}</div>
          </div>
        ))}
      </div>

      <Photo
        label="PAIN / 悩む 20-30代の人物 暗めトーン (推奨 1080x900)"
        className="pain-photo reveal"
      >
        <span className="frame-tag" style={{
          position: "absolute", top: 12, right: 12,
          background: "rgba(0,0,0,0.5)", padding: "4px 8px",
          fontFamily: "ui-monospace, monospace", fontSize: 10,
          color: "var(--cyan-2)", borderRadius: 4,
          border: "1px solid rgba(34,211,238,0.4)"
        }}>// PAIN_01.jpg</span>
      </Photo>

      <div className="pain-arrow reveal">
        <span className="down">そんなあなたへ</span>
      </div>
    </section>
  );
}

/* ============ Story ============ */
function Story() {
  return (
    <section className="block story">
      <div className="block-head reveal">
        <span className="eyebrow">OUR STORY</span>
        <h2>
          年収240万のフリーターが、<br />
          <span className="mark">なぜ動画編集</span>で人生を変えられたのか。
        </h2>
        <p className="lead">
          MOVIE BOOST LAB 主宰 / <strong style={{ color: "#fff" }}>TAKUMI</strong> (@takumi_movie) <br />
          SNS総フォロワー 25万人 / 受講生 1,800名超
        </p>
      </div>

      <Photo
        label="STORY / 講師ポートレート 横位置 (推奨 1440x1080)"
        className="story-photo reveal"
        warm
      >
        <span className="frame-tag" style={{
          position: "absolute", bottom: 12, left: 12,
          background: "rgba(0,0,0,0.6)", padding: "6px 10px",
          fontFamily: "ui-monospace, monospace", fontSize: 10,
          color: "var(--cyan-2)", borderRadius: 6
        }}>// STORY_TAKUMI.jpg</span>
      </Photo>

      <div className="story-blocks">
        <div className="story-chapter reveal">
          <div className="chap-num">01</div>
          <h4>絶望のフリーター時代</h4>
          <p>
            22歳。地元の倉庫でアルバイトをしながら、コンビニ弁当で食いつなぐ毎日。
            通帳の残高は3万円。「このまま終わるのか」と本気で思っていました。
          </p>
        </div>
        <div className="story-chapter reveal">
          <div className="chap-num">02</div>
          <h4>スマホ1台で見つけた光</h4>
          <p>
            ある日 TikTok で見かけた"動画編集者"という働き方。
            PC も知識もない状態から、無料アプリ1つで練習をスタート。3ヶ月後、初案件 5,000円を獲得。
          </p>
        </div>
        <div className="story-chapter reveal">
          <div className="chap-num">03</div>
          <h4>独立、そして仲間との出会い</h4>
          <p>
            半年で月収50万、1年で独立。同じ未経験から人生を変えたい人のために、
            "誰でも再現できる"カリキュラムを言語化し、MOVIE BOOST LAB を立ち上げました。
          </p>
        </div>
      </div>

      <div className="story-quote reveal">
        誰だって、本気でやれば人生は変えられる。<br />
        その"最短ルート"を、僕がそのまま渡します。
      </div>
    </section>
  );
}

/* ============ Features ============ */
function Features() {
  const feats = [
    {
      no: "FEATURE 01",
      ttl: "スマホ1台・未経験スタートに完全特化",
      body: "高額なPCも経験も不要。スマホアプリ CapCut だけで、初案件獲得まで完走できる独自カリキュラム。通勤やお昼休みのスキマ時間でOK。",
      tags: ["スマホ完結", "未経験OK", "通学不要"],
      photo: "FEAT / スマホ操作カット (1080x800)",
    },
    {
      no: "FEATURE 02",
      ttl: "現役クリエイターによる「案件直送」サポート",
      body: "学んだあとが本番。受講生限定の案件マッチング Slack で、実案件を直接ご紹介。「学んだだけで終わらない」を仕組み化しています。",
      tags: ["案件マッチング", "Slack 24h", "実案件保証"],
      photo: "FEAT / Slack案件画面風 (1080x800)",
    },
    {
      no: "FEATURE 03",
      ttl: "添削し放題・回数無制限のマンツーマン",
      body: "提出された動画は、現役の編集者が1本ずつチェック。回数無制限・スピード返信で、伸び悩みポイントを即解消します。",
      tags: ["回数無制限", "個別添削", "平均6時間返信"],
      photo: "FEAT / 添削MTG / Zoom画面 (1080x800)",
    },
    {
      no: "FEATURE 04",
      ttl: "TikTok / Reels の「伸ばし方」も学べる",
      body: "編集スキルだけでなく、SNSバズの設計、サムネ、フックの作り方まで。総フォロワー25万人の運用ノウハウをそのまま共有します。",
      tags: ["SNS運用", "バズ設計", "サムネ講座"],
      photo: "FEAT / 縦型動画モックアップ (1080x800)",
    },
  ];

  return (
    <section className="block features">
      <div className="block-head reveal">
        <span className="eyebrow">SERVICE FEATURES</span>
        <h2>
          選ばれる<br />
          <span className="mark">4つの理由。</span>
        </h2>
        <p className="lead">
          "学ぶ"で終わらない、"稼ぐ"まで伴走するための仕組みを揃えました。
        </p>
      </div>

      <div className="feat-list">
        {feats.map((f, i) => (
          <div className="feat-card reveal" key={i}>
            <Photo label={f.photo} className="photo feat-img" style={{ height: 180 }} />
            <div className="feat-body">
              <div className="feat-no">{f.no}</div>
              <h4>{f.ttl}</h4>
              <p>{f.body}</p>
              <div className="feat-tags">
                {f.tags.map((t, j) => (
                  <span className="feat-tag" key={j}>#{t}</span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mid-cta reveal">
        <div className="small">＼ まずは無料で受け取る ／</div>
        <h3>5大特典は LINE 登録 30秒。</h3>
        <a className="line-btn" href="#cta">
          <span className="line-icon">LINE</span>
          無料で特典を受け取る
        </a>
        <div className="line-meta" style={{ marginTop: 10 }}>※登録解除はいつでも可能です</div>
      </div>
    </section>
  );
}

/* ============ FAQ ============ */
function FAQ() {
  const qs = [
    { q: "本当に未経験から始められますか？", a: "はい。受講生の約8割が動画編集ほぼ未経験からのスタートです。スマホアプリの起動から1本ずつ丁寧にレッスンしますので、PCをお持ちでない方でも問題ありません。" },
    { q: "1日どれくらいの時間が必要ですか？", a: "目安は1日30分〜1時間。通勤時間や寝る前のスキマ時間で進めている受講生がほとんどです。お仕事や家事と無理なく両立できます。" },
    { q: "LINE登録だけでお金はかかりませんか？", a: "完全無料です。LINEで5大特典をお渡ししたあとも、ご自身のペースで情報を受け取っていただけます。合わない場合はワンタップで解除可能です。" },
    { q: "本講座に申し込まないといけませんか？", a: "いえ、無料特典のみのご利用でも全く問題ありません。気に入っていただけた方にだけ、別途有料プランのご案内をお送りしています。" },
    { q: "サポートはいつまで受けられますか？", a: "受講期間中は回数無制限。卒業後も受講生コミュニティに参加でき、案件相談や交流を継続いただけます。" },
  ];
  const [open, setOpen] = useState(0);

  return (
    <section className="block faq">
      <div className="block-head reveal">
        <span className="eyebrow">FAQ</span>
        <h2>
          よくあるご質問。
        </h2>
      </div>

      <div className="faq-list">
        {qs.map((item, i) => (
          <div className={`faq-item reveal ${open === i ? "open" : ""}`} key={i}>
            <button className="faq-q" onClick={() => setOpen(open === i ? -1 : i)}>
              <span className="qmark">Q</span>
              <span>{item.q}</span>
              <span className="toggle">＋</span>
            </button>
            <div className="faq-a">
              <div className="faq-a-inner">
                <span className="amark">A</span>
                <span>{item.a}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ============ Final CTA ============ */
function FinalCTA() {
  return (
    <section className="block final-cta" id="cta">
      <span className="eyebrow">REGISTER NOW</span>
      <h2 className="reveal">
        人生を変える"はじめの一歩"を、<br />
        <span className="hl">いま、無料で。</span>
      </h2>
      <p className="lead reveal">
        所要時間 30秒 / 完全無料 / LINE登録だけで5大特典がすぐ届きます。
      </p>

      <div className="line-block reveal">
        <ul className="line-bonus">
          <li>稼げる動画編集ロードマップ (PDF 32P)</li>
          <li>現役クリエイターの作業実演動画 3本</li>
          <li>案件獲得テンプレ DM 集 30種</li>
          <li>プロ仕様 SE &amp; トランジション集 100点</li>
          <li>個別キャリア相談 (30分)</li>
        </ul>

        <a className="line-btn" href="#" onClick={(e) => e.preventDefault()}>
          <span className="line-icon">LINE</span>
          無料で5大特典を受け取る
        </a>
        <div className="line-meta">※@movie-boost-lab を友だち追加</div>

        <div className="qr-row">
          <div className="qr">
            <div className="qr-grid"><i></i></div>
          </div>
          <div className="qr-text">
            <div className="small">QR CODE</div>
            <div className="big">PCでご覧の方は<br />QRコードからご登録ください</div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============ Sticky Bottom CTA ============ */
function StickyCTA() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => {
      const top = window.scrollY;
      const final = document.getElementById("cta");
      const finalTop = final ? final.getBoundingClientRect().top + window.scrollY : Infinity;
      setShow(top > 600 && window.scrollY + window.innerHeight < finalTop + 200);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className={`sticky-cta ${show ? "show" : ""}`}>
      <div className="sticky-cta-inner">
        <div className="micro">＼ 5大特典 無料配布中 ／</div>
        <a className="line-btn" href="#cta" onClick={(e) => {
          e.preventDefault();
          document.getElementById("cta").scrollIntoView({ behavior: "smooth", block: "start" });
        }}>
          <span className="line-icon">LINE</span>
          無料で特典を受け取る
        </a>
      </div>
    </div>
  );
}

/* ============ Footer ============ */
function Footer() {
  return (
    <footer className="footer">
      <div className="brand">
        <span className="brand-dot"></span>
        <span>MOVIE&nbsp;BOOST&nbsp;LAB</span>
      </div>
      <div>© 2026 MOVIE BOOST LAB. All rights reserved.</div>
      <div style={{ marginTop: 6, opacity: 0.6 }}>特定商取引法に基づく表記 / プライバシーポリシー</div>
    </footer>
  );
}

/* ============ Reveal Observer ============ */
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

/* ============ App ============ */
function App() {
  useReveal();
  return (
    <div className="stage">
      <div className="lp">
        <FirstView />
        <FreeBonus />
        <Pain />
        <Story />
        <Features />
        <FAQ />
        <FinalCTA />
        <Footer />
      </div>
      <StickyCTA />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
