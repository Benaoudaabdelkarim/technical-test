# UX Analysis & Technical Approach

## Identified UX Problems

1.  **Information Overload**: With high volumes of applications, recruiters struggle to find the right candidate quickly.
2.  **Fragmented Filtering**: Switching between different criteria (skills, status, date) can be cumbersome if not handled by a unified, responsive filtering system.
3.  **Lack of Visual Cues**: Difficulty in identifying the status of an application at a glance.
4.  **Collaboration Gaps**: Difficulty in tracking interview feedback and internal comments.
5.  **Perceived Performance**: Slow loading states or lack of feedback during actions can lead to frustration.

## Proposed Solutions & Technical Approach

### 1. Unified Management Dashboard

- **Modern List View**: A clean, spacious table/list with clear labels and status badges.
- **Side Panel/Modal Details**: Quick access to full details without losing context in the list.

### 2. High-Performance Filtering

- **Dynamic Query Params**: Synchronizing search and filters with JSON Server's built-in query parameters (`?q=`, `?statut=`, `_page=`).
- **Debouncing**: Implementing a 300ms delay on search inputs to minimize unnecessary network traffic.

### 3. State Management & Perceived Speed

- **Pinia Store**: Centralized state for applications, ensuring UI consistency.
- **Optimistic Updates**: Immediately updating the UI status badge while the PATCH request is in flight.
- **Loading States**: Skeleton loaders or progress bars for better UX during initial data fetch.

### 4. Premium Aesthetic (Tailwind CSS v4)

- **Glassmorphism**: Using subtle transparency and blurs for modals and alerts.
- **Rich Palette**: Using a professional, high-contrast palette (Slate/Blue) with semantic status colors.
- **Dark Mode Support**: Native dark mode using Tailwind's `dark:` utility.

### 5. Robust API Layer

- **Unified Axios Service**: Centralized configuration with error handling for common HTTP errors (404, 500, Timeout).
- **TypeScript Integration**: Full type safety for candidatures and comments to prevent runtime errors.
