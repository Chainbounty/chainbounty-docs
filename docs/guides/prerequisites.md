---
id: prerequisites
title: Stellar and Soroban Prerequisites
sidebar_position: 1
---

# Stellar and Soroban Prerequisites

ChainBounty is built on the Stellar network using Soroban smart contracts. If you're new to Stellar or Soroban, this guide covers the core concepts, tools, and resources you need to understand how ChainBounty works.

---

## What is Stellar?

[Stellar](https://stellar.org) is a decentralized blockchain network designed for fast, low-cost global payments. Key features:

- **Fast** — 3-5 second transaction confirmation
- **Cheap** — ~$0.00001 per transaction
- **Built for assets** — native support for tokens, stablecoins, and custom assets
- **Energy efficient** — uses the Stellar Consensus Protocol (SCP), not proof-of-work

Stellar has been live since 2014 and powers real-world use cases like remittances, tokenized securities, and cross-border payments.

---

## What is Soroban?

[Soroban](https://soroban.stellar.org) is Stellar's smart contract platform, launched in 2024. It brings programmable logic to Stellar while preserving its speed and low cost.

### Key features

| Feature | Description |
|---|---|
| **Rust-based** | Contracts are written in Rust using the Soroban SDK |
| **WebAssembly (Wasm)** | Contracts compile to Wasm for secure, sandboxed execution |
| **Built-in asset support** | Native integration with Stellar assets (XLM, tokens) |
| **Low fees** | Typically 0.0001–0.001 XLM per contract call |
| **Developer-friendly** | Includes a CLI, local sandbox, and testing tools |

Soroban is production-ready but still evolving — expect frequent updates and improvements.

---

## Core Concepts

### 1. Stellar Accounts

Every user on Stellar has an **account** identified by a public key (address).

- **Format:** `GXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX` (56 characters, starts with `G`)
- **Keypair:** A public key (address) + secret key (private key)
- **Balance:** Accounts hold XLM and other Stellar assets

### 2. XLM (Lumens)

XLM is the native cryptocurrency of the Stellar network.

- **Symbol:** XLM
- **Name:** Lumens (singular: Lumen)
- **Smallest unit:** 1 stroop = 0.0000001 XLM
- **Use cases:** Transaction fees, account reserves, escrow

In ChainBounty, bounties are paid in XLM or other Stellar assets.

### 3. Stellar Assets

Stellar supports **custom assets** — tokens issued by anyone on the network.

Examples:
- **USDC** — Circle's stablecoin on Stellar
- **yXLM** — Yield-bearing XLM from Ultra Stellar
- **Custom DAO tokens** — your project's governance token

ChainBounty supports bounties in any Stellar asset.

### 4. Soroban Contracts

Smart contracts on Stellar. Key properties:

- **Deployed on-chain** — each contract has a unique contract ID (starts with `C`)
- **Invoked via transactions** — users call contract functions by submitting signed transactions
- **State storage** — contracts store data on-chain (e.g. bounty details)
- **Events** — contracts emit events that can be indexed off-chain

The ChainBounty escrow contract is a Soroban contract.

### 5. Testnet vs Mainnet

| Network | Purpose | Assets | URL |
|---|---|---|---|
| **Testnet** | Development and testing | Fake XLM (free from Friendbot) | https://soroban-testnet.stellar.org |
| **Mainnet** | Production | Real XLM and assets | https://soroban-mainnet.stellar.org |

Always test on **Testnet** first before deploying or using contracts on Mainnet.

---

## Required Tools

### 1. Stellar CLI

The official command-line tool for Stellar and Soroban.

**Install:**

```bash
# macOS / Linux
curl -fsSL https://github.com/stellar/stellar-cli/releases/latest/download/stellar-cli-installer.sh | bash

# Windows (via cargo)
cargo install --locked stellar-cli --features opt
```

**Verify:**

```bash
stellar --version
```

### 2. Rust Toolchain

Soroban contracts are written in Rust. Install via [rustup](https://rustup.rs/):

```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
rustup target add wasm32-unknown-unknown
```

**Verify:**

```bash
rustc --version
cargo --version
```

### 3. Node.js (for backend and frontend)

ChainBounty's backend and frontend are built with Node.js.

**Install:** [nodejs.org](https://nodejs.org) (use LTS version 20+)

**Verify:**

```bash
node --version
npm --version
```

### 4. Freighter Wallet

Browser extension wallet for Stellar. Required for all on-chain actions in ChainBounty.

**Install:** [freighter.app](https://freighter.app)

See the [Freighter Wallet Setup guide](/docs/guides/freighter-wallet) for configuration.

---

## Optional Tools

### Stellar Laboratory

A web-based GUI for building and testing Stellar transactions.

**URL:** [laboratory.stellar.org](https://laboratory.stellar.org)

**Use cases:**
- Manually build and submit transactions
- Inspect account details
- Fund Testnet accounts via Friendbot

### Stellar Expert

A blockchain explorer for Stellar.

**URL:** [stellar.expert](https://stellar.expert)

**Use cases:**
- View account balances and transaction history
- Inspect contract state and events
- Monitor network activity

### Soroban Playground

An online IDE for writing and testing Soroban contracts.

**URL:** [soroban.stellar.org/playground](https://soroban.stellar.org/playground)

---

## Testnet Setup

### 1. Generate a keypair

```bash
stellar keys generate alice --network testnet
```

This creates a keypair named `alice` and prints the public key.

### 2. Fund the account

```bash
stellar keys fund alice --network testnet
```

This requests 10,000 test XLM from Friendbot.

### 3. Check your balance

```bash
stellar account show alice --network testnet
```

You should see a balance of 10,000 XLM.

---

## Key Differences from Ethereum

If you're coming from Ethereum/EVM, here are the main differences:

| Feature | Ethereum | Stellar + Soroban |
|---|---|---|
| **Consensus** | Proof-of-Stake | Stellar Consensus Protocol (SCP) |
| **Transaction speed** | 12 seconds | 3-5 seconds |
| **Transaction cost** | $1–$50 (varies) | ~$0.00001 (fixed) |
| **Smart contract language** | Solidity | Rust |
| **VM** | EVM | WebAssembly |
| **Native tokens** | ERC-20 standard | Built-in asset system |
| **Wallet signing** | MetaMask | Freighter |
| **Block explorer** | Etherscan | Stellar Expert |

---

## Learning Resources

### Official Docs

- **Stellar docs:** [developers.stellar.org](https://developers.stellar.org)
- **Soroban docs:** [soroban.stellar.org](https://soroban.stellar.org)
- **Stellar CLI reference:** [github.com/stellar/stellar-cli](https://github.com/stellar/stellar-cli)

### Tutorials

- **Soroban by Example:** [sorobanbyexample.org](https://sorobanbyexample.org)
- **Build a dApp on Stellar:** [developers.stellar.org/docs/build](https://developers.stellar.org/docs/build)
- **Rust Book:** [doc.rust-lang.org/book](https://doc.rust-lang.org/book)

### Community

- **Stellar Discord:** [discord.gg/stellar](https://discord.gg/stellar)
- **Soroban Dev Discord:** [discord.gg/stellardev](https://discord.gg/stellardev)
- **Stellar Stack Exchange:** [stellar.stackexchange.com](https://stellar.stackexchange.com)

---

## Common Terminology

| Term | Definition |
|---|---|
| **XLM** | Native asset of the Stellar network (Lumens) |
| **Stroop** | Smallest unit of XLM (1 stroop = 0.0000001 XLM) |
| **Ledger** | A block in the Stellar blockchain (one ledger every 5 seconds) |
| **Operation** | A single action in a Stellar transaction (e.g. payment, contract call) |
| **Horizon** | Stellar's REST API for querying blockchain data |
| **Soroban RPC** | RPC endpoint for invoking and simulating Soroban contracts |
| **Friendbot** | Testnet faucet that funds accounts with test XLM |
| **Trustline** | Permission to hold a non-native asset |

---

## Troubleshooting

### "stellar: command not found"

The Stellar CLI is not installed or not in your PATH. Run the installer again and restart your terminal.

### "Account not found"

The account hasn't been funded yet. Run `stellar keys fund <name> --network testnet`.

### "Insufficient balance"

Your account doesn't have enough XLM to cover the transaction fee. Fund it via Friendbot (Testnet) or add XLM (Mainnet).

### "Contract not found"

The contract ID is incorrect, or the contract hasn't been deployed to the network you're connected to.

---

## Next Steps

Now that you understand Stellar and Soroban basics:

- Follow the [Quick Start guide](/docs/quick-start) to run ChainBounty locally
- Set up [Freighter Wallet](/docs/guides/freighter-wallet)
- Read the [Architecture overview](/docs/architecture) to see how ChainBounty uses Soroban

---

## Need Help?

- **Stellar basics** — ask in [Stellar Discord](https://discord.gg/stellar)
- **Soroban development** — ask in [Stellar Dev Discord](https://discord.gg/stellardev)
- **ChainBounty-specific** — open an issue on [GitHub](https://github.com/chainbounty) or tag us on X [@chainbounty](https://x.com/chainbounty)
