---
name: release
description: Cut a release of the free maplibre-geoman / mapbox-geoman packages (bump versions, finalize CHANGELOG, tag, publish to npm). Use when asked to release, publish, cut a version, or prep a release (e.g. "release 0.8.4", "publish a prerelease").
---

# Release process

This monorepo publishes from a single workspace version kept in lockstep across
four manifests: the root `package.json`, `packages/core`, `packages/maplibre`,
and `packages/mapbox`. The two published packages are
`@geoman-io/maplibre-geoman-free` and `@geoman-io/mapbox-geoman-free`, released to
the **public npm registry** (`registry.npmjs.org`) with provenance.

Publishing is done by the **`Release` GitHub Actions workflow**
(`.github/workflows/release.yml`), triggered by pushing a `v*.*.*` tag (or via
`workflow_dispatch`). A release is two steps: **prep** (a commit on `master`)
then **tag** (which publishes).

## 0. Preconditions

- You are releasing from `master`, it's up to date (`git pull`), and the working tree is clean.
- The changes being released are merged and **CI on `master` is green**.
- Decide the version, following the existing line (e.g. `0.8.4`). A prerelease
  contains `-alpha`/`-beta`/`-rc` and publishes under the `beta` dist-tag instead
  of `latest`.

## 1. Prep commit

```bash
git checkout master && git pull

# Bump root + core + maplibre + mapbox package.json (one version, all four).
# Always use the script — never hand-edit versions — so the manifests stay in
# lockstep (the release workflow rejects a mismatch).
node scripts/bump-version.mjs <version>      # e.g. 0.8.4
```

`pnpm install` is **not** required for a version bump: `pnpm-lock.yaml` does not
embed workspace package versions, so there is no lockfile change. (Only run an
install if you also changed dependencies.)

Then edit `CHANGELOG.md` (Keep a Changelog format — the release workflow extracts
the notes for this version straight from here):

- Rename the existing `## [Unreleased]` heading to `## [<version>] - <YYYY-MM-DD>`
  (today's date).
- Add a fresh empty `## [Unreleased]` section directly above it.
- Fill in the entries under `### Added` / `### Changed` / `### Fixed`, describing
  the *released* state from the user's perspective. Link merged PRs where useful,
  e.g. `([#208](https://github.com/geoman-io/maplibre-geoman/pull/208))`. Drop
  WIP-only notes; call out default-behavior changes under `### Changed`.

Commit (do **not** push yet):

```bash
git add -A
git commit -m "chore(release): prep v<version>

<one short paragraph on what's in this release>"
```

The pre-commit hook runs `scripts/validate-workspace.mjs`, which enforces that
all four manifests carry the same version — if it fails, re-run the bump script.

## 2. Push + tag (this publishes)

```bash
git push origin master

git tag v<version>           # tag name MUST be v<version>, e.g. v0.8.4
git push origin v<version>   # pushing the tag triggers release.yml → npm publish
```

The tag's version must equal the root `package.json` version, or the workflow's
`validate` job fails on purpose.

## 3. Verify

```bash
gh run list --workflow=release.yml --limit 1     # find the Release run
gh run watch <run-id>                            # follow it to completion
```

The workflow runs `validate` (version + workspace-version checks,
`workspace:validate`), `build-and-test` (`pnpm install --frozen-lockfile`,
`formatter`, `typecheck:all`, `lint:all`, `test:unit`, `package` both variants,
`api:check`), the full Playwright **e2e matrix** (maplibre + mapbox), then creates
the GitHub Release (notes pulled from `CHANGELOG.md`) and publishes both packages
to npm — `--access public --provenance`, under `latest` for a stable version or
`--tag beta` for a prerelease. Confirm the run is green and the new version shows
up on npm.

## Notes / gotchas

- **Don't hand-edit versions** — always use `scripts/bump-version.mjs` so root +
  core + maplibre + mapbox stay in lockstep (the workspace validator and the
  workflow's version check both reject a mismatch).
- **No lockfile edit** for a plain version bump (the lockfile doesn't embed
  workspace versions), so no `pnpm install` is needed for the bump.
- The CHANGELOG section heading must be `## [<version>] - <date>` so the release-notes
  extractor finds it; an empty/missing section yields empty GitHub-release notes.
- To re-run a failed publish, fix forward and push a new patch tag — do **not**
  move or delete an existing published tag.
- The workflow can also be run from the Actions tab (`workflow_dispatch`) with an
  explicit version + prerelease flag, without pushing a tag.
