---
id: testnet-deployment
title: Testnet Deployment and Testing
sidebar_position: 6
---

# Testnet Deployment and Testing

This guide walks you through deploying the ChainBounty contract to Stellar Testnet, running end-to-end tests, and verifying the full stack works before going to production.

---

## Why Test on Testnet?

Testnet is a safe environment to:

- Deploy and test contracts without risking real funds
- Debug transaction failures and edge cases
- Verify frontend + backend + contract integration
- Test with multiple wallets and user roles
- Simulate disputes and edge cases

:::warning
Testnet XLM has no real value. Never send real XLM or assets to Testnet addresses.
:::

---

## Prerequisites

Before deploying to Testnet:

- ✅ **Stellar CLI** installed — [Prerequisites guide](/docs/guides/prerequisites)
- ✅ **Rust toolchain** installed
- ✅ **Freighter wallet** installed and set to Testnet
- ✅ **Testnet account funded** via [Friendbot](https://friendbot.stellar.org)
- ✅ **ChainBounty repos cloned** — see [Quick Start](/docs/quick-start)

---

## Step 1 — Build the Contract

```bash
cd chainbounty-contract
cargo build --target wasm32-unknown-unknown --release
```

The compiled contract is output to:

```
target/wasm32-unknown-unknown/release/chainbounty_contract.wasm
```

Verify the build succeeded:

```bash
ls -lh target/wasm32-unknown-unknown/release/*.wasm
```

You should see a `.wasm` file around 100–200 KB.

---

## Step 2 — Configure Stellar CLI for Testnet

Add the Testnet network configuration:

```bash
stellar network add testnet \
  --rpc-url https://soroban-testnet.stellar.org \
  --network-passphrase "Test SDF Network ; September 2015"
```

Verify it was added:

```bash
stellar network ls
```

---

## Step 3 — Generate a Deployer Keypair

Generate a new keypair for deploying the contract:

```bash
stellar keys generate deployer --network testnet
```

The CLI prints your public key:

```
Public key: GDEPLOYERXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

---

## Step 4 — Fund the Deployer Account

Request test XLM from Friendbot:

```bash
stellar keys fund deployer --network testnet
```

You should see:

```
Account funded successfully with 10,000 XLM
```

Verify your balance:

```bash
stellar account show deployer --network testnet
```

---

## Step 5 — Deploy the Contract

Deploy the compiled Wasm to Testnet:

```bash
stellar contract deploy \
  --wasm target/wasm32-unknown-unknown/release/chainbounty_contract.wasm \
  --source deployer \
  --network testnet
```

The CLI prints the **Contract ID**:

```
Contract deployed successfully with ID:
CXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

**Copy this Contract ID** — you'll need it for the backend and frontend configuration.

---

## Step 6 — Configure Backend for Testnet

Update your backend `.env` file:

```bash
cd ../chainbounty-backend
cp .env.example .env
```

Edit `.env` and set:

```bash
STELLAR_NETWORK=testnet
SOROBAN_RPC_URL=https://soroban-testnet.stellar.org
CONTRACT_ID=CXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

DATABASE_URL=postgresql://chainbounty:password@localhost:5432/chainbounty

GITHUB_WEBHOOK_SECRET=your_test_webhook_secret
GITHUB_APP_ID=your_github_app_id
GITHUB_PRIVATE_KEY_PATH=./github-private-key.pem

PORT=3001
```

### Start PostgreSQL

```bash
docker run -d \
  --name chainbounty-db \
  -e POSTGRES_USER=chainbounty \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=chainbounty \
  -p 5432:5432 \
  postgres:16
```

### Run migrations

```bash
npm install
npm run migrate
```

### Start the backend

```bash
npm run dev
```

Verify it's running:

```bash
curl http://localhost:3001/health
```

Expected response:

```json
{
  "status": "ok",
  "network": "testnet",
  "contract": "CXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  "db": "connected"
}
```

---

## Step 7 — Configure Frontend for Testnet

Update your frontend `.env.local`:

```bash
cd ../chainbounty-frontend
cp .env.example .env.local
```

Edit `.env.local`:

```bash
VITE_SOROBAN_RPC_URL=https://soroban-testnet.stellar.org
VITE_CONTRACT_ID=CXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
VITE_BACKEND_URL=http://localhost:3001
VITE_STELLAR_NETWORK=testnet
VITE_NETWORK_PASSPHRASE="Test SDF Network ; September 2015"
```

### Install and start

```bash
npm install
npm run dev
```

The frontend starts at `http://localhost:5173`.

---

## Step 8 — End-to-End Testing

Now test the full bounty lifecycle on Testnet.

### Test accounts setup

Generate 3 test accounts:

```bash
stellar keys generate maintainer --network testnet
stellar keys generate contributor --network testnet
stellar keys generate arbitrator --network testnet

stellar keys fund maintainer --network testnet
stellar keys fund contributor --network testnet
stellar keys fund arbitrator --network testnet
```

---

### Test Case 1: Happy Path

**Goal:** Post a bounty, claim it, submit work, approve, and verify payment.

1. **Open Freighter** and import the `maintainer` secret key
2. **Go to** `http://localhost:5173`
3. **Connect wallet** — Freighter prompts for approval
4. **Post a bounty:**
   - GitHub Issue URL: `https://github.com/your-org/test-repo/issues/1`
   - Amount: 100 XLM
   - Click **Post Bounty**
   - Sign the transaction in Freighter
5. **Verify on backend:**
   ```bash
   curl http://localhost:3001/bounties
   ```
   You should see the new bounty with state `open`.

6. **Switch to contributor account** in Freighter (import `contributor` secret key)
7. **Claim the bounty:**
   - Click **Claim Bounty**
   - Sign the transaction
8. **Submit work:**
   - Click **Submit Work**
   - Enter a PR URL: `https://github.com/your-org/test-repo/pull/2`
   - Sign the transaction
9. **Switch back to maintainer** in Freighter
10. **Approve submission:**
    - Click **Approve Submission**
    - Sign the transaction
11. **Verify contributor received payment:**
    ```bash
    stellar account show contributor --network testnet
    ```
    Balance should have increased by 97.5 XLM (100 - 2.5% fee).

---

### Test Case 2: Rejection and Resubmission

1. Maintainer posts a bounty (100 XLM)
2. Contributor claims it
3. Contributor submits work
4. **Maintainer rejects** with reason: "Missing tests"
5. **Verify bounty state** is back to `claimed`
6. Contributor submits again with updated PR
7. Maintainer approves
8. Verify payment

---

### Test Case 3: Dispute Resolution

1. Maintainer posts a bounty (100 XLM) **with arbitrator address**
2. Contributor claims it
3. Contributor submits work
4. **Maintainer opens dispute** with reason: "Incomplete"
5. **Verify bounty state** is `disputed`
6. **Switch to arbitrator** in Freighter
7. **Resolve dispute:**
   - Award to contributor
   - Sign the transaction
8. **Verify contributor received payment**

---

### Test Case 4: Cancellation

1. Maintainer posts a bounty (50 XLM)
2. **Before anyone claims it**, maintainer clicks **Cancel Bounty**
3. Sign the transaction
4. **Verify funds returned** to maintainer's balance

---

### Test Case 5: Multi-Asset Bounty

1. **Issue a custom token** on Testnet (or use USDC Testnet)
2. Post a bounty in that token instead of XLM
3. Complete the full lifecycle
4. Verify contributor receives the correct token

---

## Step 9 — Contract Invocation Testing (CLI)

Test contract functions directly via the Stellar CLI.

### Get a bounty

```bash
stellar contract invoke \
  --id CXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX \
  --source maintainer \
  --network testnet \
  -- get_bounty \
  --bounty_id 1
```

### List bounties by poster

```bash
stellar contract invoke \
  --id CXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX \
  --source maintainer \
  --network testnet \
  -- get_bounties_by_poster \
  --poster GMAINTAINERXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

---

## Step 10 — Verify Events and Ledger Data

All contract events are emitted on-chain and can be indexed.

### View recent events

```bash
stellar events --id CXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX --network testnet
```

### Check event logs in Stellar Expert

Visit:

```
https://stellar.expert/explorer/testnet/contract/CXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

Click **Events** to see all emitted events.

---

## Common Issues

| Problem | Fix |
|---|---|
| `Contract not found` | Wrong contract ID or wrong network in env file |
| `Transaction failed: InsufficientBalance` | Fund the account via Friendbot |
| `Freighter not connecting` | Make sure Freighter is set to Testnet |
| Backend can't connect to contract | Verify `SOROBAN_RPC_URL` and `CONTRACT_ID` in `.env` |
| Frontend shows "Network mismatch" | Verify `VITE_STELLAR_NETWORK=testnet` in `.env.local` |
| PostgreSQL connection refused | Make sure Docker container is running: `docker ps` |

---

## Automated Testing

Run the contract's unit tests:

```bash
cd chainbounty-contract
cargo test
```

Run backend integration tests:

```bash
cd chainbounty-backend
npm run test
```

Run frontend E2E tests (if set up):

```bash
cd chainbounty-frontend
npm run test:e2e
```

---

## Load Testing

Simulate high bounty volume to test backend and RPC performance.

### Example: Post 100 bounties in parallel

```bash
for i in {1..100}; do
  stellar contract invoke \
    --id $CONTRACT_ID \
    --source deployer \
    --network testnet \
    -- post_bounty \
    --poster $DEPLOYER_ADDRESS \
    --amount 1000000000 \
    --asset native \
    --github_issue_url "https://github.com/org/repo/issues/$i" \
    --arbitrator null \
    --deadline null &
done
wait
```

Monitor backend logs and RPC response times.

---

## Testnet Limitations

Testnet has some restrictions compared to Mainnet:

| Limitation | Impact |
|---|---|
| **Data retention** | Testnet is reset periodically (every few months) |
| **RPC rate limits** | Lower than Mainnet — expect throttling under load |
| **No uptime SLA** | Testnet can go down for maintenance |
| **Test XLM only** | Cannot use real assets |

Always re-deploy and re-test after a Testnet reset.

---

## Next Steps

Once Testnet testing is complete:

- Review the [Security Model](/docs/protocol/security) before Mainnet deployment
- Set up [GitHub Webhooks](/docs/guides/github-integration) for automatic issue tracking
- Read the [Mainnet deployment checklist](#) (coming soon)
- Join the Discord to coordinate with the ChainBounty team

---

## Related

- [Quick Start](/docs/quick-start) — local development setup
- [Contract ABI](/docs/api/contract-abi) — full entry point reference
- [Prerequisites](/docs/guides/prerequisites) — Stellar CLI and tooling setup
- [Security](/docs/protocol/security) — pre-Mainnet security checklist
