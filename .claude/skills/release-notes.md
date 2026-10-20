---
name: release-notes
description: Generate release notes from git history since the latest tag. Produces GitHub release notes AND updates the in-app "What's New" features list.
user_invocable: true
argument: (optional) A specific tag to generate notes from (e.g. "v2.2.0"). If omitted, uses the latest tag.
---

# Release Notes Generator

Generate two outputs based on merged PRs since the latest git tag:
1. **GitHub release notes** — markdown for the GitHub release
2. **In-app "What's New" update** — update the features array in `src/components/WhatIsNew.tsx`

---

## Part 1: GitHub Release Notes

### Steps

1. Determine the base tag:
   - If the user provides a tag as argument, use that.
   - Otherwise, find the latest tag:
     ```
     git describe --tags --abbrev=0
     ```

2. Find the previous tag (the one before the base tag) to build the changelog range:
   ```
   git tag --sort=-creatordate
   ```
   The range is `<previous_tag>...<base_tag>`.

3. Get all commits in that range:
   ```
   git log <previous_tag>...<base_tag> --format="%H %s"
   ```

4. The `origin` remote may not host the PRs. Check all remotes with `git remote -v` and use the one that resolves on GitHub (e.g. `io-origin` pointing to `iodigital-com/firan-dxp-app`). Use that repo for all `gh` commands with `--repo <owner/repo>`.

5. Extract PR numbers from commit messages (look for `(#123)` pattern). For each PR number, fetch its details:
   ```
   gh pr view <number> --repo <owner/repo> --json title,body,author,number
   ```

6. Categorize each PR based on its title's conventional commit prefix or content:
   - **New Features** — `feat:` prefix or feature-related content
   - **Bug Fixes** — `fix:` prefix or bugfix-related content
   - **Maintenance** — `chore:`, `ci:`, `build:`, `refactor:`, dependency updates, etc.
   - **Other** — anything that doesn't fit the above

   If a category has no PRs, omit it entirely.

7. Format the output as a markdown code block so the user can copy it directly. Use this structure:

````markdown
## New Features

- Description of the feature by @author in #number
- Description of another feature by @author in #number

## Bug Fixes

- Description of the fix by @author in #number
- Description of another fix by @author in #number

## Maintenance

- Description of the maintenance task by @author in #number

**Full Changelog**: <previous_tag>...<base_tag>
````

### Formatting rules

- Each PR is a bullet point with a clean description, author, and PR number
- Clean up PR titles: remove conventional commit prefixes (`fix:`, `feat:`, `chore:`, etc.), capitalize the first letter
- Use the PR title as the description, but if the PR body contains a more user-friendly summary, prefer that
- If a PR contains multiple distinct changes (visible from the body), split them into separate bullet points — all referencing the same author and PR number
- Author format: `@<github-username>`
- PR number format: `#<number>`
- Keep descriptions concise and user-friendly
- The "Full Changelog" line at the bottom uses the two tags as the range

---

## Part 2: In-App "What's New" Update

After generating the GitHub release notes, update the features array in `src/components/WhatIsNew.tsx` with any new user-facing features from this release.

### When to update

Only add items for PRs categorized as **New Features** or **Bug Fixes** that are meaningful to end users. Skip maintenance PRs, dependency updates, and internal refactors — those are not relevant for the in-app feature list.

### How to update

1. Read the current features array in `src/components/WhatIsNew.tsx`.

2. For each relevant new feature or notable fix, add a new `FeatureItem` entry to the array. Each entry has this shape:
   ```ts
   {
     icon: "material_icon_name",      // native icon (Material Symbols Outlined)
     webIcon: "web-icon-name",        // web icon (MaterialIcons from @expo/vector-icons)
     title: "Feature title",          // short Dutch title
     description: "Feature description in Dutch.",
     adminOnly?: true,                // optional, only if the feature is admin-specific
   }
   ```

3. **Icon selection rules:**
   - `icon` — use any Material Symbols Outlined icon name (snake_case, e.g. `"event"`, `"check_circle"`, `"how_to_reg"`)
   - `webIcon` — must be a valid `MaterialIcons` name from `@expo/vector-icons`. These use kebab-case (e.g. `"event"`, `"check-circle"`, `"how-to-reg"`). Check `src/components/IconSymbol/IconSymbol.web.tsx` which imports `MaterialIcons` from `@expo/vector-icons`. Not all native icon names exist on web — when in doubt, pick a safe common icon like `"star"`, `"info"`, `"add"`, `"person"`, `"settings"`.
   - When native and web icon names match (e.g. `"event"`), use the same value for both.
   - When they differ, provide both (e.g. `icon: "how_to_reg"`, `webIcon: "how-to-reg"`).

4. **Content rules:**
   - Title and description must be in **Dutch**.
   - Keep descriptions concise (1–2 sentences).
   - Set `adminOnly: true` if the feature is only visible to board members / advisors.

5. Remove all existing features from the array and replace them with only the new ones from this release. The "Installeren als app" item should stay last.

### Ask before applying

Present the proposed new feature items to the user before editing the file. Let them confirm or adjust wording, icons, and which items to include.
