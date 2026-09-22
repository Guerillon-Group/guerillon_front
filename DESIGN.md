---
version: alpha
name: "MBIYO Real Estate"
description: "A location-first real-estate experience for finding verified apartments in major Congolese cities."
colors:
  forest: "#16381e"
  gold: "#c5a059"
  canvas: "#f8faf7"
  surface: "#ffffff"
  ink: "#111827"
  muted: "#5a655d"
  border: "rgba(22, 56, 30, 0.1)"
typography:
  display:
    fontFamily: "Hanken Grotesk, ui-sans-serif, sans-serif"
  sans:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
rounded:
  DEFAULT: "0.85rem"
  hero: "2rem"
  pill: "9999px"
spacing:
  page-max: "1360px"
  content-max: "1280px"
  section-gap: "5rem"
components:
  button: { emphasis: "forest solid, with pill-shaped public CTAs" }
  search: { emphasis: "elevated white search rail" }
  listing-card: { emphasis: "image-led, quiet metadata" }
---

# MBIYO Real Estate Design System

## Overview

### Creative North Star

MBIYO should feel like arriving at a well-kept residence: calm, grounded and clear. The signature is the deep forest-green home panel paired with a full-bleed apartment image and an elevated search rail.

### Product context and register

- **Audience and primary job:** people looking to rent apartments in Goma, Bukavu and Kinshasa; find an available home and begin a booking without ambiguity.
- **Locale:** French-first interface; prices use French number formatting and USD where supplied by the catalogue.
- **Register:** hybrid. Public discovery is editorial and image-led; booking, dashboards and forms remain familiar product UI.
- **Restraint:** catalogues, filters and booking steps should use open space and clear labels rather than decorative cards.
- **Anti-references:** generic luxury-property dashboards, beige real-estate templates and over-badged marketplace cards.
- **Token ownership/runtime mapping:** `app/globals.css` is the canonical runtime theme. This file documents those CSS variables and public-page conventions.

## Colors

Forest (`#16381e`) is the primary action and anchoring surface. Gold (`#c5a059`) is reserved for verification and small highlights, never a large background. Canvas stays cool white-green (`#f8faf7`) and content surfaces are true white.

## Typography

Hanken Grotesk carries high-impact property and page headings; Inter carries controls, locations and booking information. Headings are compact with tight tracking; body copy stays conversational and readable.

## Layout

Public pages use a 1360px outer shell and a 1280px content rail. The home hero becomes a stacked composition below the large breakpoint; the search rail remains usable as vertically grouped fields on small screens.

## Elevation & Depth

Use elevation sparingly: the home hero receives one soft deep shadow and the search rail floats over it. Listing cards are mostly flat until hover or focus. Borders remain low-contrast forest hairlines.

## Shapes

Use 2rem corners for landmark media blocks, `0.85rem` for ordinary surfaces and full pills for public CTAs, tabs and search actions. Lucide is the shared outline icon family.

## Components

### Foundational visual states

Interactive controls show a visible forest focus ring, a slight pressed scale and a non-interactive disabled state. Image cards reserve their media geometry and switch to a local apartment fallback when an API image cannot load.

### Navigation and data display

The rental catalogue starts with apartment discovery. Filters remain text-labelled and horizontally scrollable on mobile. Listing images lead, with district and price as the immediate second read.

### Motion

Use short content reveal and hover transitions only. All transitions respect the global reduced-motion rule in `app/globals.css`.

## Do's and Don'ts

- **Do:** let an apartment image and the search task lead the first screen.
- **Do:** use gold only to signal trust, location or small emphasis.
- **Don't:** turn every property detail into a pill or status badge.
- **Don't:** substitute a broken API image with an empty or corrupted media area.
