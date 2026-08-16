# Legal Pages Design Spec

## Overview
Create three new pages: Cookie Policy, Privacy Policy, and Terms of Service based on provided Word documents, matching the existing site theme.

## Design Decisions

### Architecture
- Create three new page files in `src/app/[page-name]/page.tsx`
- Use the existing layout from `src/app/layout.tsx` for consistent theming
- Content will be extracted from the Word documents with minimal HTML formatting

### Content Structure
Each page will follow this pattern:
1. **Header**: Uses the site's font-serif styling with RevealHeading animations
2. **Content**: Plain text paragraphs with appropriate spacing
3. **Footer**: Will show the updated SiteFooter with new "Legal" column

### Styling Approach
- Reuse existing CSS classes from globals.css and component styles
- Use `font-serif` for headings
- Use `text-muted-foreground` or `text-pac-paper/70` for body text
- Maintain consistent spacing with `py-16` or similar padding
- Use `max-w-6xl mx-auto px-6` container pattern

### Footer Update
- Add a new "Legal" column to COLUMNS array in `site-footer.tsx`
- Column will contain links to:
  - Cookie Policy: `/cookie-policy`
  - Privacy Policy: `/privacy-policy`
  - Terms of Service: `/terms-of-service`
- Positioned between Industries and Company columns as requested

### Content Handling
- Extract raw text from .docx files using simple tag stripping
- Preserve paragraph breaks
- Leave `[[PLACEHOLDER]]` markers as-is for user to fill in later
- No additional HTML formatting or styling applied to content

## Implementation Plan
1. Create `src/app/cookie-policy/page.tsx`
2. Create `src/app/privacy-policy/page.tsx`
3. Create `src/app/terms-of-service/page.tsx`
4. Update `src/components/site/site-footer.tsx` to add Legal column
5. Test all pages render correctly

## Success Criteria
- Pages are accessible at their respective URLs
- Visual theme matches existing site (dark mode, fonts, spacing)
- Footer shows new Legal column with working links
- Content from Word documents is displayed correctly
- No broken links or 404 errors