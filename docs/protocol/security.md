---
id: security
title: Security Model and Threat Considerations
sidebar_position: 5
---

# Security Model and Threat Considerations

ChainBounty's security model is built around trustless on-chain execution, wallet-controlled signing, and defense-in-depth at every layer. This page explains the security architecture, known threats, mitigations, and best practices.

---

## Security Principles

ChainBounty is designed with the following security principles:

| Principle | Implementation |
|---|---|
| **Non-custodial** | ChainBounty never holds user funds — the smart contract does |
| **Trustless escrow** | Funds are locked on-chain with enforceable release conditions |
| **Transparent** | All state transitions are public and verifiable on Stellar |
| **Minimal attack surface** | Contract logic is kept simple and auditable |
| **Wallet-controlled** | All actions require explicit user signature via Freighter |

---

## Threat Model

### In-Scope Threats

ChainBounty defends against:

1. **Malicious maintainers** refusing to pay for valid work
2. **Malicious contributors** submitting broken code and demanding payment
3. **Rug pulls** — bounty poster trying to reclaim funds after work is done
4. **Front-running** — bots claiming bounties before legitimate contributors
5. **Double-spend** — attempting to claim the same bounty twice
6. **Sybil attacks** — fake accounts gaming reputation scores
7. **Backend compromise** — attacker gains access to the backend server
8. **Frontend compromise** — XSS, malicious code injection
9. **Smart contract bugs** — reentrancy, arithmetic overflow, state corruption

### Out-of-Scope Threats

The following are **not** protected against by the protocol:

- **Social engineering** — phishing, fake websites, impersonation
- **Compromised wallets** — user's secret key is stolen
- **GitHub account takeover** — attacker merges malicious PRs
- **Zero-day browser exploits** — Freighter or browser is compromised
- **Nation-state attacks** — targeting the Stellar network itself

Users are responsible for securing their wallets, GitHub accounts, and devices.

---

## Smart Contract Security

### Architecture

The ChainBounty contract is designed to minimize attack surface:

- **Single escrow pattern** — all funds are held in the contract, never transferred to an intermediary
- **State machine enforcement** — every transition is validated against the current bounty state
- **Explicit authorization checks** — only the poster, claimant, or arbitrator can take specific actions
- **No recursive calls** — contract does not call external contracts
- **No upgradeable proxy** — contract is immutable once deployed (upgrades require new deployment)

### Mitigations

| Threat | Mitigation |
|---|---|
| **Reentrancy** | Soroban does not allow reentrancy — calls to the contract are atomic |
| **Integer overflow** | Rust's type system and Soroban SDK prevent overflows |
| **Unauthorized access** | Every entry point checks `env.require_auth()` for the caller |
| **Double-claim** | State machine enforces that a bounty can only be claimed once |
| **Locked funds** | Dispute resolution and cancellation provide escape hatches |

### Audits

**Status:** Pre-audit (Testnet only)

Before Mainnet launch, the contract will undergo:

- **Internal security review** — core team code review
- **External audit** — professional smart contract auditors (planned Q4 2026)
- **Bug bounty program** — community-driven vulnerability disclosure

:::warning
The contract is **not yet audited**. Use Testnet for testing only. Do not deploy to Mainnet or use with real funds until an audit is completed.
:::

---

## Backend Security

The backend service is **not trustless** — it is a centralized indexing and API layer. However, it has **zero custody** over funds.

### Attack Vectors

| Attack | Impact | Mitigation |
|---|---|---|
| **Database breach** | Attacker reads bounty metadata, contributor info | Encrypt sensitive fields, use read-only DB replicas |
| **API DDoS** | Service goes down, frontend can't load bounties | Rate limiting, CDN, load balancing |
| **Webhook spoofing** | Fake GitHub events trigger incorrect state updates | Validate `X-Hub-Signature-256` HMAC |
| **SQL injection** | Attacker extracts or modifies database | Use parameterized queries, ORM validation |
| **Admin API abuse** | Attacker with API key manipulates data | Rotate keys regularly, audit logs |

### Mitigations

- **Environment secrets** — all keys stored in `.env` and never committed
- **GitHub webhook signature validation** — reject unsigned or tampered webhooks
- **Rate limiting** — 60 requests/min per IP for public endpoints
- **Input validation** — sanitize all user input before database writes
- **Read-only contract access** — backend can read contract state but cannot submit transactions

### What the backend CANNOT do

- Submit transactions on behalf of users
- Move funds from escrow
- Approve, reject, or resolve bounties
- Change bounty state on-chain

All state-changing operations require a wallet signature from the user.

---

## Frontend Security

The React frontend is **untrusted** — it runs in the user's browser and can be compromised.

### Attack Vectors

| Attack | Impact | Mitigation |
|---|---|---|
| **XSS** | Attacker injects malicious JavaScript | React escapes all user input by default |
| **Phishing** | Fake frontend steals wallet signatures | Users must verify the URL before connecting |
| **Malicious dependencies** | npm package contains backdoor | Regular dependency audits, lock file integrity checks |
| **Man-in-the-middle** | Attacker intercepts RPC calls | Enforce HTTPS, use Soroban RPC over TLS |

### Mitigations

- **Content Security Policy (CSP)** — prevents inline script execution
- **Subresource Integrity (SRI)** — ensures CDN resources are not tampered with
- **Wallet transaction review** — Freighter shows transaction details before signing
- **Open source** — frontend code is auditable on GitHub

### What the frontend CANNOT do

- Sign transactions without user approval in Freighter
- Access the user's secret key
- Submit transactions to a different contract without the user noticing (Freighter shows contract ID)

---

## Wallet Security

ChainBounty relies on Freighter for all transaction signing. Freighter's security model:

- **Secret keys never leave the extension** — stored encrypted in browser storage
- **Transaction preview** — user reviews every transaction before signing
- **Network verification** — shows which network the transaction targets (Testnet/Mainnet)
- **Sandboxed execution** — browser extension runs in an isolated environment

### User Responsibilities

Users must:

- ✅ **Back up recovery phrase** — store it offline in a secure location
- ✅ **Verify the URL** before connecting wallet — only connect to `chainbounty.dev` or trusted domains
- ✅ **Review transactions** — check the operation, fee, and network before signing
- ✅ **Use a hardware wallet** (future) — for high-value bounties
- ❌ **Never share recovery phrase** — ChainBounty support will never ask for it

---

## Dispute Resolution Security

Arbitrators have significant power — they decide who gets the escrowed funds in disputes.

### Arbitrator Risks

| Risk | Impact | Mitigation |
|---|---|
| **Biased arbitrator** | Unfair decision in favor of one party | Use reputable, neutral arbitrators |
| **Compromised arbitrator** | Attacker gains access to arbitrator key | Use multisig arbitrator (future) |
| **Arbitrator collusion** | Poster and arbitrator collude to steal funds | Require arbitrator reputation + bond |

### Future Enhancements

- **Multisig arbitration** — require 2 of 3 arbitrators to agree
- **Arbitrator staking** — arbitrators post a bond that is slashed for bad decisions
- **On-chain arbitrator registry** — track arbitrator decisions and reputation

---

## Reputation System Security

Contributor reputation scores are calculated off-chain by the backend.

### Attack Vectors

| Attack | Impact | Mitigation |
|---|---|
| **Score manipulation** | Attacker inflates their score | Only contract events affect score, backend is read-only |
| **Sybil attack** | Attacker creates many fake accounts | Require minimum activity + GitHub verification |
| **Reputation washing** | Bad actor creates new account after dispute | Link GitHub accounts, flag repeated disputes |

Reputation is **advisory only** — it does not grant special on-chain privileges.

---

## GitHub Integration Security

ChainBounty integrates with GitHub via webhooks and OAuth (future).

### Webhook Security

- **HMAC signature validation** — reject webhooks that fail `X-Hub-Signature-256` validation
- **IP allowlisting** — only accept webhooks from GitHub's public IP ranges
- **Replay protection** — track processed webhook IDs to prevent replay attacks

### OAuth Security (Future)

When GitHub OAuth is added for contributor verification:

- **Minimal scopes** — request only `read:user` and `public_repo`
- **Token rotation** — refresh tokens regularly
- **Token storage** — encrypt tokens in database

---

## Threat: Malicious Maintainer

**Scenario:** Maintainer posts a bounty, contributor completes the work, maintainer refuses to approve.

**Mitigations:**

1. **Dispute resolution** — contributor can open a dispute if arbitrator is set
2. **Reputation impact** — frequent disputes flag the maintainer as problematic
3. **Community reporting** — other contributors can warn about bad maintainers

**Limitations:** If no arbitrator is set, funds stay locked forever unless both parties agree.

---

## Threat: Malicious Contributor

**Scenario:** Contributor claims a bounty, submits broken code, demands payment.

**Mitigations:**

1. **Maintainer approval required** — contributor cannot release funds themselves
2. **Rejection + resubmission** — maintainer can reject with feedback
3. **Dispute resolution** — maintainer can open dispute if contributor insists on payment

**Limitations:** Contributor's time is wasted if maintainer acts in bad faith and opens frivolous disputes.

---

## Threat: Front-Running

**Scenario:** Bot monitors pending transactions and submits a claim faster than a human.

**Mitigations:**

1. **Stellar's speed** — 3-5 second finality makes front-running less profitable
2. **No MEV** — Stellar does not have miner extractable value (MEV) like Ethereum
3. **First-come, first-served** — contract enforces that only the first claimant succeeds

**Limitations:** Bots can still claim bounties faster than humans. This is a UX issue, not a security issue.

---

## Incident Response Plan

If a security issue is discovered:

1. **Report immediately** — email security@chainbounty.dev or DM on Discord
2. **Do not disclose publicly** until patched
3. **Bug bounty reward** — earn up to 10% of funds at risk (up to $10,000)
4. **Coordinated disclosure** — 90-day disclosure window after patch

---

## Security Checklist (Pre-Mainnet)

Before deploying to Mainnet, ensure:

- [ ] Contract has been audited by a reputable firm
- [ ] Critical bugs from audit have been fixed
- [ ] Backend API keys are rotated and secured
- [ ] Rate limiting and DDoS protection are enabled
- [ ] Frontend CSP and SRI are configured
- [ ] Testnet has been tested with 1,000+ transactions
- [ ] Dispute resolution has been tested in all scenarios
- [ ] Bug bounty program is live
- [ ] Incident response plan is documented
- [ ] Insurance or reserve fund is established (optional)

---

## Responsible Disclosure

If you discover a vulnerability:

✅ **Do:**
- Email security@chainbounty.dev with details
- Wait for acknowledgment before public disclosure
- Provide proof-of-concept if possible

❌ **Don't:**
- Exploit the vulnerability for personal gain
- Disclose publicly before a patch is available
- Test exploits on Mainnet (use Testnet only)

We commit to responding within 48 hours and issuing a fix within 30 days.

---

## Related

- [Dispute Resolution](/docs/protocol/dispute-resolution) — arbitration process
- [Contract ABI](/docs/api/contract-abi) — all entry points and authorization
- [Testnet Deployment](/docs/guides/testnet-deployment) — safe testing environment
- [Freighter Wallet Setup](/docs/guides/freighter-wallet) — wallet security basics
