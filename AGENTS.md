# Idle Farm Browser Game Design (Pixel Art, Modular, Vibe Coding Friendly)

**Date:** 2026-03-11

## 1. Overall Structure
- React SPA for desktop browser—modular components for each feature
- Pixel art graphics via Canvas or small image assets
- All progress auto-saved to localStorage
- Player actions: crop/animal management, upgrades, automation

## 2. Component Breakdown
- CropField: Plant/harvest logic, progress bar/button, pixel art
- AnimalPen: Buy/collect/sell, each animal modular, pixel art
- UpgradeShop: List/modal, atomic purchase logic
- AutomationControls: Toggle automation, quick access UI
- ResourcePanel: Tracks/display money, produce, yields
- PixelArtCanvas: Smallest asset-drawing functions per farm element
- GameState: Divides crops, animals, money, upgrades for easy test/development

## 3. UI Layout & Player Flow
- Column layout: ResourcePanel (top), FarmDashboard (middle, with CropField/AnimalPen), UpgradeShop (side/modal), AutomationControls (bottom/floating)
- All actions are button-driven, immediate feedback
- UI wireframes are atomic and actionable

## 4. Error Handling & Testing
- Non-blocking UI feedback for errors
- Each component/action is independently tested (manual/quick tests)
- Autosave is validated and robust

## 5. Persistence & Unlocks
- LocalStorage for saves; load/reset logic easy to test
- Unlocks handled modularly: milestones unlock new features/UI, keeping scope tight
- Export/import can be added later

## 6. Build & Test (repeatable commands)
- Build all: npm run build
- Run all tests: npm test
- Lint: npm run lint
- Specific test suite: npm test -- <test-file-or-suite>

**Agents MUST always run tests after changes. If tests are missing, create appropriate test cases and scripts. Verification is required before claiming work is complete.**

### For All Changes:
1. **Always create a new branch** for any feature, fix, or change — do this automatically
2. **Commit changes** to the new branch
3. **Ask the user** before pushing the branch or creating a PR — never do this automatically

### Branch Naming Conventions:
- `feature/<feature-name>` - New features
- `fix/<issue-name>` - Bug fixes
- `docs/<topic>` - Documentation changes

### Example Workflow:
```bash
# Create and switch to new branch
git checkout -b feature/my-feature

# Make changes, commit
git add .
git commit -m "feat: add my feature"

# Push and create PR
git push -u origin feature/my-feature
# Then create PR via GitHub UI or: gh pr create
```

### Never Do:
- ❌ Commit directly to main
- ❌ Push to main
- ❌ Merge PRs without review
- ❌ Commit plans or any changes before moving work to a worktree

## Review Notes

- This patch updates CLAUDE.md to improve guidance for multi-agent collaboration and contributor onboarding.
- No code changes; intended to support the open Bridge PR with better context for reviewers.
- Please verify the added sections render clearly in the PR diff and that terminology remains consistent with the rest of CLAUDE.md.
- If minor wording tweaks are needed, we can push a follow-up small edit.

## Extra: Design for Multi-Agent Collaboration

This project supports modular bridge architecture. The following guidelines help AI agents collaborate:
- Never commit to main; create feature branches and PRs
- Use a consistent, explicit planning and review workflow
