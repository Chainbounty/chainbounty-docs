---
id: bounty-lifecycle
title: Bounty Lifecycle
sidebar_position: 4
---

# Bounty Lifecycle

Every bounty in ChainBounty follows a strict state machine enforced on-chain by the Soroban contract. This page maps out every state transition, who can trigger it, and what happens at each stage.

---

## State Machine Overview

```
                  ┌─────────────┐
                  │    OPEN     │  ← Bounty posted, funds locked
                  └──────┬──────┘
                         │
          ┌──────────────┼──────────────┐
          │              │              │
          │ claim_bounty │              │ cancel_bounty
          │              │              │ (poster only)
          ▼              │              ▼
   ┌─────────────┐       │       ┌────────────┐
   │   CLAIMED   │       │       │ CANCELLED  │  ← Funds returned
   └──────┬──────┘       │       └────────────┘
          │              │
          │ submit_work  │
          │              │
          ▼              │
   ┌──────────────┐      │
   │ UNDER_REVIEW │      │
   └──────┬───────┘      │
          │              │
    ┌─────┼──────┐       │
    │     │      │       │
    │     │      │       │ open_dispute
    │     │      │       │ (poster or claimant)
    │     │      │       │
    │     │      └───────┼──────────┐
    │     │              │          │
    │     │ approve      │          ▼
    │     │              │   ┌─────────────┐
    │     ▼              │   │  DISPUTED   │
    │ ┌─────────┐        │   └──────┬──────┘
    │ │APPROVED │        │          │
    │ └─────────┘        │          │ resolve_dispute
    │   Funds released   │          │ (arbitrator only)
    │   to contributor   │          │
    │                    │          ▼
    │ reject_submission  │   ┌─────────────┐
    │                    │   │  RESOLVED   │  ← Arbitrator awards funds
    └────────────────────┘   └─────────────┘
         Back to CLAIMED
```

---

## State Descriptions

| State | Description | Who can act |
|---|---|---|
| **Open** | Bounty is funded and awaiting a claimant | Any contributor can claim; poster can cancel |
| **Claimed** | A contributor has claimed the bounty | Claimant can submit work; poster can wait |
| **Under Review** | Contributor submitted work, awaiting maintainer review | Poster can approve or reject |
| **Approved** | Work accepted, funds released to contributor | Final state — no further actions |
| **Disputed** | Either party opened a dispute | Only arbitrator can resolve |
| **Resolved** | Arbitrator awarded funds to one party | Final state — no further actions |
| **Cancelled** | Poster cancelled before a claim was made | Final state — funds returned to poster |

---

## State Transitions

### 1. Open → Claimed

**Triggered by:** `claim_bounty(claimant, bounty_id)`

**Who:** Any contributor with a Stellar wallet

**Effect:**
- Bounty state moves to `Claimed`
- Claimant address is stored on-chain
- GitHub issue is assigned to the contributor (via backend webhook)

**Conditions:**
- Bounty must be in `Open` state
- Deadline (if set) must not be expired
- No existing claimant

**Emits:** `BountyClaimed { id, claimant }`

---

### 2. Claimed → Under Review

**Triggered by:** `submit_work(claimant, bounty_id, submission_url)`

**Who:** The claimant who claimed the bounty

**Effect:**
- Bounty state moves to `Under Review`
- Submission URL (usually a pull request) is stored on-chain
- Maintainer is notified (via backend + GitHub)

**Conditions:**
- Bounty must be in `Claimed` state
- Caller must be the claimant

**Emits:** `WorkSubmitted { id, claimant, submission_url }`

---

### 3. Under Review → Approved

**Triggered by:** `approve_submission(poster, bounty_id)`

**Who:** The original bounty poster

**Effect:**
- Bounty state moves to `Approved`
- **Escrowed funds are transferred to the claimant**
- Contributor reputation score increases (backend)

**Conditions:**
- Bounty must be in `Under Review` state
- Caller must be the poster

**Emits:** `SubmissionApproved { id, claimant, amount }`

:::tip This is the happy path
Most bounties follow: Open → Claimed → Under Review → Approved.
:::

---

### 4. Under Review → Claimed (rejection)

**Triggered by:** `reject_submission(poster, bounty_id, reason)`

**Who:** The original bounty poster

**Effect:**
- Bounty state returns to `Claimed`
- Rejection reason is stored on-chain
- Contributor can revise and resubmit

**Conditions:**
- Bounty must be in `Under Review` state
- Caller must be the poster

**Emits:** `SubmissionRejected { id, claimant, reason }`

:::info
Rejection does not release funds or unclaim the bounty — it gives the contributor a chance to fix their work.
:::

---

### 5. Claimed or Under Review → Disputed

**Triggered by:** `open_dispute(caller, bounty_id, reason)`

**Who:** Either the poster or the claimant

**Effect:**
- Bounty state moves to `Disputed`
- Only the arbitrator can now take action
- Funds remain locked in escrow

**Conditions:**
- Bounty must be in `Claimed` or `Under Review` state
- Caller must be either the poster or claimant
- An arbitrator must have been set at bounty creation

**Emits:** `DisputeOpened { id, caller, reason }`

---

### 6. Disputed → Resolved

**Triggered by:** `resolve_dispute(arbitrator, bounty_id, award_to)`

**Who:** The arbitrator set at bounty creation

**Effect:**
- Bounty state moves to `Resolved`
- Funds are transferred to the `award_to` address (poster or claimant)
- No further actions possible

**Conditions:**
- Bounty must be in `Disputed` state
- Caller must be the arbitrator
- `award_to` must be either the poster or claimant

**Emits:** `DisputeResolved { id, arbitrator, award_to, amount }`

---

### 7. Open → Cancelled

**Triggered by:** `cancel_bounty(poster, bounty_id)`

**Who:** The original bounty poster

**Effect:**
- Bounty state moves to `Cancelled`
- Funds are returned to the poster
- No further actions possible

**Conditions:**
- Bounty must be in `Open` state (no claimant yet)
- Caller must be the poster

**Emits:** `BountyCancelled { id, poster, amount_returned }`

:::warning
A bounty can only be cancelled before anyone claims it. Once claimed, the poster must either approve the submission or open a dispute.
:::

---

## Invalid State Transitions

The contract will reject any transition that does not follow the state machine. Examples:

| Invalid Action | Why |
|---|---|
| Approve a bounty in `Claimed` state | Work has not been submitted yet |
| Claim a bounty in `Under Review` state | Already claimed |
| Cancel a bounty in `Claimed` state | Cannot cancel after a claim |
| Approve a bounty as a non-poster | Only poster can approve |
| Resolve a dispute as a non-arbitrator | Only arbitrator can resolve |

---

## Deadlines and Expiration

If a bounty is created with a deadline timestamp:

- The deadline is checked during `claim_bounty` — if expired, the claim fails
- After expiration, the poster can cancel the bounty and reclaim funds
- Deadlines do not auto-cancel — the poster must call `cancel_bounty`

---

## Example Flow

### Happy path: contributor completes the work

1. Poster calls `post_bounty` → state: **Open**
2. Contributor calls `claim_bounty` → state: **Claimed**
3. Contributor submits PR, calls `submit_work` → state: **Under Review**
4. Poster reviews PR, calls `approve_submission` → state: **Approved**, funds released

### Rejection and resubmission

1. Poster calls `post_bounty` → state: **Open**
2. Contributor calls `claim_bounty` → state: **Claimed**
3. Contributor submits PR, calls `submit_work` → state: **Under Review**
4. Poster calls `reject_submission` with feedback → state: **Claimed**
5. Contributor revises PR, calls `submit_work` again → state: **Under Review**
6. Poster calls `approve_submission` → state: **Approved**, funds released

### Dispute resolution

1. Poster calls `post_bounty` with arbitrator → state: **Open**
2. Contributor calls `claim_bounty` → state: **Claimed**
3. Contributor submits PR, calls `submit_work` → state: **Under Review**
4. Poster disagrees with quality, calls `open_dispute` → state: **Disputed**
5. Arbitrator reviews both sides, calls `resolve_dispute(award_to: claimant)` → state: **Resolved**, funds sent to claimant

---

## Related

- [Contract ABI](/docs/api/contract-abi) — all entry point signatures
- [Dispute Resolution](/docs/protocol/dispute-resolution) — detailed arbitration process
- [Contributor Onboarding](/docs/guides/contributor-onboarding) — how to claim and submit bounties
- [Maintainer Guide](/docs/guides/maintainer-guide) — how to post and approve bounties
