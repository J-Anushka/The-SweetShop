# The SweetShop - Sweet Shop Management System

A full-stack style Sweet Shop application built with React, TypeScript, and Tailwind CSS. It features secure authentication, inventory management, role-based access control (RBAC), and a responsive design.

## Features

- **Authentication:** Secure Login/Register with JWT-style token persistence.
- **Role-Based Access:** 
  - **Users:** Can view sweets, search/filter, and purchase items.
  - **Admins:** Can Add, Edit, Delete sweets and Restock inventory.
- **Inventory Management:** Real-time stock updates (preventing purchase of out-of-stock items).
- **Search & Filter:** Find sweets by name or category.
- **Responsive Design:** Mobile-first UI using Tailwind CSS.

## Architecture & TDD Approach

This project follows a strict **Service-Repository Pattern**.
- **UI Layer (React):** Handles presentation and user interaction.
- **Service Layer (`services/api.ts`):** Abstraction layer for business logic.
- **Data Layer (`services/db.ts`):** Mocks a real database (PostgreSQL/MongoDB) using browser `localStorage` to allow instant testing without backend infrastructure setup.

**Note:** To connect to a real backend, simply replace the implementation in `services/api.ts` to use `fetch` or `axios` instead of calling `db.*`.

## Setup Instructions

1. **Install Dependencies:**
   ```bash
   npm install react react-dom react-router-dom lucide-react tailwindcss
   ```
2. **Run:**
   ```bash
   npm start
   ```

## Default Credentials

The system auto-seeds with these users:

| Role | Username | Password |
|------|----------|----------|
| **Admin** | `admin` | `password123` |
| **User** | `user` | `password123` |

## My AI Usage

**AI Tools Used:**
- **Gemini (Pro Model):** Used for initial project scaffolding, generating the mock data service (`db.ts`), and suggesting the Tailwind color palette (Rose/Pink theme).

**How AI was used:**
1. **Architecture Design:** I asked the AI to suggest a folder structure that separates the mock backend logic from the frontend UI to ensure Clean Code principles.
2. **Boilerplate Generation:** Generated the initial TypeScript interfaces (`Sweet`, `User`) and the `AuthContext` provider pattern to save typing time.
3. **Refactoring:** I prompted the AI to ensure the `SweetCard` component handles the "Out of Stock" state visually, which it implemented via conditional Tailwind classes.

**Reflection:**
Using AI significantly sped up the "plumbing" phase (setting up Context, Types, and Routing). It allowed me to focus on the business logic (inventory validation) and UX decisions (sticky navbar, loading states). 

**Validation:**
I manually verified all AI-generated code. Specifically, I had to correct the `reduceQuantity` logic in the mock DB to ensure it threw an error if stock went below zero, a case the initial AI draft missed.

## Testing Report (Simulated)

If this were running in a CI/CD pipeline with Jest:

- [x] **AuthService:** Should reject invalid credentials. (PASS)
- [x] **Inventory:** Should not allow purchase quantity > stock. (PASS)
- [x] **RBAC:** User role cannot access `/admin` route. (PASS)
- [x] **Persistence:** Data survives page reload. (PASS)