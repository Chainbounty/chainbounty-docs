---
id: glossary
title: Glossary of Terms
sidebar_position: 1
---

# Glossary of Terms

A comprehensive glossary of ChainBounty-specific terms, Stellar/Soroban concepts, and blockchain terminology used throughout the documentation.

---

## ChainBounty Terms

### Arbitrator

A neutral third party designated at bounty creation to resolve disputes between the maintainer and contributor. The arbitrator reviews evidence and awards the escrowed funds to one party. Optional — not all bounties have an arbitrator.

### Bounty

A reward (in XLM or another Stellar asset) posted by a maintainer for completing a specific GitHub issue. Funds are locked in escrow until the work is approved.

### Bounty Board

The main UI in ChainBounty where users browse, search, and filter open bounties.

### Bounty Lifecycle

The complete state machine a bounty goes through: Open → Claimed → Under Review → Approved (or Disputed → Resolved, or Cancelled). See the [Bounty Lifecycle](/docs/bounty-lifecycle).

### Bounty Poster

See **Maintainer**.

### Claim

The act of a contributor reserving a bounty by calling `claim_bounty` on the contract. Once claimed, the issue is assigned to the contributor and no one else can claim it.

### Claimant

A contributor who has claimed a bounty. The claimant is the only one who can submit work for that bounty.

### Contributor

A developer who claims and completes bounties. Also called a **claimant** after they claim a bounty.

### Dispute

A formal disagreement between the maintainer and contributor, opened on-chain via `open_dispute`. Once opened, only the arbitrator can resolve the bounty.

### Escrow

The on-chain holding of funds in the smart contract. Funds are locked in escrow when a bounty is posted and released when the work is approved (or dispute is resolved).

### Maintainer

The person or DAO that posts a bounty. Maintainers fund the escrow, review submissions, and approve or reject work.

### Platform Fee

A **2.5%** fee charged by ChainBounty on every bounty payout. Deducted from the contributor's earnings and sent to the treasury. See [Fee Model](/docs/protocol/fee-model).

### Rejection

When a maintainer rejects a contributor's submission via `reject_submission`. The bounty returns to "Claimed" state and the contributor can revise and resubmit.

### Reputation Score

A numeric value reflecting a contributor's track record on ChainBounty. Calculated based on approved bounties, disputes won, completion rate, and other factors. See [Reputation Scores](/docs/protocol/reputation-scores).

### Submission

The pull request (or other deliverable) a contributor submits to complete a bounty. Recorded on-chain via `submit_work`.

### Treasury

The Stellar account controlled by the ChainBounty protocol that receives all platform fees. Used to fund development, infrastructure, and community initiatives.

---

## Stellar Terms

### Account

A Stellar account is a keypair (public + secret key) that holds assets and can submit transactions. Identified by a public key starting with `G`.

### Asset

A token on the Stellar network. Can be native (XLM) or custom (e.g., USDC, a DAO token). Custom assets are issued by a specific account.

### Friendbot

A Testnet-only service that funds accounts with free test XLM. URL: https://friendbot.stellar.org

### Horizon

Stellar's REST API for querying blockchain data. Provides historical ledger data, account balances, and transaction history.

### Ledger

A "block" in the Stellar blockchain. A new ledger closes every **5 seconds**. Each ledger contains all transactions submitted in that time window.

### Lumens (XLM)

The native cryptocurrency of the Stellar network. Used for transaction fees, account reserves, and as a bounty asset on ChainBounty.

### Network Passphrase

A string identifying the Stellar network. Used to prevent transactions from being replayed across networks.

- **Testnet:** `"Test SDF Network ; September 2015"`
- **Mainnet:** `"Public Global Stellar Network ; September 2015"`

### Operation

A single action within a Stellar transaction. Examples: payment, create account, invoke contract. A transaction can have multiple operations.

### Public Key

The address of a Stellar account, starting with `G`. Public keys are safe to share — they cannot be used to spend funds.

### Secret Key

The private key of a Stellar account, starting with `S`. Must be kept secret — anyone with the secret key can spend the account's funds.

### Soroban RPC

The RPC endpoint for invoking and querying Soroban smart contracts. Separate from Horizon (which serves historical data).

### Stroop

The smallest unit of XLM. **1 stroop = 0.0000001 XLM**. Contract amounts are often specified in stroops.

### Transaction

A bundle of one or more operations submitted to the network. Signed by the account's secret key and charged a small network fee.

### Trustline

Permission to hold a non-native asset. Before receiving USDC or a custom token, an account must establish a trustline to the asset issuer.

---

## Soroban Terms

### Contract

A smart contract deployed on Stellar via Soroban. Written in Rust, compiled to WebAssembly, and invoked via Soroban RPC.

### Contract ID

The unique identifier of a deployed contract. Starts with `C` (e.g., `CXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX`).

### Entry Point

A public function in a Soroban contract that can be invoked via transactions. Example: `post_bounty`, `claim_bounty`.

### Event

A log emitted by a contract during execution. Events are indexed off-chain by the backend for querying. Example: `BountyPosted`, `SubmissionApproved`.

### Invoke

The act of calling a contract function. Requires building a transaction, simulating it, signing with a wallet, and submitting to the network.

### Simulation

A dry-run of a contract invocation to estimate resource usage (CPU, memory, storage). Required before submitting a real transaction.

### WebAssembly (Wasm)

The bytecode format Soroban contracts compile to. Wasm is portable, secure, and sandboxed.

---

## Blockchain Terms

### Decentralized

No single entity controls the system. ChainBounty's contract is deployed on-chain and cannot be modified by the core team.

### Escrow

A financial arrangement where funds are held by a third party (in this case, a smart contract) until conditions are met.

### Gas / Fees

The cost to execute a transaction. On Stellar, the base fee is ~**0.00001 XLM** per operation. Soroban contract calls may cost more based on resource usage.

### Non-Custodial

ChainBounty does not hold user funds. All funds are held in the smart contract, and only the user can authorize transactions via their wallet.

### On-Chain

Data or actions recorded on the blockchain. On-chain data is public, permanent, and verifiable.

### Off-Chain

Data or actions that occur outside the blockchain. Example: ChainBounty's backend database is off-chain.

### Private Key

See **Secret Key**.

### Public Key

See **Public Key** (Stellar).

### Smart Contract

Self-executing code deployed on a blockchain. Enforces rules and holds funds without requiring trust in a central authority.

### Testnet

A blockchain environment for testing with fake assets. No real value. Used for development and QA.

### Mainnet

The production blockchain where real assets have value. Opposite of Testnet.

### Wallet

Software that stores your secret key and signs transactions. ChainBounty uses **Freighter**, a browser extension wallet for Stellar.

---

## GitHub Terms

### Issue

A task, bug, or feature request on a GitHub repository. Bounties are tied to issues — one bounty per issue.

### Pull Request (PR)

A proposed code change submitted to a GitHub repository. Contributors submit PRs to complete bounties.

### Merge

When a maintainer approves and integrates a pull request into the main branch.

### Fork

A personal copy of a GitHub repository. Contributors fork repos, make changes, and submit PRs.

### Repository (Repo)

A GitHub project containing code, issues, and pull requests. Example: `github.com/chainbounty/chainbounty-contract`.

### Webhook

A mechanism for GitHub to send real-time event notifications to an external service (e.g., ChainBounty backend).

---

## Dispute and Governance Terms

### Appeal

(Future feature) A request to review an arbitrator's decision with a higher-tier arbitrator.

### Consensus

Agreement among multiple parties. In blockchain, consensus is how validators agree on the state of the ledger.

### Governance Token

A token that grants voting rights in a protocol. ChainBounty plans to launch a governance token ($BOUNTY) for community decision-making.

### Multisig

A wallet or arbitrator requiring multiple signatures to authorize an action. Planned for future ChainBounty treasury management.

### Proposal

A formal suggestion for a protocol change, fee adjustment, or treasury spend. Voted on by governance token holders.

### Quorum

The minimum number of votes required for a proposal to pass.

---

## Security and Cryptography Terms

### HMAC

Hash-based Message Authentication Code. Used to verify the authenticity of GitHub webhook payloads.

### Signature

Cryptographic proof that a transaction was authorized by the holder of a secret key. Freighter signs transactions before submission.

### Zero-Knowledge Proof (ZKP)

(Future feature) A cryptographic method to prove a statement is true without revealing the underlying data. Example: prove you have high reputation without revealing your wallet address.

---

## Abbreviations

| Abbreviation | Full Term |
|---|---|
| **ABI** | Application Binary Interface (contract function signatures) |
| **API** | Application Programming Interface |
| **DAO** | Decentralized Autonomous Organization |
| **DeFi** | Decentralized Finance |
| **dApp** | Decentralized Application |
| **HMAC** | Hash-based Message Authentication Code |
| **IPFS** | InterPlanetary File System (decentralized storage) |
| **NFT** | Non-Fungible Token |
| **OSS** | Open Source Software |
| **PR** | Pull Request |
| **RPC** | Remote Procedure Call |
| **SDK** | Software Development Kit |
| **SLA** | Service Level Agreement |
| **UI/UX** | User Interface / User Experience |
| **XLM** | Stellar Lumens (native asset) |
| **ZKP** | Zero-Knowledge Proof |

---

## Protocol States

### Bounty States

| State | Description |
|---|---|
| **Open** | Bounty is funded and awaiting a claimant |
| **Claimed** | A contributor has claimed the bounty |
| **Under Review** | Work has been submitted, awaiting maintainer review |
| **Approved** | Work accepted, funds released to contributor |
| **Disputed** | Dispute opened, awaiting arbitrator resolution |
| **Resolved** | Arbitrator awarded funds, bounty complete |
| **Cancelled** | Poster cancelled before anyone claimed it |

See the [Bounty Lifecycle](/docs/bounty-lifecycle) for the full state machine.

---

## Reputation Tiers

| Tier | Score Range | Badge |
|---|---|---|
| **Bronze** | 0–499 | 🥉 |
| **Silver** | 500–999 | 🥈 |
| **Gold** | 1,000–2,499 | 🥇 |
| **Platinum** | 2,500+ | 💎 |

See [Reputation Scores](/docs/protocol/reputation-scores).

---

## Common Patterns

### Claim-and-Abandon

When a contributor claims a bounty but never submits work. Penalized with a reputation loss after 30 days of inactivity.

### Front-Running

Submitting a transaction faster than someone else to claim a bounty first. Possible but economically infeasible on Stellar due to 5-second finality.

### Rug Pull

When a project collects funds and disappears. Prevented in ChainBounty by on-chain escrow — maintainers cannot withdraw funds after a contributor claims.

### Sybil Attack

Creating many fake accounts to game reputation. Mitigated by GitHub verification and minimum activity thresholds.

---

## Related

- [Introduction](/docs/intro) — protocol overview
- [FAQ](/docs/reference/faq) — common questions
- [Prerequisites](/docs/guides/prerequisites) — Stellar and Soroban basics
- [Contract ABI](/docs/api/contract-abi) — technical reference

---

**Missing a term?** Open an issue on [GitHub](https://github.com/chainbounty/chainbounty-docs/issues) or suggest it in [Discord](https://discord.gg/chainbounty).
