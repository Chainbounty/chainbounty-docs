---
id: backend-api
title: Backend API Reference
sidebar_position: 2
---

# Backend API Reference

The ChainBounty backend is a Node.js/Express service that indexes on-chain bounty data, syncs GitHub issue state, and exposes a REST API consumed by the frontend. It has **no custody over funds** — it is a read/index layer only.

:::info Base URL
- **Local:** `http://localhost:3001`
- **Testnet:** `https://api-testnet.chainbounty.dev`
- **Mainnet:** `https://api.chainbounty.dev`
:::

---

## Authentication

Most endpoints are public and read-only. Endpoints that write data (webhook receiver, admin routes) require authentication.

### GitHub Webhook Signature

The `/webhooks/github` endpoint validates the `X-Hub-Signature-256` header using your `GITHUB_WEBHOOK_SECRET`.

### Admin API Key

Admin endpoints require an `Authorization: Bearer <API_KEY>` header. The key is set via `ADMIN_API_KEY` in your `.env` file.

---

## Health

### `GET /health`

Returns the service health status.

**Request**

```http
GET /health
```

**Response `200`**

```json
{
  "status": "ok",
  "network": "testnet",
  "contract": "CXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  "db": "connected",
  "uptime": 3600
}
```

---

## Bounties

### `GET /bounties`

Returns a paginated list of all bounties, newest first.

**Query Parameters**

| Parameter | Type | Default | Description |
|---|---|---|---|
| `page` | `number` | `1` | Page number |
| `limit` | `number` | `20` | Results per page (max 100) |
| `state` | `string` | — | Filter by state: `open`, `claimed`, `under_review`, `approved`, `disputed`, `cancelled` |
| `asset` | `string` | — | Filter by asset contract address |
| `poster` | `string` | — | Filter by poster Stellar address |

**Request**

```http
GET /bounties?state=open&limit=10&page=1
```

**Response `200`**

```json
{
  "data": [
    {
      "id": 42,
      "poster": "GABCDEF...",
      "amount": "1000000000",
      "asset": "native",
      "asset_symbol": "XLM",
      "github_issue_url": "https://github.com/org/repo/issues/42",
      "github_issue": {
        "title": "Fix null pointer in payment handler",
        "number": 42,
        "repo": "org/repo",
        "labels": ["bug", "good first issue"],
        "open": true
      },
      "claimant": null,
      "arbitrator": null,
      "submission_url": null,
      "state": "open",
      "created_at": "2026-08-01T10:00:00Z",
      "deadline": null
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 87,
    "total_pages": 9
  }
}
```

---

### `GET /bounties/:id`

Returns a single bounty by its on-chain ID.

**Request**

```http
GET /bounties/42
```

**Response `200`**

```json
{
  "id": 42,
  "poster": "GABCDEF...",
  "amount": "1000000000",
  "asset": "native",
  "asset_symbol": "XLM",
  "github_issue_url": "https://github.com/org/repo/issues/42",
  "github_issue": {
    "title": "Fix null pointer in payment handler",
    "number": 42,
    "repo": "org/repo",
    "labels": ["bug", "good first issue"],
    "open": true,
    "html_url": "https://github.com/org/repo/issues/42"
  },
  "claimant": "GXYZ...",
  "arbitrator": null,
  "submission_url": "https://github.com/org/repo/pull/55",
  "state": "under_review",
  "created_at": "2026-08-01T10:00:00Z",
  "deadline": null,
  "history": [
    { "state": "open",         "timestamp": "2026-08-01T10:00:00Z" },
    { "state": "claimed",      "timestamp": "2026-08-02T14:30:00Z" },
    { "state": "under_review", "timestamp": "2026-08-05T09:15:00Z" }
  ]
}
```

**Response `404`**

```json
{
  "error": "Bounty not found",
  "code": "BOUNTY_NOT_FOUND"
}
```

---

### `GET /bounties/issue`

Look up a bounty by GitHub issue URL.

**Query Parameters**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `url` | `string` | Yes | Full GitHub issue URL |

**Request**

```http
GET /bounties/issue?url=https://github.com/org/repo/issues/42
```

**Response `200`** — same shape as `GET /bounties/:id`

**Response `404`**

```json
{
  "error": "No bounty found for this issue",
  "code": "BOUNTY_NOT_FOUND"
}
```

---

## Contributors

### `GET /contributors/:address`

Returns a contributor's profile and reputation score.

**Request**

```http
GET /contributors/GXYZ...
```

**Response `200`**

```json
{
  "address": "GXYZ...",
  "reputation_score": 847,
  "rank": "silver",
  "stats": {
    "total_claimed": 12,
    "total_approved": 9,
    "total_rejected": 1,
    "total_disputed": 2,
    "disputes_won": 1,
    "total_earned_xlm": "9500000000"
  },
  "recent_activity": [
    {
      "bounty_id": 42,
      "github_issue_url": "https://github.com/org/repo/issues/42",
      "state": "approved",
      "amount": "1000000000",
      "asset_symbol": "XLM",
      "approved_at": "2026-08-06T12:00:00Z"
    }
  ]
}
```

**Response `404`**

```json
{
  "error": "Contributor not found",
  "code": "CONTRIBUTOR_NOT_FOUND"
}
```

---

### `GET /contributors`

Returns a leaderboard of top contributors by reputation score.

**Query Parameters**

| Parameter | Type | Default | Description |
|---|---|---|---|
| `limit` | `number` | `20` | Number of results (max 100) |
| `sort` | `string` | `score` | Sort by: `score`, `earned`, `approved` |

**Request**

```http
GET /contributors?limit=10&sort=score
```

**Response `200`**

```json
{
  "data": [
    {
      "address": "GXYZ...",
      "reputation_score": 1240,
      "rank": "gold",
      "total_approved": 18,
      "total_earned_xlm": "24000000000"
    }
  ],
  "meta": {
    "total": 342
  }
}
```

---

## GitHub Issues

### `GET /issues/search`

Search GitHub issues that are eligible for a bounty (open, no existing bounty).

**Query Parameters**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `q` | `string` | Yes | Search query (passed to GitHub search API) |
| `repo` | `string` | No | Filter to a specific repo e.g. `org/repo` |
| `label` | `string` | No | Filter by label e.g. `good first issue` |

**Request**

```http
GET /issues/search?q=payment+bug&repo=org/repo
```

**Response `200`**

```json
{
  "data": [
    {
      "title": "Fix null pointer in payment handler",
      "number": 42,
      "html_url": "https://github.com/org/repo/issues/42",
      "repo": "org/repo",
      "labels": ["bug"],
      "has_bounty": false,
      "created_at": "2026-07-28T08:00:00Z"
    }
  ]
}
```

---

## Webhooks

### `POST /webhooks/github`

Receives GitHub webhook events. Handles `issues` and `pull_request` event types.

This endpoint is called by GitHub automatically — you do not call it directly. See the [GitHub Integration Guide](/docs/guides/github-integration) for setup.

**Headers**

```http
Content-Type: application/json
X-GitHub-Event: issues
X-Hub-Signature-256: sha256=<hmac>
```

**Handled events**

| GitHub Event | Action | Effect |
|---|---|---|
| `issues` | `closed` | Marks linked bounty issue as closed in backend |
| `pull_request` | `opened` | Associates PR with bounty if branch references issue |
| `pull_request` | `closed` + merged | Flags submission as merged for maintainer review |

**Response `200`**

```json
{ "received": true }
```

**Response `401`**

```json
{
  "error": "Invalid webhook signature",
  "code": "UNAUTHORIZED"
}
```

---

## Stats

### `GET /stats`

Returns protocol-wide statistics.

**Request**

```http
GET /stats
```

**Response `200`**

```json
{
  "total_bounties": 312,
  "open_bounties": 87,
  "total_paid_out_xlm": "4250000000000",
  "total_contributors": 342,
  "total_disputes": 14,
  "disputes_resolved": 11
}
```

---

## Error Codes

All errors follow this shape:

```json
{
  "error": "Human-readable message",
  "code": "MACHINE_READABLE_CODE"
}
```

| Code | HTTP Status | Description |
|---|---|---|
| `BOUNTY_NOT_FOUND` | 404 | Bounty ID does not exist |
| `CONTRIBUTOR_NOT_FOUND` | 404 | Address has no activity |
| `INVALID_PARAMS` | 400 | Missing or malformed query parameters |
| `UNAUTHORIZED` | 401 | Invalid or missing API key / webhook signature |
| `RATE_LIMITED` | 429 | Too many requests — back off and retry |
| `INTERNAL_ERROR` | 500 | Unexpected server error |

---

## Rate Limits

| Tier | Limit |
|---|---|
| Public endpoints | 60 requests / minute |
| Webhook endpoint | Unlimited (GitHub IPs only) |
| Admin endpoints | 300 requests / minute |

---

## Related

- [Contract ABI](/docs/api/contract-abi) — on-chain entry points
- [Frontend Integration](/docs/api/frontend-integration) — how the frontend consumes this API
- [GitHub Integration Guide](/docs/guides/github-integration) — webhook setup
