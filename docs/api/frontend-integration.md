---
id: frontend-integration
title: Frontend Integration Guide
sidebar_position: 3
---

# Frontend Integration Guide

This guide explains how the ChainBounty React frontend connects to the Soroban contract and backend API. It covers wallet connection, reading contract state, building and signing transactions, and handling the full bounty lifecycle from the UI.

---

## Stack Overview

| Layer | Technology |
|---|---|
| Framework | React 18 + TypeScript |
| Build tool | Vite |
| Stellar SDK | `@stellar/stellar-sdk` |
| Wallet | Freighter via `@stellar/freighter-api` |
| Data fetching | TanStack Query v5 |
| Styling | Tailwind CSS |
| State | Zustand |

---

## Project Structure

```
src/
├── components/         # Reusable UI components
│   ├── BountyCard/
│   ├── BountyForm/
│   ├── SubmitWorkForm/
│   └── WalletButton/
├── hooks/              # Custom React hooks
│   ├── useWallet.ts
│   ├── useBounties.ts
│   ├── useContract.ts
│   └── useContributor.ts
├── lib/
│   ├── contract.ts     # Soroban contract client
│   ├── freighter.ts    # Freighter wallet helpers
│   └── api.ts          # Backend REST client
├── pages/
│   ├── Home.tsx
│   ├── BountyBoard.tsx
│   ├── BountyDetail.tsx
│   ├── PostBounty.tsx
│   └── Profile.tsx
└── store/
    └── wallet.ts       # Zustand wallet store
```

---

## Environment Variables

All variables are prefixed with `VITE_` so Vite exposes them to the browser bundle.

```bash
VITE_SOROBAN_RPC_URL=https://soroban-testnet.stellar.org
VITE_CONTRACT_ID=CXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
VITE_BACKEND_URL=http://localhost:3001
VITE_STELLAR_NETWORK=testnet
VITE_NETWORK_PASSPHRASE="Test SDF Network ; September 2015"
```

---

## Wallet Connection

ChainBounty uses [Freighter](https://freighter.app) for all transaction signing. The `useWallet` hook wraps the Freighter API.

### Install the Freighter package

```bash
npm install @stellar/freighter-api
```

### `useWallet` hook

```typescript
// src/hooks/useWallet.ts
import {
  isConnected,
  getAddress,
  signTransaction,
} from '@stellar/freighter-api';
import { create } from 'zustand';

type WalletStore = {
  address: string | null;
  connected: boolean;
  connect: () => Promise<void>;
  disconnect: () => void;
};

export const useWallet = create<WalletStore>((set) => ({
  address: null,
  connected: false,

  connect: async () => {
    const connected = await isConnected();
    if (!connected) {
      throw new Error('Freighter extension not found. Please install it.');
    }
    const { address } = await getAddress();
    set({ address, connected: true });
  },

  disconnect: () => {
    set({ address: null, connected: false });
  },
}));
```

### `WalletButton` component

```tsx
// src/components/WalletButton/index.tsx
import { useWallet } from '@/hooks/useWallet';

export function WalletButton() {
  const { address, connected, connect, disconnect } = useWallet();

  if (connected && address) {
    return (
      <button onClick={disconnect} className="btn btn-secondary">
        {address.slice(0, 4)}...{address.slice(-4)}
      </button>
    );
  }

  return (
    <button onClick={connect} className="btn btn-primary">
      Connect Wallet
    </button>
  );
}
```

---

## Contract Client

The contract client wraps `@stellar/stellar-sdk` to build, simulate, and submit Soroban transactions.

### Install the Stellar SDK

```bash
npm install @stellar/stellar-sdk
```

### Contract client setup

```typescript
// src/lib/contract.ts
import {
  Contract,
  Networks,
  TransactionBuilder,
  BASE_FEE,
  SorobanRpc,
  xdr,
} from '@stellar/stellar-sdk';

const RPC_URL = import.meta.env.VITE_SOROBAN_RPC_URL;
const CONTRACT_ID = import.meta.env.VITE_CONTRACT_ID;
const NETWORK_PASSPHRASE = import.meta.env.VITE_NETWORK_PASSPHRASE;

export const server = new SorobanRpc.Server(RPC_URL);
export const contract = new Contract(CONTRACT_ID);
```

---

## Reading Contract State

Use `server.getContractData` or invoke read-only functions via simulation.

### Fetch a bounty

```typescript
// src/lib/contract.ts
import { scValToNative, xdr } from '@stellar/stellar-sdk';

export async function getBounty(bountyId: number) {
  const account = await server.getAccount('GPLACEHOLDERXXXXXXXXXXXXXXXXXXXXXXXXXX');

  const tx = new TransactionBuilder(account, {
    fee: BASE_FEE,
    networkPassphrase: NETWORK_PASSPHRASE,
  })
    .addOperation(
      contract.call(
        'get_bounty',
        xdr.ScVal.scvU64(xdr.Uint64.fromString(bountyId.toString()))
      )
    )
    .setTimeout(30)
    .build();

  const result = await server.simulateTransaction(tx);

  if (SorobanRpc.Api.isSimulationSuccess(result)) {
    return scValToNative(result.result!.retval);
  }

  throw new Error('Failed to fetch bounty');
}
```

### `useBounties` hook (via backend API)

For list views, query the backend API instead of the contract directly — it's faster and includes GitHub metadata.

```typescript
// src/hooks/useBounties.ts
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

export function useBounties(state?: string) {
  return useQuery({
    queryKey: ['bounties', state],
    queryFn: () => api.get(`/bounties${state ? `?state=${state}` : ''}`),
    staleTime: 30_000,
  });
}

export function useBounty(id: number) {
  return useQuery({
    queryKey: ['bounty', id],
    queryFn: () => api.get(`/bounties/${id}`),
    staleTime: 30_000,
  });
}
```

---

## Writing Transactions

All state-changing operations follow the same pattern:
1. Build the transaction
2. Simulate it to get the footprint
3. Send to Freighter for signing
4. Submit to the network

### Helper: build and sign

```typescript
// src/lib/contract.ts
import { signTransaction } from '@stellar/freighter-api';
import { SorobanRpc, assembleTransaction } from '@stellar/stellar-sdk';

export async function buildAndSign(
  sourceAddress: string,
  operation: xdr.Operation
): Promise<string> {
  const account = await server.getAccount(sourceAddress);

  const tx = new TransactionBuilder(account, {
    fee: BASE_FEE,
    networkPassphrase: NETWORK_PASSPHRASE,
  })
    .addOperation(operation)
    .setTimeout(30)
    .build();

  // Simulate to get Soroban resource footprint
  const simResult = await server.simulateTransaction(tx);

  if (!SorobanRpc.Api.isSimulationSuccess(simResult)) {
    throw new Error(`Simulation failed: ${JSON.stringify(simResult)}`);
  }

  // Assemble with footprint
  const assembledTx = assembleTransaction(tx, simResult).build();

  // Sign with Freighter
  const { signedTxXdr } = await signTransaction(assembledTx.toXDR(), {
    networkPassphrase: NETWORK_PASSPHRASE,
  });

  return signedTxXdr;
}

export async function submitTransaction(signedXdr: string) {
  const tx = TransactionBuilder.fromXDR(signedXdr, NETWORK_PASSPHRASE);
  const result = await server.sendTransaction(tx);

  if (result.status === 'ERROR') {
    throw new Error(`Submit failed: ${result.errorResult}`);
  }

  return result;
}
```

---

## Posting a Bounty

```typescript
// src/lib/contract.ts
import { nativeToScVal, Address } from '@stellar/stellar-sdk';

export async function postBounty({
  poster,
  amount,
  asset,
  githubIssueUrl,
  arbitrator,
  deadline,
}: {
  poster: string;
  amount: bigint;
  asset: string;
  githubIssueUrl: string;
  arbitrator?: string;
  deadline?: bigint;
}) {
  const operation = contract.call(
    'post_bounty',
    new Address(poster).toScVal(),
    nativeToScVal(amount, { type: 'i128' }),
    new Address(asset).toScVal(),
    nativeToScVal(githubIssueUrl, { type: 'string' }),
    arbitrator
      ? new Address(arbitrator).toScVal()
      : xdr.ScVal.scvVoid(),
    deadline
      ? nativeToScVal(deadline, { type: 'u64' })
      : xdr.ScVal.scvVoid()
  );

  const signedXdr = await buildAndSign(poster, operation);
  return submitTransaction(signedXdr);
}
```

### `PostBounty` page usage

```tsx
// src/pages/PostBounty.tsx
import { postBounty } from '@/lib/contract';
import { useWallet } from '@/hooks/useWallet';

export function PostBountyPage() {
  const { address } = useWallet();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);

    await postBounty({
      poster: address!,
      amount: BigInt(Number(form.get('amount')) * 1e7), // XLM to stroops
      asset: 'native',
      githubIssueUrl: form.get('issue_url') as string,
    });

    alert('Bounty posted!');
  }

  return (
    <form onSubmit={handleSubmit}>
      <input name="issue_url" placeholder="GitHub issue URL" required />
      <input name="amount" type="number" placeholder="Amount in XLM" required />
      <button type="submit">Post Bounty</button>
    </form>
  );
}
```

---

## Claiming, Submitting, and Approving

The same `buildAndSign` + `submitTransaction` pattern applies to all contract calls.

```typescript
// Claim a bounty
export async function claimBounty(claimant: string, bountyId: number) {
  const op = contract.call(
    'claim_bounty',
    new Address(claimant).toScVal(),
    nativeToScVal(bountyId, { type: 'u64' })
  );
  const signed = await buildAndSign(claimant, op);
  return submitTransaction(signed);
}

// Submit work
export async function submitWork(
  claimant: string,
  bountyId: number,
  submissionUrl: string
) {
  const op = contract.call(
    'submit_work',
    new Address(claimant).toScVal(),
    nativeToScVal(bountyId, { type: 'u64' }),
    nativeToScVal(submissionUrl, { type: 'string' })
  );
  const signed = await buildAndSign(claimant, op);
  return submitTransaction(signed);
}

// Approve submission
export async function approveSubmission(poster: string, bountyId: number) {
  const op = contract.call(
    'approve_submission',
    new Address(poster).toScVal(),
    nativeToScVal(bountyId, { type: 'u64' })
  );
  const signed = await buildAndSign(poster, op);
  return submitTransaction(signed);
}
```

---

## Backend API Client

```typescript
// src/lib/api.ts
const BASE_URL = import.meta.env.VITE_BACKEND_URL;

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error ?? 'API request failed');
  }

  return res.json();
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body: unknown) =>
    request<T>(path, { method: 'POST', body: JSON.stringify(body) }),
};
```

---

## Error Handling

Wrap all contract calls in try/catch and surface errors to the user.

```tsx
async function handleClaim() {
  try {
    await claimBounty(address!, bountyId);
    toast.success('Bounty claimed!');
  } catch (err) {
    if (err instanceof Error) {
      if (err.message.includes('AlreadyClaimed')) {
        toast.error('This bounty has already been claimed.');
      } else if (err.message.includes('User declined')) {
        toast.error('Transaction cancelled.');
      } else {
        toast.error(`Error: ${err.message}`);
      }
    }
  }
}
```

---

## Related

- [Contract ABI](/docs/api/contract-abi) — full entry point reference
- [Backend API](/docs/api/backend-api) — REST endpoints
- [Freighter Wallet Setup](/docs/guides/freighter-wallet) — wallet installation and configuration
- [Quick Start](/docs/quick-start) — running the full stack locally
