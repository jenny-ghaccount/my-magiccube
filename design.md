# MagicCube Design System — LEGO-Inspired

## Design Philosophy
Inspired by LEGO's iconic design language: **bold, colorful, playful, and confident**. The UI should feel like a toy — inviting users to interact and have fun while solving their cube.

---

## Color Palette

### Primary Brand Colors (LEGO-inspired)
```css
--lego-red:      #E3000B;   /* Classic LEGO red */
--lego-yellow:   #FFD700;   /* Bright yellow */
--lego-blue:     #0055BF;   /* LEGO blue */
--lego-green:    #00852B;   /* LEGO green */
--lego-orange:   #FF6D00;   /* Vibrant orange */
--lego-white:    #FFFFFF;   /* Clean white */
```

### Cube Sticker Colors
```css
--cube-white:    #FFFFFF;
--cube-yellow:   #FFD500;
--cube-red:      #B71234;
--cube-orange:   #FF5800;
--cube-green:    #009B48;
--cube-blue:     #0046AD;
```

### UI Colors
```css
--background:    #FFF9E6;   /* Warm cream - like a LEGO instruction booklet */
--surface:       #FFFFFF;
--surface-alt:   #F5F5F5;
--text-primary:  #1A1A1A;
--text-secondary:#5C5C5C;
--accent:        #E3000B;   /* LEGO red for CTAs */
--success:       #00852B;
--error:         #E3000B;
--shadow:        rgba(0, 0, 0, 0.15);
```

---

## Typography

### Font Family
```css
/* Primary: Bold, playful, geometric */
font-family: 'Nunito', 'Poppins', sans-serif;

/* Alternative: More LEGO-like blocky feel */
font-family: 'Fredoka One', 'Baloo 2', sans-serif;
```

### Font Weights & Sizes
| Element | Size | Weight | Style |
|---------|------|--------|-------|
| H1 (Page Title) | 2.5rem | 800 | Uppercase, playful |
| H2 (Section) | 1.75rem | 700 | Bold |
| H3 (Subsection) | 1.25rem | 600 | Semi-bold |
| Body | 1rem | 400 | Regular |
| Button | 1rem | 700 | Bold, uppercase |
| Caption | 0.875rem | 400 | Regular |

---

## Component Styles

### Buttons (LEGO Brick Feel)
```css
.button-primary {
  background: linear-gradient(180deg, #E3000B 0%, #C00000 100%);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 14px 28px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  box-shadow: 
    0 4px 0 #8B0000,           /* Bottom "brick" shadow */
    0 6px 12px rgba(0,0,0,0.2);
  transition: all 0.15s ease;
}

.button-primary:hover {
  transform: translateY(-2px);
  box-shadow: 
    0 6px 0 #8B0000,
    0 8px 16px rgba(0,0,0,0.25);
}

.button-primary:active {
  transform: translateY(2px);
  box-shadow: 
    0 2px 0 #8B0000,
    0 3px 6px rgba(0,0,0,0.2);
}
```

### Cards (Building Block Style)
```css
.card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 
    0 4px 0 rgba(0,0,0,0.1),
    0 8px 24px rgba(0,0,0,0.1);
  border: 3px solid #1A1A1A;
}
```

### Cube Face Grid (3×3)
```css
.face-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 4px;
  padding: 8px;
  background: #1A1A1A;  /* Black border like real cube */
  border-radius: 12px;
  box-shadow: 
    0 4px 0 #000,
    0 8px 16px rgba(0,0,0,0.3);
}

.sticker {
  aspect-ratio: 1;
  border-radius: 6px;
  cursor: pointer;
  transition: transform 0.1s ease;
  border: 2px solid rgba(0,0,0,0.2);
}

.sticker:hover {
  transform: scale(1.05);
  z-index: 1;
}

.sticker:active {
  transform: scale(0.95);
}
```

### Color Palette Selector
```css
.color-swatch {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: 4px solid #1A1A1A;
  cursor: pointer;
  transition: all 0.15s ease;
  box-shadow: 0 3px 0 rgba(0,0,0,0.3);
}

.color-swatch:hover {
  transform: scale(1.1);
}

.color-swatch.active {
  transform: scale(1.15);
  border-color: #FFD700;
  box-shadow: 
    0 0 0 4px #FFD700,
    0 4px 0 rgba(0,0,0,0.3);
}
```

---

## Layout

### Page Structure
```
┌─────────────────────────────────────────────────┐
│  🧩 MAGICCUBE SOLVER                    [?]     │  ← Header (LEGO red)
├─────────────────────────────────────────────────┤
│                                                 │
│    ┌─────────────────────────────────────┐      │
│    │  STEP 1 ─── STEP 2 ─── STEP 3      │      │  ← Stepper (playful dots)
│    │    ○         ●          ○           │      │
│    └─────────────────────────────────────┘      │
│                                                 │
│    ┌─────────────────────────────────────┐      │
│    │                                     │      │
│    │         Main Content Area           │      │  ← Card container
│    │                                     │      │
│    │    [Color Palette]                  │      │
│    │                                     │      │
│    │    [Cube Face Grids]                │      │
│    │                                     │      │
│    └─────────────────────────────────────┘      │
│                                                 │
│         [ 🎯 SOLVE MY CUBE! ]                   │  ← CTA Button
│                                                 │
└─────────────────────────────────────────────────┘
```

### Cube Net Layout (Unfolded)
```
            ┌───────┐
            │   U   │
            │ (top) │
            └───────┘
┌───────┬───────┬───────┬───────┐
│   L   │   F   │   R   │   B   │
│(left) │(front)│(right)│(back) │
└───────┴───────┴───────┴───────┘
            ┌───────┐
            │   D   │
            │(bottom)│
            └───────┘
```

---

## Iconography
- Use rounded, friendly icons
- Recommended: **Phosphor Icons** or **Lucide** (playful feel)
- Icon style: Bold, filled, with slight rounded corners

### Key Icons Needed
- 🧩 Cube / Puzzle
- 📷 Camera
- 🎨 Palette
- ✅ Check / Success
- ⚠️ Warning
- 🔄 Reset / Refresh
- 📋 Copy
- ❓ Help

---

## Animation & Micro-interactions

### Principles
- **Bouncy**: Use spring-like easing for playfulness
- **Responsive**: Immediate feedback on interaction
- **Delightful**: Small surprises (confetti on solve?)

### Easing
```css
--ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);
--ease-smooth: cubic-bezier(0.4, 0, 0.2, 1);
```

### Suggested Animations
| Element | Trigger | Animation |
|---------|---------|-----------|
| Buttons | Hover | Lift up + shadow increase |
| Buttons | Click | Press down (squish) |
| Stickers | Click | Quick scale pulse |
| Color Swatch | Select | Pop + glow ring |
| Solve Button | Success | Shake + confetti burst 🎉 |
| Error | Invalid | Shake left-right |
| Step transition | Navigate | Slide + fade |

---

## Responsive Breakpoints
```css
--mobile:  480px;
--tablet:  768px;
--desktop: 1024px;
--wide:    1280px;
```

### Mobile Adaptations
- Stack cube faces vertically (scrollable)
- Larger touch targets (min 48×48px)
- Bottom-fixed color palette
- Full-width buttons

---

## Sample UI Mockup (ASCII)

### Desktop View - Enter Colors Step
```
╔═══════════════════════════════════════════════════════════════════╗
║  🧩 MAGICCUBE SOLVER                               [Help] [About] ║
╠═══════════════════════════════════════════════════════════════════╣
║                                                                   ║
║      ● ─────────── ● ─────────── ○                                ║
║    Welcome      Colors       Solve!                               ║
║                                                                   ║
║  ┌─────────────────────────────────────────────────────────────┐  ║
║  │                                                             │  ║
║  │   SELECT A COLOR:                                           │  ║
║  │   ⬜ 🟨 🟥 🟧 🟩 🟦                                          │  ║
║  │    W  Y  R  O  G  B                                         │  ║
║  │                                                             │  ║
║  │   ENTER YOUR CUBE:                                          │  ║
║  │                     ┌─────────┐                             │  ║
║  │                     │ ⬜⬜⬜ │ U                             │  ║
║  │                     │ ⬜⬜⬜ │                               │  ║
║  │                     │ ⬜⬜⬜ │                               │  ║
║  │                     └─────────┘                             │  ║
║  │   ┌─────────┬─────────┬─────────┬─────────┐                 │  ║
║  │   │ 🟧🟧🟧 │ 🟩🟩🟩 │ 🟥🟥🟥 │ 🟦🟦🟦 │                 │  ║
║  │   │ 🟧🟧🟧 │ 🟩🟩🟩 │ 🟥🟥🟥 │ 🟦🟦🟦 │ L F R B         │  ║
║  │   │ 🟧🟧🟧 │ 🟩🟩🟩 │ 🟥🟥🟥 │ 🟦🟦🟦 │                 │  ║
║  │   └─────────┴─────────┴─────────┴─────────┘                 │  ║
║  │                     ┌─────────┐                             │  ║
║  │                     │ 🟨🟨🟨 │ D                             │  ║
║  │                     │ 🟨🟨🟨 │                               │  ║
║  │                     │ 🟨🟨🟨 │                               │  ║
║  │                     └─────────┘                             │  ║
║  │                                                             │  ║
║  └─────────────────────────────────────────────────────────────┘  ║
║                                                                   ║
║               [ 🎯 SOLVE MY CUBE! ]        [ Reset ]              ║
║                                                                   ║
╚═══════════════════════════════════════════════════════════════════╝
```

---

## Brand Voice
- **Fun**: "Let's fix that cube!"
- **Encouraging**: "You've got this! Just 20 moves to go."
- **Playful**: "Oops! Looks like you have 10 yellows. That's one too many!"
- **Celebratory**: "🎉 Cube solved! You're a puzzle master!"

---

## Implementation Notes (MUI)

### Theme Configuration
```javascript
const theme = createTheme({
  palette: {
    primary: { main: '#E3000B' },      // LEGO red
    secondary: { main: '#0055BF' },    // LEGO blue
    background: { default: '#FFF9E6' },
    success: { main: '#00852B' },
  },
  typography: {
    fontFamily: '"Nunito", "Poppins", sans-serif',
    h1: { fontWeight: 800, textTransform: 'uppercase' },
    button: { fontWeight: 700, letterSpacing: '0.5px' },
  },
  shape: { borderRadius: 12 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          boxShadow: '0 4px 0 rgba(0,0,0,0.2)',
          '&:hover': { transform: 'translateY(-2px)' },
          '&:active': { transform: 'translateY(2px)' },
        },
      },
    },
  },
});
```

---

## Assets Needed
- [ ] Logo / Wordmark (MAGICCUBE)
- [ ] Favicon (cube icon)
- [ ] Social share image (Open Graph)
- [ ] Loading animation (spinning cube?)
- [ ] Success celebration (confetti or fireworks)

---

## References
- LEGO.com design patterns
- LEGO instruction booklet aesthetics
- Rubik's brand colors
- Playful SaaS landing pages (Notion, Linear)
