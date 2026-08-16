# Legal Pages Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create Cookie Policy, Privacy Policy, and Terms of Service pages and update the footer.

**Architecture:** Create new page routes in Next.js, extract text content, and update the existing SiteFooter component.

**Tech Stack:** Next.js (App Router), Tailwind CSS.

## Global Constraints
- Theme: Dark mode (default), IBM Plex Sans, IBM Plex Mono, Source Serif 4.
- Container: `max-w-6xl mx-auto px-6`
- Footer link format: New "Legal" column in `SiteFooter`
- Placeholder markers: `[[PLACEHOLDER]]` must be preserved.

---

### Task 1: Create Cookie Policy Page

**Files:**
- Create: `src/app/cookie-policy/page.tsx`

**Interfaces:**
- Produces: Route `/cookie-policy`

- [ ] **Step 1: Create page.tsx with basic layout**
- [ ] **Step 2: Add content extracted from docx**
- [ ] **Step 3: Apply serif heading and layout classes**
- [ ] **Step 4: Commit**

### Task 2: Create Privacy Policy Page

**Files:**
- Create: `src/app/privacy-policy/page.tsx`

**Interfaces:**
- Produces: Route `/privacy-policy`

- [ ] **Step 1: Create page.tsx with basic layout**
- [ ] **Step 2: Add content extracted from docx**
- [ ] **Step 3: Apply serif heading and layout classes**
- [ ] **Step 4: Commit**

### Task 3: Create Terms of Service Page

**Files:**
- Create: `src/app/terms-of-service/page.tsx`

**Interfaces:**
- Produces: Route `/terms-of-service`

- [ ] **Step 1: Create page.tsx with basic layout**
- [ ] **Step 2: Add content extracted from docx**
- [ ] **Step 3: Apply serif heading and layout classes**
- [ ] **Step 4: Commit**

### Task 4: Update Footer

**Files:**
- Modify: `src/components/site/site-footer.tsx`

**Interfaces:**
- Consumes: URLs for `/cookie-policy`, `/privacy-policy`, `/terms-of-service`

- [ ] **Step 1: Add new column to COLUMNS array**
- [ ] **Step 2: Verify footer renders links correctly**
- [ ] **Step 3: Commit**
