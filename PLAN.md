# Plan: SNS運用代行ポートフォリオページ
_Locked via grill — by Codex + ユーザー_

## Goal

クラウドソーシングの応募先に提示できる、SNS運用代行の実績・対応範囲・問い合わせ導線を備えた専用ページを、既存ポートフォリオと統一したデザインで追加する。

## Approach

1. `portfolio-site/sns-management.html` を追加し、既存の黒基調・蛍光グリーン・アニメーションのデザインシステムを再利用する。SNS用画像は `portfolio-site/assets/sns/` に正規化し、意味の分かる英数字ファイル名で参照する。
2. 既存の `portfolio-site/index.html` のナビゲーションに `sns-management.html` への「SNS運用」リンクを追加し、制作物セクションにも同ページへのカードリンクを追加する。専用ページのロゴ・「ポートフォリオへ戻る」は `index.html` へ、ページ内ナビゲーションは同ページのアンカーへリンクする。既存の `script.js` を共有する場合は、存在しない要素を前提にしないようページごとに安全に初期化する。
3. 専用ページに、サービスの訴求、対応業務、運用の流れ、実績、参考料金、無料トライアル、問い合わせフォームを掲載する。
4. 実績カードには、Instagram 2アカウントとThreads 1アカウントを掲載する。Instagramはサムネイル・再生数・外部リンク、Threadsは投稿スクリーンショット・反応数・外部リンクで構成する。
5. 参考料金は「月額5万円〜／内容に応じて個別見積もり」と簡潔に表示し、ライト・スタンダード・運用強化の目安を示す。
6. 「先着3社限定・2か月無料トライアル」を掲載する。対象はライトサポート相当（投稿月4件、リール月2本まで、素材はクライアント提供、キャプション・投稿予約・月次簡易レポート・各投稿1回までの修正を含む、成果保証なし、実績として匿名掲載可）の範囲に限定する。現地撮影、広告費、DM・コメントの常時対応、追加修正、定例会議は含めない。投稿予約を含む運用代行はサービス提供後に行うもので、ログイン情報をフォームで受け取らない。
7. 投稿権限は、クライアントが各プラットフォームの公式機能で必要最小限の公開・予約権限を付与し、契約終了時にクライアントが取り消す。投稿はクライアントの明示承認を得てから予約し、承認または権限が得られない場合は、投稿文・画像・動画を下書きとして納品してクライアント側で公開する。
8. 無料トライアルには「募集状況：受付中／募集停止中」を明示し、受注決定時にサイト管理者が手動で状態を更新する。フォーム送信は応募確定ではなく、内容確認後に対象者を選定・返信する旨を表示する。
9. 専用フォームには、お名前、事業名またはアカウント名、メールアドレス、SNSアカウントURL、相談目的、希望する支援内容、予算感、お問い合わせ内容を設ける。既存のFormspree送信先を利用し、SNS専用の件名または送信元識別子を加える。必須はお名前、事業名またはアカウント名、メールアドレス、相談目的、希望する支援内容、お問い合わせ内容とする。SNS URLと予算感は任意にし、希望支援内容は複数選択可とする。無料トライアル希望を選べる選択肢を含める。
10. フォームには、問い合わせ・見積もり対応のみに情報を利用する旨、パスワードなどの機微情報を入力しない旨、送信前の同意チェック、Formspreeのスパム対策用ハニーポットを設ける。送信の成功・失敗をARIAライブリージョンで通知し、失敗時は再送方法を案内する。JavaScriptが使えない場合もHTMLフォーム送信が可能な状態を保つ。
11. モバイル表示、リンク、フォーム項目、外部リンクの安全属性、画像参照を検証する。

## Key decisions and tradeoffs

- 対象は個人事業主・インフルエンサー・業種を限定しない事業者。業種は絞らず、目的に合わせて伴走する訴求にする。
- 主軸はInstagram運用支援。企画、制作、投稿、分析までを一括で担い、認知拡大・集客・ファン化を目指す。フォロワー増加や成果は保証しない。
- 料金は個別見積もりを原則とし、ページには判断材料となるベース価格だけを載せる。
- 無料トライアルは実績づくりに有効だが、工数を保護するため先着3社・2か月・ライト相当の上限付きにする。
- フォロワー数は成長途中の数値が過度に評価されないよう非掲載とし、実投稿・再生数・反応数で制作と運用の実態を示す。
- Instagramは外部リンク方式にして埋め込み依存を避け、表示速度とレイアウトの安定性を優先する。

## Content and assets

### Instagram: ゆうた|仕事を辞めたいドライバーの味方

- Profile: `https://www.instagram.com/yuta_driver/?hl=ja`
- `assets/sns/instagram-driver-workday.png`（移動元 `IMG_7267.PNG`）→ `https://www.instagram.com/reel/Dd8hMRypDeK/`、再生数 121
- `assets/sns/instagram-driver-choice.png`（移動元 `IMG_7284.PNG`）→ `https://www.instagram.com/reel/DdyjeBwJs_G/`、再生数 104
- `assets/sns/instagram-driver-confidence.png`（移動元 `drive-download-20261001T154035Z-1-001/IMG_7268.PNG`）→ `https://www.instagram.com/reel/Dd8_hgcJJug/`、再生数 28

### Instagram: ゆうた｜会社員のインスタ運用記録

- Profile: `https://www.instagram.com/yuta_insta_note/?hl=ja`
- `assets/sns/instagram-record-start.png`（移動元 `drive-download-20261001T154035Z-1-001/IMG_7280.PNG`）→ `https://www.instagram.com/reel/DdtTcDrJqbM/`、再生数 148

### Threads: ふたご育児の時短帖｜毎日を少しラクに

- Profile: `https://www.threads.com/@yuta.ikuji`
- `assets/sns/threads-parenting-three-tips.png`（移動元 `drive-download-20261001T154035Z-1-001/IMG_7281.PNG`）→ `https://www.threads.com/share/FDKA3X48B/`、いいね 12・コメント 2
- `assets/sns/threads-parenting-let-go.png`（移動元 `drive-download-20261001T154035Z-1-001/IMG_7282.PNG`）→ `https://www.threads.com/share/D4HMOYLQp/`、いいね 9・コメント 5
- `assets/sns/threads-parenting-intro.png`（移動元 `drive-download-20261001T154035Z-1-001/IMG_7283.PNG`）→ `https://www.threads.com/share/MutSRKkN0/`、いいね 4・コメント 4

All engagement figures are owner-provided snapshots as of 2026-10-02. The owner approved commercial portfolio use of the account names, links, screenshots, metrics, and the unedited rear-view family thumbnail.

The Threads share URLs are the URLs supplied by the owner; each will be opened and verified immediately before launch. If Threads exposes a canonical public post URL on opening, that canonical URL will replace the share URL.

## Acceptance and proof

- 既存ポートフォリオのナビゲーションと制作物カードの双方から、SNS運用ページへ到達でき、専用ページのロゴと戻るリンクから `index.html` へ戻れる。
- 専用ページのすべての画像・投稿・プロフィールリンクが正しい素材とURLを参照し、外部リンクは新しいタブで安全に開く。
- 実績カードにフォロワー数を表示しない一方、指定された再生数・いいね数・コメント数を正しく表示する。
- 無料トライアルの先着3社、2か月、ライトサポート上限、手動の募集状況、選定・返信の流れが明示される。
- フォームに合意済みの8項目があり、必須・任意、入力型、同意、ハニーポット、送信成功・失敗時の案内が動作する。
- 360px、768px、1440px幅でレイアウトを確認し、キーボードでメニュー、カード、すべてのフォーム操作、外部リンクを移動できる。可視フォーカス、代替テキスト、見出し構造、リンクの安全属性を確認する。
- すべての外部リンクのURL・新規タブ動作を確認し、存在しない画像へのネットワーク要求がないことを確認する。

## Risks and open questions

- フォロワー数・再生数・反応数は変動するため、必要に応じて将来更新する。
- 実績として掲載するアカウント・投稿の公開状態が変わった場合は、リンクや素材を見直す。
- 初回2か月無料トライアルの継続契約は保証せず、正式な業務範囲・権限・修正回数は個別見積もり時に確認する。

## Out of scope

- このサイト制作中にSNSアカウントの実運用、広告運用、撮影、クライアントアカウントへのログインを行うこと。
- 成果保証、フォロワー増加保証、外部プラットフォーム上での投稿・メッセージ送信。
- 無料トライアルの応募受付を自動選考・自動停止する仕組み。
