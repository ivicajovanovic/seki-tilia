---
name: remotion-best-practices
description: Official agency-grade Remotion motion design best practices for programmatic video generation. Use whenever designing, animating, or reviewing Remotion video compositions, Reels, or motion treatments.
metadata:
  version: "1.0"
---

# Remotion Motion Design Best Practices

Create agency-grade, frame-perfect video animations using Remotion and React.

## Core Motion Principles

### 1. Physics-Based Spring Animations (`spring()`)
- Prefer `spring({ frame, fps, config })` over linear `interpolate()` for movement, scale, and positioning.
- Use tailored spring configs:
  - **Hero elements & Product reveal**: `stiffness: 90, damping: 12, mass: 0.8` (natural weight, subtle organic overshoot)
  - **UI pills & Badges**: `stiffness: 140, damping: 14` (snappy, energetic)
  - **Text & Headlines**: `stiffness: 80, damping: 16` (smooth, controlled glide)
  - **Footers & Scrims**: `stiffness: 60, damping: 18` (calm, stable)

### 2. Staggered Entrance Choreography
- Never animate all elements simultaneously.
- Use a 3-step or 4-step delay chain:
  1. Background & Header (0s - 0.2s)
  2. Headline & Core Offer Pill (0.2s - 0.5s)
  3. Podium & Hero Product Box (0.4s - 0.7s)
  4. Supporting Text & CTA Footer (0.6s - 0.9s)

### 3. Composition & Sizing Standards
- Product packaging must be bold, hero-sized, and optical centerpieces (45–65% of composition height).
- Podiums and support structures must sit low on the canvas so product packaging rests grounded in the lower-middle zone without crowding top headlines.

### 4. Frame-Perfect Execution
- Always drive animations via `useCurrentFrame()` and `useVideoConfig()`.
- Never use CSS `@keyframes` or Tailwind transition classes for video timing.
- Ensure all video compositions run at 30 fps with exact frame bounds.
