---
id: contributor-onboarding
title: Contributor Onboarding Guide
sidebar_position: 3
---

# Contributor Onboarding Guide

Welcome to ChainBounty. This guide walks contributors through the entire bounty workflow — from finding an issue to getting paid on-chain. If you're a developer looking to earn XLM by contributing to open source, you're in the right place.

---

## Prerequisites

Before you claim your first bounty, make sure you have:

- ✅ **Freighter wallet** installed and funded on Testnet — [Setup guide](/docs/guides/freighter-wallet)
- ✅ **A GitHub account** with public repos and contribution history
- ✅ **Basic Git knowledge** — how to fork, clone, branch, and submit PRs
- ✅ **XLM on Testnet** for transaction fees (get free test XLM via [Friendbot](https://friendbot.stellar.org))

---

## Step 1 — Browse Open Bounties

Visit the ChainBounty app at `https://app.chainbounty.dev` (or `http://localhost:5173` if running locally).

### Filter bounties

Use the filters to find work that matches your skills:

| Filter | Use case |
|---|---|
| **Language** | Filter by repo language (TypeScript, Rust, Python, etc.) |
| **Amount** | Find bounties in your preferred payout range |
| **Label** | Look for `good first issue`, `bug`, `feature`, etc. |
| **Repo** | Follow a specific project |

### What to look for

- **Clear requirements** — the GitHub issue should have a detailed description
- **Realistic scope** — avoid bounties that are vague or too broad
- **Recent activity** — check if the repo is actively maintained
- **Fair payout** — compare the amount to the complexity

---

## Step 2 — Claim a Bounty

Once you find a bounty you want to work on:

1. Click **View Details** to open the bounty page
2. Read the full GitHub issue and make sure you understand the requirements
3. Click **Claim Bounty**
4. Freighter will prompt you to sign the transaction — approve it
5. Wait for confirmation (usually 5–10 seconds)

:::tip
Only claim a bounty if you are confident you can deliver the work. Claiming and not delivering hurts your reputation score.
:::

### What happens on-chain

- The bounty state moves from **Open** to **Claimed**
- Your Stellar address is recorded as the claimant
- The GitHub issue is assigned to you (via webhook)

---

## Step 3 — Do the Work

### Fork and clone the repo

```bash
git clone https://github.com/org/repo
cd repo
git checkout -b fix-issue-42
```

### Follow the repo's contribution guidelines

Most repos have a `CONTRIBUTING.md` file. Read it before starting work:

- Code style and linting rules
- How to run tests locally
- Commit message conventions
- PR template requirements

### Ask questions

If anything is unclear:

- Comment on the GitHub issue
- Reach out in the project's Discord or Slack
- Tag the maintainer in your question

Do **not** start work if you don't understand the requirements.

---

## Step 4 — Submit Your Work

### Push your branch and open a PR

```bash
git add .
git commit -m "fix: resolve null pointer in payment handler"
git push origin fix-issue-42
```

Open a pull request against the main branch. In your PR description:

- Reference the issue: `Closes #42`
- Explain what you changed and why
- Include screenshots or test output if relevant

### Submit work on ChainBounty

1. Go back to the bounty page on ChainBounty
2. Click **Submit Work**
3. Paste your pull request URL
4. Click **Submit** — sign the transaction in Freighter

### What happens on-chain

- The bounty state moves from **Claimed** to **Under Review**
- Your PR URL is stored on-chain
- The maintainer is notified to review

---

## Step 5 — Wait for Review

The maintainer will review your pull request. There are three possible outcomes:

### ✅ Approved

- The maintainer merges your PR
- They call `approve_submission` on the contract
- **The escrowed funds are released to your Stellar wallet**
- Your reputation score increases

You'll receive a notification and see the XLM in your Freighter wallet within seconds.

### ❌ Rejected with feedback

- The maintainer calls `reject_submission` with a reason
- The bounty state returns to **Claimed**
- You can revise your work and resubmit

Fix the issues mentioned in the rejection reason, push new commits, and click **Submit Work** again with the updated PR URL.

### ⚠️ Dispute opened

If you and the maintainer cannot agree:

- Either party can call `open_dispute`
- The bounty moves to **Disputed** state
- An arbitrator (set at bounty creation) will review both sides and award the funds

See the [Dispute Resolution guide](/docs/protocol/dispute-resolution) for the full process.

---

## Step 6 — Build Your Reputation

Every approved bounty increases your **on-chain reputation score**. This score is calculated by the backend and displayed on your profile.

### How reputation works

| Action | Effect |
|---|---|
| Bounty approved | +100 base points + bonus for amount/complexity |
| Bounty rejected | No change (neutral) |
| Dispute won | +50 points |
| Dispute lost | -50 points |
| Bounty claimed but abandoned | -25 points (if no activity for 30 days) |

### Reputation tiers

| Tier | Score Range | Badge |
|---|---|---|
| **Bronze** | 0–499 | 🥉 |
| **Silver** | 500–999 | 🥈 |
| **Gold** | 1,000–2,499 | 🥇 |
| **Platinum** | 2,500+ | 💎 |

High-reputation contributors are more likely to be selected for high-value bounties and private invites.

---

## Best Practices

### ✅ Do

- **Claim only what you can complete** — don't claim 10 bounties at once
- **Communicate early and often** — post updates in the GitHub issue
- **Follow the code style** — run linters and formatters before submitting
- **Write tests** — if the project has a test suite, add tests for your changes
- **Be responsive** — reply to feedback within 48 hours
- **Ask for help** — it's better to ask than to submit broken code

### ❌ Don't

- Claim a bounty and disappear for weeks
- Submit AI-generated code without reviewing it
- Copy code from other repos without attribution
- Argue with maintainers in public comments
- Open disputes for minor feedback
- Spam low-effort PRs to farm reputation

---

## Common Issues

### "Bounty already claimed"

Someone else claimed it before you. Move on to another bounty.

### "Transaction failed: NotClaimant"

You're trying to submit work for a bounty you didn't claim. Make sure you claimed it first.

### "Maintainer hasn't responded in 2 weeks"

If the maintainer is unresponsive:

1. Comment on the GitHub issue tagging them
2. Check if the repo is still active (recent commits?)
3. If still no response, consider opening a dispute (requires an arbitrator to be set)

### "My PR was merged but I haven't been paid"

The maintainer must call `approve_submission` on the contract. The merge on GitHub does not automatically release funds. Ping them on the bounty page or in the PR.

---

## Claiming Your First Bounty — Quick Checklist

- [ ] Freighter installed and funded with test XLM
- [ ] Connected wallet on ChainBounty app
- [ ] Found a bounty you can complete
- [ ] Read the full GitHub issue
- [ ] Clicked **Claim Bounty** and signed the transaction
- [ ] Forked the repo and created a branch
- [ ] Completed the work and opened a PR
- [ ] Clicked **Submit Work** on ChainBounty with your PR URL
- [ ] Waited for maintainer review
- [ ] Got approved and received payment 🎉

---

## Next Steps

- Read the [Bounty Lifecycle](/docs/bounty-lifecycle) to understand all state transitions
- Check the [Reputation Score methodology](/docs/protocol/reputation-scores) for scoring details
- Join the ChainBounty Discord to connect with other contributors
- Review the [Dispute Resolution process](/docs/protocol/dispute-resolution) in case you need it

---

## Need Help?

- **Technical issues** — open an issue on [GitHub](https://github.com/chainbounty)
- **Bounty disputes** — see [Dispute Resolution](/docs/protocol/dispute-resolution)
- **General questions** — ask in the Discord or tag us on X [@chainbounty](https://x.com/chainbounty)
