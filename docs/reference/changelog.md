---
id: changelog
title: Changelog and Versioning
sidebar_position: 3
---

# Changelog and Versioning

ChainBounty follows [Semantic Versioning](https://semver.org/) (SemVer). This page documents all notable changes to the protocol, contract, backend, and frontend across versions.

---

## Versioning Scheme

ChainBounty uses **SemVer** with the format `MAJOR.MINOR.PATCH`:

- **MAJOR** — Breaking changes (e.g., contract upgrade requiring migration)
- **MINOR** — New features, backward compatible
- **PATCH** — Bug fixes and minor improvements

**Example:**

- `v1.0.0` → `v1.1.0` — new feature added (backward compatible)
- `v1.1.0` → `v1.1.1` — bug fix
- `v1.1.1` → `v2.0.0` — breaking change (contract upgrade)

---

## Release Channels

| Channel | Purpose | Stability |
|---|---|---|
| **Testnet** | Testing and development | Unstable, frequent updates |
| **Mainnet Beta** | Early production, limited scale | Mostly stable, possible issues |
| **Mainnet Stable** | Production-ready | Stable, audited |

---

## Current Version

### v0.3.0 (Testnet) — December 2026

**Status:** Current Testnet version

**Highlights:**

- Dispute resolution fully implemented
- Multi-asset support (USDC, yXLM, custom tokens)
- Reputation system with tier badges
- GitHub webhook integration stable

---

## Changelog

### v0.3.0 — December 15, 2026

**Contract:**

- ✨ Added `open_dispute` and `resolve_dispute` entry points
- ✨ Multi-asset support via `asset` parameter in `post_bounty`
- 🐛 Fixed edge case where cancelled bounties could be re-claimed
- 🐛 Fixed overflow in reputation score calculation

**Backend:**

- ✨ Reputation tiers (Bronze, Silver, Gold, Platinum)
- ✨ Leaderboard API endpoint
- ✨ Webhook signature validation for GitHub
- 🐛 Fixed race condition in bounty indexing

**Frontend:**

- ✨ Dispute modal UI
- ✨ Asset selector dropdown (XLM, USDC, yXLM, custom)
- ✨ Reputation badges on contributor profiles
- 🐛 Fixed Freighter connection on Firefox

**Docs:**

- 📝 Added Dispute Resolution guide
- 📝 Added Token Support guide
- 📝 Added Security Model documentation

---

### v0.2.0 — November 1, 2026

**Contract:**

- ✨ Added `reject_submission` entry point
- ✨ Deadline support (optional expiry timestamp)
- 🐛 Fixed double-claim vulnerability

**Backend:**

- ✨ GitHub webhook integration
- ✨ Reputation score calculation
- ✨ Contributor profile API
- 🐛 Fixed PostgreSQL connection pooling issue

**Frontend:**

- ✨ Bounty board filters (state, amount, label)
- ✨ Contributor profile page
- ✨ Real-time notifications via WebSocket
- 🐛 Fixed transaction simulation on slow networks

**Docs:**

- 📝 Added GitHub Integration guide
- 📝 Added Reputation Scores documentation
- 📝 Added FAQ section

---

### v0.1.0 — October 1, 2026

**Initial Testnet Beta release**

**Contract:**

- ✨ Core escrow functionality (`post_bounty`, `claim_bounty`, `submit_work`, `approve_submission`)
- ✨ Cancellation support
- ✨ On-chain events (BountyPosted, BountyClaimed, etc.)

**Backend:**

- ✨ REST API for bounty listing
- ✨ PostgreSQL indexing
- ✨ Health check endpoint

**Frontend:**

- ✨ Bounty board UI
- ✨ Freighter wallet integration
- ✨ Post bounty form
- ✨ Claim and submit work flows

**Docs:**

- 📝 Introduction and protocol overview
- 📝 Quick Start guide
- 📝 Contract ABI reference
- 📝 Backend API reference

---

## Upcoming Releases

### v0.4.0 (Testnet) — Planned Q1 2027

**Contract:**

- ✨ Milestone bounties (split large bounties into checkpoints)
- ✨ Partial payment support
- 🔧 Gas optimizations

**Backend:**

- ✨ Email notifications
- ✨ PR quality ratings
- 🔧 Redis caching layer

**Frontend:**

- ✨ Mobile-responsive UI
- ✨ Dark/light mode toggle
- ✨ Multi-language support (Spanish, French, Chinese)

---

### v1.0.0 (Mainnet) — Planned Q1 2027

**Major milestone: Mainnet launch**

**Contract:**

- 🔒 External security audit completed
- 🔒 All critical vulnerabilities patched
- ✨ Immutable deployment (no upgrade path)

**Backend:**

- ✨ 99.9% uptime SLA
- ✨ DDoS protection and rate limiting
- ✨ Multi-region deployment

**Frontend:**

- ✨ Production-ready UI
- ✨ Onboarding tutorial
- ✨ Help center integration

**Governance:**

- 📋 Bug bounty program live
- 📋 Insurance fund established

---

## Breaking Changes

Breaking changes require user action (e.g., re-deploy, migrate data).

### v1.0.0 → v2.0.0 (Future)

**Breaking:**

- Contract ID changes (new deployment)
- All bounties must be migrated to new contract
- Frontend config must update `VITE_CONTRACT_ID`

**Migration path:**

1. Maintainers approve or cancel all open bounties on v1 contract
2. Core team deploys v2 contract
3. Users update frontend config to point to v2 contract

---

## Deprecations

Features marked for removal in future versions.

### Deprecated in v0.3.0

- **None**

### Future deprecations

- **Manual GitHub linking (v1.2.0)** — will be replaced by OAuth flow

---

## Security Updates

Critical security fixes are released immediately as **patch versions**.

### v0.2.1 — November 15, 2026

**🔒 Security patch**

- Fixed reentrancy vulnerability in dispute resolution (Testnet only, no funds at risk)
- Fixed HMAC validation bypass in webhook handler

---

## Contract Upgrades

ChainBounty contracts are **immutable** once deployed. Upgrades require deploying a new contract.

### How contract upgrades work

1. **Deploy new contract** to a new Contract ID
2. **Announce migration** with 30-day notice
3. **Freeze old contract** after migration period
4. **Users update config** to point to new contract ID

All existing bounties on the old contract must be resolved before migration.

---

## Versioning by Component

Each component (contract, backend, frontend, docs) has its own version, but they're synchronized for major releases.

### Current versions

| Component | Version | Repo |
|---|---|---|
| **Contract** | v0.3.0 | [chainbounty-contract](https://github.com/chainbounty/chainbounty-contract) |
| **Backend** | v0.3.1 | [chainbounty-backend](https://github.com/chainbounty/chainbounty-backend) |
| **Frontend** | v0.3.2 | [chainbounty-frontend](https://github.com/chainbounty/chainbounty-frontend) |
| **Docs** | v0.3.0 | [chainbounty-docs](https://github.com/chainbounty/chainbounty-docs) |

Minor version differences (e.g., backend v0.3.1 vs contract v0.3.0) indicate backward-compatible patches that don't affect other components.

---

## Release Notes Format

All release notes follow this format:

```markdown
## vX.Y.Z — Date

**Contract:**
- ✨ New feature
- 🐛 Bug fix
- 🔒 Security fix
- 🔧 Performance improvement
- 💥 Breaking change

**Backend:**
- ...

**Frontend:**
- ...

**Docs:**
- 📝 Documentation updates
```

---

## How to Check Your Version

### Contract

Query the contract's version entry point (if available):

```bash
stellar contract invoke \
  --id $CONTRACT_ID \
  --network testnet \
  -- version
```

Or check the deployment transaction on Stellar Expert.

### Backend

```bash
curl https://api.chainbounty.dev/health
```

Response includes version:

```json
{
  "status": "ok",
  "version": "0.3.1",
  "network": "testnet"
}
```

### Frontend

Open the browser console:

```javascript
console.log(window.__CHAINBOUNTY_VERSION__);
// Output: "0.3.2"
```

Or check the footer: **ChainBounty v0.3.2**

---

## Subscribing to Updates

Stay informed about new releases:

- **GitHub Releases** — watch the [chainbounty repos](https://github.com/chainbounty)
- **Discord** — announcements channel in [Discord](https://discord.gg/chainbounty)
- **Twitter** — follow [@chainbounty](https://x.com/chainbounty)
- **Newsletter** — subscribe at [chainbounty.dev/newsletter](https://chainbounty.dev/newsletter)

---

## Semantic Versioning Examples

### MAJOR (breaking)

- Contract ABI changes (function signatures altered)
- Backend API endpoints removed or renamed
- Frontend requires new wallet version

**Example:** `v1.5.2` → `v2.0.0`

### MINOR (new features)

- New contract entry point added
- New backend API endpoint
- New frontend feature

**Example:** `v1.5.2` → `v1.6.0`

### PATCH (bug fixes)

- Bug fix that doesn't change behavior
- Performance improvement
- Documentation typo

**Example:** `v1.5.2` → `v1.5.3`

---

## Historical Releases

### Alpha (Pre-v0.1.0) — July–September 2026

**Private testing phase**

- Internal contract prototypes
- Basic frontend POC
- Architecture design

Not publicly released.

---

## Related

- [Roadmap](/docs/reference/roadmap) — upcoming features
- [Contributing](/docs/contributing) — how to contribute to releases
- [Security](/docs/protocol/security) — security update policy
- [GitHub Releases](https://github.com/chainbounty/chainbounty-contract/releases) — full release history

---

**Questions about versioning?** Ask in [Discord](https://discord.gg/chainbounty) or open an issue on [GitHub](https://github.com/chainbounty).
