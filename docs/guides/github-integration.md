---
id: github-integration
title: GitHub Integration and Webhook Setup
sidebar_position: 5
---

# GitHub Integration and Webhook Setup

ChainBounty integrates with GitHub to automatically sync issue status, track pull requests, and assign issues when bounties are claimed. This guide explains how to set up GitHub webhooks and configure the integration.

---

## Why GitHub Integration?

Without integration, ChainBounty and GitHub are two separate systems. With webhooks enabled:

- ✅ **Auto-assign issues** — when a contributor claims a bounty, the GitHub issue is assigned to them
- ✅ **Track PR status** — when a PR is opened or merged, ChainBounty reflects the state
- ✅ **Real-time notifications** — maintainers and contributors are notified of state changes
- ✅ **Sync metadata** — issue titles, labels, and descriptions are indexed by the backend

---

## Architecture

```
┌─────────────────┐
│     GitHub      │
│                 │
│  Issues / PRs   │
└────────┬────────┘
         │
         │  Webhook events (issues, pull_request)
         │
         ▼
┌────────────────────────────────────┐
│   ChainBounty Backend              │
│   POST /webhooks/github            │
│                                    │
│  • Validates HMAC signature        │
│  • Parses event payload            │
│  • Updates bounty metadata         │
│  • Stores in PostgreSQL            │
└────────────────────────────────────┘
```

---

## Prerequisites

- ✅ **GitHub repository** with issues enabled
- ✅ **Admin access** to the repo (needed to configure webhooks)
- ✅ **ChainBounty backend running** and publicly accessible (or use ngrok for local testing)
- ✅ **Webhook secret** — a random string for HMAC validation

---

## Step 1 — Generate a Webhook Secret

Generate a secure random string to sign webhook payloads:

```bash
openssl rand -hex 32
```

Copy the output (e.g. `a1b2c3d4e5f6...`) — you'll use this in both GitHub and the backend.

---

## Step 2 — Configure the Backend

Update your backend `.env` file:

```bash
GITHUB_WEBHOOK_SECRET=a1b2c3d4e5f6...
```

Restart the backend:

```bash
npm run dev
```

Verify the webhook endpoint is accessible:

```bash
curl -X POST http://localhost:3001/webhooks/github
```

You should get a `401 Unauthorized` response (expected — no valid signature).

---

## Step 3 — Expose Your Backend (Local Development)

If you're running the backend locally, GitHub cannot reach `localhost`. Use **ngrok** to create a public tunnel.

### Install ngrok

Download from [ngrok.com](https://ngrok.com) or use a package manager:

```bash
# macOS
brew install ngrok

# Windows
choco install ngrok
```

### Start ngrok

```bash
ngrok http 3001
```

ngrok prints a public URL:

```
Forwarding  https://abc123.ngrok.io -> http://localhost:3001
```

Copy this URL — you'll use it in GitHub.

---

## Step 4 — Add Webhook in GitHub

### Go to your repo settings

1. Navigate to your GitHub repo (e.g. `https://github.com/your-org/your-repo`)
2. Click **Settings** (must be admin)
3. Click **Webhooks** in the left sidebar
4. Click **Add webhook**

### Configure the webhook

| Field | Value |
|---|---|
| **Payload URL** | `https://abc123.ngrok.io/webhooks/github` (or your production URL) |
| **Content type** | `application/json` |
| **Secret** | Paste the webhook secret from Step 1 |
| **Which events?** | Select individual events |

### Select events

Check the following events:

- ✅ **Issues** — opened, closed, assigned, labeled
- ✅ **Pull requests** — opened, closed, reopened, merged
- ❌ Uncheck everything else (Push, Releases, etc.)

### Save

Click **Add webhook**.

GitHub sends a test `ping` event. If successful, you'll see a green checkmark next to the webhook.

---

## Step 5 — Test the Integration

### Test 1: Issue opened

1. Create a new issue in your GitHub repo
2. Check the ChainBounty backend logs — you should see:
   ```
   [Webhook] Received event: issues, action: opened
   [Webhook] Issue #42 indexed: "Fix null pointer in payment handler"
   ```

### Test 2: Bounty claimed → Issue assigned

1. Post a bounty on ChainBounty for the issue
2. Claim the bounty with a contributor account
3. Check GitHub — the issue should be **assigned** to the contributor's GitHub account

:::info
Assignment only works if the contributor's Stellar address is linked to their GitHub account. If not linked, assignment is skipped.
:::

### Test 3: Pull request opened

1. Contributor opens a pull request referencing the issue (`Closes #42`)
2. Backend receives the `pull_request` webhook
3. ChainBounty links the PR to the bounty
4. Bounty page shows the PR URL

### Test 4: Pull request merged

1. Maintainer merges the PR on GitHub
2. Backend receives `pull_request` event with `action: closed`, `merged: true`
3. ChainBounty flags the submission as merged (visual indicator for maintainer)

---

## Step 6 — Verify Webhook Deliveries

GitHub logs every webhook delivery. Check if deliveries are successful:

1. Go to **Settings → Webhooks**
2. Click your webhook
3. Scroll to **Recent Deliveries**
4. Click a delivery to see the request and response

### Successful delivery

- **Status:** 200
- **Response:** `{ "received": true }`

### Failed delivery

- **Status:** 401 → Invalid signature (check webhook secret)
- **Status:** 500 → Backend error (check logs)
- **Status:** Timeout → Backend not reachable (check ngrok or firewall)

---

## Step 7 — Link GitHub Accounts to Stellar Addresses (Optional)

For auto-assignment to work, contributors must link their GitHub username to their Stellar address.

### Option A: Manual linking (admin)

Maintainers can manually link accounts in the backend database:

```sql
INSERT INTO github_links (github_username, stellar_address)
VALUES ('octocat', 'GCONTRIBUTORXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX');
```

### Option B: OAuth flow (future feature)

In a future version, contributors will:

1. Click **Link GitHub Account** in their ChainBounty profile
2. Authorize via GitHub OAuth
3. Backend stores the link automatically

---

## Webhook Event Reference

### `issues` Event

| Action | When it fires | ChainBounty behavior |
|---|---|---|
| `opened` | New issue created | Index issue metadata |
| `closed` | Issue closed or deleted | Mark linked bounty issue as closed |
| `reopened` | Issue reopened | Mark linked bounty issue as open |
| `assigned` | Issue assigned to someone | Update assignee metadata |
| `labeled` | Label added to issue | Re-index issue with new labels |

### `pull_request` Event

| Action | When it fires | ChainBounty behavior |
|---|---|---|
| `opened` | New PR created | Link PR to bounty if issue is referenced |
| `closed` + `merged: true` | PR merged | Flag submission as merged |
| `closed` + `merged: false` | PR closed without merge | Remove submission link |
| `reopened` | PR reopened | Restore submission link |

---

## Security Considerations

### HMAC Signature Validation

Every webhook includes an `X-Hub-Signature-256` header:

```
X-Hub-Signature-256: sha256=abcdef123456...
```

The backend validates this signature using the webhook secret:

```typescript
import crypto from 'crypto';

const signature = request.headers['x-hub-signature-256'];
const payload = JSON.stringify(request.body);
const expectedSignature = 'sha256=' + crypto
  .createHmac('sha256', process.env.GITHUB_WEBHOOK_SECRET)
  .update(payload)
  .digest('hex');

if (signature !== expectedSignature) {
  throw new Error('Invalid signature');
}
```

If the signature doesn't match, the webhook is rejected with `401 Unauthorized`.

### IP Allowlisting (Optional)

For extra security, only accept webhooks from GitHub's public IP ranges:

- [GitHub webhook IP ranges](https://api.github.com/meta)

Example (Express middleware):

```typescript
const GITHUB_IPS = ['140.82.112.0/20', '143.55.64.0/20', ...]; // from GitHub API

app.use('/webhooks/github', (req, res, next) => {
  const clientIp = req.ip;
  if (!GITHUB_IPS.some(range => ipInRange(clientIp, range))) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  next();
});
```

---

## Webhook Payload Examples

### Issue opened

```json
{
  "action": "opened",
  "issue": {
    "number": 42,
    "title": "Fix null pointer in payment handler",
    "html_url": "https://github.com/org/repo/issues/42",
    "labels": [
      { "name": "bug" },
      { "name": "good first issue" }
    ],
    "user": {
      "login": "octocat"
    }
  },
  "repository": {
    "full_name": "org/repo"
  }
}
```

### Pull request merged

```json
{
  "action": "closed",
  "pull_request": {
    "number": 55,
    "title": "Fix: resolve null pointer",
    "html_url": "https://github.com/org/repo/pull/55",
    "merged": true,
    "user": {
      "login": "contributor"
    },
    "body": "Closes #42"
  },
  "repository": {
    "full_name": "org/repo"
  }
}
```

---

## Troubleshooting

| Problem | Fix |
|---|---|
| Webhook shows red X in GitHub | Check backend logs for errors, verify signature secret matches |
| `401 Unauthorized` | Webhook secret mismatch — verify `.env` and GitHub settings |
| `404 Not Found` | Wrong webhook URL — verify ngrok or production domain |
| Issue not assigned after claim | GitHub link missing — link Stellar address to GitHub username |
| PR not linked to bounty | PR description doesn't reference issue (use `Closes #42`) |
| Webhook delivers but nothing happens | Check backend logs for parsing errors |

---

## Production Deployment

When deploying to production:

1. **Use a real domain** — replace ngrok URL with your production backend URL (e.g. `https://api.chainbounty.dev/webhooks/github`)
2. **Enable HTTPS** — GitHub requires HTTPS for webhooks
3. **Rotate webhook secret** — use a different secret for production than Testnet
4. **Monitor deliveries** — set up alerts for failed webhook deliveries
5. **Rate limit** — protect the webhook endpoint from spam (GitHub may retry on failure)

---

## Multiple Repos

To use ChainBounty across multiple repos:

### Option A: One webhook per repo

Add the same webhook configuration to each repo. All webhooks point to the same backend endpoint.

### Option B: GitHub App (future)

Install a GitHub App that automatically configures webhooks for all repos in an organization.

---

## Webhook Logs

The backend logs all webhook events. Check logs for debugging:

```bash
# View webhook logs
docker logs chainbounty-backend | grep "\[Webhook\]"

# View recent webhook events in DB
psql -d chainbounty -c "SELECT * FROM webhook_events ORDER BY created_at DESC LIMIT 10;"
```

---

## Future Enhancements

Planned improvements to GitHub integration:

- **GitHub OAuth** — authenticate contributors with their GitHub accounts
- **GitHub App** — install ChainBounty across all repos in an org
- **Bi-directional sync** — post comments on GitHub when bounty state changes
- **Automatic PR linking** — detect PRs even without "Closes #42" in description
- **Issue templates** — pre-fill bounty details when creating issues

---

## Related

- [Backend API Reference](/docs/api/backend-api) — webhook endpoint documentation
- [Security Model](/docs/protocol/security) — webhook signature validation
- [Contributor Onboarding](/docs/guides/contributor-onboarding) — claiming bounties
- [Maintainer Guide](/docs/guides/maintainer-guide) — posting bounties
