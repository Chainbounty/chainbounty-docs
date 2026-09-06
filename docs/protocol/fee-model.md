---
id: fee-model
title: Fee Model and Treasury
sidebar_position: 2
---

# Fee Model and Treasury

ChainBounty charges a small protocol fee on every bounty to sustain development, infrastructure, and community growth. This page explains how fees work, where they go, and how the treasury is managed.

---

## Fee Structure

ChainBounty charges a **2.5% protocol fee** on every bounty payout. The fee is deducted when funds are released to the contributor.

### Who pays the fee?

The fee is effectively paid by the **contributor**, not the maintainer. Here's how it works:

1. Maintainer posts a bounty for **100 XLM**
2. 100 XLM is locked in escrow
3. Contributor completes the work and maintainer approves
4. Contributor receives **97.5 XLM** (100 XLM - 2.5% fee)
5. **2.5 XLM** goes to the ChainBounty treasury

### Why this model?

- **Predictable for maintainers** — you pay exactly what you post, no hidden fees
- **Simple** — one flat percentage, no tiered structure or complex calculations
- **Fair** — contributors only pay when they earn

---

## Fee Breakdown

| Bounty Amount | Protocol Fee (2.5%) | Contributor Receives | Treasury Receives |
|---|---|---|---|
| 10 XLM | 0.25 XLM | 9.75 XLM | 0.25 XLM |
| 100 XLM | 2.5 XLM | 97.5 XLM | 2.5 XLM |
| 1,000 XLM | 25 XLM | 975 XLM | 25 XLM |
| 10,000 XLM | 250 XLM | 9,750 XLM | 250 XLM |

---

## Network Fees

In addition to the protocol fee, Stellar charges a small **network transaction fee** for every on-chain operation.

### Stellar base fee

- **0.00001 XLM per operation** (1 stroop)
- ChainBounty transactions typically include 1–3 operations
- Total network fee: **~0.00003 XLM** per transaction

### Who pays network fees?

- **Poster** pays when posting a bounty
- **Claimant** pays when claiming
- **Claimant** pays when submitting work
- **Poster** pays when approving or rejecting
- **Arbitrator** pays when resolving disputes

Network fees are **not** collected by ChainBounty — they go to Stellar validators.

---

## Treasury Management

All protocol fees are sent to the **ChainBounty Treasury**, a Stellar account controlled by the protocol.

### Treasury address

- **Testnet:** `GTREASURYXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX`
- **Mainnet:** `GTREASURYXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX`

:::info
Treasury addresses are set in the contract at deployment time and cannot be changed without a contract upgrade.
:::

### What the treasury funds

| Use Case | % of Treasury | Description |
|---|---|---|
| **Protocol development** | 40% | Core contract, backend, and frontend development |
| **Infrastructure** | 25% | RPC nodes, backend hosting, database, monitoring |
| **Community growth** | 20% | Marketing, docs, contributor incentives, hackathons |
| **Reserve fund** | 15% | Emergency fund for disputes, exploits, or downtime |

---

## Fee Distribution (Future)

ChainBounty plans to introduce **decentralized treasury governance** where token holders vote on fee allocation and treasury spending.

### Planned governance features

- **ChainBounty governance token** — distributed to early contributors and maintainers
- **On-chain voting** — vote on treasury proposals, fee adjustments, protocol upgrades
- **Treasury transparency** — public dashboard showing all inflows/outflows
- **Grants program** — fund OSS tooling, integrations, and ecosystem projects

---

## No-Fee Scenarios

ChainBounty does **not** charge fees in the following cases:

| Scenario | Reason |
|---|---|
| Bounty cancelled before claim | No work was done, no payout occurred |
| Dispute resolved in favor of maintainer | Funds returned to maintainer, no payout occurred |
| Testnet bounties | Testnet is for testing only — no real value |

---

## Fee Comparison with Other Platforms

| Platform | Fee Structure | Notes |
|---|---|---|
| **ChainBounty** | 2.5% on payout | On-chain, transparent |
| **Gitcoin** | 10–15% platform fee | Includes matching fund overhead |
| **IssueHunt** | 10% on payout | Centralized, fiat off-ramp fees extra |
| **Upwork** | 5–20% sliding scale | Plus payment processing fees |
| **Freelancer** | 10% or $5 minimum | Plus withdrawal fees |

ChainBounty's 2.5% fee is designed to be the **lowest in the industry** while maintaining a sustainable protocol.

---

## Fee Adjustments

The protocol fee is set in the smart contract and can only be changed via a **contract upgrade**.

### How fee changes work

1. A proposal is made by the core team or governance (future)
2. The community discusses the change
3. A new contract version is deployed with the updated fee
4. Existing bounties continue using the old fee rate
5. New bounties use the new fee rate

### Fee change policy

ChainBounty commits to:

- **No surprise changes** — at least 30 days notice before any fee adjustment
- **Transparent rationale** — explain why the fee is changing
- **Backward compatibility** — existing bounties are unaffected
- **Community input** — governance token holders vote on changes (once governance is live)

---

## Treasury Transparency

All treasury activity is public and verifiable on the Stellar blockchain.

### View treasury balance

```bash
stellar account show GTREASURYXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX --network testnet
```

Or visit: [https://stellar.expert/explorer/testnet/account/GTREASURYXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX](https://stellar.expert/explorer/testnet)

### Quarterly treasury reports

ChainBounty publishes a quarterly report showing:

- Total fees collected
- Total spent (by category)
- Remaining balance
- Upcoming planned expenses

---

## Multi-Asset Fees

ChainBounty supports bounties in any Stellar-issued asset (XLM, USDC, custom tokens). Fees are deducted **in the same asset as the bounty**.

### Example: USDC bounty

1. Maintainer posts a bounty for **100 USDC**
2. 100 USDC is locked in escrow
3. Contributor completes the work
4. Contributor receives **97.5 USDC**
5. Treasury receives **2.5 USDC**

The treasury holds multiple assets. When governance launches, token holders vote on how to use or convert treasury assets.

---

## Fee Refund Policy

ChainBounty does **not** refund protocol fees once a payout is made. However:

- If the contributor disputes and **wins**, they receive the full escrowed amount (no additional fee)
- If a bug in the contract causes an incorrect fee deduction, the treasury will manually refund affected users

---

## Zero-Fee Alternatives (Self-Hosted)

ChainBounty is open source. If you don't want to pay the protocol fee, you can:

1. Fork the contract repo
2. Deploy your own contract with no fee or a custom fee
3. Run your own frontend and backend
4. Maintain your own infrastructure

This is fully supported — ChainBounty is MIT licensed.

:::tip
Running your own instance means you handle all hosting, security, and maintenance. Most users find the 2.5% fee is worth the convenience.
:::

---

## Fee Revenue Projection

Based on estimated usage:

| Monthly Volume | Avg Bounty | Total Payouts | Fees Collected (2.5%) |
|---|---|---|---|
| 100 bounties | 100 XLM | 10,000 XLM | 250 XLM |
| 500 bounties | 100 XLM | 50,000 XLM | 1,250 XLM |
| 1,000 bounties | 100 XLM | 100,000 XLM | 2,500 XLM |
| 5,000 bounties | 100 XLM | 500,000 XLM | 12,500 XLM |

At scale, a 2.5% fee provides sustainable funding for development and growth while keeping costs low for users.

---

## Treasury Multisig (Future)

The treasury will eventually transition to a **multisig wallet** controlled by:

- Core team members (2 seats)
- Elected governance representatives (3 seats)
- Community-nominated security auditor (1 seat)

Threshold: **4 of 6 signatures** required for any treasury spend.

---

## Related

- [Security Model](/docs/protocol/security) — how treasury funds are secured
- [Contract ABI](/docs/api/contract-abi) — fee calculation logic
- [Roadmap](/docs/reference/roadmap) — governance and treasury plans
