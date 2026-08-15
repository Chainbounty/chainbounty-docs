---
id: intro
title: Introduction
sidebar_position: 1
---

# Introduction to ChainBounty

ChainBounty is a fully on-chain bounty platform that connects open source contributors with DAOs and projects that need work done. Bounties are posted against real GitHub issues, funds are locked in a Soroban smart contract, and payment is released automatically after maintainer approval — no middlemen, no trust required.

## The Problem

Open source sustainability is broken. Projects need contributors but have no reliable, trustless way to pay for work. Existing platforms like Gitcoin and IssueHunt are either off-chain, centralized, or require significant trust between parties. Contributors do work and don't get paid. Projects post bounties and get no submissions. There is no on-chain accountability for either side.

## The ChainBounty Solution

ChainBounty solves this with three core primitives:

| Primitive | What it does |
|---|---|
| **Escrow Contract** | Locks bounty funds on-chain until approval conditions are met |
| **GitHub Integration** | Ties every bounty to a real issue; webhooks track progress automatically |
| **Reputation System** | Scores contributors on-chain based on accepted work over time |

Together these create a trustless, transparent bounty lifecycle where code is the contract.

## Protocol Overview

ChainBounty is built on the **Stellar network** using **Soroban** smart contracts. Here is how the protocol fits together at a high level:

```
┌─────────────────────────────────────────────────────────┐
│                     ChainBounty Protocol                 │
│                                                          │
│  ┌──────────────┐    ┌──────────────┐    ┌───────────┐  │
│  │   Maintainer  │    │   Soroban    │    │Contributor│  │
│  │  (Bounty      │───▶│   Escrow     │◀───│  (Claimant│  │
│  │   Poster)     │    │   Contract   │    │  )        │  │
│  └──────────────┘    └──────┬───────┘    └───────────┘  │
│                             │                            │
│                    ┌────────▼────────┐                   │
│                    │  GitHub Webhook  │                   │
│                    │  Backend Service │                   │
│                    └────────┬────────┘                   │
│                             │                            │
│                    ┌────────▼────────┐                   │
│                    │  React Frontend  │                   │
│                    │  Dashboard       │                   │
│                    └─────────────────┘                   │
└─────────────────────────────────────────────────────────┘
```

### Key Actors

**Maintainer / Bounty Poster**
A DAO, project, or individual who posts a bounty against a GitHub issue. They fund the escrow, define acceptance criteria, and approve or reject submissions.

**Contributor**
A developer who claims a bounty, submits a pull request, and receives payment when their work is approved. Their on-chain reputation grows with each successful submission.

**Arbitrator** *(optional)*
A neutral third party invoked during disputes. Defined at bounty creation time and only activated if maintainer and contributor cannot agree.

### Core Components

**Soroban Escrow Contract**
The heart of the protocol. Holds funds, enforces milestone gates, tracks bounty state, and releases payment. Fully auditable on-chain. See the [Contract ABI](/docs/api/contract-abi) for all entry points.

**Backend Service**
A Node.js service that listens to GitHub webhooks, syncs issue state to the contract, scores contributors, and exposes a REST API for the frontend. See the [Backend API Reference](/docs/api/backend-api).

**React Frontend**
A dashboard where maintainers post bounties, contributors browse open issues, and both parties track submissions and payments. See the [Frontend Integration Guide](/docs/guides/frontend-integration).

**Freighter Wallet**
All on-chain actions are signed through [Freighter](https://freighter.app), the standard Stellar browser wallet. See the [Wallet Setup Guide](/docs/guides/freighter-wallet).

## Design Principles

1. **Trustless by default** — Funds never leave the contract without meeting on-chain conditions.
2. **GitHub-native** — Bounties live where the work happens, not in a separate system.
3. **Permissionless** — Anyone with a Stellar wallet can post or claim a bounty.
4. **Transparent** — Every state change is an on-chain transaction, publicly verifiable.
5. **Fair** — Dispute resolution gives both parties a structured path to resolution.

## What ChainBounty is Not

- It is not a freelance marketplace — bounties are tied to specific open source GitHub issues.
- It is not a DAO governance tool — it handles execution, not voting.
- It is not custodial — ChainBounty never holds your funds; the contract does.

## Next Steps

- Follow the [Quick Start guide](/docs/quick-start) to run the project locally.
- Read the [Architecture overview](/docs/architecture) for a deep dive into how the components connect.
- Check the [Stellar & Soroban Prerequisites](/docs/guides/prerequisites) if you are new to the ecosystem.
