# Workflow Test Script

This document provides a step-by-step test to validate the complete development and deployment workflow for wallykroeker.com.

**Purpose**: Verify every step of the workflow works correctly before using it for real changes.

**Note**: This test creates temporary files and commits locally but does NOT push to GitHub or deploy to production.

---

## Prerequisites

- [ ] Development environment set up (pnpm installed, dependencies installed)
- [ ] Dev server NOT running (we'll start it as part of test)
- [ ] Clean git status (no uncommitted changes)

```bash
# Verify prerequisites
pnpm --version  # Should show version
git status      # Should be clean
```

---

## Test 1: Local Development Server

### Steps

1. **Start dev server**
   ```bash
   pnpm dev
   ```

2. **Expected output**:
   ```
   ▲ Next.js 14.2.5
   - Local:        http://localhost:3000
   - Environments: .env.local

   ✓ Starting...
   ✓ Ready in ~1-2 seconds
   ```

3. **Verify in browser**:
   - [ ] Open http://localhost:3000
   - [ ] Homepage loads with dark theme
   - [ ] Header shows navigation links
   - [ ] Featured projects section visible
   - [ ] Footer visible

4. **Test navigation**:
   - [ ] Click "Tech Blog" → Should show /blog with post listings
   - [ ] Click a blog post → Should show full post
   - [ ] Click "Projects" → Should show projects page
   - [ ] Navigation works without errors

**Result**: ✅ Dev server working

Keep dev server running for next tests.

---

## Test 2: Content Addition (Blog Post)

### Steps

1. **Create test blog post**
   ```bash
   cat > content/posts/workflow-test-20250115.md << 'EOF'
   ---
   title: "Workflow Test Post - DELETE ME"
   date: "2025-01-15"
   tags: ["Test", "Workflow"]
   description: "This is a test post to validate the workflow. Should be deleted after testing."
   ---

   # Test Post

   This is a test post to validate the workflow works correctly.

   ## Features Being Tested

   - Markdown rendering
   - Frontmatter parsing
   - Auto-linking of headings
   - Hot reload in dev server

   ## Expected Behavior

   This post should:
   1. Appear in /blog listing
   2. Be sorted by date (newest first)
   3. Have a clickable link
   4. Render with proper styling
   5. Show heading anchors

   **Delete this post after testing.**
   EOF
   ```

2. **Verify hot reload** (dev server should still be running)
   - Dev server console should show: `✓ Compiled /blog in XXXms`

3. **Check in browser**:
   - [ ] Visit http://localhost:3000/blog
   - [ ] See "Workflow Test Post - DELETE ME" in listing
   - [ ] Post shows date: 1/15/2025 (or local format)
   - [ ] Post shows description
   - [ ] Click on post title

4. **Check individual post page**:
   - [ ] URL is http://localhost:3000/blog/workflow-test-20250115
   - [ ] Title renders: "Workflow Test Post - DELETE ME"
   - [ ] Date shown at top
   - [ ] All markdown content renders correctly
   - [ ] Headings have anchor links (hover to see #)

**Result**: ✅ Content workflow working

---

## Test 3: Linting

### Steps

1. **Run linter** (in a new terminal, keep dev server running)
   ```bash
   pnpm lint
   ```

2. **Expected output**:
   ```
   ✔ No ESLint warnings or errors
   ```

   OR some warnings but no errors (warnings are OK for this test)

**Result**: ✅ Linting passing

---

## Test 4: Production Build

### Steps

1. **Stop dev server** (Ctrl+C in dev server terminal)

2. **Build for production**
   ```bash
   pnpm build
   ```

3. **Expected output**:
   ```
   ▲ Next.js 14.2.5

   ✓ Creating an optimized production build
   ✓ Compiled successfully
   ✓ Linting and checking validity of types
   ✓ Collecting page data
   ✓ Generating static pages (X/X)
   ✓ Finalizing page optimization

   Route (app)                                Size     First Load JS
   ┌ ○ /                                     XXX B          XXX kB
   ├ ○ /blog                                 XXX B          XXX kB
   ├ ○ /blog/building-wallykroeker-com      XXX B          XXX kB
   ├ ○ /blog/workflow-test-20250115         XXX B          XXX kB
   ...

   ○  (Static)  automatically rendered as static HTML
   ```

4. **Verify test post in build output**:
   - [ ] `/blog/workflow-test-20250115` appears in route list
   - [ ] Build completed successfully with no errors

**Result**: ✅ Production build working

---

## Test 5: Preview Production Build

### Steps

1. **Run production build locally**
   ```bash
   pnpm start
   ```

2. **Expected output**:
   ```
   ▲ Next.js 14.2.5
   - Local:        http://localhost:3000

   ✓ Ready in XXXms
   ```

3. **Verify in browser**:
   - [ ] Visit http://localhost:3000/blog
   - [ ] Test post still appears
   - [ ] Visit http://localhost:3000/blog/workflow-test-20250115
   - [ ] Post renders correctly
   - [ ] Styling looks correct (dark theme, proper spacing)

4. **Stop production server** (Ctrl+C)

**Result**: ✅ Production preview working

---

## Test 6: Git Workflow

### Steps

1. **Check git status**
   ```bash
   git status
   ```

2. **Expected output**:
   ```
   Untracked files:
     content/posts/workflow-test-20250115.md
     workflow-test.md
   ```

3. **Stage test post**
   ```bash
   git add content/posts/workflow-test-20250115.md
   ```

4. **Review staged changes**
   ```bash
   git diff --staged
   ```

5. **Expected output**: Should show the full diff of the new file with + markers

6. **Check status again**
   ```bash
   git status
   ```

7. **Expected output**:
   ```
   Changes to be committed:
     new file:   content/posts/workflow-test-20250115.md

   Untracked files:
     workflow-test.md
   ```

8. **Create test commit**
   ```bash
   git commit -m "content: add workflow test post (will be reverted)"
   ```

9. **Expected output**:
   ```
   [main XXXXXXX] content: add workflow test post (will be reverted)
    1 file changed, XX insertions(+)
    create mode 100644 content/posts/workflow-test-20250115.md
   ```

10. **View commit log**
    ```bash
    git log --oneline -3
    ```

11. **Expected output**: Should show your test commit as the latest

12. **Verify commit content**
    ```bash
    git show HEAD
    ```
    - [ ] Shows commit message
    - [ ] Shows diff with file additions
    - [ ] Commit looks correct

**Result**: ✅ Git workflow working

**IMPORTANT**: Do NOT push this commit! We'll undo it next.

---

## Test 7: Git Reset (Undo Test Commit)

### Steps

1. **Undo the test commit** (keeps file but uncommits it)
   ```bash
   git reset HEAD~1
   ```

2. **Check status**
   ```bash
   git status
   ```

3. **Expected output**:
   ```
   Untracked files:
     content/posts/workflow-test-20250115.md
     workflow-test.md
   ```

4. **Verify commit is gone**
   ```bash
   git log --oneline -3
   ```
   - [ ] Test commit should NOT appear
   - [ ] Back to original commit history

**Result**: ✅ Git reset working

---

## Test 8: Cleanup

### Steps

1. **Remove test post**
   ```bash
   rm content/posts/workflow-test-20250115.md
   ```

2. **Verify removal**
   ```bash
   ls content/posts/
   ```
   - [ ] `workflow-test-20250115.md` should NOT be in list

3. **Check git status**
   ```bash
   git status
   ```
   - [ ] Should be clean (or just show untracked workflow-test.md)

4. **Restart dev server**
   ```bash
   pnpm dev
   ```

5. **Verify test post is gone**:
   - [ ] Visit http://localhost:3000/blog
   - [ ] Test post should NOT appear in listing
   - [ ] Only original posts visible

**Result**: ✅ Cleanup complete

---

## Test 9: Build After Cleanup

### Steps

1. **Build again** (test post should be gone)
   ```bash
   pnpm build
   ```

2. **Verify in output**:
   - [ ] `/blog/workflow-test-20250115` should NOT appear in routes
   - [ ] Only original blog posts in route list
   - [ ] Build succeeds

**Result**: ✅ Build reflects cleanup

---

## Summary Checklist

Review all tests:

- [ ] Test 1: Dev server starts and works
- [ ] Test 2: Content addition with hot reload works
- [ ] Test 3: Linting passes
- [ ] Test 4: Production build succeeds
- [ ] Test 5: Production preview works locally
- [ ] Test 6: Git add/commit workflow works
- [ ] Test 7: Git reset works (undo commits)
- [ ] Test 8: Cleanup successful
- [ ] Test 9: Build reflects changes correctly

**If all tests pass**: ✅ Complete workflow validated and working!

**If any test fails**: Review WORKFLOW.md for detailed instructions and troubleshooting.

---

## What We Validated

This test confirmed:

1. **Local Development**: Dev server, hot reload, navigation
2. **Content System**: Markdown posts, frontmatter, rendering
3. **Build System**: Linting, production builds, static generation
4. **Git Workflow**: Staging, committing, reviewing changes, undoing commits
5. **Cleanup**: Removing content, verifying changes propagate

**What we did NOT test** (requires production access):
- Pushing to GitHub
- Pulling on production server
- Running deployment script
- Live site verification

Those steps should be tested with real (non-test) content when deploying for the first time.

---

## Next Steps

Now that the workflow is validated:

1. **Keep workflow-test.md** as a reference (don't commit it unless you want to)
2. **Use WORKFLOW.md** as your guide for all real changes
3. **Follow the complete workflow** for your next real change:
   - Make change locally
   - Test in dev
   - Lint and build
   - Commit with proper message
   - Push to GitHub
   - Deploy to production

**Congratulations!** Your development environment is fully set up and tested.
