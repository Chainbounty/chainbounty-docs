---
id: roadmap
title: Roadmap and Future Features
sidebar_position: 4
---

# Roadmap and Future Features

ChainBounty is actively evolving. This page outlines what's coming next, what's being explored, and how the protocol will grow over time.

---

## Current Phase: Testnet Beta (Q4 2026)

ChainBounty is currently in **Testnet Beta** with full functionality but no real funds at risk.

### Goals for this phase

- ✅ Core contract deployed and tested
- ✅ Backend indexing and API live
- ✅ Frontend UI complete
- ✅ GitHub webhook integration working
- ✅ Reputation system operational
- 🔄 Community testing and feedback
- 🔄 Bug fixes and UX improvements
- 🔄 Documentation complete

---

## Q1 2027 — Mainnet Launch

**Target:** January 2027

### Deliverables

| Feature | Status | Description |
|---|---|---|
| **Smart contract audit** | 🔄 In progress | External security audit by professional auditors |
| **Bug bounty program** | 📅 Planned | Incentivize vulnerability disclosure |
| **Mainnet deployment** | 📅 Planned | Deploy contract to Stellar Mainnet |
| **Insurance fund** | 📅 Planned | Reserve fund for edge cases and exploits |
| **Fiat on-ramp guide** | 📅 Planned | Help users convert USD → XLM → bounties |

### Launch criteria

- [ ] Contract audit complete with all critical issues resolved
- [ ] 1,000+ Testnet transactions with no major issues
- [ ] Backend has 99.9% uptime for 30 days
- [ ] Dispute resolution tested in all scenarios
- [ ] Core team and advisors sign off

---

## Q2 2027 — Growth and Scale

**Focus:** Onboard projects, DAOs, and contributors at scale.

### Features

| Feature | Priority | Description |
|---|---|---|
| **GitHub App** | High | Install ChainBounty across all repos in an org |
| **Multi-repo dashboards** | High | Maintainers manage bounties across multiple projects |
| **Batch bounty posting** | Medium | Post 10+ bounties in one transaction |
| **Email notifications** | Medium | Get notified when bounties are claimed or approved |
| **Mobile-friendly UI** | Medium | Responsive design for phones and tablets |
| **Search and filters** | High | Filter by language, label, amount, reputation |

---

## Q3 2027 — Governance and Decentralization

**Focus:** Transition from core team control to community governance.

### Features

| Feature | Priority | Description |
|---|---|---|
| **Governance token launch** | High | $BOUNTY token distributed to early users |
| **Treasury governance** | High | Token holders vote on fee splits and spending |
| **Fee adjustment voting** | High | Community proposes and votes on fee changes |
| **Protocol upgrades via vote** | Medium | On-chain voting for contract upgrades |
| **Grants program** | Medium | Community allocates treasury funds to OSS projects |

### Token Distribution (Proposed)

| Allocation | % | Recipients |
|---|---|---|
| **Early contributors** | 25% | Top 100 contributors by reputation |
| **Early maintainers** | 15% | Projects that posted 10+ bounties |
| **Core team** | 20% | Founding team and advisors (4-year vest) |
| **Treasury** | 20% | Community-controlled grants and incentives |
| **Liquidity** | 10% | DEX pools and liquidity mining |
| **Future contributors** | 10% | Ongoing contributor rewards |

---

## Q4 2027 — Advanced Features

**Focus:** Expand beyond basic bounties into advanced workflows.

### Features

| Feature | Priority | Description |
|---|---|---|
| **Milestone bounties** | High | Split large bounties into multiple checkpoints |
| **Recurring bounties** | Medium | Pay contributors monthly for ongoing work |
| **Bounty templates** | Medium | Pre-fill bounty details for common tasks |
| **Partial payments** | Medium | Award 70% to contributor, 30% refund to maintainer |
| **Staking for priority** | Low | Contributors stake $BOUNTY to get first claim on high-value bounties |
| **Reputation NFTs** | Low | Mint your reputation as a tradeable NFT |

---

## 2028 and Beyond — Ecosystem Expansion

**Focus:** Build a full ecosystem around decentralized open source work.

### Planned Features

#### Multi-Chain Support

Expand beyond Stellar to other chains:

- **Ethereum** — via cross-chain bridge
- **Polygon** — L2 for lower fees
- **Solana** — alternative high-speed chain
- **Cosmos** — IBC integration

Contributors can claim on one chain and receive payment on another.

---

#### DAO Tooling

ChainBounty as infrastructure for DAOs:

- **Proposal-to-bounty** — auto-create bounties from passed governance proposals
- **Multisig integration** — DAOs post bounties directly from multisig wallets
- **Budget tracking** — on-chain dashboards showing DAO spend on bounties
- **Contributor analytics** — which contributors are most valuable to your DAO?

---

#### GitLab and Bitbucket Support

Currently GitHub-only. Expand to:

- **GitLab** — self-hosted and GitLab.com
- **Bitbucket** — Atlassian ecosystem
- **Gitea** — self-hosted Git platforms

---

#### AI-Powered Matching

Use AI to match contributors to bounties:

- **Skill detection** — analyze past PRs to understand contributor strengths
- **Bounty recommendations** — suggest bounties based on contributor skills
- **Auto-estimate** — predict bounty completion time based on issue complexity
- **Quality prediction** — flag potentially problematic issues or contributors

---

#### Decentralized Reputation

Make reputation truly portable:

- **Cross-platform reputation** — import reputation from Gitcoin, IssueHunt, etc.
- **Reputation as NFT** — mint and trade reputation on secondary markets
- **Zero-knowledge proofs** — prove reputation without revealing wallet address
- **Reputation delegation** — let teams share reputation across members

---

#### Advanced Dispute Resolution

Improve the arbitration process:

- **Multisig arbitration** — require 2 of 3 arbitrators to agree
- **Arbitrator reputation** — score arbitrators based on decision quality
- **Appeals process** — allow one appeal to a higher-tier arbitrator
- **On-chain evidence** — store dispute evidence on IPFS, linked on-chain

---

#### Hackathons and Competitions

Built-in support for time-bound competitions:

- **Hackathon mode** — post bounties with a shared deadline
- **Leaderboards** — rank contributors by points earned during the event
- **Prize pools** — distribute prizes to top N contributors
- **Team submissions** — allow teams to claim and split bounties

---

#### Bounty Marketplace

Secondary market for bounty rights:

- **Sell your claim** — if you claimed a bounty but can't complete it, sell your claim
- **Bounty insurance** — contributors buy insurance against unfair rejection
- **Bounty derivatives** — bet on whether a bounty will be completed

---

## Research and Exploration

These ideas are in the research phase — no guarantees they'll be built.

### Optimistic Approvals

- Contributor submits work
- Funds auto-release after 7 days unless maintainer rejects
- Reduces burden on maintainers, incentivizes timely review

### Bounty Pools

- Multiple projects contribute to a shared pool
- Contributors can claim from the pool and choose which issue to work on
- Pool dividends are distributed based on contribution quality

### Reputation Staking

- Contributors stake their reputation to claim high-value bounties
- If they fail to deliver, their stake is burned
- Protects maintainers from claim-and-abandon behavior

### On-Chain Code Review

- Store PR diffs and review comments on-chain or IPFS
- Maintainers cryptographically sign their approval
- Enables trustless audits of bounty outcomes

---

## Community Requests

These features have been requested by the community. Upvote in [GitHub Discussions](https://github.com/chainbounty/discussions).

| Feature | Votes | Status |
|---|---|---|
| **Private bounties** (invite-only) | 42 | 🔄 In design |
| **Anonymous bounties** (private poster identity) | 38 | 📅 Planned Q3 2027 |
| **Tip contributors** (send extra payment after approval) | 31 | 🔄 In development |
| **Bounty subscriptions** (pay monthly for maintenance) | 27 | 📅 Exploring |
| **Referral bonuses** (earn for bringing in contributors) | 23 | 📅 Planned Q4 2027 |
| **Localization** (translate UI to 10+ languages) | 19 | 📅 Planned Q2 2027 |

**Want to see something built?** Upvote or propose it in [Discussions](https://github.com/chainbounty/discussions).

---

## Not on the Roadmap

Some features have been explicitly **rejected** after community discussion:

| Feature | Why it's not happening |
|---|---|
| **Closed-source contract** | Conflicts with ChainBounty's open-source ethos |
| **KYC for contributors** | Privacy-hostile and excludes pseudonymous contributors |
| **Subscription pricing** | Prefer pay-per-use (platform fee) over monthly subscriptions |
| **Centralized escrow** | Defeats the purpose of on-chain trustless escrow |
| **Ads on the platform** | Degrades user experience and conflicts with mission |

---

## How to Influence the Roadmap

ChainBounty's roadmap is shaped by the community. Here's how to have your say:

1. **Join Discord** — [discord.gg/chainbounty](https://discord.gg/chainbounty) for real-time discussions
2. **Propose in GitHub Discussions** — long-form proposals with community voting
3. **Vote with $BOUNTY** (post-governance) — token holders vote on priorities
4. **Contribute code** — implement the feature yourself and submit a PR
5. **Fund a bounty** — post a bounty for a feature you want built

---

## Version History

| Version | Release Date | Highlights |
|---|---|---|
| **v0.1.0** | Oct 2026 | Testnet Beta launch |
| **v0.2.0** | Nov 2026 | Reputation system + GitHub webhooks |
| **v0.3.0** | Dec 2026 | Dispute resolution + multi-asset support |
| **v1.0.0** | Jan 2027 | Mainnet launch (planned) |
| **v1.1.0** | Q2 2027 | Governance token launch (planned) |
| **v2.0.0** | Q4 2027 | Milestone bounties + advanced features (planned) |

---

## Stay Updated

Follow ChainBounty's progress:

- **Twitter / X:** [@chainbounty](https://x.com/chainbounty)
- **Discord:** [discord.gg/chainbounty](https://discord.gg/chainbounty)
- **GitHub:** [github.com/chainbounty](https://github.com/chainbounty)
- **Monthly newsletter:** [Subscribe here](https://chainbounty.dev/newsletter)

---

## Related

- [Contributing](/docs/contributing) — help build the roadmap
- [FAQ](/docs/reference/faq) — common questions about features
- [Changelog](/docs/reference/changelog) — what shipped recently
