# SNS運用代行ポートフォリオページ — Plan Review Log

## Settings

- `MAX_ROUNDS`: 5
- `PLAN_FILE`: `PLAN.md`
- `LOG_FILE`: `PLAN-REVIEW-LOG.md`

## Phase 1 decisions

- 用途はクラウドソーシングの応募先に提示するSNS運用代行ポートフォリオ。
- 対象は個人事業主、インフルエンサー、業種を限定しない事業者。
- Instagramを主軸に、企画・制作・投稿・分析までの一括運用を提供する。
- 訴求は認知拡大・集客・ファン化への伴走。成果は保証しない。
- 問い合わせは専用ページ内のフォームで受ける。
- 料金は個別見積もりを原則とし、月額5万円〜の参考料金を表示する。
- 無料トライアルは先着3社限定、2か月、ライトサポート相当の作業上限付き。
- 実績はInstagram 2件とThreads 1件。Instagramはサムネイル＋外部リンク、Threadsはリンク＋スクリーンショット。
- フォロワー数は非掲載。リール再生数とThreadsのいいね・コメント数を掲載する。
- フォーム項目はお名前、事業名またはアカウント名、メール、SNS URL、目的、希望支援内容、予算感、問い合わせ内容。
- 既存ポートフォリオのナビゲーションと制作物カードに専用ページへの導線を追加する。

## Phase 3 review

### Round 1 — VERDICT: REVISE

Reviewer findings:

1. Asset paths were ambiguous because source images are split between the portfolio root and `drive-download-20261001T154035Z-1-001/`.
2. The new page needed an explicit navigation and shared-script compatibility design because the existing navigation uses page fragments and the script assumes existing page elements.
3. The first-three-companies offer needed a manually maintained availability status and an intake/selection process.
4. The form needed privacy notice, consent, anti-spam handling, credential warning, and failure behavior.
5. The eight fields needed required/optional statuses, selection behavior, validation, and trial selection.
6. The form needed SNS-specific source/subject behavior and accessible result states.
7. Time-sensitive metrics needed snapshot attribution and portfolio-use consent.
8. Final full external URLs and content types needed to be fixed in the plan.
9. Trial and paid scope needed clear inclusions and exclusions.
10. Acceptance criteria needed concrete viewport, accessibility, form, outbound-link, and missing-asset checks.

Plan changes after review:

- Normalized every SNS asset to a planned `assets/sns/` path with its source location and final full outbound URL.
- Defined cross-page and page-local navigation plus safe shared-script initialization.
- Added trial availability status, manual update responsibility, and selection language.
- Defined form contract, consent, privacy notice, honeypot, accessibility behavior, and fallback.
- Added snapshot date and owner-approved portfolio-use record.
- Added explicit trial inclusions/exclusions and measurable acceptance checks.

### Round 2 — VERDICT: REVISE

Reviewer findings:

1. The plan contradicted itself by promising posting/scheduling in the service while excluding live operation in out-of-scope.
2. Permission, approval, revocation, and no-access fallback for scheduled posting were underdefined.
3. Instagram tracking URLs should be canonicalized; provided Threads share URLs should be verified and replaced with canonical public URLs when available.

Plan changes after review:

- Distinguished the future service (which includes approved posting/scheduling) from activities excluded during this website build.
- Added client-granted least-privilege access, per-post approval, revocation, and draft-delivery fallback.
- Replaced Instagram URLs with canonical reel URLs and added pre-launch verification/replacement rules for Threads share URLs.

### Round 3 — VERDICT: APPROVED

Full reviewer response:

> The scope distinction is now clear: no live SNS operation occurs while building the site, while scheduling is a possible future service deliverable. Permission handling, explicit pre-scheduling approval, and draft-delivery fallback now cover the operational edge cases. Instagram uses stable canonical reel URLs; Threads links have a pre-launch verification/replacement rule.
>
> No remaining material contradiction or missing safeguard found.
>
> VERDICT: APPROVED
