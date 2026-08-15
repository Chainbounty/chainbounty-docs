---
id: architecture
title: Architecture
sidebar_position: 2
---

# Architecture

ChainBounty is composed of four distinct layers that work together: a Soroban smart contract for on-chain escrow, a backend service for GitHub integration, a React frontend for the user interface, and the Stellar network as the settlement layer. This page maps out how they connect.

## High-Level Architecture

```
                        ┌─────────────────────────────────────────┐
                        │              Stellar Network              │
                        │         (Testnet / Mainnet)               │
                        └──────────────────┬──────────────────────┘
                                           │  Soroban RPC
                         ┌─────────────────▼──────────────────┐
                         │        Soroban Escrow Contract       │
                         │                                      │
                         │  • post_bounty()                     │
                         │  • claim_bounty()                    │
                         │  • submit_work()                     │
                         │  • approve_submission()              │
                         │  • reject_submission()               │
                         │  • open_dispute()                    │
                         │  • resolve_dispute()                 │
                         │  • cancel_bounty()                   │
                         └────────┬────────────────┬───────────┘
                                  │                │
               Soroban SDK        │                │  Events / Ledger
                ┌─────────────────▼──┐    ┌────────▼──────────────┐
                │   React Frontend   │    │   Backend Service      │
                │                    │    │   (Node.js)            │
                │  • Issue Browser   │    │                        │
                │  • Bounty Board    │    │  • GitHub Webhooks     │
                │  • Submit Portal   │    │  • Issue Sync          │
                │  • Wallet Connect  │    │  • Contributor Scoring │
                │  • Dashboard       │    │  • REST API            │
                └────────────────────┘    └────────────┬──────────┘
                         ▲                             │
                         │       REST API              │
                         └─────────────────────────────┘
                                           ▲
                                           │  Webhooks
                                ┌──────────┴──────────┐
                                │      GitHub          │
                                │                      │
                                │  • Issues            │
                                │  • Pull Requests     │
                                │  • Labels / Status   │
                                └─────────────────────┘
```

## Component Breakdown

### 1. Soroban Escrow Contract

The contract is the single source of truth for all bounty state. It is deployed on the Stellar network and interacted with via Soroban RPC.

**Responsibilities:**
- Accept and lock bounty funds in escrow
- Track bounty state through its full lifecycle
- Enforce milestone gates before releasing payment
- Handle disputes between maintainers and contributors
- Emit events for every state transition

**Key data structures:**

```rust
pub struct Bounty {
    pub id: u64,
    pub poster: Address,
    pub amount: i128,
    pub asset: Address,        // XLM or Stellar token
    pub github_issue_url: String,
    pub claimant: Option<Address>,
    pub arbitrator: Option<Address>,
    pub state: BountyState,
    pub created_at: u64,
    pub deadline: Option<u64>,
}

pub enum BountyState {
    Open,
    Claimed,
    UnderReview,
    Approved,
    Disputed,
    Resolved,
    Cancelled,
}
```

See the full [Contract ABI Reference](/docs/api/contract-abi) for all entry points and their parameters.

---

### 2. Backend Service

A Node.js service that acts as the bridge between GitHub and the Stellar network.

**Responsibilities:**
- Listen to GitHub webhooks for issue and PR events
- Sync issue status changes to bounty metadata
- Expose a REST API consumed by the frontend
- Calculate and update contributor reputation scores
- Index bounty events from the Stellar ledger

**Tech stack:**
- Node.js + Express
- Stellar SDK (`@stellar/stellar-sdk`)
- PostgreSQL for off-chain indexing
- GitHub Webhooks API

**Key API surface:**

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/bounties` | List all open bounties |
| `GET` | `/bounties/:id` | Get a single bounty |
| `GET` | `/contributors/:address` | Get contributor profile + score |
| `POST` | `/webhooks/github` | GitHub webhook receiver |

See the full [Backend API Reference](/docs/api/backend-api).

---

### 3. React Frontend

A single-page application that gives maintainers and contributors a UI over the contract and backend.

**Responsibilities:**
- Connect to Freighter wallet for transaction signing
- Browse and search GitHub issues with active bounties
- Post new bounties (calls `post_bounty` on contract)
- Claim, submit, approve, and dispute bounties
- Display contributor reputation and history

**Tech stack:**
- React 18 + TypeScript
- Stellar SDK + Freighter API
- TanStack Query for data fetching
- Tailwind CSS

See the [Frontend Integration Guide](/docs/api/frontend-integration).

---

### 4. Stellar Network

All fund movements and state transitions are settled on Stellar. ChainBounty uses:

- **Soroban** — smart contract execution environment
- **Soroban RPC** — used by both frontend and backend to read contract state and submit transactions
- **Stellar Testnet** — for development and testing
- **Stellar Mainnet** — for production

---

## Data Flow: Posting a Bounty

```
Maintainer
    │
    │  1. Connects Freighter wallet
    ▼
React Frontend
    │
    │  2. Fills out bounty form (GitHub issue URL, amount, deadline)
    │  3. Builds Soroban transaction
    ▼
Freighter Wallet
    │
    │  4. Signs transaction
    ▼
Stellar Network
    │
    │  5. Contract executes post_bounty(), locks funds in escrow
    │  6. Emits BountyPosted event
    ▼
Backend Service
    │
    │  7. Indexes new bounty from ledger event
    │  8. Fetches GitHub issue metadata
    │  9. Stores in PostgreSQL
    ▼
React Frontend
    │
    │  10. Polls backend API, displays bounty on board
    ▼
Contributor sees bounty and can claim it
```

## Data Flow: Releasing Payment

```
Contributor submits PR on GitHub
    │
    ▼
GitHub Webhook ──▶ Backend Service
                        │
                        │  Updates submission record
                        ▼
                  Maintainer reviews
                        │
                        │  Approves via Frontend
                        ▼
                  React Frontend builds
                  approve_submission() tx
                        │
                        ▼
                  Freighter signs
                        │
                        ▼
                  Stellar Network executes
                        │
                        │  Contract releases escrow to contributor
                        │  Emits BountyApproved event
                        ▼
                  Backend updates
                  contributor reputation score
```

## Security Boundaries

| Boundary | Trust Level | Notes |
|---|---|---|
| Stellar Network | Trustless | All fund movements are on-chain |
| Soroban Contract | Trustless | Logic is public and auditable |
| Backend Service | Semi-trusted | Used for indexing only, cannot move funds |
| Frontend | Untrusted | All transactions require wallet signature |
| GitHub | External | Webhook data is informational only |

The backend and frontend have **zero custody** over funds. They can read state and build transactions, but nothing moves without a valid signature from the bounty poster or claimant's wallet.

## Next Steps

- [Quick Start](/docs/quick-start) — get the stack running locally
- [Contract ABI](/docs/api/contract-abi) — full entry point reference
- [Bounty Lifecycle](/docs/bounty-lifecycle) — state machine walkthrough
