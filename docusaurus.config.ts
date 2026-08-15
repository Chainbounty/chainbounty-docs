import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'ChainBounty',
  tagline: 'Decentralized Bounty Board for Open Source — powered by Stellar & Soroban',
  favicon: 'img/favicon.ico',

  future: {
    v4: true,
  },

  url: 'https://chainbounty.dev',
  baseUrl: '/',

  organizationName: 'chainbounty',
  projectName: 'chainbounty-docs',

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          editUrl: 'https://github.com/chainbounty/chainbounty-docs/tree/main/',
          showLastUpdateTime: true,
          showLastUpdateAuthor: true,
        },
        blog: false, // Blog disabled — docs-only site
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: 'img/chainbounty-social-card.png',
    metadata: [
      { name: 'keywords', content: 'chainbounty, stellar, soroban, open source, bounty, dao, smart contracts' },
      { name: 'twitter:card', content: 'summary_large_image' },
    ],
    colorMode: {
      defaultMode: 'dark',
      disableSwitch: false,
      respectPrefersColorScheme: true,
    },
    announcementBar: {
      id: 'testnet_notice',
      content: '⚠️ ChainBounty is currently on <strong>Stellar Testnet</strong>. Do not use real funds.',
      backgroundColor: '#1a1a2e',
      textColor: '#a78bfa',
      isCloseable: true,
    },
    navbar: {
      title: 'ChainBounty',
      logo: {
        alt: 'ChainBounty Logo',
        src: 'img/logo.svg',
        srcDark: 'img/logo-dark.svg',
      },
      hideOnScroll: false,
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'mainSidebar',
          position: 'left',
          label: 'Docs',
        },
        {
          to: '/docs/api/backend-api',
          label: 'API',
          position: 'left',
        },
        {
          to: '/docs/guides/contributor-onboarding',
          label: 'Contributors',
          position: 'left',
        },
        {
          to: '/docs/guides/maintainer-guide',
          label: 'Maintainers',
          position: 'left',
        },
        {
          href: 'https://github.com/chainbounty',
          label: 'GitHub',
          position: 'right',
        },
        {
          href: 'https://app.chainbounty.dev',
          label: 'Launch App',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Protocol',
          items: [
            { label: 'Introduction', to: '/docs/intro' },
            { label: 'Architecture', to: '/docs/architecture' },
            { label: 'Contract ABI', to: '/docs/api/contract-abi' },
            { label: 'Bounty Lifecycle', to: '/docs/bounty-lifecycle' },
          ],
        },
        {
          title: 'Guides',
          items: [
            { label: 'Quick Start', to: '/docs/quick-start' },
            { label: 'Contributor Guide', to: '/docs/guides/contributor-onboarding' },
            { label: 'Maintainer Guide', to: '/docs/guides/maintainer-guide' },
            { label: 'Freighter Wallet', to: '/docs/guides/freighter-wallet' },
          ],
        },
        {
          title: 'Reference',
          items: [
            { label: 'Backend API', to: '/docs/api/backend-api' },
            { label: 'Frontend Integration', to: '/docs/api/frontend-integration' },
            { label: 'Dispute Resolution', to: '/docs/dispute-resolution' },
            { label: 'Security Model', to: '/docs/security' },
          ],
        },
        {
          title: 'Community',
          items: [
            { label: 'GitHub', href: 'https://github.com/chainbounty' },
            { label: 'Discord', href: 'https://discord.gg/chainbounty' },
            { label: 'Twitter / X', href: 'https://x.com/chainbounty' },
            { label: 'Contributing', to: '/docs/contributing' },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} ChainBounty Protocol. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.vsDark,
      darkTheme: prismThemes.vsDark,
      additionalLanguages: ['rust', 'toml', 'bash', 'json', 'typescript', 'solidity'],
    },
    algolia: undefined, // Wire up Algolia DocSearch when ready
  } satisfies Preset.ThemeConfig,
};

export default config;
