---
id: freighter-wallet
title: Freighter Wallet Setup
sidebar_position: 2
---

# Freighter Wallet Setup

Freighter is the official Stellar browser wallet extension. ChainBounty uses Freighter for all on-chain actions — posting bounties, claiming, submitting work, and approving payments. This guide walks you through installation, account setup, and connecting to ChainBounty.

:::info Supported Browsers
Freighter is available for **Chrome**, **Firefox**, **Brave**, and **Edge**.
:::

---

## Step 1 — Install Freighter

1. Visit [freighter.app](https://freighter.app) or search "Freighter" in your browser's extension store
2. Click **Add to Browser** and confirm the installation
3. A Freighter icon will appear in your browser toolbar

---

## Step 2 — Create or Import a Wallet

### Create a new wallet

1. Click the Freighter icon in your toolbar
2. Click **Create New Wallet**
3. Set a strong password — this encrypts your keys locally
4. Freighter will display a **12-word recovery phrase**

:::danger Back up your recovery phrase
Write it down and store it somewhere safe offline. If you lose it, your funds cannot be recovered. Never share it with anyone.
:::

5. Confirm your recovery phrase when prompted
6. Your wallet is ready

### Import an existing wallet

If you already have a Stellar account:

1. Click the Freighter icon
2. Click **Import Wallet**
3. Enter your 12 or 24-word recovery phrase
4. Set a password

---

## Step 3 — Switch to Testnet

ChainBounty runs on Stellar Testnet for development. You must switch Freighter to Testnet before connecting.

1. Open Freighter
2. Click the **network selector** at the top (it will say "Mainnet" by default)
3. Select **Testnet**

The header will turn yellow indicating you are on Testnet.

:::warning
Always verify you are on the correct network before signing any transaction. Testnet transactions use test funds only and have no real value.
:::

---

## Step 4 — Fund Your Testnet Account

Testnet accounts start with zero balance. Use Stellar Friendbot to get free test XLM.

### Option A — Friendbot URL

Replace `YOUR_PUBLIC_KEY` with your Stellar address (starts with `G`):

```
https://friendbot.stellar.org?addr=YOUR_PUBLIC_KEY
```

Open that URL in your browser. You will receive **10,000 test XLM**.

### Option B — Stellar Laboratory

1. Go to [laboratory.stellar.org](https://laboratory.stellar.org)
2. Navigate to **Account Creator**
3. Enter your public key and click **Get Test Network Lumens**

### Verify your balance

Open Freighter — your balance should now show **10,000 XLM** on Testnet.

---

## Step 5 — Connect Freighter to ChainBounty

1. Open the ChainBounty app at `http://localhost:5173` (or the deployed URL)
2. Click **Connect Wallet** in the top right
3. Freighter will pop up and ask for permission — click **Connect**
4. Your wallet address will appear in the navbar

ChainBounty stores only your public key. Your private key never leaves Freighter.

---

## Signing Transactions

Every on-chain action in ChainBounty triggers a Freighter signing prompt. Here is what each prompt shows:

| Field | What it means |
|---|---|
| **Operation** | The contract function being called (e.g. `post_bounty`) |
| **Fee** | The network fee in XLM (usually less than 0.01 XLM) |
| **Network** | Should always match your current network (Testnet or Mainnet) |
| **Resource fee** | Soroban computation cost — estimated by simulation |

Always verify the **network** and **operation** before clicking **Approve**.

---

## Managing Multiple Accounts

Freighter supports multiple accounts. To add another:

1. Open Freighter
2. Click your account name at the top
3. Click **Add Account**
4. Choose **Generate** (new) or **Import** (existing)

You can switch between accounts from the same dropdown.

---

## Connecting Programmatically

If you are building on top of ChainBounty, here is how to interact with Freighter in code:

### Check if Freighter is installed

```typescript
import { isConnected } from '@stellar/freighter-api';

const connected = await isConnected();
if (!connected) {
  alert('Please install the Freighter extension from freighter.app');
}
```

### Request the user's address

```typescript
import { getAddress } from '@stellar/freighter-api';

const { address } = await getAddress();
console.log('Connected address:', address);
```

### Sign a transaction

```typescript
import { signTransaction } from '@stellar/freighter-api';

const { signedTxXdr } = await signTransaction(transactionXdr, {
  networkPassphrase: 'Test SDF Network ; September 2015',
});
```

### Check the active network

```typescript
import { getNetwork } from '@stellar/freighter-api';

const { network, networkPassphrase } = await getNetwork();
console.log('Current network:', network); // e.g. "TESTNET"
```

---

## Troubleshooting

| Problem | Fix |
|---|---|
| Freighter popup does not appear | Check that the extension is enabled and not blocked by a popup blocker |
| "Freighter not found" error | Make sure the extension is installed and the page is not in an iframe |
| Wrong network error | Open Freighter and switch to the correct network (Testnet or Mainnet) |
| Transaction rejected | You clicked Cancel in Freighter — retry the action |
| Insufficient balance | Fund your account via Friendbot (Testnet) or add XLM (Mainnet) |
| Freighter shows blank screen | Try disabling other wallet extensions that may conflict |

---

## Security Best Practices

- **Never share your recovery phrase** — ChainBounty, Discord helpers, or any support team will never ask for it
- **Lock Freighter** when not in use (Settings → Lock Wallet)
- **Verify the URL** before connecting — only connect to `chainbounty.dev` or your local `localhost`
- **Use a separate account** for testing on Testnet vs real funds on Mainnet
- **Review every transaction** in the Freighter popup before signing

---

## Related

- [Quick Start](/docs/quick-start) — full local setup guide
- [Prerequisites](/docs/guides/prerequisites) — Stellar ecosystem overview
- [Contributor Onboarding](/docs/guides/contributor-onboarding) — next steps after wallet setup
