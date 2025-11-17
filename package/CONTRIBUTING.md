## Contributing Guide

Thanks for your interest in improving this project! This document explains how to get set up, the workflow we follow, and a few conventions that keep the repo healthy. If anything is unclear, open an issue or start a discussion so we can improve these docs.

## Before You Start

- Make sure you have a GitHub issue or task describing the change. If none exists, please create one and wait for a maintainer to confirm the scope.
- Read the `README.md` to understand the architecture and how the policy acceptance UI is structured.
- Review the license for any usage restrictions.

## Code of Conduct

We follow the [Contributor Covenant](https://www.contributor-covenant.org/) Code of Conduct. By participating you agree to uphold these standards. Report unacceptable behavior to the maintainers privately.

## Local Development

- `pnpm` is the supported package manager. Install dependencies with `pnpm install`.
- Run the dev server with `pnpm dev`; it defaults to `http://localhost:3000`.
- Run the lint checks with `pnpm lint`; fix issues before committing.
- Execute the component tests with `pnpm test` (or the relevant command noted in `README.md`).

If your change alters dependencies, update `pnpm-lock.yaml` and mention it in your pull request.

## Branching Model

- Base all work off the `main` branch.
- Use short-lived feature branches named like `feature/policy-diff-copy`, `fix/modal-focus-trap`, or `docs/update-readme`.
- Avoid force-pushing to shared branches.

## Commit Guidelines

- Write descriptive commit messages in the present tense (`Add loading state to modal`).
- Keep commits focused; prefer multiple small commits over one large one.
- If a commit fixes an issue, reference it in the message body (`Fixes #123`).

## Coding Standards

- Follow the conventions already present in the file you are editing.
- Keep TypeScript strictness and ESLint rules in mind; run `pnpm lint --fix` when possible.
- Update or add tests when altering behaviour.
- For UI changes, include screenshots or screen recordings in the pull request when practical.

## Pull Request Process

- Rebase your branch on top of the latest `main` and resolve conflicts locally.
- Ensure the following checklist before submitting:
  - [ ] All lint and test commands pass locally.
  - [ ] Docs and examples updated if behaviour or API changes.
  - [ ] Screenshots supplied for UI updates.
  - [ ] Breaking changes called out clearly.
- Fill in the PR template completely, including context, testing notes, and any follow-up work.
- Request a review from at least one maintainer; tag subject-matter owners for specialised areas.

## Issue Triage

- Label new issues appropriately (`bug`, `enhancement`, `documentation`, etc.).
- Add reproduction steps or additional context if you have it.
- If you start working on an issue, assign it to yourself or comment to avoid duplicate effort.

## Release Notes

- Maintainers handle versioning and releases.
- When your change affects the user-facing experience, propose release notes in your PR description so they can be copied into the changelog.

## Questions?

Open a discussion, comment on an issue, or reach out to the maintainers. We are happy to help you get started. Happy hacking!

Happy Hacking!
