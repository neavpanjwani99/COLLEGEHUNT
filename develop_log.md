# Project Codebase Analysis & Loom Video Script

## 1. Filter Logic in Colleges Listing Page
- **Location:** `src/components/CollegesClient.tsx`
- **Total Filters:** 3 (Search, Category, Type)
- **Logic Used:** `AND` logic. All conditions must be met for a college to pass through. `(searchMatch && categoryMatch && typeMatch)`
- **Function Name:** `filteredColleges` (implemented using `useMemo`).

## 2. CompareContext Details
- **Location:** `src/context/CompareContext.tsx`
- **Functionality:** Manages a global state array `compareList`, saves the IDs to `localStorage`, and provides toast notifications (success/warning).
- **Max Limit:** 3 colleges max.
- **Enforcement:** Enforced directly in the `addToCompare` function via `if (current.length >= 3) return current;`
- **Exceeding Limit:** If a user tries to add a 4th college, the context triggers a warning toast: `notify("Maximum 3 colleges can be compared. Remove one to add another.", "warning")`.

## 3. Save Feature Implementation
- **Location:** `src/context/SaveContext.tsx`
- **Storage:** Uses `localStorage` using the key `"CollegeHunt_saved"`.
- **Sync Behavior:** It syncs on **every change**. The `useEffect` hook watches the `[savedIds]` dependency array and updates `localStorage` immediately whenever a college is added or removed.

## 4. Invalid ID Handling (/colleges/invalid-id)
- **Location:** `src/app/colleges/[id]/page.tsx`
- **Implementation:** The server checks `getCollegeById(id)`. If the college is not found, rather than using Next.js's native `notFound()`, it returns a beautifully styled JSX block directly in the page.
- **Render Output:** It renders a breadcrumb navigation, a `School` lucide icon (size 64), an `h1` reading "College not found", a description paragraph, and a `LinkButton` redirecting back to `/colleges` ("Browse All Colleges").

## 5. Framer Motion Animations
- **Global Page Transitions:** `src/components/AppShell.tsx` uses `initial={{ opacity: 0, y: 8 }}` and `animate={{ opacity: 1, y: 0 }}` on `<motion.div>`.
- **Scroll Reveal:** `src/components/CollegesClient.tsx` wraps cards in `motion.div`. Uses `initial={{ opacity: 0, y: 30 }}`, `whileInView={{ opacity: 1, y: 0 }}`, `viewport={{ once: true, margin: "-50px" }}`, and staggered `transition={{ duration: 0.6, delay: index * 0.1, ease: [0.21, 0.47, 0.32, 0.98] }}`.
- **Card Hover:** `src/components/CollegeCard.tsx` uses `whileHover={{ y: -4, boxShadow: "0 20px 40px rgba(37, 99, 235, 0.12)" }}` with `transition={{ duration: 0.2, ease: "easeOut" }}`.
- **Micro-Interactions (Save/Compare Buttons):** `src/components/CollegeCard.tsx`
  - Heart Button Tap: `whileTap={{ scale: 1.4 }}`.
  - Heart Icon Toggle: `animate={saved ? { scale: [1, 1.3, 1] } : { scale: 1 }}`.
  - Compare Text Toggle: `initial={{ opacity: 0, scale: 0.8 }}`, `animate={{ opacity: 1, scale: 1 }}`.

## 6. TypeScript Interfaces (`src/types/college.ts`)
- **`Course`**: `{ name: string; duration: string; fees: number; }`
- **`Placement`**: `{ averagePackage: number; highestPackage: number; placementRate: number; topRecruiters: string[]; }`
- **`Review`**: `{ author: string; rating: number; date: string; comment: string; }`
- **`College`**: 
  - `id`: string
  - `name`: string
  - `location`: string
  - `type`: "Government" | "Private" | "Deemed"
  - `category`: "Engineering" | "Management" | "Medical" | "Arts" | "Commerce"
  - `fees`: number
  - `rating`: number
  - `totalReviews`: number
  - `rank`: number
  - `imageUrl`: string
  - `established`: number
  - `overview`: string
  - `courses`: Course[]
  - `placements`: Placement[]
  - `reviews`: Review[]
  - `tags`: string[]
  - `website`: string
  - `phone`: string
  - `email`: string

## 7. Search Implementation
- **Location:** `src/components/CollegesClient.tsx`
- **Debouncing:** There is **no debounce** implemented. It updates instantly on `onChange` using a standard `useState`.
- **Searched Fields:** It evaluates against both `college.name` and `college.location`.

## 8. Comparison Table Winner Logic
- **Location:** `src/components/CompareTableClient.tsx`
- **Logic:** The component maps the array to find absolute maximums/minimums across the active `compareList` array. When rendering a cell, it compares the current cell's value against the extracted "best" value, rendering a green success Badge if it matches.
- **Fees:** Winner is the **lowest** value using `Math.min(...compareList.map((c) => c.fees))`.
- **Rating:** Winner is the **highest** value using `Math.max(...compareList.map((c) => c.rating))`.
- **Package:** Winner is the **highest** value using `Math.max(...compareList.map((c) => c.placements.highestPackage))`.

## 9. Pages and Routes
- **`/`**: Handled by `src/app/page.tsx`. Renders the `Home` function.
- **`/colleges`**: Handled by `src/app/colleges/page.tsx`. Renders `CollegesPage` (wraps `CollegesClient`).
- **`/colleges/[id]`**: Handled by `src/app/colleges/[id]/page.tsx`. Renders `CollegeDetailPage` (wraps `CollegeDetailClient`).
- **`/compare`**: Handled by `src/app/compare/page.tsx`. Renders `ComparePage` (wraps `CompareTableClient`).
- **`/saved`**: Handled by `src/app/saved/page.tsx`. Renders `SavedPage` (wraps `SavedClient`).

## 10. Error Boundary & Not-Found Handling
- **Error Handling:** Exists in `src/app/error.tsx`. It exports `ErrorBoundary` which catches runtime application errors and renders a stylized `<div className="max-w-md ...">` containing an `h2` ("Something went wrong") and a `Try Again` Button connected to the `reset` prop.
- **Not Found Handling:** There is no global `not-found.tsx` for general 404s. However, domain-specific 404 handling exists in `src/app/colleges/[id]/page.tsx`, rendering an elegant fallback UI when an invalid college ID is provided.

---

# Loom Video Script: CollegeHunt Codebase Walkthrough

**(0:00 - 1:00) Introduction & Project Overview**
"Hey everyone! Today I want to walk you through the codebase of CollegeHunt, a premium Next.js application I built to help students discover and compare colleges in India. The goal of this project was to create a highly interactive, state-driven platform with incredibly smooth animations. Let's dive right into how I structured the application, starting with the routing."

**(1:00 - 2:30) Routing & Interfaces**
"The app uses the Next.js App Router paradigm. I have five main routes set up here. At the root, `/`, we have `page.tsx` rendering the `Home` component. Then we have `/colleges` powered by `CollegesPage`, a dynamic route at `/colleges/[id]` rendering `CollegeDetailPage`, a `/compare` route, and finally a `/saved` route. 

To keep everything strongly typed, if we look at `src/types/college.ts`, you'll see my TypeScript interfaces. The core `College` interface is extremely robust. It handles literal types for `type` (like Government or Private) and `category`. It also houses nested interfaces like `Course` for arrays of durations and fees, `Placement` which holds `highestPackage` and `placementRate`, and `Review`. By enforcing this structure, I made sure my data mapping remains bug-free."

**(2:30 - 4:00) Context APIs (Save & Compare)**
"Now, let's talk about cross-component state management. I decided to use React Context for two main features: Saving and Comparing. 

In `src/context/SaveContext.tsx`, I built a hook that saves users' favorite colleges directly to their browser using the `localStorage` key `"CollegeHunt_saved"`. I used a `useEffect` hook that syncs data on *every single change* to the `savedIds` array, ensuring no data loss if the user refreshes.

The `CompareContext.tsx` is slightly more complex. Here, I'm maintaining a `compareList` array. I enforced a strict maximum limit of 3 colleges. Inside the `addToCompare` function, you can see the logic: `if (current.length >= 3) return current;`. If a user attempts to add a fourth college, the function catches it and fires a built-in custom toast notification reading: *'Maximum 3 colleges can be compared. Remove one to add another.'* It's a nice UX touch that prevents the comparison UI from breaking."

**(4:00 - 5:30) Colleges Listing & Filtering Logic**
"Moving over to the colleges listing page in `src/components/CollegesClient.tsx`, this is where users spend most of their time. 

I built a powerful, instant search and filter system. I have three active filters here: a text search, a category dropdown, and a type dropdown. The filtering is handled by the `filteredColleges` function, wrapped in a `useMemo` hook for performance. I used strict `AND` logic: `searchMatch && categoryMatch && typeMatch`. All three conditions must pass for a card to render. 

For the search bar, you might be wondering if I used a debounce. Actually, I chose *not* to debounce it. It's tied directly to an `onChange` event updating a React state immediately. Next.js and React 18 are fast enough that the instantaneous feedback feels snappy, searching directly against `college.name` and `college.location` simultaneously."

**(5:30 - 7:00) Animations with Framer Motion**
"To make the UI feel premium, I heavily integrated `framer-motion`. 

First, global page transitions in `AppShell.tsx` use a subtle fade-in, going from an initial `y: 8` and `opacity: 0` to `y: 0`.

The magic really happens in `CollegesClient.tsx`. As you scroll, cards don't just appear—they gracefully slide in. I wrapped the mapping in a `motion.div` and used `whileInView={{ opacity: 1, y: 0 }}` with a staggered delay based on the card's index: `transition={{ delay: index * 0.1 }}` and a custom bezier curve `ease: [0.21, 0.47, 0.32, 0.98]`.

Inside `CollegeCard.tsx` itself, hovering a card triggers `whileHover={{ y: -4 }}` with an elevated box shadow. I also added micro-interactions! Tapping the Save heart icon triggers `whileTap={{ scale: 1.4 }}`, and if it's successfully saved, it runs an array animation `scale: [1, 1.3, 1]` for a nice popping effect."

**(7:00 - 8:30) Compare Table Winner Logic**
"Once users add colleges to compare, they navigate to the `/compare` page, rendered by `CompareTableClient.tsx`. 

I wanted the UI to automatically highlight the 'winner' in every category. The logic here is completely dynamic based on the active `compareList`. For instance, to find the best fees, I map the array and find the minimum: `Math.min(...compareList.map((c) => c.fees))`. But for placements, the winner is the maximum: `Math.max(...compareList.map((c) => c.placements.highestPackage))`. When rendering the cell, if the current college matches the calculated 'best' value, it renders a green highlight badge. It's simple but highly effective."

**(8:30 - 10:00) Error Boundaries and UX Polish**
"Finally, I wanted to ensure the app never crashes gracefully. 

If a user navigates to a broken route like `/colleges/invalid-id`, I don't just throw a generic 404. Inside `src/app/colleges/[id]/page.tsx`, the server validates the ID against `getCollegeById`. If it fails, I render a custom JSX block featuring a massive `School` Lucide icon and a 'Browse All Colleges' `LinkButton` to keep them in the ecosystem.

For unexpected runtime issues, I implemented a React Error Boundary in `src/app/error.tsx`. It catches the error and renders a clean 'Something went wrong' card with a 'Try Again' button tied to the `reset` prop, ensuring the user always has a path forward.

And that's a comprehensive look at the CollegeHunt architecture! Thanks for watching."

