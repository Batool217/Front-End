# Sprint 3: Post Details Screen Implementation Guide

This document outlines the division of tasks and the Git branching workflow for implementing the **Post Details** (Book Details) screen.

---

## 🛠️ Task Breakdown & Responsibilities

### Task 1: Main Layout & Breadcrumb (Page Integrator)
*   **Target File:** `src/pages/PostDetails.jsx`
*   **Responsibilities:**
    *   Set up routing in `src/App.jsx` pointing to `/listings/:id`.
    *   Create the main container with a responsive 2-column layout grid.
    *   Implement the dynamic breadcrumb component: `Home > Academic > [Book Title]`.
    *   Manage the main page state (fetching book details from API/mock data using the `:id` parameter).
    *   Integrate and coordinate child components from Tasks 2-7.

### Task 2: Interactive Image Gallery (Left Column)
*   **Target Component:** `src/components/post-details/ImageGallery.jsx`
*   **Responsibilities:**
    *   Build the main image display container.
    *   Create a thumbnail row below the main image for listings with multiple photos.
    *   Implement click logic: clicking a thumbnail changes the active main image.
    *   Handle loading states and image fallback wrappers.

### Task 3: Header Details, Badges & Price
*   **Target Component:** `src/components/post-details/BookHeader.jsx`
*   **Responsibilities:**
    *   Design the pills/badges row (e.g., `Good`, `Academic`, `University of Jordan`).
    *   Render the main book title and author.
    *   Render the large price tag (e.g., `8 JD`).
    *   Implement conditional styling for high-quality items (e.g., displaying "Excellent - like new or similar" banner when condition is Excellent).

### Task 4: Metadata Grid Component
*   **Target Component:** `src/components/post-details/MetadataGrid.jsx`
*   **Responsibilities:**
    *   Build a 3-column layout displaying key details:
        *   **Faculty:** with university icon 🏛️ (only for Academic category).
        *   **Edition:** with book icon 📖.
        *   **Posted Date:** with calendar icon 📅.
    *   Ensure the component dynamically hides the Faculty field if the category is `General`.

### Task 5: Seller Profile Card
*   **Target Component:** `src/components/post-details/SellerCard.jsx`
*   **Responsibilities:**
    *   Create the card component displaying:
        *   Seller avatar.
        *   Seller name (e.g., "Ahmad Al-Khatib").
        *   Seller metrics: Rating ⭐, total sales count, and active status.
    *   Create a stylized "View Profile" button that redirects to the seller's profile.

### Task 6: Description & Exchange Details Box
*   **Target Component:** `src/components/post-details/BookDescription.jsx`
*   **Responsibilities:**
    *   Design the `About this book` typography and paragraph area.
    *   Create the conditional `Exchange For` card:
        *   Features a light-orange background with a swap icon 🔄.
        *   Only renders if the listing type is `for_sale_and_exchange`.

### Task 7: Action Footer (Contact & Report)
*   **Target Component:** `src/components/post-details/ActionButtons.jsx`
*   **Responsibilities:**
    *   Implement the two primary action buttons at the bottom of the details card:
        *   `Report` button (subtle gray style, warning/flag icon).
        *   `Contact Seller` button (bold orange style, chat icon).
    *   Implement smooth hover, active press states, and click triggers.

---

## 🌿 Git Branching & Workflow

To work in parallel without overriding each other's code, please follow this Git flow:

### 1. Update your local environment
Before creating your branch, make sure your local `sprint3` branch is up-to-date:
```bash
git checkout sprint3
git pull origin sprint3
```

### 2. Create your Feature Branch
Create a branch specifically for your task. Use the naming convention: `feature/sprint3-task-[task_number]-[your_name]`
For example:
*   *For Task 2:* `git checkout -b feature/sprint3-task2-gallery`
*   *For Task 5:* `git checkout -b feature/sprint3-task5-sellercard`

### 3. Work and Commit
Make frequent, clean commits while working on your component:
```bash
git add .
git commit -m "feat(post-details): implement thumbnail click handler"
```

### 4. Push and Open a Pull Request (PR)
Push your branch to GitHub and create a PR targeting the `sprint3` branch (NOT `main`):
```bash
git push -u origin feature/sprint3-task-X-yourname
```
Open GitHub, click **Compare & pull request**, set the base branch to **`sprint3`**, and explain your changes.

### 5. Code Review & Merging
Once another team member reviews and approves your PR, it can be merged into `sprint3`.
After your PR is merged, you can update your local branches to get the latest merged code from your teammates.
