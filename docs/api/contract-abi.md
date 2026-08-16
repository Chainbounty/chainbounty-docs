---
id: contract-abi
title: Contract ABI Reference
sidebar_position: 1
---

# Contract ABI Reference

This page documents every entry point on the ChainBounty Soroban escrow contract. Each function lists its arguments, return value, emitted events, and error conditions.

:::info Contract Address
The deployed Testnet contract ID is set in your `.env` file as `CONTRACT_ID`. See the [Quick Start guide](/docs/quick-start) for deployment instructions.
:::

---

## Data Types

### `BountyState`

The state enum that tracks where a bounty is in its lifecycle.

```rust
pub enum BountyState {
    Open,         // Funded, awaiting a claimant
    Claimed,      // A contributor has claimed it
    UnderReview,  // Contributor submitted work, awaiting maintainer review
    Approved,     // Maintainer approved — funds released to contributor
    Disputed,     // Either party opened a dispute
    Resolved,     // Arbitrator resolved the dispute
    Cancelled,    // Poster cancelled before a claim was made
}
```

### `Bounty`

The primary data structure stored in contract storage.

```rust
pub struct Bounty {
    pub id: u64,
    pub poster: Address,
    pub amount: i128,
    pub asset: Address,              // Contract address of the asset (XLM or token)
    pub github_issue_url: String,
    pub claimant: Option<Address>,
    pub arbitrator: Option<Address>,
    pub submission_url: Option<String>,
    pub state: BountyState,
    pub created_at: u64,             // Ledger timestamp
    pub deadline: Option<u64>,       // Optional expiry ledger timestamp
}
```

### `Error`

All contract errors returned as `Err(ContractError)`.

```rust
pub enum ContractError {
    BountyNotFound = 1,
    AlreadyClaimed = 2,
    NotClaimant = 3,
    NotPoster = 4,
    NotArbitrator = 5,
    InvalidState = 6,
    InsufficientFunds = 7,
    DeadlineExpired = 8,
    Unauthorized = 9,
    InvalidInput = 10,
}
```

---

## Entry Points

### `post_bounty`

Creates a new bounty and locks funds in escrow.

```rust
pub fn post_bounty(
    env: Env,
    poster: Address,
    amount: i128,
    asset: Address,
    github_issue_url: String,
    arbitrator: Option<Address>,
    deadline: Option<u64>,
) -> Result<u64, ContractError>
```

**Parameters**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `poster` | `Address` | Yes | Wallet address of the bounty poster |
| `amount` | `i128` | Yes | Amount to lock in escrow (in stroops for XLM) |
| `asset` | `Address` | Yes | Asset contract address (use XLM contract address for XLM) |
| `github_issue_url` | `String` | Yes | Full URL to the GitHub issue |
| `arbitrator` | `Option<Address>` | No | Address of dispute arbitrator |
| `deadline` | `Option<u64>` | No | Ledger timestamp after which bounty auto-expires |

**Returns** — `u64` — the new bounty ID.

**Emits** — `BountyPosted { id, poster, amount, asset, github_issue_url }`

**Errors** — `InvalidInput` if amount is zero or URL is empty. `InsufficientFunds` if poster balance is too low.

---

### `claim_bounty`

Allows a contributor to claim an open bounty.

```rust
pub fn claim_bounty(
    env: Env,
    claimant: Address,
    bounty_id: u64,
) -> Result<(), ContractError>
```

**Parameters**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `claimant` | `Address` | Yes | Wallet address of the contributor claiming the bounty |
| `bounty_id` | `u64` | Yes | ID of the bounty to claim |

**Returns** — `()`

**Emits** — `BountyClaimed { id, claimant }`

**Errors** — `BountyNotFound`, `AlreadyClaimed`, `InvalidState` (if not `Open`), `DeadlineExpired`

---

### `submit_work`

Called by the claimant to submit their work for review.

```rust
pub fn submit_work(
    env: Env,
    claimant: Address,
    bounty_id: u64,
    submission_url: String,
) -> Result<(), ContractError>
```

**Parameters**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `claimant` | `Address` | Yes | Must match the address that claimed the bounty |
| `bounty_id` | `u64` | Yes | ID of the bounty |
| `submission_url` | `String` | Yes | URL to the pull request or submission artifact |

**Returns** — `()`

**Emits** — `WorkSubmitted { id, claimant, submission_url }`

**Errors** — `BountyNotFound`, `NotClaimant`, `InvalidState` (if not `Claimed`), `InvalidInput` if URL is empty

---

### `approve_submission`

Called by the poster to approve submitted work and release escrow funds to the contributor.

```rust
pub fn approve_submission(
    env: Env,
    poster: Address,
    bounty_id: u64,
) -> Result<(), ContractError>
```

**Parameters**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `poster` | `Address` | Yes | Must match the original bounty poster |
| `bounty_id` | `u64` | Yes | ID of the bounty to approve |

**Returns** — `()`

**Emits** — `SubmissionApproved { id, claimant, amount }`

**Errors** — `BountyNotFound`, `NotPoster`, `InvalidState` (if not `UnderReview`)

:::note
This function transfers the escrowed funds to the claimant's address atomically. The bounty state moves to `Approved` and no further actions are possible.
:::

---

### `reject_submission`

Called by the poster to reject submitted work. Returns the bounty to `Claimed` state so the contributor can resubmit.

```rust
pub fn reject_submission(
    env: Env,
    poster: Address,
    bounty_id: u64,
    reason: String,
) -> Result<(), ContractError>
```

**Parameters**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `poster` | `Address` | Yes | Must match the original bounty poster |
| `bounty_id` | `u64` | Yes | ID of the bounty |
| `reason` | `String` | Yes | Rejection reason stored on-chain |

**Returns** — `()`

**Emits** — `SubmissionRejected { id, claimant, reason }`

**Errors** — `BountyNotFound`, `NotPoster`, `InvalidState` (if not `UnderReview`)

---

### `open_dispute`

Opens a dispute on a bounty. Can be called by either the poster or claimant.

```rust
pub fn open_dispute(
    env: Env,
    caller: Address,
    bounty_id: u64,
    reason: String,
) -> Result<(), ContractError>
```

**Parameters**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `caller` | `Address` | Yes | Either the poster or claimant |
| `bounty_id` | `u64` | Yes | ID of the bounty |
| `reason` | `String` | Yes | Reason for the dispute |

**Returns** — `()`

**Emits** — `DisputeOpened { id, caller, reason }`

**Errors** — `BountyNotFound`, `Unauthorized` (if caller is neither poster nor claimant), `InvalidState`

:::warning
A dispute can only be opened when the bounty is in `Claimed` or `UnderReview` state. Once opened, only the arbitrator can resolve it.
:::

---

### `resolve_dispute`

Called by the arbitrator to resolve a dispute. Routes funds to either the poster or claimant.

```rust
pub fn resolve_dispute(
    env: Env,
    arbitrator: Address,
    bounty_id: u64,
    award_to: Address,
) -> Result<(), ContractError>
```

**Parameters**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `arbitrator` | `Address` | Yes | Must match the arbitrator set at bounty creation |
| `bounty_id` | `u64` | Yes | ID of the disputed bounty |
| `award_to` | `Address` | Yes | Address to receive the escrowed funds |

**Returns** — `()`

**Emits** — `DisputeResolved { id, arbitrator, award_to, amount }`

**Errors** — `BountyNotFound`, `NotArbitrator`, `InvalidState` (if not `Disputed`), `Unauthorized` if `award_to` is neither poster nor claimant

---

### `cancel_bounty`

Allows the poster to cancel a bounty and reclaim funds. Only valid before a contributor claims it.

```rust
pub fn cancel_bounty(
    env: Env,
    poster: Address,
    bounty_id: u64,
) -> Result<(), ContractError>
```

**Parameters**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `poster` | `Address` | Yes | Must match the original poster |
| `bounty_id` | `u64` | Yes | ID of the bounty to cancel |

**Returns** — `()`

**Emits** — `BountyCancelled { id, poster, amount_returned }`

**Errors** — `BountyNotFound`, `NotPoster`, `InvalidState` (if not `Open`)

---

### `get_bounty`

Read-only. Returns the full `Bounty` struct for a given ID.

```rust
pub fn get_bounty(
    env: Env,
    bounty_id: u64,
) -> Result<Bounty, ContractError>
```

**Returns** — `Bounty`

**Errors** — `BountyNotFound`

---

### `get_bounties_by_poster`

Read-only. Returns all bounty IDs posted by a given address.

```rust
pub fn get_bounties_by_poster(
    env: Env,
    poster: Address,
) -> Vec<u64>
```

**Returns** — `Vec<u64>`

---

### `get_bounties_by_claimant`

Read-only. Returns all bounty IDs claimed by a given address.

```rust
pub fn get_bounties_by_claimant(
    env: Env,
    claimant: Address,
) -> Vec<u64>
```

**Returns** — `Vec<u64>`

---

## Events Reference

All events emitted by the contract follow this structure and can be indexed from Stellar ledger data.

| Event | Fields | Trigger |
|---|---|---|
| `BountyPosted` | `id, poster, amount, asset, github_issue_url` | `post_bounty` succeeds |
| `BountyClaimed` | `id, claimant` | `claim_bounty` succeeds |
| `WorkSubmitted` | `id, claimant, submission_url` | `submit_work` succeeds |
| `SubmissionApproved` | `id, claimant, amount` | `approve_submission` succeeds |
| `SubmissionRejected` | `id, claimant, reason` | `reject_submission` succeeds |
| `DisputeOpened` | `id, caller, reason` | `open_dispute` succeeds |
| `DisputeResolved` | `id, arbitrator, award_to, amount` | `resolve_dispute` succeeds |
| `BountyCancelled` | `id, poster, amount_returned` | `cancel_bounty` succeeds |

---

## Invoking the Contract via Stellar CLI

```bash
# Post a bounty
stellar contract invoke \
  --id $CONTRACT_ID \
  --source poster-key \
  --network testnet \
  -- post_bounty \
  --poster GXXXXXXX \
  --amount 1000000000 \
  --asset CXXXXXXX \
  --github_issue_url "https://github.com/org/repo/issues/42" \
  --arbitrator null \
  --deadline null

# Get a bounty
stellar contract invoke \
  --id $CONTRACT_ID \
  --network testnet \
  -- get_bounty \
  --bounty_id 1
```

---

## Related

- [Bounty Lifecycle](/docs/bounty-lifecycle) — state machine diagram
- [Backend API Reference](/docs/api/backend-api) — REST API on top of the contract
- [Dispute Resolution](/docs/protocol/dispute-resolution) — full arbitration process
