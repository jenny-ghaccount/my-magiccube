# Rubik's Cube Solver — Task List

## Phase 1: Project Setup
- [ ] Initialize Next.js project with App Router
- [ ] Install and configure MUI (Material-UI)
- [ ] **Set up LEGO-inspired MUI theme** (see design.md)
- [ ] Install fonts: Nunito / Fredoka One
- [ ] Set up project folder structure (`/app`, `/components`, `/lib`, `/utils`)
- [ ] Configure TypeScript (recommended)
- [ ] Set up ESLint and Prettier
- [ ] Create basic layout component with header/footer (LEGO red header)

## Phase 2: Core UI Components
- [ ] Create Stepper component for the 3-step flow
  - Step 1: Welcome / Capture (optional in MVP)
  - Step 2: Enter Colors
  - Step 3: Solve & Results
- [ ] Build Color Palette selector component
  - 6 color swatches: White, Yellow, Red, Orange, Green, Blue
  - Active color indicator
- [ ] Build Face Grid component (3×3 clickable grid)
  - Click to apply selected color
  - Visual feedback on color change
- [ ] Create full Cube Entry view with all 6 faces (U, R, F, D, L, B)
  - Arrange grids in a cube net layout
  - Tooltip guidance for center stickers

## Phase 3: State Management
- [ ] Define cube state data structure (54 stickers)
- [ ] Implement state management (React Context or Zustand)
- [ ] Build face-to-string converter (URFDLB 54-char format)
- [ ] Implement color mapping: W→U, Y→D, R→R, O→L, G→F, B→B

## Phase 4: Validation Logic
- [ ] Implement color count validation (each color = 9 stickers)
- [ ] Display detailed error messages (e.g., "White: 8, Yellow: 10")
- [ ] Add visual indicators for invalid faces
- [ ] Block solve button until validation passes

## Phase 5: Solver Integration
- [ ] Install **cubing.js** solver package (`npm install cubing`)
- [ ] Set up dynamic import to avoid SSR issues
- [ ] Create solver wrapper function using Kociemba two-phase algorithm
- [ ] Handle solver errors gracefully
- [ ] Test with known cube states

## Phase 6: Results Page
- [ ] Display solution string in Singmaster notation
- [ ] Add notation legend (U, R, F, D, L, B, ', 2)
- [ ] Add "Copy to Clipboard" button
- [ ] Add "Solve Another" / Reset button
- [ ] Show move count

## Phase 7: Responsive Design & Mobile
- [ ] Ensure touch-friendly tap targets (min 44×44px)
- [ ] Test and adjust layout for mobile screens
- [ ] Optimize face grid layout for small screens
- [ ] Test on iOS Safari and Android Chrome

## Phase 8: Accessibility
- [ ] Add keyboard navigation for grids and controls
- [ ] Implement proper focus management
- [ ] Add ARIA labels for screen readers
- [ ] Ensure sufficient color contrast
- [ ] Test with keyboard-only navigation

## Phase 9: Performance & Polish
- [ ] Optimize initial load time (< 2s target)
- [ ] Add loading indicator during solve computation
- [ ] Ensure UI remains responsive during solve (async)
- [ ] Add subtle animations/transitions
- [ ] Error boundary for unexpected failures

## Phase 10: Testing & QA
- [ ] Test all 6 face color entry
- [ ] Test validation error cases
- [ ] Test solver with multiple cube states
- [ ] Test on Chrome, Safari, Firefox, Edge
- [ ] Test on mobile devices
- [ ] Fix any discovered bugs

---

## v1.1 Enhancements (Post-MVP)
- [ ] Camera capture with getUserMedia
- [ ] Corner alignment overlays (U+F+R, D+B+L)
- [ ] Tap-to-sample sticker color workflow
- [ ] Color calibration using center stickers
- [ ] Interactive correction/override mode
- [ ] File upload fallback for camera

---

## Current Progress

| Phase | Status |
|-------|--------|
| 1. Project Setup | 🔴 Not Started |
| 2. Core UI Components | 🔴 Not Started |
| 3. State Management | 🔴 Not Started |
| 4. Validation Logic | 🔴 Not Started |
| 5. Solver Integration | 🔴 Not Started |
| 6. Results Page | 🔴 Not Started |
| 7. Responsive Design | 🔴 Not Started |
| 8. Accessibility | 🔴 Not Started |
| 9. Performance & Polish | 🔴 Not Started |
| 10. Testing & QA | 🔴 Not Started |

---

## Quick Start Commands

```bash
# Create Next.js project
npx create-next-app@latest . --typescript --app --eslint

# Install MUI
npm install @mui/material @emotion/react @emotion/styled @mui/icons-material

# Install solver (example)
npm install cubing
```

---

## Notes
- All processing is client-side (no backend)
- Privacy-first: no image uploads to servers
- Target: Modern browsers (last 2 versions)
- **Solver**: cubing.js (Kociemba two-phase algorithm)
- **Design**: LEGO-inspired theme (see design.md)
