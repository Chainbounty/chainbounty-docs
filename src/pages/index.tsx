import type { ReactNode } from 'react';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import clsx from 'clsx';

import styles from './index.module.css';

type Feature = {
  emoji: string;
  title: string;
  description: string;
};

const features: Feature[] = [
  {
    emoji: '🔐',
    title: 'On-Chain Escrow',
    description:
      'Bounty funds are locked in a Soroban smart contract with milestone gates. No middlemen, no trust required.',
  },
  {
    emoji: '🐙',
    title: 'GitHub-Native',
    description:
      'Link any GitHub issue to a bounty. Webhooks track issue status and contributor submissions in real time.',
  },
  {
    emoji: '⚖️',
    title: 'Dispute Resolution',
    description:
      'Built-in on-chain arbitration process protects both contributors and maintainers when disagreements arise.',
  },
  {
    emoji: '⭐',
    title: 'Reputation Scores',
    description:
      'Every contributor builds an on-chain reputation score based on accepted submissions and maintainer ratings.',
  },
  {
    emoji: '🌐',
    title: 'Multi-Asset Support',
    description:
      'Post and receive bounties in XLM or any Stellar-issued token. Flexible treasury and fee model.',
  },
  {
    emoji: '🚀',
    title: 'DAO-Ready',
    description:
      'DAOs and OSS projects can post, manage, and track bounties without any centralized platform dependency.',
  },
];

function Hero() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <div className={styles.heroTag}>
          🌟 Built on Stellar &amp; Soroban
        </div>
        <Heading as="h1" className="hero__title">
          {siteConfig.title}
        </Heading>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <div className={styles.buttons}>
          <Link className="button button--primary button--lg" to="/docs/intro">
            Read the Docs
          </Link>
          <Link
            className="button button--secondary button--lg"
            to="/docs/quick-start"
          >
            Quick Start →
          </Link>
        </div>
        <div className={styles.heroBadges}>
          <span className={styles.badge}>Testnet Live</span>
          <span className={styles.badge}>Open Source</span>
          <span className={styles.badge}>MIT License</span>
        </div>
      </div>
    </header>
  );
}

function FeatureCard({ emoji, title, description }: Feature) {
  return (
    <div className={clsx('col col--4', styles.featureCol)}>
      <div className={styles.featureCard}>
        <div className={styles.featureEmoji}>{emoji}</div>
        <Heading as="h3" className={styles.featureTitle}>
          {title}
        </Heading>
        <p className={styles.featureDescription}>{description}</p>
      </div>
    </div>
  );
}

export default function Home(): ReactNode {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title={siteConfig.title}
      description="ChainBounty — Decentralized Bounty Board for Open Source. Post bounties for GitHub issues, claim rewards, and release escrow on-chain."
    >
      <Hero />
      <main>
        <section className={styles.features}>
          <div className="container">
            <Heading as="h2" className={styles.sectionHeading}>
              Why ChainBounty?
            </Heading>
            <div className="row">
              {features.map((f) => (
                <FeatureCard key={f.title} {...f} />
              ))}
            </div>
          </div>
        </section>

        <section className={styles.cta}>
          <div className="container">
            <Heading as="h2">Ready to dive in?</Heading>
            <p>
              Start with the <Link to="/docs/intro">Introduction</Link>, follow
              the <Link to="/docs/quick-start">Quick Start</Link>, or jump
              straight to the{' '}
              <Link to="/docs/api/contract-abi">Contract ABI</Link>.
            </p>
            <div className={styles.buttons}>
              <Link
                className="button button--primary button--lg"
                to="/docs/guides/contributor-onboarding"
              >
                I'm a Contributor
              </Link>
              <Link
                className="button button--secondary button--lg"
                to="/docs/guides/maintainer-guide"
              >
                I'm a Maintainer
              </Link>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}
