---
id: maintainer-guide
title: Maintainer and Bounty Poster Guide
sidebar_position: 4
---

# Maintainer and Bounty Poster Guide

This guide is for open source maintainers, DAOs, and projects that want to post bounties on ChainBounty. Learn how to fund issues, review submissions, approve or reject work, and handle disputes.

---

## Who Should Post Bounties?

ChainBounty is designed for:

- **Open source maintainers** who need help with specific issues
- **DAOs** funding public goods or protocol improvements
- **Companies** sponsoring open source features
- **Individual developers** looking to outsource specific tasks

If you have a GitHub repo and funds to pay contributors, you're ready to post.

---

## Prerequisites

Before posting your first bounty:

- ✅ **Freighter wallet** installed and funded — [Setup guide](/docs/guides/freighter-wallet)
- ✅ **XLM on Testnet** (for testing) or **Mainnet** (for production)
- ✅ **GitHub repo** with open issues
- ✅ **Clear issue descriptions** — contributors need to know what you want built

---

## Step 1 — Prepare Your GitHub Issue

A good bounty starts with a well-written issue.

### Write a clear title

❌ Bad: "Fix bug"  
✅ Good: "Fix null pointer exception in payment processing handler"

### Include detailed requirements

Your issue should answer:

- **What is broken or missing?**
- **What should the final behavior be?**
- **What are the acceptance criteria?**
- **Are there any constraints?** (performance, compatibility, design)

### Add labels

Use GitHub labels to help contributors filter bounties:

- `bounty` — marks it as a paid issue
- `good first issue` — beginner-friendly
- `bug`, `feature`, `documentation`, etc.

### Set a realistic scope

Break large features into smaller, focused issues. Contributors are more likely to claim well-scoped tasks.

---

## Step 2 — Post a Bounty

### Go to ChainBounty and connect your wallet

1. Visit `https://app.chainbounty.dev`
2. Click **Connect Wallet** and approve the Freighter connection
3. Make sure you're on the correct network (Testnet or Mainnet)

### Click "Post Bounty"

Fill out the form:

| Field | Required | Description |
|---|---|---|
| **GitHub Issue URL** | Yes | Full URL to the issue (e.g. `https://github.com/org/repo/issues/42`) |
| **Amount** | Yes | Payment in XLM or another Stellar asset |
| **Asset** | Yes | Choose XLM or a Stellar token |
| **Deadline** | No | Optional expiration timestamp — bounty auto-expires if not claimed |
| **Arbitrator** | No | Stellar address of a neutral third party for disputes |

### Example values

```
Issue URL: https://github.com/myorg/myrepo/issues/42
Amount: 100 XLM
Asset: XLM (native)
Deadline: (leave blank for no deadline)
Arbitrator: GARBITRATOR... (optional)
```

### Sign and submit

Click **Post Bounty**. Freighter will prompt you to sign the transaction. The funds will be locked in escrow on-chain.

:::tip
Set an arbitrator if you're posting high-value bounties or working with new contributors. This gives both parties a fallback if disputes arise.
:::

---

## Step 3 — Monitor Claims

Once your bounty is posted, it appears on the bounty board. Contributors can browse and claim it.

### You'll be notified when someone claims it

- **On ChainBounty** — the bounty status changes to `Claimed`
- **On GitHub** — the issue is assigned to the contributor (via webhook)
- **Email** — if you have notifications enabled

### What to do after a claim

- Check the contributor's profile and reputation score
- Confirm they understand the requirements (they may comment on the issue)
- Wait for them to submit their work

---

## Step 4 — Review Submitted Work

When the contributor submits their work:

1. The bounty status changes to **Under Review**
2. You receive a notification with the pull request URL
3. The PR is linked on the bounty page

### Review the pull request

Check:

- ✅ Does it solve the issue as described?
- ✅ Does it follow the repo's code style and conventions?
- ✅ Are there tests (if required)?
- ✅ Is the PR description clear?
- ✅ Does it introduce breaking changes?

### Run the code locally

```bash
git fetch origin pull/123/head:pr-123
git checkout pr-123
npm install  # or your build command
npm test
```

Test the changes thoroughly before approving.

---

## Step 5 — Approve or Reject

### ✅ Approve the submission

If the work is good:

1. Merge the pull request on GitHub
2. Go to the bounty page on ChainBounty
3. Click **Approve Submission**
4. Sign the transaction in Freighter

The escrowed funds are released to the contributor immediately. The bounty state moves to **Approved**.

### ❌ Reject with feedback

If the work needs changes:

1. Leave feedback in the PR review (be specific)
2. Go to the bounty page on ChainBounty
3. Click **Reject Submission**
4. Enter a rejection reason (stored on-chain)
5. Sign the transaction

The bounty returns to **Claimed** state. The contributor can revise their work and resubmit.

:::info
Rejection is **not** permanent — it gives the contributor a chance to fix issues. Be constructive in your feedback.
:::

---

## Step 6 — Handle Disputes

If you and the contributor cannot agree, either party can open a dispute.

### When to open a dispute

- The contributor submitted work but you believe it's incomplete
- The contributor claims you're being unreasonable
- There's a fundamental disagreement on acceptance criteria

### How to open a dispute

1. Go to the bounty page
2. Click **Open Dispute**
3. Enter a detailed reason
4. Sign the transaction

The bounty moves to **Disputed** state. Only the arbitrator can now act.

### Arbitrator resolution

The arbitrator (set at bounty creation) will:

1. Review the GitHub issue, PR, and both parties' arguments
2. Decide who should receive the funds
3. Call `resolve_dispute` on the contract
4. Funds are sent to the winning party

See the [Dispute Resolution guide](/docs/protocol/dispute-resolution) for the full process.

---

## Step 7 — Cancel a Bounty (if needed)

You can cancel a bounty **only if no one has claimed it yet**.

### To cancel

1. Go to the bounty page
2. Click **Cancel Bounty**
3. Sign the transaction

The funds are returned to your wallet immediately.

:::warning
Once a contributor claims a bounty, you cannot cancel it. You must either approve their work or open a dispute.
:::

---

## Best Practices for Maintainers

### ✅ Do

- **Write clear, detailed issues** — saves time and reduces disputes
- **Set realistic bounty amounts** — pay fairly based on complexity
- **Respond to questions quickly** — contributors need guidance
- **Review submissions within 48–72 hours** — don't leave contributors waiting
- **Give constructive feedback** — help contributors improve
- **Use arbitrators for high-value bounties** — reduces risk

### ❌ Don't

- Post vague or open-ended issues
- Set bounties too low for the work required
- Ignore contributor questions
- Reject submissions without clear feedback
- Approve low-quality work just to close the issue
- Open disputes for trivial disagreements

---

## Funding Strategies

### Individual issues

Post a bounty for each issue separately. Good for:

- One-off bugs or small features
- Testing the platform with low amounts
- Projects with sporadic funding

### Bulk funding

Post multiple bounties at once for a coordinated initiative. Good for:

- DAOs funding a quarterly roadmap
- Hackathons with multiple prize categories
- Protocol upgrades requiring multiple PRs

### Recurring bounties

Post the same type of bounty regularly (e.g. "weekly security audit"). Good for:

- Ongoing maintenance work
- Content creation (docs, blog posts)
- Regular code reviews

---

## Budgeting Guide

| Task Type | Suggested Range (XLM) | Complexity |
|---|---|---|
| Typo fix, doc update | 5–20 | Trivial |
| Small bug fix | 20–100 | Low |
| Medium feature | 100–500 | Medium |
| Large feature | 500–2,000 | High |
| Critical security fix | 1,000–5,000+ | Critical |

Adjust based on:

- Urgency (need it ASAP? pay more)
- Contributor reputation (high-rep contributors may expect higher rates)
- Market rates (compare to Gitcoin, IssueHunt, Upwork)

---

## Multi-Asset Bounties

ChainBounty supports any Stellar-issued asset, not just XLM.

### Example use cases

- **USDC** — stable value for long-term bounties
- **Your DAO token** — pay contributors in your native token
- **yXLM** — yield-bearing XLM from staking protocols

To use a non-XLM asset, paste the asset's Stellar contract address in the "Asset" field when posting.

---

## GitHub Webhook Integration

For automatic issue tracking and status syncing, set up GitHub webhooks. See the [GitHub Integration guide](/docs/guides/github-integration).

With webhooks enabled:

- Issues are auto-assigned when a bounty is claimed
- PR status updates are reflected on ChainBounty
- You get notified in real time

---

## Common Issues

### "Contributor claimed but never started work"

If the contributor goes silent:

1. Comment on the issue asking for an update
2. Wait 7 days
3. If still no response, open a dispute (if arbitrator is set) or negotiate with the contributor to unclaim

There is currently no auto-unclaim mechanism — this is a design choice to prevent claim sniping.

### "I approved the wrong submission by mistake"

On-chain transactions are irreversible. Always review carefully before clicking **Approve**.

### "The contributor opened a dispute unfairly"

The arbitrator will review both sides. Provide clear evidence (PR comments, issue history) to support your case.

---

## Posting Your First Bounty — Quick Checklist

- [ ] Freighter installed and funded with XLM
- [ ] GitHub issue created with clear requirements
- [ ] Connected wallet on ChainBounty
- [ ] Filled out bounty form with issue URL and amount
- [ ] Optionally set a deadline and arbitrator
- [ ] Clicked **Post Bounty** and signed transaction
- [ ] Funds locked in escrow, bounty is live
- [ ] Waiting for a contributor to claim it

---

## Next Steps

- Read the [Bounty Lifecycle](/docs/bounty-lifecycle) to understand all states
- Set up [GitHub Webhooks](/docs/guides/github-integration) for automatic tracking
- Review the [Dispute Resolution process](/docs/protocol/dispute-resolution)
- Check the [Fee Model](/docs/protocol/fee-model) to understand protocol costs

---

## Need Help?

- **Technical issues** — open an issue on [GitHub](https://github.com/chainbounty)
- **Bounty disputes** — see [Dispute Resolution](/docs/protocol/dispute-resolution)
- **General questions** — ask in Discord or tag us on X [@chainbounty](https://x.com/chainbounty)
