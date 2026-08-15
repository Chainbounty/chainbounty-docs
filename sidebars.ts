import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  mainSidebar: [
    {
      type: 'doc',
      id: 'intro',
      label: '👋 Introduction',
    },
    {
      type: 'doc',
      id: 'architecture',
      label: '🏗️ Architecture',
    },
    {
      type: 'doc',
      id: 'quick-start',
      label: '🚀 Quick Start',
    },
    {
      type: 'doc',
      id: 'bounty-lifecycle',
      label: '🔄 Bounty Lifecycle',
    },
    {
      type: 'category',
      label: '📖 Guides',
      collapsed: false,
      items: [
        'guides/prerequisites',
        'guides/freighter-wallet',
        'guides/contributor-onboarding',
        'guides/maintainer-guide',
        'guides/github-integration',
        'guides/testnet-deployment',
        'guides/frontend-integration',
      ],
    },
    {
      type: 'category',
      label: '📡 API Reference',
      collapsed: false,
      items: [
        'api/contract-abi',
        'api/backend-api',
        'api/frontend-integration',
      ],
    },
    {
      type: 'category',
      label: '⚖️ Protocol',
      collapsed: false,
      items: [
        'protocol/dispute-resolution',
        'protocol/fee-model',
        'protocol/reputation-scores',
        'protocol/token-support',
        'protocol/security',
      ],
    },
    {
      type: 'category',
      label: '📚 Reference',
      collapsed: false,
      items: [
        'reference/glossary',
        'reference/faq',
        'reference/changelog',
        'reference/roadmap',
      ],
    },
    {
      type: 'doc',
      id: 'contributing',
      label: '🤝 Contributing',
    },
  ],
};

export default sidebars;
