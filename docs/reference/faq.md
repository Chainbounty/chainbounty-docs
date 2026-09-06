---
id: faq
title: Frequently Asked Questions
sidebar_position: 2
---

# Frequently Asked Questions

Quick answers to common questions about ChainBounty. If you don't find your answer here, ask in [Discord](https://discord.gg/chainbounty) or open an issue on [GitHub](https://github.com/chainbounty).

---

## General

### What is ChainBounty?

ChainBounty is a decentralized bounty platform for open source development. Projects post bounties on GitHub issues, contributors complete the work, and payment is released on-chain through a Stellar smart contract — no middlemen, no trust required.

### Is ChainBounty free to use?

Yes, posting and claiming bounties is free. ChainBounty charges a **2.5% protocol fee** on payouts, which is deducted from the contributor's earnings. See the [Fee Model](/docs/protocol/fee-model).

### Which blockchain does ChainBounty use?

ChainBounty is built on the **Stellar blockchain** using **Soroban** smart contracts. Stellar is fast (3-5 second finality), cheap (~$0.00001 per transaction), and designed for payments.

### Is ChainBounty open source?

Yes. All code is MIT licensed and available on GitHub:

- Contract: [github.com/chainbounty/chainbounty-contract](https://github.com/chainbounty/chainbounty-contract)
- Backend: [github.com/chainbounty/chainbounty-backend](https://github.com/chainbounty/chainbounty-backend)
- Frontend: [github.com/chainbounty/chainbounty-frontend](https://github.com/chainbounty/chainbounty-frontend)

You can fork and self-host if you prefer.

---

## For Contributors

### How do I start earning bounties?

1. Install [Freighter wallet](https://freighter.app) and fund it with XLM
2. Visit [app.chainbounty.dev](https://app.chainbounty.dev)
3. Connect your wallet
4. Browse open bounties and claim one
5. Complete the work and submit your pull request
6. Get paid when the maintainer approves

See the [Contributor Onboarding guide](/docs/guides/contributor-onboarding).

### Do I need a GitHub account?

Yes. Bounties are tied to GitHub issues, so you'll need a GitHub account to submit pull requests and receive issue assignments.

### Can I claim multiple bounties at once?

Yes, but only claim what you can realistically complete. Claiming many bounties and not delivering hurts your reputation score.

### What happens if my submission is rejected?

The maintainer can reject with feedback. The bounty returns to "Claimed" state and you can revise your work and resubmit. Rejection does not hurt your reputation (unless you receive 3+ rejections on the same bounty).

### How long do I have to complete a bounty?

Some bounties have a deadline set by the maintainer. If no deadline is set, you have unlimited time — but if you go 30+ days with no activity, your reputation may take a small penalty for abandonment.

### Can I work with a team?

Bounties are claimed by a single Stellar address. If you want to split payment with teammates, claim the bounty yourself and distribute payment off-chain after approval.

### What if the maintainer never approves my work?

If an arbitrator was set when the bounty was posted, you can open a dispute. The arbitrator will review both sides and award the funds. If no arbitrator was set, you're reliant on the maintainer's good faith.

### How is reputation calculated?

Reputation is based on approved submissions, dispute outcomes, completion rate, and PR quality. See the [Reputation Score Methodology](/docs/protocol/reputation-scores).

---

## For Maintainers

### How much does it cost to post a bounty?

You pay exactly the bounty amount you post (e.g., 100 XLM). The 2.5% protocol fee is deducted from the contributor's payout, not from your funds.

### Can I cancel a bounty after posting?

Yes, but only if no one has claimed it yet. Once claimed, you must either approve the work or open a dispute — you cannot cancel.

### What if I'm not satisfied with the submission?

You can reject the submission with feedback. The contributor can revise and resubmit. If the disagreement is irreconcilable, open a dispute (if an arbitrator is set).

### Do I need to set an arbitrator?

No, it's optional. But for high-value bounties or when working with unknown contributors, setting an arbitrator gives both parties a fallback if disputes arise.

### Can I edit a bounty after posting?

No. Bounty terms (amount, GitHub issue, arbitrator) are immutable once posted. If you need to change terms, cancel the bounty (if unclaimed) and post a new one.

### Can I post bounties in tokens other than XLM?

Yes. ChainBounty supports any Stellar-issued asset (e.g., USDC, your DAO token). Just provide the asset's contract address when posting.

### How do I know if a contributor is reliable?

Check their reputation score and profile. High-reputation contributors (Silver, Gold, Platinum) have a proven track record. You can also filter bounty visibility by reputation tier.

---

## Technical

### What wallet do I need?

ChainBounty uses [Freighter](https://freighter.app), the official Stellar browser extension wallet. It's available for Chrome, Firefox, Brave, and Edge.

### Is my money safe?

Funds are held in a Soroban smart contract, not by ChainBounty. The contract enforces release conditions — only the maintainer or arbitrator can authorize payout. ChainBounty has **zero custody** over your funds.

### What are the transaction fees?

Stellar charges a network fee of ~**0.00001 XLM** per transaction (~$0.000001 USD). This goes to Stellar validators, not to ChainBounty.

### How long do transactions take?

Stellar finalizes transactions in **3-5 seconds**. Once the maintainer approves, the contributor receives payment almost instantly.

### What happens if the contract has a bug?

The contract will be audited before Mainnet launch. If a critical bug is found on Testnet, it will be fixed and redeployed. On Mainnet, a bug bounty program will be active to incentivize responsible disclosure.

### Can I interact with the contract directly (without the frontend)?

Yes. The contract is fully accessible via the Stellar CLI or any Soroban SDK. See the [Contract ABI](/docs/api/contract-abi) for all entry points.

---

## Payments

### How do I get paid?

When the maintainer approves your submission, the smart contract automatically sends XLM (or the bounty asset) to your Stellar wallet. No withdrawal process — it's instant.

### Can I withdraw to a bank account?

ChainBounty only handles on-chain payments. To convert XLM to fiat, use a Stellar-compatible exchange like:

- [Coinbase](https://coinbase.com)
- [Kraken](https://kraken.com)
- [Bitso](https://bitso.com)

### What's the minimum payout?

There is no minimum. Bounties can be as small as 1 XLM (~$0.10 USD) or as large as the maintainer sets.

### Are bounties taxable?

Yes, in most jurisdictions. Bounty earnings are considered income and may be subject to income tax. Consult a tax professional for your specific situation. ChainBounty does not provide tax forms or reporting.

---

## Disputes

### When should I open a dispute?

Open a dispute when:

- The maintainer refuses to approve valid work
- The contributor insists on payment for incomplete work
- You cannot agree on whether acceptance criteria were met

Disputes should be a **last resort** — try to resolve disagreements through communication first.

### Who can resolve disputes?

Only the **arbitrator** (set when the bounty was posted) can resolve disputes. The arbitrator reviews both sides and awards the escrowed funds to one party.

### What if no arbitrator was set?

You cannot open a dispute. The only recourse is continued negotiation or abandoning the bounty.

### How long does dispute resolution take?

Depends on the arbitrator. Most arbitrators commit to resolving within 7 business days. Check with your arbitrator beforehand.

### Can I appeal an arbitrator's decision?

No. Arbitrator decisions are final and irreversible. Choose a reputable, neutral arbitrator when posting the bounty.

See the [Dispute Resolution guide](/docs/protocol/dispute-resolution).

---

## Reputation

### How do I increase my reputation?

- Complete bounties successfully
- Submit high-quality PRs on the first try
- Maintain a high completion rate (don't abandon bounties)
- Stay active month-over-month

See the [Reputation Score Methodology](/docs/protocol/reputation-scores).

### Can reputation go negative?

No. The lowest score is **0**. However, frequent disputes, abandoned bounties, or spam submissions will keep your score low.

### Can I reset my reputation?

No. Reputation is tied to your Stellar address and cannot be reset. If you want a fresh start, create a new wallet — but you'll lose all badges and history.

### Is reputation stored on-chain?

Partially. The core events (approvals, disputes) are on-chain, but the full score calculation and GitHub factors are stored off-chain in the backend database.

---

## GitHub Integration

### Is GitHub required?

Yes. Bounties must be tied to a GitHub issue. GitHub webhooks are optional but highly recommended for automatic issue tracking.

### Can I use GitLab or Bitbucket?

Not yet. ChainBounty currently only integrates with GitHub. GitLab and Bitbucket support may be added in the future.

### Do I need to install a GitHub App?

No. Maintainers can manually post bounties by pasting the GitHub issue URL. For automatic webhook integration, see the [GitHub Integration guide](/docs/guides/github-integration).

---

## Testnet vs Mainnet

### What's the difference between Testnet and Mainnet?

- **Testnet** — for testing and development. Uses fake XLM with no real value. Safe to experiment.
- **Mainnet** — production network. Uses real XLM and assets. Money is at risk.

Always test on Testnet before using Mainnet.

### How do I get Testnet XLM?

Use the Stellar Friendbot:

```
https://friendbot.stellar.org?addr=YOUR_STELLAR_ADDRESS
```

Or via CLI:

```bash
stellar keys fund <account-name> --network testnet
```

### When will ChainBounty launch on Mainnet?

Mainnet launch is planned for **Q1 2027** after:

- Smart contract audit
- Security testing
- Beta program with select maintainers

Stay updated via [Discord](https://discord.gg/chainbounty) or [Twitter](https://x.com/chainbounty).

---

## Troubleshooting

### "Freighter not found"

Install the Freighter browser extension from [freighter.app](https://freighter.app). Refresh the page after installation.

### "Insufficient balance"

You don't have enough XLM in your wallet to cover the transaction fee. Fund your account via Friendbot (Testnet) or add XLM (Mainnet).

### "Transaction failed: AlreadyClaimed"

Someone else claimed the bounty before you. Move on to another open bounty.

### "Contract not found"

You're connected to the wrong network (Testnet vs Mainnet) or the contract ID in the frontend config is incorrect. Check your Freighter network setting.

### "Bounty not showing up after posting"

Wait 10-15 seconds for the transaction to finalize and the backend to index it. Refresh the page. If still missing, check the transaction on [Stellar Expert](https://stellar.expert).

### "GitHub issue not assigned after claim"

The contributor's Stellar address is not linked to their GitHub account. Assignment is optional and requires a GitHub link. See the [GitHub Integration guide](/docs/guides/github-integration).

---

## Community and Support

### How do I report a bug?

Open an issue on GitHub:

- [Contract bugs](https://github.com/chainbounty/chainbounty-contract/issues)
- [Backend bugs](https://github.com/chainbounty/chainbounty-backend/issues)
- [Frontend bugs](https://github.com/chainbounty/chainbounty-frontend/issues)

### How do I request a feature?

Post in the [ChainBounty Discord](https://discord.gg/chainbounty) or open a GitHub issue with the `feature-request` label.

### Where can I get help?

- **Discord** — [discord.gg/chainbounty](https://discord.gg/chainbounty)
- **Twitter / X** — [@chainbounty](https://x.com/chainbounty)
- **GitHub Discussions** — [github.com/chainbounty](https://github.com/chainbounty)
- **Email** — support@chainbounty.dev

### Can I contribute to ChainBounty?

Yes! ChainBounty is open source. Check the [Contributing guide](/docs/contributing) or look for issues labeled `good first issue`.

---

## Privacy and Data

### What data does ChainBounty collect?

- **On-chain data** — all transactions are public on Stellar (wallet addresses, bounty amounts, timestamps)
- **GitHub data** — issue URLs, PR links, contributor usernames (public GitHub data only)
- **Backend logs** — API usage, webhook events (not sold or shared)

ChainBounty does **not** collect:

- Email addresses (unless you sign up for updates)
- Private keys or secret keys
- Personal information beyond public GitHub profiles

### Can I delete my data?

On-chain data is permanent and cannot be deleted. Off-chain data (backend database) can be removed by emailing support@chainbounty.dev with your Stellar address.

### Is ChainBounty GDPR compliant?

ChainBounty is designed to minimize data collection. Blockchain data is public by design. If you're in the EU and have specific GDPR concerns, contact privacy@chainbounty.dev.

---

## Related

- [Quick Start](/docs/quick-start) — get started in 15 minutes
- [Contributor Guide](/docs/guides/contributor-onboarding) — how to earn bounties
- [Maintainer Guide](/docs/guides/maintainer-guide) — how to post bounties
- [Dispute Resolution](/docs/protocol/dispute-resolution) — handling disagreements
