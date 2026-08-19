# Plan: Update Website Styling and Content

## Context
The user requested several updates to the website to improve design and content.
- Update navbar blue color to match project branding.
- Remove Trustees section.
- Update hero section (swap H1 and H2).
- Remove 4 Pillars of ActivHR section.
- Replace "Ready to modernize HR" section with "Get in touch" content.
- Remove "How staff clock in" from footer.
- Adjust navbar spacing.

## Critical Files
- `src/components/site/site-header.tsx`
- `src/components/site/site-footer.tsx`
- `src/app/page.tsx`

## Design Approach
- **Navbar**: Update `bg-[#004990]` in `src/components/site/site-header.tsx` to the correct blue, and adjust `gap-1` to spacing for balanced alignment.
- **Trustees**: Search for trustees section in the codebase and remove it.
- **Hero**: Swap `h1` and `h2` elements in `src/app/page.tsx` as requested.
- **4 Pillars**: Locate and remove the 4 pillars section in `src/app/page.tsx`.
- **Get in touch**: Remove "Ready to modernize" section and update contact section in `src/app/page.tsx`.
- **Footer**: Remove "How staff clock in" link in `src/components/site/site-footer.tsx`.

## Verification
- Run the app and visually check the homepage.
- Check the navbar blue color against project standards (or visually confirm it's consistent).
- Ensure removed sections are gone.
- Verify navbar spacing.
