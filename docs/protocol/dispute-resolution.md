---
id: dispute-resolution
title: Dispute Resolution
sidebar_position: 1
---

# Dispute Resolution

ChainBounty includes an on-chain dispute resolution mechanism to protect both maintainers and contributors when disagreements arise. This page explains when and how to use it, the arbitrator's role, and the full resolution process.

---

## When Disputes Happen

Disputes occur when the maintainer and contributor cannot agree on whether submitted work meets the acceptance criteria.

### Common dispute scenarios

| Scenario | Example |
|---|---|
| **Scope disagreement** | Contributor believes they completed the work; maintainer says it's incomplete |
| **Quality disagreement** | Maintainer rejects work as low-quality; contributor disagrees |
| **Acceptance criteria unclear** | Issue description was vague; both sides interpret it differently |
| **Communication breakdown** | One party stops responding after work is submitted |
| **Bad faith rejection** | Maintainer rejects valid work to avoid payment |
| **Bad faith submission** | Contributor submits broken code hoping to get paid |

---

## Dispute Prerequisites

Not all bounties support disputes. To enable dispute resolution, the maintainer must:

1. **Set an arbitrator** when posting the bounty
2. Provide a **Stellar address** of a neutral third party

If no arbitrator is set, disputes cannot be opened. The only recourse is negotiation between the two parties.

:::warning
Always set an arbitrator for high-value bounties or when working with unknown contributors.
:::

---

## Opening a Dispute

Either the **maintainer** or the **contributor** can open a dispute.

### Who can open a dispute?

- The original bounty poster
- The claimant who was assigned the bounty

### When can a dispute be opened?

- The bounty must be in **Claimed** or **Under Review** state
- A dispute cannot be opened after the bounty is already **Approved** or **Cancelled**

### How to open a dispute

1. Go to the bounty page on ChainBounty
2. Click **Open Dispute**
3. Enter a detailed reason (stored on-chain)
4. Sign the transaction in Freighter

### What to include in your dispute reason

- A clear summary of the disagreement
- Reference specific acceptance criteria from the issue
- Link to relevant PR comments or discussions
- Explain what the other party did or did not do

**Example dispute reasons:**

✅ Good:
> "The issue required pagination support for the `/users` endpoint. The contributor's PR only adds a `limit` parameter but does not implement `offset` or return pagination metadata. See issue requirement #3 and PR comment: [link]."

❌ Bad:
> "Work is incomplete."

---

## The Arbitrator's Role

The arbitrator is a neutral third party chosen by the maintainer at bounty creation.

### Who can be an arbitrator?

- A trusted community member
- A DAO multisig address
- A professional arbitration service
- A respected developer or project lead

### Arbitrator responsibilities

- **Review the evidence** from both parties (GitHub issue, PR, comments, dispute reasons)
- **Remain neutral** — no conflict of interest with either party
- **Make a fair decision** based on the original acceptance criteria
- **Award the funds** to the party who is in the right

### Arbitrator compensation

Arbitrators can charge a fee for their services. This fee is:

- Negotiated off-chain before the bounty is posted
- Paid separately (not deducted from escrow automatically)

Future versions of ChainBounty may include on-chain arbitrator fee splits.

---

## Dispute Resolution Process

Once a dispute is opened, the bounty moves to **Disputed** state. Only the arbitrator can take action.

### Step 1 — Dispute opened

- Either party calls `open_dispute(reason)` on the contract
- Bounty state: **Disputed**
- Funds remain locked in escrow
- The arbitrator is notified (via backend + email if registered)

### Step 2 — Evidence submission

Both parties submit their arguments. This happens **off-chain** via:

- ChainBounty dispute portal (if available)
- Email to the arbitrator
- A shared document or forum thread

Evidence to provide:

- Link to the GitHub issue
- Link to the submitted pull request
- Screenshots of relevant comments
- Explanation of why you believe you are correct

### Step 3 — Arbitrator review

The arbitrator reviews:

1. The original GitHub issue — what were the acceptance criteria?
2. The submitted pull request — does it meet those criteria?
3. Both parties' arguments and evidence
4. Any repo conventions or standards

The arbitrator may:

- Ask clarifying questions to either party
- Request additional evidence
- Review code or test the PR locally

### Step 4 — Arbitrator decision

The arbitrator calls `resolve_dispute(award_to)` on the contract, where `award_to` is the Stellar address of either the maintainer or the contributor.

**Possible outcomes:**

| Award to | Effect |
|---|---|
| **Contributor** | Escrowed funds are sent to the contributor's wallet |
| **Maintainer** | Escrowed funds are returned to the maintainer's wallet |

The decision is **final and irreversible**. The bounty state moves to **Resolved**.

---

## Dispute Resolution Timeline

| Event | Recommended Timeframe |
|---|---|
| Dispute opened | Immediate |
| Both parties submit evidence | Within 48 hours of dispute opening |
| Arbitrator reviews | Within 5–7 business days |
| Arbitrator issues decision | Within 7 business days of dispute opening |

:::info
These are recommended timelines. Arbitrators set their own response times. Check with your arbitrator before posting the bounty.
:::

---

## Decision Criteria

Arbitrators should base their decision on:

1. **The original issue description** — this is the contract between both parties
2. **Acceptance criteria** — was it explicitly stated? Implied?
3. **Industry standards** — does the code meet basic quality expectations?
4. **Good faith effort** — did the contributor make a reasonable attempt?
5. **Communication** — did either party act in bad faith?

### Example 1: Contributor wins

**Scenario:** Issue says "Add dark mode toggle." Contributor submits a PR with a functional dark mode toggle. Maintainer rejects it saying "I wanted auto-detection based on system preference," but this was never mentioned in the issue.

**Decision:** Award to contributor — the original requirement was met.

### Example 2: Maintainer wins

**Scenario:** Issue says "Fix the login form so it validates email format." Contributor submits a PR that only adds a placeholder attribute but does not validate the email. Maintainer rejects it.

**Decision:** Award to maintainer — the work is incomplete and does not meet the stated requirement.

### Example 3: Split decision (future feature)

In some cases, partial work deserves partial payment. This is not yet supported on-chain but may be added in future contract versions.

---

## Avoiding Disputes

Most disputes can be prevented with good practices.

### For maintainers

- ✅ Write clear, detailed issue descriptions
- ✅ Define acceptance criteria upfront
- ✅ Respond to contributor questions before they start work
- ✅ Give constructive feedback if rejecting a submission
- ✅ Set a fair bounty amount for the work required

### For contributors

- ✅ Read the full issue before claiming
- ✅ Ask questions if anything is unclear
- ✅ Post progress updates in the issue
- ✅ Test your code thoroughly before submitting
- ✅ Follow the repo's style guide and conventions

---

## Dispute Frequency and Reputation Impact

Disputes affect both parties' reputation scores.

### For contributors

| Outcome | Reputation Impact |
|---|---|
| Dispute opened by maintainer, contributor wins | +50 (vindicated) |
| Dispute opened by maintainer, maintainer wins | -50 (work was insufficient) |
| Dispute opened by contributor, contributor wins | +50 (maintainer was unfair) |
| Dispute opened by contributor, maintainer wins | -50 (frivolous dispute) |

### For maintainers

Maintainers do not have a public reputation score, but frequent disputes can:

- Discourage contributors from claiming their bounties
- Flag the maintainer as difficult to work with
- Result in higher arbitrator scrutiny on future disputes

---

## Arbitrator Best Practices

If you are serving as an arbitrator:

- ✅ **Stay neutral** — no conflicts of interest
- ✅ **Review all evidence** — don't rush to judgment
- ✅ **Ask questions** — clarify ambiguities before deciding
- ✅ **Explain your reasoning** — transparency builds trust
- ✅ **Act quickly** — don't leave parties waiting for weeks
- ❌ **Don't accept disputes** where you have a relationship with either party

---

## Future Enhancements

The following features are planned for future contract versions:

- **Partial payment splits** — award 70% to contributor, 30% to maintainer
- **On-chain arbitrator fees** — deduct a percentage from escrow automatically
- **Multi-signature arbitration** — require 2 of 3 arbitrators to agree
- **Appeal process** — allow one appeal to a higher-tier arbitrator
- **Reputation-based auto-resolution** — if contributor has gold tier + no prior disputes, auto-approve after 14 days of maintainer inactivity

---

## Dispute Resolution Flow Diagram

```
┌─────────────────────────────────────────────────────────┐
│          Either party opens dispute                      │
│          open_dispute(reason)                            │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
          ┌──────────────────────┐
          │  Bounty: DISPUTED     │
          │  Funds: Locked        │
          └──────────┬────────────┘
                     │
         ┌───────────┴───────────┐
         │                       │
         ▼                       ▼
┌─────────────────┐    ┌─────────────────┐
│  Contributor     │    │  Maintainer      │
│  submits         │    │  submits         │
│  evidence        │    │  evidence        │
└────────┬─────────┘    └────────┬─────────┘
         │                       │
         └───────────┬───────────┘
                     │
                     ▼
          ┌──────────────────────┐
          │  Arbitrator reviews   │
          │  both sides           │
          └──────────┬────────────┘
                     │
                     ▼
          ┌──────────────────────┐
          │  resolve_dispute      │
          │  (award_to: address)  │
          └──────────┬────────────┘
                     │
         ┌───────────┴───────────┐
         │                       │
         ▼                       ▼
┌─────────────────┐    ┌─────────────────┐
│  Contributor     │    │  Maintainer      │
│  receives funds  │    │  receives refund │
└─────────────────┘    └─────────────────┘

         Bounty state: RESOLVED
         (final — no further actions)
```

---

## Related

- [Bounty Lifecycle](/docs/bounty-lifecycle) — full state machine
- [Contract ABI](/docs/api/contract-abi) — `open_dispute` and `resolve_dispute` entry points
- [Contributor Guide](/docs/guides/contributor-onboarding) — avoiding disputes as a contributor
- [Maintainer Guide](/docs/guides/maintainer-guide) — avoiding disputes as a maintainer
