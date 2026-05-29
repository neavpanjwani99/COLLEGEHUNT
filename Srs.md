codex# Software Requirements Specification (SRS)
# CollegeHunt — College Discovery Platform
# Version: 1.0
# Date: 2026-05-23
# Author: Frontend Engineer (Track B)

---

## Table of Contents

1. [Introduction](#1-introduction)
2. [Overall Description](#2-overall-description)
3. [System Features & Functional Requirements](#3-system-features--functional-requirements)
4. [External Interface Requirements](#4-external-interface-requirements)
5. [Non-Functional Requirements](#5-non-functional-requirements)
6. [Data Model & Persistence](#6-data-model--persistence)
7. [State Management Architecture](#7-state-management-architecture)
8. [Edge Cases & Error Handling](#8-edge-cases--error-handling)
9. [Testing Matrix](#9-testing-matrix)
10. [Deployment & Performance](#10-deployment--performance)
11. [Appendix: Asset Inventory](#11-appendix-asset-inventory)

---

## 1. Introduction

### 1.1 Purpose
This SRS defines the complete functional and non-functional requirements for **CollegeHunt**, a Next.js 14 web application that enables Indian students to discover, compare, and evaluate colleges through an interactive, engagement-driven interface.

### 1.2 Intended Audience
- Frontend Engineer (implementer)
- UI/UX Evaluator
- QA Engineer
- Deployment Engineer

### 1.3 Project Scope
**In Scope:**
- College listing with multi-criteria filtering
- Full-text search across names, locations, and courses
- College detail page with tabbed information architecture
- Side-by-side college comparison (max 3 colleges)
- Persistent user state across sessions (no backend required)
- Responsive design (375px to 1440px+)

**Out of Scope:**
- User authentication / login system
- Real-time data APIs (all data is local JSON mock)
- Payment processing
- Admin dashboard
- Backend database

### 1.4 Definitions & Acronyms

| Term | Definition |
|------|------------|
| **NIRF** | National Institutional Ranking Framework (India) |
| **FFCS** | Fully Flexible Credit System (VIT's scheduling system) |
| **LPA** | Lakhs Per Annum (salary unit) |
| **NAAC** | National Assessment and Accreditation Council |
| **NBA** | National Board of Accreditation |
| **Quick View** | Modal overlay showing college preview without page navigation |
| **Compare Drawer** | Sticky bottom bar showing selected comparison colleges |
| **Engagement Loop** | Psychological pattern designed to retain user attention |

### 1.5 References
- Next.js 14 App Router Documentation
- TailwindCSS v3 Design System
- Framer Motion Animation Library
- Lucide React Icon Set

---

## 2. Overall Description

### 2.1 Product Perspective
CollegeHunt is a standalone client-side web application. It operates entirely within the browser using local JSON data and browser storage (localStorage). No server-side rendering of dynamic data is required, though Next.js App Router static generation should be leveraged for performance.

### 2.2 User Classes

| User Class | Characteristics | Primary Needs |
|------------|----------------|---------------|
| **Prospective Student** | 17-21 years old, first-time college searcher | Simple filters, visual comparison, fees clarity |
| **Parent** | 45-55 years old, decision influencer | Trust signals (ranking, accreditation), contact info |
| **Researcher** | 22-25 years old, postgraduate planner | Detailed placement stats, course structures |
| **Counselor** | 30-50 years old, advising multiple students | Quick comparison, exportable shortlists |

### 2.3 Operating Environment
- **Browser Support:** Chrome 110+, Firefox 110+, Safari 16+, Edge 110+
- **Minimum Viewport:** 375px width (iPhone SE)
- **Target Viewport:** 390px - 1440px
- **Network:** Optimized for 3G+ (lazy loading images, minimal JS bundles)

### 2.4 Design Constraints
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript (strict mode enabled, `tsconfig.json` must have `"strict": true`)
- **Styling:** TailwindCSS with custom design tokens
- **State:** React useState + useContext ONLY. No Redux, Zustand, Jotai, or external state libraries.
- **Data:** Local JSON in `/data` folder. No fetch() calls to external APIs.
- **Icons:** lucide-react ONLY. No FontAwesome, Material Icons, or custom SVG icon sets.

### 2.5 Assumptions
- User has JavaScript enabled
- localStorage is available and not in private/incognito mode (graceful degradation required)
- Images may fail to load (fallback placeholder must exist)
- User may navigate directly to any URL (deep linking must work)

---

## 3. System Features & Functional Requirements

### 3.1 Feature 1: College Listing + Search

#### 3.1.1 Description
Display all colleges in a responsive grid. Allow users to search by name/location and filter by category, type, fees range, rating, and location. Results update instantly without page reload.

#### 3.1.2 Functional Requirements

**FR-1.1: Search Input**
- A search bar must accept free-text input
- Search must match against: `college.name` and `college.location`
- Matching must be case-insensitive (`toLowerCase()` comparison)
- Search must debounce at 150ms to prevent excessive re-renders
- Placeholder text: "Search colleges, courses, cities..."
- Search icon (lucide `Search`) must appear on the left inside the input
- Input background: `bg-surface` (#F1F5F9)
- Border: invisible by default, visible `border-primary` on focus
- Focus ring: `ring-2 ring-primary/20`
- Clear button (X icon) appears when text is entered; clicking clears input

**FR-1.2: Category Filter**
- Options: All, Engineering, Management, Medical, Arts, Commerce
- Presentation: Clickable chips/pills
- Active state: `bg-primary text-white`
- Inactive state: `bg-surface text-text-secondary hover:bg-border`
- "All" is default selected
- Only one category can be active at a time (radio behavior, not checkbox)

**FR-1.3: College Type Filter**
- Options: All, Government, Private, Deemed
- Same chip presentation as Category
- Same selection behavior (single select)

**FR-1.4: Minimum Rating Filter**
- Options: 3+, 3.5+, 4+, 4.5+
- Presentation: Clickable buttons with star icon
- Active state: `bg-amber-50 text-amber-700 border-amber-200`
- Logic: `college.rating >= selectedMinRating`
- "Any" (no filter) is default; deselecting an active rating returns to "Any"

**FR-1.5: Fees Range Filter**
- Two number inputs: "Min Fees (₹)" and "Max Fees (₹)"
- Input type: `number` with `min="0"`
- Validation: If min > max, show inline error "Min fees cannot exceed max fees"
- Logic: `college.fees >= minFees AND college.fees <= maxFees`
- Empty input = no bound on that side
- Format display: inputs accept raw numbers, labels show "₹" prefix

**FR-1.6: Location Text Filter**
- Single text input: "Filter by city or state"
- Case-insensitive partial match against `college.location`
- Example: "Delhi" matches "New Delhi, Delhi"

**FR-1.7: Filter Combination Logic**
- ALL active filters must be applied simultaneously (AND logic, not OR)
- Search + Category + Type + Rating + Fees + Location must work together
- Example: Search="IIT" + Category="Engineering" + Rating="4.5+" must show only IIT Bombay and IIT Delhi

**FR-1.8: Active Filter Display**
- Selected filters must appear as removable chips above the grid
- Each chip shows filter name + value + X button
- Clicking X removes that filter and updates results instantly
- "Clear All Filters" button appears when any filter is active
- Button positioned top-right of filter panel

**FR-1.9: Sort Options**
- Dropdown select with options:
  - "Rating: High to Low" (`rating-desc`)
  - "Fees: Low to High" (`fees-asc`)
  - "Fees: High to Low" (`fees-desc`)
  - "Rank: Best First" (`rank-asc`)
  - "Reviews: Most First" (`reviews-desc`)
- Default: "Rating: High to Low"
- Sort applies to filtered results, not entire dataset

**FR-1.10: Results Count**
- Display: "Showing X of Y colleges"
- X = currently displayed (after pagination)
- Y = total filtered count
- Must update instantly on any filter/sort change
- If Y = 0, show "No colleges found" empty state

**FR-1.11: Pagination**
- 9 colleges per page
- Controls: Previous button, page numbers (1, 2, 3...), Next button
- Previous disabled on page 1
- Next disabled on last page
- Page numbers show current page as `bg-primary text-white`
- Ellipsis (...) for gaps if > 5 pages
- Page change scrolls grid to top

**FR-1.12: Empty State**
- When no colleges match filters:
  - Centered illustration (graduation cap emoji or lucide `School` icon at 64px)
  - Text: "No colleges found matching your filters"
  - Subtext: "Try adjusting your search or filters"
  - Button: "Clear All Filters" (resets everything)

**FR-1.13: Loading State**
- On initial page load, show 6 skeleton cards
- Skeleton must pulse with `animate-pulse`
- Skeleton mimics card layout: image box, title box, 3 line boxes, button box
- Loading duration: simulated 800ms via `setTimeout`
- After 800ms, fade in actual content with `animate-fade-in`

---

### 3.2 Feature 2: College Detail Page

#### 3.2.1 Description
Dedicated page for each college showing comprehensive information organized in tabs. URL pattern: `/colleges/[id]`.

#### 3.2.2 Functional Requirements

**FR-2.1: Route Resolution**
- Dynamic route: `/colleges/[id]` where `id` matches `college.id` from data
- If `id` not found in data array, render 404-style page:
  - Large "College not found" heading
  - Subtext: "The college you're looking for doesn't exist in our database"
  - Button: "Browse All Colleges" linking to `/colleges`
  - Breadcrumb still shows: Home > Colleges > Not Found

**FR-2.2: Breadcrumb Navigation**
- Position: Top of page, above hero section
- Format: Home > Colleges > [College Name]
- "Home" links to `/`
- "Colleges" links to `/colleges`
- Current page (college name) is plain text, not a link
- Separator: `ChevronRight` icon from lucide
- Text color: `text-text-muted` for links, `text-text-primary` for current

**FR-2.3: Hero Section Layout**
- Two-column layout on desktop (left: image, right: info)
- Single column on mobile (image full width, info below)

**Hero Left — Image:**
- Next.js `Image` component with `fill` or fixed dimensions
- Aspect ratio: 16:9 on desktop, 4:3 on mobile
- Rounded corners: `rounded-xl`
- Object fit: `cover`
- Fallback: if `imageUrl` empty or load fails, show placeholder-college.png
- Subtle shadow: `shadow-card`

**Hero Right — Information:**
- College name: `h1`, `text-3xl md:text-4xl`, `font-bold`, `text-text-primary`
- Location: `MapPin` icon + text, `text-text-secondary`
- Type badge: uses Badge component with variant mapping:
  - Government → `success` (green)
  - Private → `info` (blue)
  - Deemed → `warning` (amber)
- Rating: `RatingStars` component + numeric value + review count
  - Format: "4.8 (3,420 reviews)"
  - Review count formatted with commas: `toLocaleString("en-IN")`
- Established year: "Established 1958" with `Calendar` icon
- Tags: horizontal wrap of Badge components (default variant, small size)
- Annual fees: prominently displayed
  - Label: "Annual Fees"
  - Value: `formatFees(college.fees)` — large bold text
  - Color: `text-text-primary`

**Hero Actions:**
- "Visit Website" button: `outline` variant, opens `college.website` in new tab (`target="_blank"`, `rel="noopener noreferrer"`), uses `ExternalLink` icon
- "Add to Compare" button: `primary` variant if not in compare list, `secondary` if already added
  - Toggle behavior: click once to add, click again to remove
  - If compare list is full (3/3) and college not in list, show toast instead of adding

**FR-2.4: Tab Navigation**
- Tabs: Overview, Courses, Placements, Reviews
- Default active: Overview
- Presentation: horizontal row of text buttons
- Active tab: `text-primary` with bottom border `border-b-2 border-primary`
- Inactive tab: `text-text-muted hover:text-text-secondary`
- On mobile: horizontally scrollable (`overflow-x-auto scrollbar-hide`)
- Tab content area: `mt-8`
- Tab switch: instant, no loading state

**FR-2.5: Overview Tab**
- College.overview text as paragraph
  - Typography: `text-lg`, `text-text-secondary`, `leading-relaxed`
  - Max width: `max-w-3xl`
- Below text: Stats Grid (3 columns desktop, 2 tablet, 1 mobile)
  - Stats to show:
    1. Total Courses — `BookOpen` icon, number, label "Courses"
    2. Placement Rate — `TrendingUp` icon, percentage, label "Placement Rate"
    3. Average Package — `IndianRupee` icon, formatted amount, label "Avg Package"
    4. Highest Package — `Trophy` icon, formatted amount, label "Highest Package"
    5. Year Established — `Calendar` icon, year, label "Established"
  - Each stat card: white bg, border, rounded-lg, padding-4, centered icon
  - Number: `text-2xl font-bold text-text-primary`
  - Label: `text-sm text-text-muted`
  - Icon: `w-5 h-5 text-primary mb-2`

**FR-2.6: Courses Tab**
- Table presentation
- Columns: Course Name, Duration, Annual Fees
- Header row: `bg-surface`, `text-text-secondary`, `font-semibold`, `text-sm`
- Data rows: alternating backgrounds (`even:bg-white odd:bg-surface/50`)
- Course Name: `text-text-primary font-medium`
- Duration: `text-text-secondary`
- Fees: `formatFees(course.fees)`, right-aligned
- If courses array empty: centered message "Course information not available" with `BookX` icon
- Table responsive: horizontal scroll on mobile (`overflow-x-auto`)

**FR-2.7: Placements Tab**
- Three big number highlights at top (horizontal row):
  - Average Package: `formatPackage(placements.averagePackage)`
  - Highest Package: `formatPackage(placements.highestPackage)`
  - Placement Rate: `${placements.placementRate}%`
  - Each: large number (`text-3xl font-bold`), label below (`text-sm text-text-muted`), icon above
  - Container: `bg-surface rounded-xl p-6`

- Progress Bar for Placement Rate:
  - Track: `bg-border rounded-full h-4`
  - Fill: `bg-success rounded-full h-4`
  - Width: `${placementRate}%`
  - Animation: width transitions from 0% to actual value over 1s on tab mount
  - Label above bar: "Placement Rate" + percentage

- Top Recruiters Section:
  - Heading: "Top Recruiters" with `Building2` icon
  - Each recruiter as a chip/pill: `bg-white border border-border rounded-full px-4 py-2 text-sm text-text-secondary`
  - Layout: flex wrap with gap-2
  - If empty: "Recruiter information not available"

**FR-2.8: Reviews Tab**
- Overall Rating Header:
  - Large number: `college.rating` in `text-5xl font-bold text-text-primary`
  - Stars below: `RatingStars` at large size
  - Review count: "Based on X reviews" in `text-text-muted`
  - Layout: centered card at top of tab

- Individual Review Cards:
  - Layout: vertical stack with gap-4
  - Each card: white bg, border, rounded-lg, padding-4
  - Avatar: colored circle with initials (`getInitials(author)`), random background color per author
  - Author name: `font-semibold text-text-primary`
  - Date: `text-xs text-text-muted` (formatted as "Nov 15, 2024")
  - Rating: `RatingStars` small size
  - Comment: `text-text-secondary leading-relaxed`
  - If reviews empty: "No reviews yet. Be the first to review!" with `MessageSquare` icon

**FR-2.9: Contact Information**
- Displayed below tabs on all tab views (persistent)
- Section title: "Contact Information" with `Contact` icon
- Fields:
  - Phone: `Phone` icon + clickable `tel:` link
  - Email: `Mail` icon + clickable `mailto:` link
  - Website: `Globe` icon + clickable external link
- Layout: horizontal row on desktop, vertical stack on mobile
- Styled as subtle cards with `bg-surface` background

**FR-2.10: "People Also Viewed" Section**
- Position: Bottom of page, below contact info
- Heading: "People Also Viewed" with `Users` icon
- Shows 3 colleges from same category, sorted by rating descending, excluding current college
- Uses `CollegeCard` component at smaller size (compact variant)
- Horizontal scroll on mobile

---

### 3.3 Feature 3: Compare Colleges

#### 3.3.1 Description
Users select colleges via Compare button on cards. A sticky bottom drawer appears. On the compare page, colleges are shown side-by-side with highlighted winners.

#### 3.3.2 Functional Requirements

**FR-3.1: Compare Context State**
- Global state via React Context
- State shape: `compareList: College[]` (max length 3)
- Actions:
  - `addToCompare(college)`: Adds if not present and length < 3
  - `removeFromCompare(id)`: Removes by college.id
  - `clearCompare()`: Empties array
  - `isInCompare(id)`: Boolean check
- Persistence: Sync to localStorage on every change
  - Key: `CollegeHunt_compare`
  - On app load: read from localStorage, validate against current data (remove stale IDs)
- Max limit enforcement: If user tries to add 4th college, show toast:
  - Message: "Maximum 3 colleges can be compared. Remove one to add another."
  - Duration: 3 seconds
  - Type: warning (amber)

**FR-3.2: Compare Button on CollegeCard**
- Position: Bottom-right of card, next to "View Details"
- Icon: `Scale` (lucide) or custom compare icon
- States:
  - Not in compare: `outline` variant, text "Compare"
  - In compare: `secondary` variant, text "Added", checkmark icon
- Click behavior:
  - If in compare → remove, show toast "Removed from comparison"
  - If not in compare and list < 3 → add, show toast "Added to comparison"
  - If not in compare and list = 3 → show max limit toast
- Animation: Button briefly scales to 0.95 then 1.05 on click

**FR-3.3: Compare Drawer**
- Position: Fixed bottom, full width, z-index 50
- Appearance: Triggered when `compareList.length >= 1`
- Animation: `animate-slide-up` (translateY 100% → 0%)
- Disappearance: `animate-slide-down` when list becomes empty

**Drawer Layout:**
- Background: `bg-white`
- Top border: `border-t border-border`
- Shadow: `shadow-drawer` (upward shadow)
- Padding: `px-4 py-3`
- Height: auto (content-driven), max-height `200px`

**Drawer Content:**
- Left side: "Compare (X/3)" label + college chips
  - Each chip: college name (truncated to 20 chars), small X button to remove
  - Chip style: `bg-surface rounded-lg px-3 py-1.5 text-sm flex items-center gap-2`
  - Empty slots: dashed border box `border-2 border-dashed border-border rounded-lg px-3 py-1.5 text-text-muted text-sm`
  - Max 3 slots always visible (filled + empty)
- Right side: Action buttons
  - "Clear All": `ghost` variant, small size, resets list
  - "Compare Now": `primary` variant, links to `/compare`
    - Disabled state (opacity 50%, cursor not-allowed) when `compareList.length < 2`
    - Tooltip on hover when disabled: "Select at least 2 colleges"

**FR-3.4: Compare Page**
- Route: `/compare`
- If `compareList.length < 2`:
  - Centered empty state:
    - Icon: `Scale` at 64px, `text-text-muted`
    - Heading: "Compare Colleges"
    - Subtext: "Please select at least 2 colleges to compare"
    - Button: "Browse Colleges" linking to `/colleges`
  - Do NOT show table

- If `compareList.length >= 2`:
  - Page title: "Compare Colleges" with `Scale` icon
  - Subtitle: "Side-by-side comparison of your shortlisted colleges"

**Comparison Table Structure:**
- First column (sticky left): Row labels
- Subsequent columns: One per college, up to 3
- Table is horizontally scrollable on mobile
- Sticky header row

**Comparison Rows (in order):**

1. **Header Row** — College Image + Name
   - Image: 80x60px, rounded, object-cover
   - Name: bold, truncated if long
   - Remove button: small X icon top-right of column
   - Column header background: college-specific tint
     - Government: `bg-green-50/50`
     - Private: `bg-blue-50/50`
     - Deemed: `bg-amber-50/50`

2. **Location**
   - Plain text

3. **Type**
   - Badge component with appropriate variant

4. **Category**
   - Plain text with category icon

5. **National Rank**
   - Number with `#` prefix: "#1", "#15"
   - Winner: LOWEST number gets highlight (green bg + crown icon)
   - Highlight style: `bg-success-light text-success-dark font-semibold`

6. **Overall Rating**
   - Number + stars
   - Winner: HIGHEST rating gets highlight

7. **Total Reviews**
   - Number formatted with commas
   - Winner: HIGHEST count gets highlight

8. **Annual Fees**
   - `formatFees()` output
   - Winner: LOWEST fees gets highlight (affordability wins)

9. **Established Year**
   - Plain year
   - No winner highlight (older is not necessarily better)

10. **Average Package**
    - `formatPackage()` output
    - Winner: HIGHEST package gets highlight

11. **Highest Package**
    - `formatPackage()` output
    - Winner: HIGHEST package gets highlight

12. **Placement Rate**
    - Percentage + small progress bar
    - Winner: HIGHEST rate gets highlight

13. **Number of Courses**
    - Count
    - Winner: HIGHEST count gets highlight

14. **Tags**
    - Comma-separated or small chips
    - No winner highlight

**Winner Highlight Rules:**
- A cell gets `bg-success-light` background + `text-success-dark` text + `font-semibold`
- Crown icon (`Crown` from lucide) appears next to winner value
- If tie for winner, ALL tied cells get highlight
- Non-numeric rows never get highlight

**FR-3.5: Remove from Comparison Table**
- Each college column header has X button
- Clicking removes college from compareList
- Table updates instantly
- If removal leaves only 1 college, show the "select at least 2" empty state
- Animation: Column fades out over 300ms before re-render

**FR-3.6: Add More Colleges from Compare Page**
- If compareList has 1 or 2 colleges, show empty column placeholders
- Placeholder: dashed border, "+ Add College" button
- Button links to `/colleges` with compare drawer still visible
- On `/colleges`, user can add more; drawer updates in real-time

---

### 3.4 Feature 4: Homepage

#### 3.4.1 Description
Landing page designed to immediately engage users and funnel them into discovery.

#### 3.4.2 Functional Requirements

**FR-4.1: Hero Section**
- Full-width section, `bg-gradient-to-b from-white to-background-page`
- Centered content, max-width `max-w-4xl`
- Headline: "Find Your Perfect College" — `text-4xl md:text-5xl font-bold text-text-primary text-center`
- Subheadline: "Discover, compare, and choose from India's top institutions with confidence." — `text-lg text-text-secondary text-center mt-4`
- Search Bar: Large centered input (same component as listing page but larger)
  - Width: `w-full max-w-2xl`
  - Height: `h-14` (taller than standard)
  - Shadow: `shadow-lg`
  - On submit/Enter: navigates to `/colleges?search={query}`
  - Keyboard shortcut hint: "Press Ctrl+K to search" — `text-xs text-text-muted` below input

**FR-4.2: Category Quick Links**
- Section title: "Explore by Category"
- 5 category cards in horizontal row (scrollable on mobile)
- Each card:
  - Icon: Category-specific lucide icon (Engineering=`Cpu`, Management=`Briefcase`, Medical=`HeartPulse`, Arts=`Palette`, Commerce=`TrendingUp`)
  - Category name
  - Subtext: "X colleges" (count from data)
  - Background: `bg-white border border-border rounded-xl p-6`
  - Hover: `shadow-card-hover`, `scale-[1.02]`, `border-primary/20`
  - Click: navigates to `/colleges?category={name}`

**FR-4.3: Top Rated Colleges**
- Section title: "Top Rated Colleges" with `Star` icon
- Shows 6 highest-rated colleges using `CollegeCard` component
- Grid: 1 mobile, 2 tablet, 3 desktop
- Data source: `getTopRatedColleges(6)`
- "View All" link to `/colleges?sort=rating-desc`

**FR-4.4: Recently Viewed Strip**
- Section title: "Continue Where You Left Off" with `History` icon
- Only visible if `recentlyViewed` localStorage array has items
- Horizontal scrollable strip of compact college cards
- Max 8 items, stored in localStorage key `CollegeHunt_recent`
- Each item: small card (image 60x40, name truncated, rating)
- Click navigates to detail page
- "Clear History" button on right side of header

**FR-4.5: Stats Banner**
- Below hero, above categories
- 3 stats in horizontal row:
  - "15+ Colleges" with `Building2` icon
  - "5 Categories" with `Layers` icon
  - "Compare up to 3" with `Scale` icon
- Style: subtle, `text-text-secondary`, centered

---

### 3.5 Feature 5: Quick View Modal (Engagement Loop)

#### 3.5.1 Description
Modal overlay allowing users to preview college details without leaving the listing page. Critical for session retention.

#### 3.5.2 Functional Requirements

**FR-5.1: Trigger**
- Clicking college card image opens Quick View
- Clicking college name navigates to detail page (standard behavior)
- Cursor: `cursor-zoom-in` on card image

**FR-5.2: Modal Structure**
- Overlay: `bg-black/50 backdrop-blur-sm`, covers full viewport
- Modal container: `bg-white rounded-2xl shadow-modal max-w-3xl w-full mx-4 max-h-[85vh] overflow-y-auto`
- Position: centered, `fixed inset-0 flex items-center justify-center z-50`
- Animation: `animate-fade-in` for overlay, `animate-bounce-in` for modal

**FR-5.3: Modal Content**
- Header: College name + type badge + close button (X icon, top-right)
- Hero: Image + key stats row (Rating, Fees, Rank, Established)
- Tabs: Overview, Courses, Placements (same as detail page but compact)
- Reviews: Show first 2 reviews with "View all X reviews" link to detail page
- Footer actions:
  - "View Full Details" button (primary) → navigates to detail page
  - "Add to Compare" button (outline) → toggles compare state
  - "Save" button (ghost) → adds to saved list (localStorage)

**FR-5.4: Close Behavior**
- Click X button
- Click outside modal (overlay)
- Press Escape key
- All close actions restore background scroll and maintain exact scroll position

**FR-5.5: Scroll Lock**
- When modal opens: `document.body.style.overflow = 'hidden'`
- When modal closes: restore previous overflow value
- Must not affect scroll position

---

### 3.6 Feature 6: Saved Colleges (Secondary Engagement Loop)

#### 3.6.1 Description
Heart/save toggle on cards and detail pages. Saved colleges persist across sessions.

#### 3.6.2 Functional Requirements

**FR-6.1: Save Toggle**
- Heart icon (`Heart` from lucide) on CollegeCard (top-right corner, overlay on image)
- On detail page: heart button next to "Add to Compare"
- States:
  - Not saved: `text-white/70 hover:text-white` (on image overlay) or `text-text-muted` (on page)
  - Saved: `text-error fill-error` (filled heart)
- Animation: `scale-125` bounce on toggle

**FR-6.2: Persistence**
- localStorage key: `CollegeHunt_saved`
- Stores array of college IDs
- On load: hydrate saved state
- On toggle: update localStorage immediately

**FR-6.3: Saved Colleges Page**
- Route: `/saved` (optional, if time permits)
- Shows grid of saved colleges
- Empty state: "No saved colleges yet" with heart icon

---

## 4. External Interface Requirements

### 4.1 User Interfaces

#### 4.1.1 Navigation Bar
- Position: sticky top-0, z-40
- Background: `bg-white/80 backdrop-blur-md` (glassmorphism)
- Bottom border: `border-b border-border`
- Height: `h-16`

**Left:**
- Logo: "CollegeHunt" text
  - Font: bold, `text-xl`, `text-primary`
  - Letter "F" stylized with `text-accent` (orange)
  - Link to `/`

**Center (desktop only):**
- Simplified search input
  - Width: `w-64`
  - Height: `h-9`
  - On submit: navigates to `/colleges?search={query}`

**Right:**
- Nav links: "Home", "Colleges", "Compare (X)"
  - "Compare (X)" only visible if compareList not empty
  - X shows count with small badge: `bg-accent text-white text-xs rounded-full px-1.5`
  - Badge animates (bounce) when count changes
  - Active link: `text-primary font-medium`
  - Inactive link: `text-text-secondary hover:text-text-primary`

**Mobile (hamburger menu):**
- Hamburger icon (`Menu`) on right
- Sheet/drawer slides from right
- Contains all nav links stacked vertically
- Background: `bg-white shadow-lg`
- Close button: X icon

#### 4.1.2 Footer
- Background: `bg-white border-t border-border`
- Padding: `py-12`
- Layout: 4 columns desktop, stacked mobile

**Column 1 — Brand:**
- Logo: "CollegeHunt"
- Tagline: "Discover your future"
- Social icons (optional): Twitter, LinkedIn, GitHub

**Column 2 — Quick Links:**
- Home, Colleges, Compare, Saved

**Column 3 — Categories:**
- Engineering, Management, Medical, Arts, Commerce

**Column 4 — Legal:**
- Privacy Policy, Terms of Service, Contact

**Bottom bar:**
- Copyright: "© 2026 CollegeHunt. All rights reserved."
- Centered, `text-sm text-text-muted`

### 4.2 Hardware Interfaces
- Not applicable (web-only application)

### 4.3 Software Interfaces
- **Next.js 14:** App Router, static generation for pages
- **TailwindCSS:** Utility-first styling
- **Framer Motion:** Component animations, AnimatePresence
- **Lucide React:** Icon library
- **localStorage:** Browser persistence API

### 4.4 Communications Interfaces
- No external API calls required
- All data is local JSON
- External links (college websites) open in new tabs

---

## 5. Non-Functional Requirements

### 5.1 Performance

**NFR-5.1.1: Initial Load**
- Time to First Contentful Paint (FCP): < 1.5s on 4G
- Largest Contentful Paint (LCP): < 2.5s
- First Input Delay (FID): < 100ms

**NFR-5.1.2: Runtime Performance**
- Filter/sort operations: < 50ms for 15 items
- Modal open/close: < 100ms with animation
- No layout shift during filter changes

**NFR-5.1.3: Bundle Size**
- Initial JS bundle: < 200KB gzipped
- Images: Use Next.js Image optimization, lazy loading
- Fonts: System font stack (Inter via next/font if available, else system-ui)

### 5.2 Reliability

**NFR-5.2.1: Error Boundaries**
- Every page must have an error boundary
- Component errors must not crash entire application
- Fallback UI: "Something went wrong. Please refresh." with reload button

**NFR-5.2.2: Data Integrity**
- Invalid college IDs in URL must show 404 page, not crash
- Malformed localStorage data must be caught and reset gracefully
- Missing optional fields (courses, reviews) must not cause render errors

### 5.3 Availability
- Client-side only; no server dependency for core functionality
- Static export compatible (can run without Node.js server)

### 5.4 Security
- All external links use `rel="noopener noreferrer"`
- No sensitive data collection (no login, no PII)
- localStorage data is non-sensitive (college IDs only)

### 5.5 Maintainability
- **Code Style:**
  - TypeScript strict mode: no `any` types
  - ESLint: Next.js recommended rules
  - Prettier: default config
- **Component Structure:**
  - Single responsibility principle
  - Props interfaces defined for every component
  - Default props for optional values
- **File Organization:**
  - Follow exact structure defined in project brief
  - Co-location: component + styles + types + tests (if any) near each other

### 5.6 Portability
- Next.js static export for deployment to any static host
- Vercel optimized (images, ISR if needed)

### 5.7 Accessibility (a11y)

**NFR-5.7.1: Keyboard Navigation**
- All interactive elements must be focusable
- Tab order: logical, top-to-bottom, left-to-right
- Enter/Space activates buttons and links
- Escape closes modals and drawers
- `Ctrl+K` opens search from anywhere

**NFR-5.7.2: Screen Readers**
- Semantic HTML: `<nav>`, `<main>`, `<article>`, `<button>`
- Alt text on all images: "[College Name] campus"
- ARIA labels on icon-only buttons: `aria-label="Add to compare"`
- Live regions for dynamic content: `aria-live="polite"` on results count

**NFR-5.7.3: Visual Accessibility**
- Color contrast: minimum 4.5:1 for normal text, 3:1 for large text
- Focus indicators: visible `ring-2 ring-primary ring-offset-2` on all focusable elements
- No information conveyed by color alone (icons + text always)

### 5.8 Localization
- Currency: Indian Rupee (₹)
- Number formatting: Indian locale (`en-IN`)
- Date formatting: "Nov 15, 2024" style
- Language: English only (no i18n required)

---

## 6. Data Model & Persistence

### 6.1 TypeScript Interfaces

```typescript
// /types/college.ts

interface Course {
  name: string;
  duration: string;
  fees: number;
}

interface Placements {
  averagePackage: number;
  highestPackage: number;
  topRecruiters: string[];
  placementRate: number; // 0-100
}

interface Review {
  author: string;
  rating: number; // 0-5, one decimal
  comment: string;
  date: string; // ISO format: "2024-11-15"
}

interface College {
  id: string; // kebab-case: "iit-bombay"
  name: string;
  location: string; // "City, State"
  type: "Private" | "Government" | "Deemed";
  category: "Engineering" | "Management" | "Medical" | "Arts" | "Commerce";
  fees: number; // annual fees in INR
  rating: number; // 0-5, one decimal
  totalReviews: number;
  rank: number; // national rank
  imageUrl: string; // path or URL
  established: number; // year
  overview: string; // 2-3 sentences
  courses: Course[];
  placements: Placements;
  reviews: Review[];
  tags: string[];
  website: string; // full URL with protocol
  phone: string; // with country code
  email: string;
}

interface CollegeFilters {
  category: string; // "All" | category name
  location: string;
  minFees: number | ""; // empty string = no min
  maxFees: number | ""; // empty string = no max
  minRating: number; // 0 = any
  type: string; // "All" | type name
}

type SortOption = 
  | "rating-desc" 
  | "fees-asc" 
  | "fees-desc" 
  | "rank-asc" 
  | "reviews-desc";
```

### 6.2 Mock Data Requirements

**Quantity:** Minimum 15 colleges
**Coverage:**
- At least 3 Engineering colleges (IIT Bombay, IIT Delhi, BITS Pilani)
- At least 2 Management colleges (IIM Ahmedabad, Symbiosis)
- At least 1 Medical college (Manipal)
- At least 1 Arts college (Christ University)
- At least 1 Commerce college (Delhi University)
- Mix of Government, Private, and Deemed types

**Realism Rules:**
- Fees must be realistic (IIT ~2L, IIM ~33L, DU ~65K)
- Packages must be realistic (IIT avg ~28L, IIM avg ~35L, DU avg ~8L)
- Ratings must follow bell curve: most between 3.8-4.6, few extremes
- Ranks must be unique per category or realistic nationally
- Reviews must sound authentic (mix of praise and mild criticism)

### 6.3 localStorage Schema

```typescript
// Key: CollegeHunt_compare
// Value: string[] — array of college IDs
// Max length: 3
// Validation on load: remove IDs not found in current data

// Key: CollegeHunt_recent
// Value: Array<{ id: string; timestamp: number }>
// Max length: 8
// Sorted by timestamp descending
// Deduplicated by ID (most recent timestamp wins)

// Key: CollegeHunt_saved
// Value: string[] — array of college IDs
// Max length: 50
// No validation required (IDs may become stale, handled gracefully)
```

### 6.4 Data Helpers

```typescript
// /data/colleges.ts

export const colleges: College[] = [...];

export const getCollegeById = (id: string): College | undefined;
// Returns college or undefined if not found

export const getCollegesByCategory = (category: string): College[];
// Returns all if "All", filtered otherwise

export const getTopRatedColleges = (limit: number): College[];
// Sorted by rating descending, sliced to limit
```

---

## 7. State Management Architecture

### 7.1 Compare Context

```typescript
// /context/CompareContext.tsx

interface CompareContextType {
  compareList: College[];
  addToCompare: (college: College) => void;
  removeFromCompare: (id: string) => void;
  clearCompare: () => void;
  isInCompare: (id: string) => boolean;
  canAddMore: boolean;
}

const CompareContext = createContext<CompareContextType | null>(null);

// Provider wraps entire app in layout.tsx
// useCompare() hook throws if used outside provider
```

**State Flow:**
1. User clicks "Compare" on CollegeCard
2. `addToCompare` called
3. State updates → React re-renders
4. localStorage syncs via useEffect
5. CompareDrawer appears (AnimatePresence)
6. Navbar badge updates (bounce animation)

### 7.2 Recent Views Tracking

```typescript
// Hook: useRecentViews()

function addRecentView(collegeId: string) {
  // Read existing from localStorage
  // Remove duplicate if exists
  // Add to front with timestamp
  // Trim to 8 items
  // Write back to localStorage
}

// Called on CollegeDetailPage mount
// Called on QuickViewModal open
```

### 7.3 Saved Colleges State

```typescript
// Hook: useSavedColleges()

interface SavedState {
  savedIds: string[];
  toggleSaved: (id: string) => void;
  isSaved: (id: string) => boolean;
}

// Syncs to localStorage: CollegeHunt_saved
// Used by CollegeCard heart button and DetailPage save button
```

### 7.4 Filter State (Page-Level)

```typescript
// /app/colleges/page.tsx

const [searchQuery, setSearchQuery] = useState("");
const [filters, setFilters] = useState<CollegeFilters>({
  category: "All",
  location: "",
  minFees: "",
  maxFees: "",
  minRating: 0,
  type: "All",
});
const [sortBy, setSortBy] = useState<SortOption>("rating-desc");
const [currentPage, setCurrentPage] = useState(1);
const [isLoading, setIsLoading] = useState(true);

// URL sync: useSearchParams to read initial state
// useEffect to update URL when filters change
```

---

## 8. Edge Cases & Error Handling

### 8.1 Data Edge Cases

| Case | Input | Expected Behavior |
|------|-------|-------------------|
| Fees = 0 | `fees: 0` | Display "Free" (e.g., FPM at IIM) |
| Fees undefined | `fees: undefined` | Display "N/A" |
| Fees null | `fees: null` | Display "N/A" |
| Rating = 0 | `rating: 0` | Show "Not rated" text, no stars |
| Rating undefined | `rating: undefined` | Show "Not rated" |
| Empty courses | `courses: []` | "Course information not available" |
| Empty reviews | `reviews: []` | "No reviews yet" |
| Empty recruiters | `topRecruiters: []` | "Recruiter information not available" |
| Missing image | `imageUrl: ""` | Show placeholder-college.png |
| Invalid image URL | 404 on load | Show placeholder-college.png |
| Very long name | > 50 chars | Truncate with ellipsis |
| Very long overview | > 500 chars | Truncate in card, full in detail |

### 8.2 User Action Edge Cases

| Case | Action | Expected Behavior |
|------|--------|-------------------|
| Compare list full | Add 4th college | Toast: "Maximum 3 colleges can be compared" |
| Add duplicate | Click Compare on already-added college | Remove from list, toast: "Removed from comparison" |
| Remove last compare | Compare page with 2 colleges, remove 1 | Show "Select at least 2" empty state |
| Clear all filters | Click "Clear All" with no active filters | No-op, button can be disabled |
| Invalid fees range | Min=500000, Max=100000 | Show inline error, disable apply |
| Direct URL with bad ID | `/colleges/invalid-id` | "College not found" page with back button |
| Direct URL with query | `/colleges?category=Engineering` | Pre-apply filter on load |
| localStorage corrupted | Invalid JSON in storage | Catch error, reset to default, console.warn |
| localStorage disabled | Incognito/private mode | App works but state not persisted; no crash |
| Rapid filter changes | User clicks 5 filters in 1 second | Debounced at 150ms, smooth updates |
| Mobile rotate | Portrait → Landscape | Layout adjusts, no content loss |

### 8.3 Error Boundaries

```typescript
// /app/error.tsx (Next.js error boundary)

export default function ErrorBoundary({ error, reset }: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-text-primary">
          Something went wrong
        </h2>
        <p className="text-text-secondary mt-2">
          {error.message || "An unexpected error occurred"}
        </p>
        <Button onClick={reset} className="mt-4">
          Try Again
        </Button>
      </div>
    </div>
  );
}
```

---

## 9. Testing Matrix

### 9.1 Manual Test Cases

**TC-1: Search Functionality**
1. Navigate to `/colleges`
2. Type "IIT" in search bar
3. Verify: Only IIT Bombay and IIT Delhi visible
4. Clear search
5. Verify: All 15 colleges visible

**TC-2: Filter Combination**
1. Select Category: "Engineering"
2. Select Type: "Government"
3. Select Rating: "4.5+"
4. Verify: Only IIT Bombay, IIT Delhi, NIT Trichy visible
5. Add Location: "Delhi"
6. Verify: Only IIT Delhi visible

**TC-3: Compare Flow**
1. Click "Compare" on IIT Bombay
2. Verify: Drawer appears with IIT Bombay chip
3. Click "Compare" on IIT Delhi
4. Click "Compare" on BITS Pilani
5. Click "Compare" on VIT Vellore
6. Verify: Toast "Maximum 3 colleges can be compared"
7. Click "Compare Now"
8. Verify: Table shows 3 columns, winner highlights visible

**TC-4: Detail Page Tabs**
1. Click "View Details" on any college
2. Verify: Overview tab active by default
3. Click "Courses" tab
4. Verify: Course table visible
5. Click "Placements" tab
6. Verify: Progress bar animates to correct percentage
7. Click "Reviews" tab
8. Verify: Review cards visible with avatars

**TC-5: Mobile Responsiveness**
1. Open DevTools, set viewport to iPhone SE (375px)
2. Navigate to `/colleges`
3. Verify: Filter button visible, grid is 1 column
4. Click Filter button
5. Verify: Filter drawer slides up
6. Close drawer
7. Verify: Scroll position maintained

**TC-6: Persistence**
1. Add 2 colleges to compare
2. Close browser tab
3. Reopen `/colleges`
4. Verify: Compare drawer still shows 2 colleges
5. Navigate to `/compare`
6. Verify: Table shows 2 columns

**TC-7: Edge Case — Invalid ID**
1. Navigate to `/colleges/invalid-id`
2. Verify: "College not found" page
3. Click "Browse All Colleges"
4. Verify: Navigates to `/colleges`

**TC-8: Keyboard Shortcuts**
1. On any page, press `Ctrl+K`
2. Verify: Search input focused
3. On `/colleges`, press `Esc`
4. Verify: Any open modal/drawer closes

### 9.2 Visual Regression Checks

- [ ] Card hover shadow deepens smoothly
- [ ] Filter chip removal animates out
- [ ] Compare drawer slides up with spring physics
- [ ] Modal backdrop fades in
- [ ] Skeleton cards pulse uniformly
- [ ] Rating stars fill partially (e.g., 4.2 = 4 full + 1 partial)
- [ ] Placement ring draws itself on mount
- [ ] Toast slides in from top-right

---

## 10. Deployment & Performance

### 10.1 Build Configuration

```javascript
// next.config.js
const nextConfig = {
  output: 'export', // Static export for any host
  images: {
    unoptimized: true, // Required for static export
  },
  trailingSlash: true,
};

module.exports = nextConfig;
```

### 10.2 Vercel Deployment Checklist

- [ ] `output: 'export'` configured
- [ ] All images in `/public` folder
- [ ] No server-side API routes (all data is local)
- [ ] `basePath` not needed (deploying to root)
- [ ] Environment: Node 18+

### 10.3 Performance Budget

| Metric | Target | Max |
|--------|--------|-----|
| First Contentful Paint | 1.0s | 1.5s |
| Largest Contentful Paint | 1.5s | 2.5s |
| Time to Interactive | 2.0s | 3.5s |
| Cumulative Layout Shift | 0 | 0.1 |
| Total Blocking Time | 50ms | 200ms |
| Bundle Size (gzipped) | 150KB | 200KB |

### 10.4 Lighthouse Targets
- Performance: 90+
- Accessibility: 95+
- Best Practices: 100
- SEO: 95+

---

## 11. Appendix: Asset Inventory

### 11.1 Icons (Lucide React)

| Icon Name | Usage |
|-----------|-------|
| `Search` | Search bars |
| `MapPin` | Location display |
| `Star` | Ratings |
| `Building2` | College type, recruiters |
| `IndianRupee` | Fees display |
| `Calendar` | Established year |
| `BookOpen` | Courses count |
| `TrendingUp` | Placement rate |
| `Trophy` | Highest package |
| `Phone` | Contact |
| `Mail` | Email |
| `Globe` | Website |
| `ExternalLink` | External links |
| `ChevronRight` | Breadcrumbs |
| `ChevronLeft` | Pagination |
| `ChevronDown` | Dropdowns |
| `X` | Close buttons, remove chips |
| `Scale` | Compare feature |
| `Heart` | Save toggle |
| `Menu` | Mobile hamburger |
| `Cpu` | Engineering category |
| `Briefcase` | Management category |
| `HeartPulse` | Medical category |
| `Palette` | Arts category |
| `TrendingUp` | Commerce category |
| `Crown` | Winner highlight |
| `Users` | People also viewed |
| `History` | Recently viewed |
| `Layers` | Categories |
| `School` | Empty state |
| `BookX` | No courses |
| `MessageSquare` | No reviews |
| `Contact` | Contact section |
| `GraduationCap` | Hero/brand |

### 11.2 Images

| File | Path | Usage |
|------|------|-------|
| placeholder-college.png | `/public/placeholder-college.png` | Fallback for all college images |

### 11.3 Color Tokens

| Token | Hex | Usage |
|-------|-----|-------|
| Primary Blue | #2563EB | Buttons, links, active states |
| Primary Dark | #1E40AF | Button hover |
| Accent Orange | #F97316 | Compare, badges, CTAs |
| Background Page | #F8FAFC | Main page background |
| Card Background | #FFFFFF | Cards |
| Surface Gray | #F1F5F9 | Inputs, tags, sidebar |
| Border | #E2E8F0 | All borders, dividers |
| Text Primary | #0F172A | Headings, labels |
| Text Secondary | #475569 | Body text |
| Text Muted | #94A3B8 | Placeholders, metadata |
| Success Green | #16A34A | Ratings >4, positive tags |
| Warning Amber | #D97706 | Moderate ratings |
| Error Red | #DC2626 | Validation errors |

### 11.4 Animation Tokens

| Token | Duration | Easing | Usage |
|-------|----------|--------|-------|
| slide-up | 300ms | ease-out | Drawer entrance |
| slide-down | 300ms | ease-out | Drawer exit |
| fade-in | 200ms | ease-out | Modal backdrop |
| bounce-in | 500ms | cubic-bezier(0.68,-0.55,0.265,1.55) | Modal content |
| pulse-soft | 2000ms | infinite | Skeleton |
| shimmer | 2000ms | linear | Skeleton gradient |
| card-hover | 200ms | ease | Card shadow transition |

---

## 12. Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-05-23 | Frontend Engineer | Initial SRS covering all 3 features + engagement loops |

---

**END OF DOCUMENT**

