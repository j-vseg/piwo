---
name: release-notes-and-features
description: Generate release notes from git history since the latest tag. Produces GitHub release notes, updates the in-app "What's New" list, and updates the About App features if applicable.
user_invocable: true
argument: (optional) A specific tag to generate notes from (e.g. "v2.2.0"). If omitted, uses the latest tag.
---

# Release Notes & Features Generator

Generate up to three outputs based on merged PRs since the latest git tag:

1. **GitHub release notes** — markdown for the GitHub release
2. **In-app "What's New" update** — update the features array in `src/components/WhatIsNew/WhatIsNew.tsx`
3. **About App features update** — if applicable, update the features array in `src/domains/settings/screens/about-app.tsx`

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

```markdown
## New Features

- Description of the feature by @author in #number
- Description of another feature by @author in #number

## Bug Fixes

- Description of the fix by @author in #number
- Description of another fix by @author in #number

## Maintenance

- Description of the maintenance task by @author in #number

**Full Changelog**: <previous_tag>...<base_tag>
```

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

After generating the GitHub release notes, update the features array in `src/components/WhatIsNew/WhatIsNew.tsx` with any new user-facing features from this release.

### When to update

Only add items for PRs categorized as **New Features** or **Bug Fixes** that are meaningful to end users. Skip maintenance PRs, dependency updates, and internal refactors — those are not relevant for the in-app feature list.

### How to update

1. Read the current features array in `src/components/WhatIsNew/WhatIsNew.tsx`.

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

3. **Icon selection rules (must work on both Android and web):**
   - `icon` — used on Android (Material Symbols Outlined, snake_case, e.g. `"event"`, `"check_circle"`, `"how_to_reg"`)
   - `webIcon` — used on web (`MaterialIcons` from `@expo/vector-icons`, kebab-case, e.g. `"event"`, `"check-circle"`, `"how-to-reg"`). Not all native icon names exist on web.
   - **Always verify both icons exist.** Check `src/components/IconSymbol/IconSymbol.web.tsx` for web icon imports. When in doubt, pick a safe icon that exists on both platforms: `"event"`, `"star"`, `"info"`, `"add"`, `"person"`, `"settings"`, `"check-circle"` / `"check_circle"`.
   - When native and web icon names match (e.g. `"event"`), use the same value for both.
   - When they differ, provide both (e.g. `icon: "how_to_reg"`, `webIcon: "how-to-reg"`).

4. **Content rules:**
   - Title and description must be in **Dutch**.
   - Keep descriptions concise (1–2 sentences).
   - Set `adminOnly: true` if the feature is only visible to board members / advisors.

5. Remove all existing features from the array and replace them with only the new ones from this release. The "Installeren als app" item should stay last.

6. **Bump `FEATURES_VERSION`** — After updating the features array, increment the `FEATURES_VERSION` constant (exported from the same file) by 1. This triggers the auto-show "What's New" bottom sheet on web for all users who haven't seen the new version yet.

### Ask before applying

Present the proposed new feature items to the user before editing the file. Let them confirm or adjust wording, icons, and which items to include.

---

## Part 3: About App Features Update

After updating the "What's New" list, check whether any new features from this release should be added to the permanent app feature list in `src/domains/settings/screens/about-app.tsx`.

### When to update

Only update this file when a release introduces a **new core capability** of the app — something a new user would want to know about. Examples: a new screen, a new major interaction pattern, a new user role feature. Do **not** add incremental improvements, bug fixes, or minor enhancements — those belong in "What's New" only.

### How to update

1. Read the current features array in `src/domains/settings/screens/about-app.tsx`.

2. For each applicable new core feature, add a new `FeatureItem` entry. The shape is identical to Part 2:

   ```ts
   {
     icon: "material_icon_name",      // Android icon (Material Symbols Outlined, snake_case)
     webIcon: "web-icon-name",        // web icon (MaterialIcons from @expo/vector-icons, kebab-case)
     translationKey: "featureKey",    // key under the "aboutApp" namespace in nl.json
     adminOnly?: true,                // optional, only if the feature is admin-specific
   }
   ```

   The component uses `t(`aboutApp.${feature.translationKey}.title`)` and `t(`aboutApp.${feature.translationKey}.description`)` to render the text.

3. **Translation file update** — After the user confirms the proposed features, add the title and description text to `src/translations/nl.json` under the `"aboutApp"` key **before** updating the feature array. Each feature gets its own nested object keyed by the `translationKey`:

   ```json
   {
     "aboutApp": {
       "<featureKey>": {
         "title": "Dutch title",
         "description": "Dutch description."
       }
     }
   }
   ```

4. **Icon selection rules** — same as Part 2: both `icon` and `webIcon` must be valid on their respective platforms (Android and web). Always verify both exist.

5. **Content rules** — same as Part 2: Dutch, concise, `adminOnly` where applicable.

6. Add new entries in a logical position among the existing features. The `"Installeren als app"` item must remain last.

### Ask before applying

Present the proposed changes to the user before editing the file. If no features from this release qualify as core capabilities, skip this step and inform the user that no about-app update is needed.
