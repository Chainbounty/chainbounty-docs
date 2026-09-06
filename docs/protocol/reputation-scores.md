---
id: reputation-scores
title: Reputation Score Methodology
sidebar_position: 3
---

# Reputation Score Methodology

ChainBounty tracks contributor reputation on-chain and off-chain to help maintainers identify reliable, high-quality contributors. This page explains how reputation is calculated, what affects your score, and how it's used.

---

## What is Reputation?

Your reputation score is a **numeric value** that reflects your track record on ChainBounty. It's calculated by the backend based on on-chain events (contract calls) and GitHub activity (PR quality, maintainer ratings).

### What reputation measures

| Factor | Weight |
|---|---|
| **Approved submissions** | High |
| **Disputes won** | Medium |
| **Bounty completion rate** | Medium |
| **GitHub PR quality** | Low |
| **Activity consistency** | Low |

Reputation is **not** a direct measure of code quality — it's a signal of reliability and trustworthiness.

---

## Reputation Tiers

Contributors are grouped into tiers based on their score:

| Tier | Score Range | Badge | Perks |
|---|---|---|---|
| **Bronze** | 0–499 | 🥉 | None |
| **Silver** | 500–999 | 🥈 | Priority in bounty search results |
| **Gold** | 1,000–2,499 | 🥇 | Featured on homepage, early access to high-value bounties |
| **Platinum** | 2,500+ | 💎 | Private bounty invites, lower platform fees (future) |

---

## How Reputation is Calculated

Reputation starts at **0** for new contributors and increases (or decreases) based on on-chain actions.

### Base Formula

```
Reputation = Σ (event_score × multiplier) + bonuses - penalties
```

---

## Scoring Events

### ✅ Approved Submission

**Base points:** 100

**Multipliers:**

| Condition | Multiplier |
|---|---|
| Bounty amount < 50 XLM | 1.0x |
| Bounty amount 50–200 XLM | 1.5x |
| Bounty amount 200–1,000 XLM | 2.0x |
| Bounty amount > 1,000 XLM | 3.0x |
| First submission approved (no rejections) | +1.2x |
| Completed in < 48 hours | +1.1x |

**Example:**

```
Bounty: 150 XLM
First try: Yes
Time: 36 hours

Score = 100 × 1.5 (amount) × 1.2 (first try) × 1.1 (speed)
      = 198 points
```

---

### ❌ Rejected Submission

**Base points:** 0 (neutral — no penalty for a single rejection)

**Penalty triggers:**

| Condition | Penalty |
|---|---|
| 3+ rejections on the same bounty | -25 points |
| Submission was plagiarized or spam | -100 points |
| Contributor abandoned after rejection | -10 points |

Rejections with constructive feedback and resubmissions are **neutral** — they don't hurt your score.

---

### ⚖️ Dispute Opened

**When contributor opens dispute:**

- Dispute won (arbitrator awards to contributor): **+50 points**
- Dispute lost (arbitrator awards to maintainer): **-50 points**

**When maintainer opens dispute:**

- Dispute won by contributor (arbitrator awards to contributor): **+50 points**
- Dispute lost by contributor (arbitrator awards to maintainer): **-50 points**

---

### 🚫 Bounty Claimed but Abandoned

**Penalty:** -25 points

**Triggers when:**

- Contributor claims a bounty
- No submission is made within 30 days (or deadline, if set)
- Bounty is still in `Claimed` state

**Exceptions:**

- Maintainer explicitly canceled the bounty
- Issue was closed or repo was archived
- Contributor posted an update in the last 7 days

---

### 🎯 Completion Rate Bonus

At the end of each quarter, contributors receive a bonus based on their completion rate:

```
Completion Rate = Approved Bounties / Claimed Bounties
```

| Completion Rate | Bonus |
|---|---|
| 90–100% | +100 points |
| 75–89% | +50 points |
| 50–74% | 0 points |
| < 50% | -50 points |

---

### 🔁 Consistency Bonus

Contributors who maintain regular activity receive a consistency bonus:

**Monthly active (at least 1 approved submission per month):**

- 3 consecutive months: +20 points
- 6 consecutive months: +50 points
- 12 consecutive months: +100 points

---

## Off-Chain Factors (GitHub)

The backend indexes GitHub activity to refine reputation scores.

### PR Quality Score

Maintainers can optionally rate a contributor's PR after approval (1–5 stars). This affects reputation:

| Rating | Effect |
|---|---|
| ⭐⭐⭐⭐⭐ (5 stars) | +10 points |
| ⭐⭐⭐⭐ (4 stars) | +5 points |
| ⭐⭐⭐ (3 stars) | 0 points |
| ⭐⭐ (2 stars) | -5 points |
| ⭐ (1 star) | -10 points |

PR quality is **optional** — if not rated, no adjustment is made.

### GitHub Contributor Score

Contributors with strong GitHub profiles receive a one-time onboarding bonus:

| GitHub Profile | Bonus |
|---|---|
| 1,000+ contributions in past year | +50 points |
| 500–999 contributions | +25 points |
| 100–499 contributions | +10 points |
| < 100 contributions | 0 points |

This is calculated once when the contributor links their GitHub account.

---

## Reputation Decay

Reputation does **not** decay over time. Inactive contributors keep their score.

**Rationale:** Reputation reflects historical performance. Taking a break should not punish contributors.

---

## Sybil Attack Prevention

To prevent fake accounts from gaming the system:

### Minimum activity threshold

- Contributors must have at least **3 approved bounties** before their reputation is displayed publicly
- Until then, they show as "New Contributor" with no score

### GitHub verification (optional)

- Contributors who link a GitHub account with 100+ contributions get a **Verified** badge
- Verified contributors are prioritized in search and recommendations

### Multi-account detection

The backend flags accounts with:

- Same IP address claiming multiple bounties
- Same GitHub account linked to multiple Stellar addresses
- Identical PR patterns or code submissions

Flagged accounts are reviewed manually and may be banned.

---

## How Reputation is Used

### For Contributors

- **Featured placement** — high-reputation contributors appear first in searches
- **Private invites** — maintainers can invite top contributors to exclusive bounties
- **Lower fees** (future) — Platinum contributors may receive reduced platform fees
- **Credibility signal** — reputation is public and verifiable

### For Maintainers

- **Filter by reputation** — only show bounties to Silver+ contributors
- **Fast-track approval** — trust high-reputation contributors with quicker review
- **Risk assessment** — avoid contributors with low scores or frequent disputes

---

## Reputation Leaderboard

ChainBounty displays a public leaderboard of top contributors:

**URL:** `https://app.chainbounty.dev/leaderboard`

**Filters:**

- **All-time** — highest total reputation
- **Monthly** — most points earned this month
- **By repo** — top contributors to a specific project

Contributors can opt out of the leaderboard in their profile settings.

---

## Viewing Your Reputation

### On ChainBounty

1. Go to your profile: `https://app.chainbounty.dev/profile/YOUR_ADDRESS`
2. View your score, tier, and activity history

### Via API

```bash
curl https://api.chainbounty.dev/contributors/GXXXXXXX
```

**Response:**

```json
{
  "address": "GXXXXXXX",
  "reputation_score": 847,
  "tier": "silver",
  "stats": {
    "total_claimed": 12,
    "total_approved": 9,
    "total_rejected": 1,
    "total_disputed": 2,
    "disputes_won": 1,
    "completion_rate": 0.75,
    "total_earned_xlm": "9500000000"
  },
  "badges": [
    "verified_github",
    "3_month_streak"
  ]
}
```

---

## Reputation Badges

Contributors earn badges for milestones:

| Badge | How to Earn |
|---|---|
| **First Bounty** | Complete your first approved bounty |
| **10 Bounties** | Complete 10 approved bounties |
| **50 Bounties** | Complete 50 approved bounties |
| **100 Bounties** | Complete 100 approved bounties |
| **Streak (3 months)** | Active for 3 consecutive months |
| **Streak (6 months)** | Active for 6 consecutive months |
| **Streak (12 months)** | Active for 12 consecutive months |
| **Verified GitHub** | Link GitHub account with 100+ contributions |
| **Top 10** | Ranked in top 10 on all-time leaderboard |
| **Dispute Master** | Won 5+ disputes |
| **High Roller** | Completed a bounty worth 1,000+ XLM |

Badges appear on your profile and in search results.

---

## Reputation Appeals

If you believe your reputation score is incorrect due to:

- A bug in the scoring algorithm
- A false Sybil flag
- An unfair dispute outcome

You can appeal by:

1. Emailing support@chainbounty.dev with:
   - Your Stellar address
   - A description of the issue
   - On-chain transaction IDs as evidence
2. A human reviewer will investigate within 7 business days
3. If the appeal is successful, your score is manually adjusted

---

## Future Enhancements

Planned improvements to the reputation system:

- **Skill tags** — reputation per language/framework (Rust, TypeScript, etc.)
- **Maintainer ratings** — maintainers also get reputation scores
- **Endorsements** — maintainers can endorse contributors for specific skills
- **Reputation NFTs** — mint your reputation as a Stellar NFT
- **Cross-platform reputation** — import reputation from Gitcoin, IssueHunt, etc.

---

## Reputation vs On-Chain Data

| Aspect | On-Chain | Off-Chain (Backend) |
|---|---|---|
| **Bounty approvals** | ✅ Fully verifiable | ✅ Indexed from events |
| **Dispute outcomes** | ✅ Fully verifiable | ✅ Indexed from events |
| **Completion rate** | ✅ Fully verifiable | ✅ Calculated from events |
| **PR quality ratings** | ❌ Not stored | ✅ Stored in backend DB |
| **GitHub activity** | ❌ Not stored | ✅ Fetched via GitHub API |
| **Badges** | ❌ Not stored | ✅ Calculated by backend |

Reputation is **semi-decentralized** — core events are on-chain, but the full score is calculated off-chain.

---

## Example: Reputation Journey

### Alice — New Contributor

| Month | Event | Points | Total |
|---|---|---|---|
| Jan | First bounty approved (50 XLM, 48h) | +100 × 1.0 × 1.2 × 1.1 = **132** | 132 |
| Jan | Second bounty approved (100 XLM) | +100 × 1.5 = **150** | 282 |
| Feb | Third bounty approved (75 XLM, first try) | +100 × 1.5 × 1.2 = **180** | 462 |
| Mar | Fourth bounty approved (200 XLM) | +100 × 2.0 = **200** | 662 |
| Mar | 3-month consistency bonus | **+20** | **682 (Silver tier)** |

After 4 months, Alice is Silver tier with a strong completion rate.

---

## Related

- [Contributor Onboarding](/docs/guides/contributor-onboarding) — how to earn reputation
- [Bounty Lifecycle](/docs/bounty-lifecycle) — which events affect reputation
- [Dispute Resolution](/docs/protocol/dispute-resolution) — how disputes impact reputation
- [Backend API](/docs/api/backend-api) — reputation API endpoints
