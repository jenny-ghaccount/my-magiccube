# Rubik’s Cube Solver Web App — Requirements (React + Next.js + MUI)

## Overview
Build a browser-based tool that helps users solve a standard 3×3 Rubik’s Cube by:
- Entering sticker colors manually, or
- Capturing two “corner” photos (U+F+R and D+B+L) and sampling sticker colors with guided taps.

The app validates the cube state, computes a solution using a client-side solver, and displays the move sequence in standard Singmaster notation. No heavy computer vision is required.

## Goals
- Enable users to get accurate solution steps for a 3×3 cube in the browser.
- Minimize friction by supporting both manual color entry and a guided two-photo capture workflow.
- Preserve privacy by keeping all processing client-side.
- Provide a clear, correct solution in Singmaster notation; optionally enable guided correction for misread colors.

## Non-Goals
- Support for cubes other than 3×3 (e.g., 2×2, 4×4, Pyraminx).
- Single-photo full reconstruction or fully automatic CV detection in v1.
- Advanced speedcubing features (timers, scrambles, CFOP breakdown).
- Backend image processing or user accounts.

## Users
- Casual users who want to solve their scrambled 3×3 cube.
- Hobbyists who are comfortable following move notation but may need UI guidance.

## Platforms
- Modern desktop and mobile browsers (Chrome, Safari, Firefox, Edge).
- Touch and mouse input supported.

## Assumptions
- The cube uses a conventional color scheme with distinct sticker colors: White, Yellow, Red, Orange, Green, Blue.
- Users can provide two photos with three faces visible each, or enter colors manually.
- Client-side solver libraries are acceptable.

---

## Scope (MVP)
- React + Next.js (App Router) + MUI UI.
- **LEGO-inspired design**: Bold, colorful, playful aesthetic (see design.md).
- Manual color entry for six faces via interactive 3×3 grids.
- Cube state validation (counts per color, basic sanity checks).
- Client-side solving using **cubing.js** (Kociemba two-phase algorithm).
- Display of solution steps in Singmaster notation.
- Optional image upload for reference in MVP (no sampling yet).
- Responsive UI and basic accessibility.

## Scope (v1.1 enhancement)
- Camera capture via getUserMedia with corner alignment overlays.
- Two-photo workflow: U+F+R and D+B+L.
- Guided tap-to-sample sticker centers to assign colors (semi-manual, no CV).
- Interactive correction step and re-validation.

---

## User Experience (UX)
- Stepper-based flow:
  1) Capture/Upload (optional in MVP)
  2) Enter Colors
  3) Solve and Results
- Color palette selector with clear swatches.
- Face grids for U, R, F, D, L, B; tooltip guidance to set center stickers first.
- Error messages for invalid states and helpful corrections.
- Results page shows solution string and short notation legend.
- Mobile-friendly layout and touch targets.

---

## Technical Requirements
- Framework: Next.js (App Router), React, MUI.
- Design System: LEGO-inspired theme (see design.md for full specification).
- Client-only computation (no backend).
- Solver: **cubing.js** (Kociemba two-phase algorithm); dynamic import to avoid SSR issues.
- State building: 54-character URFDLB string from six face grids using a fixed mapping:
  - W → U, Y → D, R → R, O → L, G → F, B → B.
- Validation:
  - Each color appears exactly 9 times.
  - Basic structure checks; deeper legality checks can be added later.
- Camera:
  - getUserMedia for live capture (v1.1).
  - Fallback to file upload.
- Color sampling (v1.1):
  - User taps sticker centers on overlay; sample pixel color.
  - Calibrate using center stickers; cluster/nearest-color assignment with user override.

---

## Accessibility
- Keyboard navigation for face grids and controls.
- Sufficient color contrast and alternative labels.
- Screen-reader-friendly labels and roles.
- Touch-friendly hit areas on mobile.

## Privacy & Security
- All processing of images and cube states is on-device.
- No image uploads to a server.
- Permissions requests only for camera; graceful fallback if denied.

## Performance & Compatibility
- Solution computation returns in under 2 seconds on modern devices for typical states.
- UI remains responsive during solving (async/dynamic import).
- Works on latest two versions of major browsers.

## Localization
- Initial UI in English.
- Optional German localization in a later iteration.

---

## Acceptance Criteria (MVP)

Functional
- Given the user sets all six faces’ colors so that each of W, Y, R, O, G, B appears exactly 9 times, when they click “Solve,” then the app produces a solution string in Singmaster notation.
- Given the cube state is invalid (e.g., color counts not equal to 9), when the user clicks “Solve,” then the app shows a clear error message explaining what is wrong and does not attempt solving.
- Given the solver is available, when the user requests a solution, then the app returns a solution within 2 seconds on a modern desktop and 4 seconds on a mid-range mobile device.
- Given a valid solution, when the results are displayed, then the notation legend (U, R, F, D, L, B; ’ for counter-clockwise; 2 for double turn) is visible.

UI/UX
- Given a user on mobile, when they interact with the grids and color palette, then touch targets are large enough to tap without misclicking.
- Given a user navigates the stepper, when they click “Next: Enter Colors,” then they proceed to the color entry step and can return to previous steps.
- Given a user clicks a sticker square, when they select an active color, then the sticker’s color changes immediately and visually reflects the chosen color.

Validation & Error Handling
- Given a color count mismatch, when validation runs, then the error message lists each color with its count (e.g., W=8, Y=10).
- Given an internal error from the solver/import, when the user attempts to solve, then the app shows a friendly error and suggests checking installation or trying again.

Accessibility
- Given a keyboard-only user, when they tab through controls, then all interactive elements are focusable and operable.
- Given a screen-reader user, when they navigate the UI, then face grids, color buttons, and actions have descriptive labels.

Privacy & Permissions
- Given no camera permission is granted, when the user opens the Capture/Upload step, then the app provides file upload and proceeds without blocking the flow.

Performance & Compatibility
- Given a modern browser, when the app loads, then initial interactive content is ready within 2 seconds on broadband and 4 seconds on mobile networks.
- Given an older device, when solving runs, then the main thread remains responsive (no full UI freeze) thanks to async calls.

---

## Acceptance Criteria (v1.1: Two-Photo Flow & Sampling)

Capture
- Given a user taps “Open Camera,” when permission is granted, then a live preview appears with a corner overlay and instructions to align U+F+R, then D+B+L.
- Given camera permission is denied or unavailable, when the user tries to capture, then the app offers file upload for two photos.

Sampling & Calibration
- Given two corner photos are captured or uploaded, when the user enters sampling mode, then three 3×3 overlays appear per photo (one overlay per visible face).
- Given a user taps the center sticker for each visible face, when calibration runs, then the app assigns base colors for that face (W/Y/R/O/G/B).
- Given a user taps each sticker center, when sampling occurs, then the sampled RGB is mapped to the nearest calibrated face color, and the sticker color is set.
- Given misclassification, when the user taps a sticker in review mode, then they can override the color via the palette.

Validation & Completion
- Given sampling completes for both photos, when the app assembles the 54 stickers, then it validates color counts and flags conflicts with visual highlights.
- Given a valid assembled state, when the user clicks “Solve,” then the app produces a solution as per MVP performance criteria.

UX
- Given varying lighting, when sampling is uncertain (low confidence), then the app indicates uncertainty (e.g., subtle warning icon) and suggests manual confirmation.

---

## Edge Cases
- Photos with strong shadows or color casts leading to ambiguous color sampling.
- Cubes with non-standard color schemes (e.g., swapped center colors).
- Impossible states entered manually (parity/orientation violations); solver should fail gracefully and the app should prompt correction.
- Users who only provide one photo; app must block solving until all six faces are known.

---

## Metrics (Optional)
- Time-to-first-solve (from page load to solution shown).
- Percentage of successful solves vs. validation failures.
- Average correction rate after sampling.

---

## Future Enhancements (Out of MVP Scope)
- Full automatic sticker detection using OpenCV.js (contours, homographies).
- 3D solution animation (e.g., cubing.js viewer).
- Internationalization (German UI), theme customization.
- PWA installability and offline use.
- Support for different cube color schemes and face-letter remapping.
- Advanced legality checks and error explanations.

---

Next steps:
- Confirm the MVP acceptance criteria and any changes to language (English vs. German).
- Decide on solver library (min2phase vs. cubing.js).
- Prioritize whether camera capture and sampling are part of v1 or a follow-up release.