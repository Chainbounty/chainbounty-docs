# ChainBounty Docs

Documentation site for [ChainBounty](https://chainbounty.dev) — a decentralized bounty board for open source, built on Stellar & Soroban.

Built with [Docusaurus 3](https://docusaurus.io/).

## Local development

```bash
npm install
npm start
```

## Build

```bash
npm run build
```

## Project structure

```
docs/
├── intro.md                  # Introduction & protocol overview
├── architecture.md           # System architecture
├── quick-start.md            # Quick start guide
├── bounty-lifecycle.md       # Bounty state machine
├── contributing.md           # OSS contributing guide
├── guides/                   # User guides
│   ├── prerequisites.md
│   ├── freighter-wallet.md
│   ├── contributor-onboarding.md
│   ├── maintainer-guide.md
│   ├── github-integration.md
│   ├── testnet-deployment.md
│   └── frontend-integration.md
├── api/                      # API reference
│   ├── contract-abi.md
│   ├── backend-api.md
│   └── frontend-integration.md
├── protocol/                 # Protocol docs
│   ├── dispute-resolution.md
│   ├── fee-model.md
│   ├── reputation-scores.md
│   ├── token-support.md
│   └── security.md
└── reference/                # Reference material
    ├── glossary.md
    ├── faq.md
    ├── changelog.md
    └── roadmap.md
```

## License

MIT
