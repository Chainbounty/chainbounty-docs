---
id: quick-start
title: Quick Start
sidebar_position: 3
---

# Quick Start

Get ChainBounty running locally in under 15 minutes. This guide covers cloning the repos, installing dependencies, configuring environment variables, and spinning up all three services.

:::info Prerequisites
Before you begin, make sure you have the following installed. If anything is missing, see the [Stellar & Soroban Prerequisites guide](/docs/guides/prerequisites).

- **Node.js** v20 or higher
- **Rust** + **Cargo** (stable toolchain)
- **Stellar CLI** (`stellar`) v21 or higher
- **Docker** (for local PostgreSQL)
- **Freighter** browser extension installed and set to Testnet
:::

---

## Step 1 — Clone the Repositories

ChainBounty is split across three repos. Clone all of them into a common parent folder.

```bash
mkdir chainbounty && cd chainbounty

git clone https://github.com/chainbounty/chainbounty-contract
git clone https://github.com/chainbounty/chainbounty-backend
git clone https://github.com/chainbounty/chainbounty-frontend
```

Your folder structure should look like this:

```
chainbounty/
├── chainbounty-contract/
├── chainbounty-backend/
└── chainbounty-frontend/
```

---

## Step 2 — Set Up the Soroban Contract

### Build the contract

```bash
cd chainbounty-contract
cargo build --target wasm32-unknown-unknown --release
```

### Configure the Stellar CLI for Testnet

```bash
stellar network add testnet \
  --rpc-url https://soroban-testnet.stellar.org \
  --network-passphrase "Test SDF Network ; September 2015"
```

### Generate a deployer keypair and fund it

```bash
stellar keys generate deployer --network testnet
stellar keys fund deployer --network testnet
```

### Deploy the contract

```bash
stellar contract deploy \
  --wasm target/wasm32-unknown-unknown/release/chainbounty_contract.wasm \
  --source deployer \
  --network testnet
```

The command prints a **Contract ID** — copy it, you'll need it in the next steps.

```
# Example output
Contract deployed successfully with ID: CXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

---

## Step 3 — Set Up the Backend

```bash
cd ../chainbounty-backend
npm install
```

### Configure environment variables

Copy the example env file and fill in your values:

```bash
cp .env.example .env
```

Open `.env` and set:

```bash
# Stellar
STELLAR_NETWORK=testnet
SOROBAN_RPC_URL=https://soroban-testnet.stellar.org
CONTRACT_ID=CXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX   # from Step 2

# Database
DATABASE_URL=postgresql://chainbounty:password@localhost:5432/chainbounty

# GitHub
GITHUB_WEBHOOK_SECRET=your_webhook_secret
GITHUB_APP_ID=your_github_app_id
GITHUB_PRIVATE_KEY_PATH=./github-private-key.pem

# Server
PORT=3001
```

### Start PostgreSQL with Docker

```bash
docker run -d \
  --name chainbounty-db \
  -e POSTGRES_USER=chainbounty \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=chainbounty \
  -p 5432:5432 \
  postgres:16
```

### Run database migrations

```bash
npm run migrate
```

### Start the backend

```bash
npm run dev
```

The backend starts at `http://localhost:3001`. You should see:

```
[ChainBounty] Backend running on port 3001
[ChainBounty] Connected to PostgreSQL
[ChainBounty] Soroban RPC connected — Testnet
```

---

## Step 4 — Set Up the Frontend

```bash
cd ../chainbounty-frontend
npm install
```

### Configure environment variables

```bash
cp .env.example .env.local
```

Open `.env.local` and set:

```bash
VITE_SOROBAN_RPC_URL=https://soroban-testnet.stellar.org
VITE_CONTRACT_ID=CXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
VITE_BACKEND_URL=http://localhost:3001
VITE_STELLAR_NETWORK=testnet
VITE_NETWORK_PASSPHRASE="Test SDF Network ; September 2015"
```

### Start the frontend

```bash
npm run dev
```

The frontend starts at `http://localhost:5173`.

---

## Step 5 — Connect Freighter Wallet

1. Open the Freighter extension in your browser
2. Switch to **Testnet** (Settings → Network → Testnet)
3. Copy your Testnet public key
4. Fund it using the [Stellar Friendbot](https://friendbot.stellar.org): 
   ```
   https://friendbot.stellar.org?addr=YOUR_PUBLIC_KEY
   ```
5. Visit `http://localhost:5173` and click **Connect Wallet**

You are now ready to post and claim bounties on Testnet.

---

## Step 6 — Post Your First Bounty

1. Go to `http://localhost:5173`
2. Click **Post Bounty**
3. Paste a GitHub issue URL (e.g. `https://github.com/your-org/your-repo/issues/1`)
4. Set an amount in XLM
5. Optionally set a deadline and an arbitrator address
6. Click **Post** — Freighter will prompt you to sign the transaction
7. Once confirmed, the bounty appears on the board

---

## Verify Everything is Working

Run a quick health check on the backend:

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

## Common Issues

| Problem | Fix |
|---|---|
| `stellar: command not found` | Install Stellar CLI — see [Prerequisites](/docs/guides/prerequisites) |
| Contract deploy fails | Make sure your deployer account is funded via Friendbot |
| Freighter not connecting | Ensure Freighter is set to Testnet, not Mainnet |
| Database connection refused | Make sure the Docker container is running: `docker ps` |
| `VITE_CONTRACT_ID` not set | Copy the contract ID from the deploy output in Step 2 |

---

## Next Steps

- Read the [Bounty Lifecycle](/docs/bounty-lifecycle) to understand all state transitions
- Set up [GitHub Webhooks](/docs/guides/github-integration) to enable automatic issue tracking
- Review the [Contract ABI](/docs/api/contract-abi) if you want to interact with the contract directly
