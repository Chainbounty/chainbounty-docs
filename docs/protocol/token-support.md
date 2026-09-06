---
id: token-support
title: Token Support and Multi-Asset Bounties
sidebar_position: 4
---

# Token Support and Multi-Asset Bounties

ChainBounty supports bounties in **any Stellar-issued asset**, not just XLM. This includes stablecoins (USDC), yield-bearing tokens (yXLM), and custom DAO tokens. This guide explains how multi-asset bounties work and how to use them.

---

## Why Multi-Asset Support?

Different projects have different payment preferences:

| Asset Type | Use Case |
|---|---|
| **XLM** | Default, fast, widely available |
| **USDC** | Stable value, no crypto volatility |
| **yXLM** | Earn yield while escrowed |
| **DAO tokens** | Align contributor incentives with protocol |
| **Custom tokens** | Project-specific rewards |

Multi-asset support makes ChainBounty flexible for any project or DAO.

---

## Supported Assets

ChainBounty supports:

- **Native XLM** — Stellar's native asset
- **Any Stellar Asset (SEP-41)** — issued via the Stellar Asset Contract standard
- **Custom Soroban tokens** — any token deployed as a Soroban contract

### Popular assets on Stellar

| Asset | Issuer | Description |
|---|---|---|
| **XLM** | Native | Stellar's native cryptocurrency |
| **USDC** | Circle | USD-pegged stablecoin |
| **yXLM** | Ultra Stellar | Yield-bearing XLM |
| **AQUA** | Aquarius | AMM governance token |
| **Your Token** | Your DAO | Custom project token |

---

## How Multi-Asset Bounties Work

The contract escrow mechanism works the same regardless of asset:

1. **Maintainer posts bounty** — specifies amount and asset contract address
2. **Funds are locked** — transferred from maintainer to contract
3. **Contributor completes work** — submits PR
4. **Maintainer approves** — contract transfers asset to contributor

The **2.5% protocol fee** is deducted in the same asset as the bounty.

---

## Posting a Bounty in a Non-XLM Asset

### Step 1 — Get the asset contract address

Every Stellar asset has a unique **contract address** (starts with `C`).

#### Find the contract address

**Option A — Stellar Expert**

1. Go to [stellar.expert](https://stellar.expert)
2. Search for the asset (e.g., "USDC")
3. Click the asset, then go to **Contract** tab
4. Copy the contract address

**Option B — Stellar CLI**

```bash
stellar contract id asset \
  --asset USDC:GBDKXXX... \
  --network mainnet
```

Replace `GBDKXXX...` with the issuer's public key.

**Option C — Native XLM**

For native XLM, use the special identifier:

```
Native XLM contract address:
CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC
```

---

### Step 2 — Post the bounty with the asset address

In the ChainBounty frontend:

1. Click **Post Bounty**
2. Fill in the GitHub issue URL
3. Enter the amount (e.g., `100`)
4. **Asset field:** Paste the contract address (or select from dropdown)
5. Sign the transaction

**Example:**

```
GitHub Issue: https://github.com/my-dao/my-repo/issues/42
Amount: 100
Asset: CXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX (USDC)
```

---

### Step 3 — Verify escrow

After posting, verify the funds were transferred:

```bash
stellar contract invoke \
  --id $CONTRACT_ID \
  --network mainnet \
  -- get_bounty \
  --bounty_id 1
```

The `asset` field shows the contract address of the escrowed token.

---

## Claiming and Receiving Multi-Asset Bounties

Contributors don't need to do anything special. The claim and submission process is identical for all assets.

### Claiming

```typescript
await claimBounty(contributorAddress, bountyId);
```

No asset parameter needed — the contract knows which asset is escrowed.

### Receiving payment

When the maintainer approves, the contributor receives the bounty in the posted asset:

- **USDC bounty** → contributor receives USDC
- **yXLM bounty** → contributor receives yXLM
- **DAO token bounty** → contributor receives DAO tokens

---

## Trustlines

To receive a non-XLM asset on Stellar, the recipient must have a **trustline** to that asset.

### What is a trustline?

A trustline is permission to hold a specific asset. It's Stellar's way of preventing spam tokens from being sent to your account without consent.

### Establishing a trustline

**Via Freighter:**

1. Open Freighter
2. Go to **Manage Assets**
3. Search for the asset (e.g., USDC)
4. Click **Add Asset**
5. Sign the transaction

**Via CLI:**

```bash
stellar contract invoke \
  --id $ASSET_CONTRACT_ID \
  --source contributor \
  --network mainnet \
  -- approve \
  --from $CONTRIBUTOR_ADDRESS \
  --spender $CONTRACT_ID \
  --amount 999999999999
```

### What happens if no trustline?

If the contributor doesn't have a trustline when the maintainer approves:

- **Contract behavior:** The transaction will fail with an error
- **Resolution:** Contributor must establish a trustline and ask the maintainer to retry approval

:::tip
Contributors should establish trustlines for common assets (USDC, yXLM) proactively to avoid delays.
:::

---

## Treasury and Fees

Protocol fees are collected **in the same asset as the bounty**.

### Example: USDC bounty

1. Maintainer posts **100 USDC** bounty
2. 100 USDC locked in contract
3. Contributor completes work
4. Maintainer approves
5. Contributor receives **97.5 USDC**
6. Treasury receives **2.5 USDC**

The treasury holds multiple assets. When governance launches, token holders will vote on how to use or convert treasury assets.

---

## Advanced: Custom DAO Tokens

DAOs can pay contributors in their native governance token instead of XLM or stablecoins.

### Benefits

- **Align incentives** — contributors become stakeholders
- **Treasury efficiency** — pay from existing token supply
- **Community building** — onboard contributors as token holders

### Example: Paying in $DAO token

```rust
// Maintainer posts bounty
post_bounty(
    poster,
    100_000_000, // 100 $DAO tokens
    DAO_TOKEN_CONTRACT_ADDRESS,
    "https://github.com/dao/repo/issues/1",
    None,
    None
)
```

Contributor receives $DAO tokens on approval, giving them voting power in the DAO.

---

## Asset Conversion (Future)

In a future version, contributors may be able to specify a **preferred payout asset** different from the bounty asset.

### How it would work

1. Maintainer posts bounty in **$DAO token**
2. Contributor claims and specifies **"pay me in USDC"**
3. On approval, contract auto-swaps $DAO → USDC via a DEX
4. Contributor receives USDC

This requires integration with a Stellar DEX like [Aquarius](https://aqua.network) or [StellarX](https://stellarx.com).

---

## Multi-Asset Bounty Board Filters

The frontend allows filtering bounties by asset:

```
Filter by asset:
- XLM (native)
- USDC (stablecoin)
- yXLM (yield-bearing)
- Custom (select from list)
```

Contributors can browse only USDC bounties or XLM bounties based on preference.

---

## Asset Whitelisting (Optional)

To prevent spam or scam tokens, maintainers can configure the frontend to only show bounties in **whitelisted assets**.

### Example whitelist

```typescript
const WHITELISTED_ASSETS = [
  'CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC', // XLM
  'CXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX', // USDC
  'CXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX', // yXLM
  'CXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX', // DAO token
];
```

Bounties in non-whitelisted assets are hidden by default but can be shown via an "Advanced" toggle.

---

## Testing Multi-Asset Bounties on Testnet

### Step 1 — Issue a test token

```bash
stellar contract deploy \
  --wasm token_contract.wasm \
  --source deployer \
  --network testnet
```

This deploys a standard Soroban token contract.

### Step 2 — Mint tokens

```bash
stellar contract invoke \
  --id $TOKEN_CONTRACT_ID \
  --source deployer \
  --network testnet \
  -- mint \
  --to $MAINTAINER_ADDRESS \
  --amount 1000000000
```

### Step 3 — Post a bounty in the test token

Use the token contract ID as the asset when posting.

### Step 4 — Claim and complete

Contributor claims, submits work, maintainer approves. Verify the contributor receives the test token.

---

## Asset Discovery

Contributors want to know what each asset is worth. The frontend can display:

- **Asset symbol** — e.g., "USDC"
- **Issuer** — e.g., "Circle"
- **Current price** — fetched from a Stellar DEX or price oracle
- **Equivalent in USD** — calculate `amount × price`

### Example display

```
Bounty: 100 USDC
Equivalent: ~$100 USD

Bounty: 1,000 $DAO
Equivalent: ~$250 USD (based on current DEX price)
```

---

## Multi-Asset API Endpoints

### Get bounties by asset

```bash
curl https://api.chainbounty.dev/bounties?asset=CXXXXXXX
```

Returns all bounties posted in that asset.

### Get asset metadata

```bash
curl https://api.chainbounty.dev/assets/CXXXXXXX
```

Returns:

```json
{
  "contract_id": "CXXXXXXX",
  "symbol": "USDC",
  "name": "USD Coin",
  "issuer": "Circle",
  "decimals": 7,
  "price_usd": 1.00,
  "total_volume": "12500000000"
}
```

---

## Security Considerations

### Rugpull tokens

Malicious token issuers can freeze or revoke tokens. ChainBounty cannot prevent this — it's a risk inherent to custom tokens.

**Mitigation:**

- Use only reputable tokens (USDC, yXLM, established DAO tokens)
- Check the issuer's reputation before accepting bounties in unknown tokens
- Prefer XLM for maximum trust minimization

### Price volatility

Token prices can change between bounty posting and approval. A **100 $DAO** bounty worth $250 today might be worth $50 tomorrow.

**Mitigation:**

- Use stablecoins (USDC) for price stability
- Set clear expectations with contributors about volatility risk
- Consider milestone payments for large, long-term bounties

---

## Supported Token Standards

ChainBounty supports:

- **Stellar Asset Contract (SEP-41)** — standard for wrapping classic Stellar assets
- **Soroban Token Interface (SEP-TBD)** — standard for Soroban-native tokens

Any token implementing these interfaces works with ChainBounty out of the box.

---

## Bounty Amount Denominations

Token amounts are stored as **integers** (no decimals on-chain). The frontend handles decimal conversion.

### Example: USDC

USDC has **7 decimals** on Stellar.

- **UI:** User enters `100 USDC`
- **Contract:** Stores `1000000000` (100 × 10^7)
- **Payout:** Sends `975000000` (97.5 USDC after 2.5% fee)

Make sure your frontend correctly handles the token's `decimals` field when posting bounties.

---

## Future: Cross-Chain Assets

ChainBounty may eventually support:

- **Wrapped assets** — BTC, ETH, SOL wrapped on Stellar
- **Cross-chain bounties** — post on Stellar, pay on Ethereum
- **Bridge integration** — auto-bridge assets between chains

This requires partnerships with cross-chain bridge providers.

---

## Related

- [Fee Model](/docs/protocol/fee-model) — how fees work for multi-asset bounties
- [Contract ABI](/docs/api/contract-abi) — asset parameter in `post_bounty`
- [Prerequisites](/docs/guides/prerequisites) — Stellar asset basics
- [Testnet Deployment](/docs/guides/testnet-deployment) — testing with custom tokens
