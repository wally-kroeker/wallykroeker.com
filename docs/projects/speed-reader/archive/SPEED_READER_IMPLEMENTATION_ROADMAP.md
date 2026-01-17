# Speed Reader - Implementation Roadmap

**Project:** RSVP Speed Reader for wallykroeker.com
**Status:** Research Complete → Design Phase
**Timeline:** 1 week to MVP (Design: 2 days, Implementation: 3 days, Testing: 1 day, Polish: 1 day)

---

## Research Complete ✓

**Deliverables:**
- [x] SPEED_READER_RESEARCH.md (comprehensive research report)
- [x] SPEED_READER_TECHNICAL_REFERENCE.md (code examples and patterns)
- [x] SPEED_READER_UX_WIREFRAMES.md (design specifications)
- [x] This roadmap document

**Key Findings:**
- RSVP technology is well-understood and straightforward to implement
- ORP alignment (floor(length/2)-1) is critical for speed
- 300 WPM is optimal starting speed (comfortable for most users)
- Mobile-first design essential (most use case is reading on phones)
- No external dependencies needed (pure React + Tailwind)

---

## Phase 1: Design (Bill) - 2 Days

### Day 1: Component Design
**Tasks:**
1. Review research docs (SPEED_READER_RESEARCH.md + SPEED_READER_UX_WIREFRAMES.md)
2. Create detailed component specifications
3. Finalize layout decisions (desktop + mobile)
4. Answer open UX questions:
   - Context words: Show or hide?
   - Completion state: Message or auto-reset?
   - Animation: Fade/scale on word change?
   - Slider tooltip: Show WPM while dragging?

**Deliverables:**
- Component spec document (dimensions, Tailwind classes, states)
- Interaction specification (keyboard, touch, animations)
- Accessibility requirements checklist

### Day 2: Visual Design & Handoff
**Tasks:**
1. Create visual mockup (Figma optional, detailed written spec required)
2. Define color palette (confirm or adjust from wireframes)
3. Typography decisions (font sizes, weights, line heights)
4. Review accessibility compliance (WCAG 2.1 AA)
5. Prepare handoff to Mario

**Deliverables:**
- Final design specification (ready for implementation)
- Component hierarchy diagram
- Responsive breakpoint specifications
- Any visual assets (icons, if not using lucide-react)

---

## Phase 2: Implementation (Mario) - 3 Days

### Day 1: Core Logic + Basic UI
**Tasks:**
1. Set up file structure: `/app/tools/speed-reader/`
2. Implement utility functions (utils.ts):
   - `getORP()`
   - `formatWord()`
   - `calculateDelay()`
   - `parseText()`
3. Create custom hook (`useRSVPReader.ts`)
4. Build basic Reader component (word display + play/pause)
5. Test core RSVP logic (verify ORP alignment, timing accuracy)

**Acceptance Criteria:**
- [ ] Words display one at a time with correct ORP highlighting
- [ ] Play/pause functionality works
- [ ] Timing matches expected WPM (300 WPM = 200ms per word)
- [ ] State management handles edge cases (empty text, completion)

### Day 2: Full UI + Controls
**Tasks:**
1. Implement all child components:
   - WordDisplay.tsx
   - Controls.tsx (playback buttons, speed slider, presets)
   - ProgressBar.tsx
   - TextInput.tsx
2. Add keyboard shortcuts (Space, Arrow keys, Esc)
3. Wire up all controls (speed adjustment, rewind, fast-forward, reset)
4. Implement progress tracking (word count, time remaining)

**Acceptance Criteria:**
- [ ] All controls functional (buttons, slider, presets)
- [ ] Keyboard shortcuts work (Space, ←/→, Esc)
- [ ] Progress bar updates in real-time
- [ ] Text input loads correctly into reader

### Day 3: Polish + Responsive + Persistence
**Tasks:**
1. Mobile optimization (responsive layout, touch targets)
2. Add localStorage persistence (save WPM preference)
3. Implement "Load Sample" functionality (demo text)
4. Add loading states, error handling (empty text, etc.)
5. Accessibility audit (keyboard nav, ARIA labels, screen reader)
6. Cross-browser testing (Chrome, Firefox, Safari)

**Acceptance Criteria:**
- [ ] Mobile layout works (thumb-reachable controls)
- [ ] User preferences persist across sessions
- [ ] All states handled gracefully (empty, loading, error, complete)
- [ ] WCAG 2.1 AA compliant (contrast, keyboard, screen reader)
- [ ] Works on major browsers (Chrome, Firefox, Safari desktop + mobile)

---

## Phase 3: Testing & QA - 1 Day

### Testing Checklist

**Functional Tests:**
- [ ] Text parsing handles edge cases (empty, very long, special characters, URLs)
- [ ] ORP calculation correct for various word lengths
- [ ] Delay calculation accurate (test at 250, 400, 600, 1000 WPM)
- [ ] Punctuation pauses work (commas +100ms, periods +300ms)
- [ ] Play/pause maintains position correctly
- [ ] Rewind/fast-forward jumps correct number of words
- [ ] Reset returns to beginning
- [ ] Speed changes apply immediately (no need to restart)
- [ ] Progress bar matches actual word position
- [ ] Completion handling (stops at end, shows appropriate state)

**UX Tests:**
- [ ] Desktop layout: Text input and reader display side-by-side
- [ ] Mobile layout: Stacked, controls at bottom (thumb-reach)
- [ ] Keyboard shortcuts work from any page state
- [ ] Focus indicators visible on all interactive elements
- [ ] Hover states work on desktop
- [ ] Touch targets ≥44px on mobile
- [ ] Text readable at all breakpoints (no horizontal scroll)
- [ ] Loading states clear (textarea → reader transition)

**Performance Tests:**
- [ ] Page load time <2 seconds
- [ ] No lag with 10,000+ word texts
- [ ] Smooth playback at all WPM settings (no stuttering)
- [ ] No memory leaks (timers cleared on unmount)
- [ ] Bundle size <100KB for speed-reader components

**Accessibility Tests:**
- [ ] Keyboard-only navigation (Tab, Space, Arrow keys)
- [ ] Screen reader announces state changes (playing/paused, progress)
- [ ] High contrast mode (respects system preferences)
- [ ] Focus visible on all controls
- [ ] ARIA labels on icon-only buttons
- [ ] Text scales to 200% without breaking layout

**Cross-Browser Tests:**
- [ ] Chrome/Edge (Chromium engine)
- [ ] Firefox
- [ ] Safari (macOS)
- [ ] Mobile Chrome (Android)
- [ ] Mobile Safari (iOS)

**Edge Cases:**
- [ ] Empty text input (graceful error message)
- [ ] Very short text (1-5 words)
- [ ] Very long text (book-length, 50,000+ words)
- [ ] Text with lots of punctuation
- [ ] Text with URLs, numbers, special characters
- [ ] Rapid speed changes while playing
- [ ] Tab blur during playback (should pause)

---

## Phase 4: Polish & Launch - 1 Day

### Pre-Launch Tasks

**SEO & Metadata:**
- [ ] Add metadata to page.tsx (title, description, keywords)
- [ ] OpenGraph tags for social sharing
- [ ] Add to sitemap.xml
- [ ] Submit to Google Search Console

**Documentation:**
- [ ] Add usage instructions to page (above tool)
- [ ] Explain RSVP technology (brief intro paragraph)
- [ ] List keyboard shortcuts (visible on page)
- [ ] Add "About this tool" section (why we built it, how it works)

**Integration:**
- [ ] Add "Speed Reader" to main site navigation (under Tools)
- [ ] Link from relevant blog posts (reading, productivity topics)
- [ ] Add to homepage projects section (optional)

**Analytics:**
- [ ] Add pageview tracking (if using self-hosted analytics)
- [ ] Optional: Track WPM preference distribution (privacy-conscious)
- [ ] Optional: Track completion rate (how many finish vs abandon)

**Final Checks:**
- [ ] Spelling/grammar check on all text
- [ ] Consistent capitalization, punctuation
- [ ] All links work (navigation, footer)
- [ ] Favicon loads correctly
- [ ] Dark mode consistent with rest of site
- [ ] No console errors or warnings

---

## Success Metrics (Post-Launch)

### Week 1:
- **Traffic:** 50+ unique users
- **Engagement:** Average session >2 minutes (indicates tool usage)
- **Completion:** >30% of users read ≥100 words

### Month 1:
- **Traffic:** 200+ unique users
- **Return visits:** 20% return rate
- **Feedback:** Positive community response (Discord, social)
- **SEO:** Ranking for "speed reader online", "RSVP reader"

### Month 3:
- **Traffic:** 500+ unique users
- **Feature requests:** Identify Phase 2 priorities (URL loading, blog integration)
- **Performance:** <1% error rate, 99% uptime

---

## Phase 2 Features (Future)

**Planned Enhancements:**
1. **URL Loading:** Fetch and parse articles from URLs
2. **Blog Integration:** "Read with RSVP" button on blog posts
3. **Reading Stats:** Total words read, average WPM, streak tracking
4. **Bookmark Position:** Save progress for long texts
5. **Export/Share:** Generate shareable links with pre-loaded text
6. **Light Mode:** Theme toggle for users who prefer light backgrounds
7. **Font Customization:** Size adjustment, font family options
8. **Advanced Controls:** Sentence-by-sentence navigation, chapter markers

**Prioritization:**
- Blog integration (high value, low effort)
- Reading stats (high engagement, medium effort)
- URL loading (high complexity, moderate value - CORS challenges)

---

## File Structure (Final)

```
/app/tools/speed-reader/
├── page.tsx                 // Main page component with metadata
├── Reader.tsx               // Top-level reader component
├── WordDisplay.tsx          // RSVP word display with ORP
├── Controls.tsx             // Playback controls and speed adjustment
├── ProgressBar.tsx          // Progress indicator
├── TextInput.tsx            // Text input area
├── useRSVPReader.ts         // Custom hook for RSVP logic
├── utils.ts                 // Utility functions (ORP, delay, parse)
├── types.ts                 // TypeScript interfaces
└── __tests__/
    ├── utils.test.ts        // Unit tests for utilities
    ├── useRSVPReader.test.ts // Hook tests
    └── Reader.test.tsx      // Component integration tests
```

**Estimated Total Lines of Code:**
- TypeScript: ~800 lines
- Tests: ~200 lines
- **Total: ~1,000 LOC**

---

## Team Assignments

| Phase | Owner | Duration | Deliverable |
|-------|-------|----------|-------------|
| Research | Riker ✓ | Complete | Research docs + wireframes |
| Design | Bill | 2 days | Component specs + interaction design |
| Implementation | Mario | 3 days | Working speed reader (MVP) |
| Testing | Mario | 1 day | QA checklist complete, bugs fixed |
| Launch Prep | Mario + Bill | 1 day | SEO, docs, integration |

**Total Timeline:** 7 days (1 full work week)

---

## Risk Assessment

### Low Risk:
- Core RSVP algorithm (well-understood, simple to implement)
- Responsive layout (standard Tailwind patterns)
- Accessibility (Tailwind + semantic HTML = good baseline)

### Medium Risk:
- Cross-browser timer accuracy (setTimeout precision varies)
  - **Mitigation:** Test on all browsers, adjust timing if needed
- Mobile touch gesture conflicts (browser swipe gestures)
  - **Mitigation:** Use button controls only for MVP, avoid custom gestures

### High Risk:
- None identified (straightforward feature with clear requirements)

---

## Open Questions & Decisions Needed

**For Bill (Design Phase):**
1. ✓ Layout: Two-column desktop, stacked mobile? **→ YES (from wireframes)**
2. ⚠️ Context words: Show previous/next words faded? **→ DECIDE**
3. ⚠️ Animations: Fade/scale on word change, or instant? **→ DECIDE**
4. ⚠️ Completion state: Message, confetti, or auto-reset? **→ DECIDE**
5. ⚠️ Slider tooltip: Show WPM value while dragging? **→ DECIDE**

**For Wally (Product Decisions):**
1. ⚠️ Phase 2 priority: Blog integration vs. URL loading vs. Stats? **→ DECIDE LATER**
2. ⚠️ Analytics: Track WPM preferences, or pageviews only? **→ DECIDE LATER**
3. ⚠️ Embedding: Offer as widget for others to use? **→ DECIDE LATER**

---

## Definition of Done

**MVP is complete when:**
- [x] Research complete (Riker) ✓
- [ ] Design specs finalized (Bill)
- [ ] All components implemented (Mario)
- [ ] All acceptance criteria met (see Phase 2, Day 1-3)
- [ ] Testing checklist 100% complete
- [ ] SEO metadata added
- [ ] Documentation written
- [ ] Deployed to production
- [ ] Announced in Cognitive Loop / Discord

**Launch Criteria:**
- Zero critical bugs
- WCAG 2.1 AA compliant
- Works on Chrome, Firefox, Safari (desktop + mobile)
- Page load <2 seconds
- Positive feedback from 3+ beta testers

---

## Next Immediate Steps

1. **Riker → Bob Prime:** Handoff research to Bob for review
2. **Bob Prime → Bill:** Assign design phase with research docs
3. **Bill → Mario:** Handoff design specs when complete
4. **Mario → Bob Prime:** Daily check-ins during implementation
5. **Bob Prime → Wally:** Demo MVP before launch for final approval

---

**End of Roadmap**

*This is a high-confidence, low-risk project with clear requirements and well-understood technology. Expected outcome: Production-ready speed reader in 1 week.*
