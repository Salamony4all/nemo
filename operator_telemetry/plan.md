# Execution Plan: Nemo Administrator Dashboard Implementation

## 1. DIAGNOSIS
The user wants to implement an Administrator Dashboard for the Nemo application. This dashboard must be protected by a simple authentication mechanism (Username: "Admin", Password: "123") and allow the administrator to perform CRUD operations (specifically creating) on "offers" (tours), images, prices, and details.

**Current State of Codebase:**
- The application uses static data imports (`PRESEEDED_OFFERS`, `PRESEEDED_MEDIA`) from a `data` file.
- The UI is built with React, Tailwind CSS, Lucide-react, and Motion (framer-motion).
- Navigation is handled via a tab-based state (`activeTab`) in `App.tsx`.
- Data types are defined in `types.ts`.

**Technical Requirements:**
- **State Transition:** Data must move from static constants to React state (`useState`) so that the Admin Dashboard can update the UI in real-time.
- **Authentication:** A lightweight login gate for the Admin section.
- **UI/UX:** The dashboard must maintain the existing aesthetic (dark mode, glassmorphism, Lucide icons).
- **Persistence:** To prevent data loss on refresh, `localStorage` should be implemented to persist admin changes.

---

## 2. STEP-BY-STEP EXECUTION PLAN

### Step 1: State Management Refactor (`src/App.tsx`)
Currently, the app reads directly from `PRESEEDED_OFFERS`. We need to move this into state.
1. Modify `App.tsx` to initialize state using the preseeded data.
2. Implement `localStorage` sync so that new offers added by the admin persist across browser refreshes.
3. Define setter functions (`setOffers`, `setMedia`) that will be passed to the Admin Dashboard.

### Step 2: Create Admin Authentication Component (`src/components/AdminAuth.tsx`)
Create a simple, sleek login modal/page.
1. **Fields:** Username and Password.
2. **Logic:** Validate against `username === "Admin"` and `password === "123"`.
3. **State:** On success, set an `isAdminAuthenticated` flag in the parent `App.tsx` or a context.
4. **Styling:** Use the existing glassmorphism design (backdrop-blur, border-white/10).

### Step 3: Create Admin Dashboard Component (`src/components/AdminDashboard.tsx`)
Build the management interface.
1. **Layout:** 
    - A sidebar or top-toggle to switch between "Manage Offers" and "Manage Media".
    - A form to add new items.
    - A list/table of existing items with "Delete" capabilities.
2. **Offer Form Fields:**
    - Title (string)
    - Price (number)
    - Description (text)
    - Image URL (string)
    - Location/Duration (matching `TourOffer` type).
3. **Media Form Fields:**
    - Asset URL (string)
    - Category (dropdown: Image/Video)
    - Tag/Description.
4. **Actions:** 
    - `handleAddOffer()`: Appends a new `TourOffer` object to the state.
    - `handleAddMedia()`: Appends a new `MediaAsset` object to the state.
    - `handleDelete()`: Filters out the item by ID.

### Step 4: Integration into Main Navigation (`src/App.tsx`)
1. Add `"admin"` to the `activeTab` type union: `activeTab: "offers" | "media" | "ai" | "board" | "admin"`.
2. Add an "Admin" button to the navigation menu (perhaps visible only via a hidden shortcut or a small gear icon in the corner).
3. Implement the conditional rendering logic:
   - If `activeTab === "admin"`:
     - If `!isAdminAuthenticated` $\rightarrow$ Show `<AdminAuth />`.
     - If `isAdminAuthenticated` $\rightarrow$ Show `<AdminDashboard />`.

### Step 5: UI/UX Polish
1. Use `motion.div` for transitions when entering the Admin Dashboard.
2. Use `ShieldCheck` and `Settings` icons from Lucide-react.
3. Ensure forms are responsive and match the "Nemo" color palette.

---

## 3. VERIFICATION STEPS

### Functional Testing
- [ ] **Auth Gate:** Try logging in with wrong credentials $\rightarrow$ should fail. Log in with `Admin`/`123` $\rightarrow$ should grant access.
- [ ] **Add Offer:** Create a new tour offer $\rightarrow$ navigate back to "Offers" tab $\rightarrow$ verify the new tour appears in the feed with the correct price and image.
- [ ] **Add Media:** Upload a new image URL $\rightarrow$ navigate to "Media Hub" $\rightarrow$ verify the asset is present.
- [ ] **Persistence:** Add an offer $\rightarrow$ Refresh the page $\rightarrow$ verify the offer still exists (via `localStorage`).
- [ ] **Deletion:** Delete an existing offer from the dashboard $\rightarrow$ verify it is removed from the main view.

### UI/UX Testing
- [ ] **Visual Consistency:** Ensure the Admin Dashboard uses the same fonts, colors, and blur effects as the rest of the app.
- [ ] **Responsiveness:** Check that the admin forms are usable on mobile screen widths.
- [ ] **Transitions:** Ensure `AnimatePresence` handles the switching between Admin and User views smoothly.