# FarmFleet Design System

## Direction

Field Ledger is a practical operations console built for CHC teams working in changing light and on mobile devices. It uses a warm paper canvas and deep ink frame to make statuses, times, and next actions easy to scan. Harvest orange is reserved for live work and primary decisions; moss marks healthy field state; signal yellow marks planning and attention.

## Typography

IBM Plex Sans carries the interface and headings. IBM Plex Mono is reserved for dates, times, IDs, and compact operational labels. Headings use tight tracking and stepped weights; body copy stays short and readable.

## Color Roles

- Ink `#17211d`: navigation, dark frames, primary text
- Paper `#f4f0e6`: panels and form surfaces
- Canvas `#e9e5da`: page ground and quiet zones
- Harvest `#e36b2c`: primary action, live state, key emphasis
- Moss `#42604a`: healthy field state and supporting callouts
- Signal `#f1c45b`: planning state, selected time slots, attention
- Line `#d2cdbd`: rules and table structure

## Composition

Pages lead with a compact operational intro, then a dense data surface. The dashboard puts today's run sheet beside attention items and keeps fleet status below. Tables use ruled rows and a fixed mono rhythm. Schedule uses a machine-first timeline with hour rails, status blocks, and AI duration markers. Mobile collapses to a single column while preserving the task/action order.

## Components

Buttons are rectangular with a small radius and explicit action labels. Panels have thin rules and no decorative gradients. Status badges pair a colored dot with text and never rely on color alone. Empty, loading, error, consent, preview, and confirmation states are all represented in the primary flows.

## Interaction

The authored motion is limited to the recording pulse and short feedback states. Voice capture always shows consent before microphone access, keeps extracted data editable, and requires an explicit schedule decision. Schedule changes expose old and new times before acceptance.
