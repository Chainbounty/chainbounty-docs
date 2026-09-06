---
id: contributing
title: Contributing to ChainBounty
sidebar_position: 11
---

# Contributing to ChainBounty

ChainBounty is open source and community-driven. We welcome contributions of all kinds — code, documentation, bug reports, feature requests, and community support. This guide explains how to contribute effectively.

---

## Code of Conduct

By participating in the ChainBounty community, you agree to abide by our Code of Conduct.

### Our Pledge

We pledge to make participation in our project and community a harassment-free experience for everyone, regardless of age, body size, disability, ethnicity, gender identity and expression, level of experience, education, socio-economic status, nationality, personal appearance, race, religion, or sexual identity and orientation.

### Our Standards

**Examples of behavior that contributes to a positive environment:**

- ✅ Using welcoming and inclusive language
- ✅ Being respectful of differing viewpoints and experiences
- ✅ Gracefully accepting constructive criticism
- ✅ Focusing on what is best for the community
- ✅ Showing empathy towards other community members

**Examples of unacceptable behavior:**

- ❌ Trolling, insulting/derogatory comments, and personal or political attacks
- ❌ Public or private harassment
- ❌ Publishing others' private information without permission
- ❌ Spam, self-promotion, or off-topic content
- ❌ Other conduct which could reasonably be considered inappropriate

### Enforcement

Violations of the Code of Conduct should be reported to **conduct@chainbounty.dev**. All complaints will be reviewed and investigated promptly and fairly. The project team is obligated to maintain confidentiality with regard to the reporter.

Consequences for violations may include:

1. Warning
2. Temporary ban from community channels
3. Permanent ban

---

## Ways to Contribute

### 🐛 Report Bugs

Found a bug? Open an issue on the relevant repo:

- **Contract bugs:** [chainbounty-contract/issues](https://github.com/chainbounty/chainbounty-contract/issues)
- **Backend bugs:** [chainbounty-backend/issues](https://github.com/chainbounty/chainbounty-backend/issues)
- **Frontend bugs:** [chainbounty-frontend/issues](https://github.com/chainbounty/chainbounty-frontend/issues)
- **Documentation issues:** [chainbounty-docs/issues](https://github.com/chainbounty/chainbounty-docs/issues)

**When reporting bugs, include:**

- Steps to reproduce
- Expected behavior vs actual behavior
- Environment (Testnet/Mainnet, browser version, Freighter version)
- Screenshots or error messages
- Transaction IDs (if applicable)

---

### 💡 Suggest Features

Have an idea for improving ChainBounty? We'd love to hear it.

**Before suggesting:**

- Check if it's already been proposed in [GitHub Discussions](https://github.com/chainbounty/discussions)
- Think through the use case and potential challenges
- Consider whether it aligns with ChainBounty's mission

**Feature request template:**

```markdown
**Problem:** What problem does this solve?

**Proposed solution:** How would this feature work?

**Alternatives considered:** What other approaches did you think about?

**Impact:** Who would benefit from this feature?
```

---

### 📝 Improve Documentation

Documentation contributions are highly valued. You can:

- Fix typos or broken links
- Clarify confusing explanations
- Add examples or diagrams
- Translate docs (future)

**To edit docs:**

1. Fork [chainbounty-docs](https://github.com/chainbounty/chainbounty-docs)
2. Edit the markdown files in `docs/`
3. Test locally: `npm install && npm start`
4. Submit a pull request

---

### 🛠️ Contribute Code

Ready to write code? Here's how to get started.

#### Setup Development Environment

**Contract:**

```bash
git clone https://github.com/chainbounty/chainbounty-contract
cd chainbounty-contract
cargo build --target wasm32-unknown-unknown --release
cargo test
```

**Backend:**

```bash
git clone https://github.com/chainbounty/chainbounty-backend
cd chainbounty-backend
npm install
cp .env.example .env  # Edit with your config
npm run migrate
npm run dev
```

**Frontend:**

```bash
git clone https://github.com/chainbounty/chainbounty-frontend
cd chainbounty-frontend
npm install
cp .env.example .env.local  # Edit with your config
npm run dev
```

#### Find an Issue to Work On

Look for issues labeled:

- `good first issue` — beginner-friendly
- `help wanted` — core team needs assistance
- `bug` — something is broken
- `enhancement` — new feature or improvement

**Comment on the issue** before starting work to avoid duplication.

#### Development Workflow

1. **Fork the repo** and create a new branch:
   ```bash
   git checkout -b fix/issue-42
   ```

2. **Write code** following the style guide (see below)

3. **Test your changes:**
   - Contract: `cargo test`
   - Backend: `npm run test`
   - Frontend: `npm run test`

4. **Commit with a clear message:**
   ```bash
   git commit -m "fix: resolve null pointer in payment handler"
   ```

5. **Push and open a PR:**
   ```bash
   git push origin fix/issue-42
   ```

6. **Wait for review** — maintainers will review and provide feedback

---

### 🎨 Code Style Guides

#### Rust (Contract)

- Use `rustfmt`: `cargo fmt`
- Use `clippy`: `cargo clippy`
- Follow [Rust API Guidelines](https://rust-lang.github.io/api-guidelines/)
- Keep functions small and focused
- Add doc comments for all public functions

**Example:**

```rust
/// Posts a new bounty and locks funds in escrow.
///
/// # Arguments
/// * `poster` - The address posting the bounty
/// * `amount` - The bounty amount in stroops
/// * `github_issue_url` - Full URL to the GitHub issue
///
/// # Returns
/// The newly created bounty ID
pub fn post_bounty(
    env: Env,
    poster: Address,
    amount: i128,
    github_issue_url: String,
) -> Result<u64, ContractError> {
    // Implementation
}
```

#### TypeScript (Backend & Frontend)

- Use Prettier: `npm run format`
- Use ESLint: `npm run lint`
- Follow [TypeScript best practices](https://www.typescriptlang.org/docs/handbook/declaration-files/do-s-and-don-ts.html)
- Prefer `async/await` over `.then()`
- Use meaningful variable names

**Example:**

```typescript
/**
 * Fetches a bounty by ID from the contract.
 * @param bountyId - The on-chain bounty ID
 * @returns The bounty data
 * @throws Error if bounty not found
 */
export async function getBounty(bountyId: number): Promise<Bounty> {
  const result = await contract.call('get_bounty', nativeToScVal(bountyId));
  return scValToNative(result);
}
```

---

### 🧪 Testing Guidelines

All code contributions must include tests.

#### Contract Tests

```rust
#[test]
fn test_post_bounty() {
    let env = Env::default();
    let contract = ChainBountyContract::new(&env);
    
    let bounty_id = contract.post_bounty(
        poster.clone(),
        1000000000,
        String::from_str(&env, "https://github.com/org/repo/issues/42"),
    );
    
    assert_eq!(bounty_id, 1);
}
```

#### Backend Tests

```typescript
describe('GET /bounties/:id', () => {
  it('should return a bounty by ID', async () => {
    const response = await request(app).get('/bounties/1');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id', 1);
  });

  it('should return 404 for non-existent bounty', async () => {
    const response = await request(app).get('/bounties/999');
    expect(response.status).toBe(404);
  });
});
```

---

### 🚀 Pull Request Guidelines

**Before submitting:**

- [ ] Code follows the style guide
- [ ] All tests pass
- [ ] New tests are added for new features
- [ ] Documentation is updated (if needed)
- [ ] Commit messages follow [Conventional Commits](https://www.conventionalcommits.org/)

**PR title format:**

```
<type>: <short description>

Examples:
- feat: add reputation leaderboard
- fix: resolve null pointer in payment handler
- docs: update contributor onboarding guide
- chore: upgrade dependencies
```

**Types:**

- `feat` — new feature
- `fix` — bug fix
- `docs` — documentation only
- `style` — formatting, missing semicolons, etc.
- `refactor` — code change that neither fixes a bug nor adds a feature
- `test` — adding or updating tests
- `chore` — tooling, dependencies, etc.

**PR description should include:**

- What problem this solves
- How you implemented it
- Testing you performed
- Screenshots (if UI changes)

---

### 🏆 Recognition

All contributors are recognized in the project README and on the ChainBounty website.

**Contribution levels:**

| Contributions | Recognition |
|---|---|
| 1+ PRs merged | Listed as a contributor |
| 10+ PRs merged | Featured on the website |
| 50+ PRs merged | Core contributor badge |
| Consistent contributions | Invited to core team |

---

## Community Channels

### Discord

Join the [ChainBounty Discord](https://discord.gg/chainbounty) for:

- Real-time discussions
- Getting help
- Sharing ideas
- Meeting other contributors

### GitHub Discussions

Use [GitHub Discussions](https://github.com/chainbounty/discussions) for:

- Feature proposals
- Technical deep dives
- Long-form Q&A

### Twitter / X

Follow [@chainbounty](https://x.com/chainbounty) for:

- Project updates
- Community highlights
- Announcements

---

## Bounties for Contributors

ChainBounty uses ChainBounty! Many open issues have bounties attached. Look for the `bounty` label on GitHub issues.

**How to earn:**

1. Find an issue with the `bounty` label
2. Claim the bounty on [app.chainbounty.dev](https://app.chainbounty.dev)
3. Complete the work and submit a PR
4. Get paid when maintainers approve

---

## Core Team

The ChainBounty core team includes:

- **Protocol Lead** — contract architecture and audits
- **Backend Lead** — API and infrastructure
- **Frontend Lead** — UI/UX and design
- **DevRel Lead** — documentation and community

Interested in joining the core team? Contribute regularly for 3+ months and reach out to team@chainbounty.dev.

---

## Release Process

ChainBounty follows [Semantic Versioning](https://semver.org/):

- **Major (1.0.0)** — breaking changes
- **Minor (0.1.0)** — new features, backward compatible
- **Patch (0.0.1)** — bug fixes

Releases are cut monthly. Critical security fixes are released immediately.

---

## Security Disclosures

Found a security vulnerability? **Do not open a public issue.**

Email **security@chainbounty.dev** with:

- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (optional)

We commit to:

- Acknowledging receipt within 48 hours
- Providing a fix within 30 days
- Crediting you in the security advisory (if desired)

See the [Security Model](/docs/protocol/security) for details.

---

## License

By contributing to ChainBounty, you agree that your contributions will be licensed under the MIT License.

See [LICENSE](https://github.com/chainbounty/chainbounty-contract/blob/main/LICENSE) for details.

---

## Questions?

Reach out:

- **General questions:** [Discord](https://discord.gg/chainbounty)
- **Code reviews:** Comment on your PR
- **Security issues:** security@chainbounty.dev
- **Everything else:** team@chainbounty.dev

Thank you for contributing to ChainBounty! 🎉
