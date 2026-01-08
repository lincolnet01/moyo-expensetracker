# Moyo ExpenseTracker

## Project Description
I want to build expense tracking application. The user will add his income source and amount and then track the expenses. The app should also provide expense report. 

## Product Requirements Document
Product Requirements Document: Moyo ExpenseTracker

Version: 1.0
Date: October 26, 2023
Author: [AI Coding Agent]

1. Introduction and Goals

1.1 Project Overview
Moyo ExpenseTracker is a web-based application designed to help small business owners accurately track their income sources and expenses. The primary goal is to provide a clear, real-time financial overview, allowing users to understand where their money is being allocated and maintain a clear picture of their remaining funds.

1.2 Business Goals
*   Provide a simple, intuitive platform for financial tracking tailored for small business owners.
*   Offer robust reporting capabilities to facilitate financial review and decision-making.
*   Establish a foundation for future features like budgeting and goal tracking.

1.3 Target Audience
Small business owners who require granular control and visibility over their daily operational finances but may not require full-scale accounting software.

2. Scope and Features

2.1 Core Features (MVP)

2.1.1 User Authentication and Security
*   User Registration (Email/Password).
*   Secure User Login/Logout.
*   Password Reset functionality.
*   Data privacy must be prioritized, ensuring sensitive financial data is stored securely.

2.1.2 Income Management
*   Users must be able to manually input new income transactions.
*   Required Income Fields: Amount, Date, Source Name (e.g., Client A Payment, Sales Revenue).
*   Users must be able to view, edit, and delete past income entries.

2.1.3 Expense Tracking
*   Users must be able to manually input new expense transactions.
*   Required Expense Fields: Amount, Date, Category (selection required), Description/Notes.
*   Users must be able to view, edit, and delete past expense entries.

2.1.4 Category Management
*   The system will come pre-populated with a set of Standard Categories (e.g., Utilities, Marketing, Inventory, Salaries).
*   Users must have the ability to create, edit, and delete custom Expense Categories.
*   Users must have the ability to create and manage Subcategories under both standard and custom categories.

2.2 Reporting and Analytics

*   The application must feature a dedicated Reporting Dashboard.
*   Reports must be generated based on user-selected parameters.
*   Supported Reporting Types:
    *   Monthly Summary: Total Income, Total Expenses, Net Balance for the selected month.
    *   Category Breakdown: Detailed view of spending grouped by Category/Subcategory for a given period.
    *   Trend Analysis: Visualization (e.g., simple line graph) showing month-over-month expense fluctuation over the last 6 months.
    *   Custom Date Ranges: Ability to select arbitrary Start and End dates for reporting.
*   Export Functionality: All generated reports (including raw transaction data underlying the report) must be exportable in CSV format.

2.3 Future Scalability (Phase 2/Future Consideration)
*   Budgeting tools creation based on categories.
*   Financial Goal setting and tracking module.
*   (Future Consideration Only) Integration points for bank feeds or receipt scanning.

3. Technical Specifications

3.1 Platform and Technology
*   The application shall be developed as a responsive Web Application.
*   No specific hosting platform constraints are noted, allowing flexibility in deployment choices (e.g., standard web server/cloud hosting).

3.2 Data Structure Requirements
The core database schema must accommodate:
*   Users Table (Authentication details).
*   Income Table (ID, UserID, Amount, Date, Source Name, CreationDate).
*   Expense Table (ID, UserID, Amount, Date, CategoryID, Description, CreationDate).
*   Category Table (ID, Name, Type [Income/Expense], ParentCategoryID [for subcategories]).

3.3 Design and UX Specifications
*   Inspiration: The application design and layout should draw inspiration from the aesthetic and structure of the akaunting application (focusing on clarity, data density, and professional presentation).
*   Color Palette: The primary color scheme must feature blue, complemented by colors that pair well with blue (e.g., white, light gray backgrounds, and accent colors for positive/negative indicators).
*   UX Goal: Data entry must be quick and efficient, reflecting the needs of busy small business owners.

4. User Stories (Examples)

| ID | As a... | I want to... | So that I can... | Priority |
| :--- | :--- | :--- | :--- | :--- |
| US-001 | Small Business Owner | securely log into my expense tracker | access my private financial data. | High |
| US-002 | Small Business Owner | quickly add a new expense entry | accurately record a purchase right after it happens. | High |
| US-003 | Small Business Owner | see a summary of all my income sources for the last month | know my total revenue period. | High |
| US-004 | Small Business Owner | define my own expense categories (e.g., \\"Client Entertainment\\") | track spending aligned with my business structure. | High |
| US-005 | Small Business Owner | export my quarterly spending breakdown | share it easily with my accountant. | High |
| US-006 | Small Business Owner | view how my spending in \\"Marketing\\" compares month-over-month | adjust my budget strategy next month. | Medium |

5. Non-Functional Requirements

5.1 Performance
*   Dashboard loading time (with up to 1 year of data) should be under 3 seconds.
*   Transaction entry submission must return confirmation within 1 second.

5.2 Security
*   All transmitted data must use HTTPS/TLS encryption.
*   User passwords must be stored securely using appropriate hashing algorithms (e.g., bcrypt).
*   Basic input validation must be implemented on all forms to prevent injection attacks.

5.3 Maintainability
*   The codebase, developed via an AI Coding Agent, must follow clear, well-commented conventions suitable for future human review or extension.
*   Configuration settings (e.g., database connection strings, default categories) must be externalized where possible.

6. Development Approach

6.1 Development Methodology
Development will be guided by the requirements outlined in this PRD, managed iteratively based on the AI Coding Agent's capability to deliver features incrementally. The focus remains on delivering the MVP (Section 2.1) first.

## Technology Stack
Moyo ExpenseTracker - Technology Stack Document (techStack)

1. Introduction
This document outlines the recommended technology stack for the Moyo ExpenseTracker application. The selection prioritizes rapid development (given the use of an AI coding agent), strong performance for a modern web application, robust data handling for financial tracking, and adherence to the desired UX inspiration (Akaunting).

2. Frontend Stack (Client-Side)

Technology | Framework/Library | Justification
---|---|---
Language | TypeScript | Provides static typing, enhancing code quality and maintainability, which is crucial for financial applications, especially during AI-assisted development.
Core Framework | React (via Next.js) | Modern, component-based structure. Next.js provides server-side rendering (SSR) capabilities for better initial load performance and SEO potential (though less critical for a logged-in app, it offers powerful routing and API handling).
Styling | Tailwind CSS | Utility-first CSS framework. Facilitates rapid styling iteration and closely matches the professional, structured look of applications like Akaunting.
Color Palette | Shades of Blue (Primary), Light Gray/White (Backgrounds) | Matches the user preference. Tailwind makes managing a consistent blue-centric color scheme straightforward.
State Management | React Context API / Zustand (if complexity increases) | Context API is sufficient initially. Zustand is lightweight and easier to adopt than Redux if complex global state becomes necessary for reporting views.
Charting/Visualization | Recharts or Chart.js (integrated via React wrapper) | Necessary for trend analysis and category breakdowns in the reporting module. Recharts is highly customizable within the React ecosystem.

3. Backend Stack (Server-Side & API)

Technology | Framework/Library | Justification
---|---|---
Language | Node.js (JavaScript/TypeScript) | Allows for a unified language stack (Full-Stack TypeScript), simplifying context switching and leveraging the same tooling across the application.
Web Framework | NestJS (or Express if simplicity is paramount for AI agent) | NestJS provides a structured, modular framework heavily inspired by Angular/enterprise patterns. This structure is excellent for building scalable, maintainable APIs, which benefits future feature expansion (budgeting, goals). If the AI agent struggles with NestJS boilerplate, a well-structured Express server using TypeScript is the fallback.
API Architecture | RESTful API | Standard, well-understood architecture suitable for web applications and easy integration with frontend charting libraries.

4. Database and Data Persistence

Technology | Type | Justification
---|---|---
Primary Database | PostgreSQL | Robust, open-source relational database known for data integrity, transactional safety, and excellent support for complex querying required for detailed financial reports and trend analysis. It scales well.
ORM/Query Builder | Prisma | Modern, type-safe ORM that integrates exceptionally well with TypeScript and Node.js, simplifying database interactions and migrations.

5. Security and Authentication

Technology | Solution | Justification
---|---|---
Authentication | JWT (JSON Web Tokens) via dedicated provider (e.g., Passport.js within NestJS) | Standard, secure method for session management in modern web applications. Given the sensitive financial nature, secure token handling is essential.
Data Security | HTTPS (TLS/SSL enforced) | Non-negotiable for protecting data transmission, especially for sensitive financial entries.
Password Hashing | bcrypt | Industry standard for securely hashing and salting user passwords before storage.

6. Reporting and Data Export

Technology | Tool/Method | Justification
---|---|---
Reporting Logic | Backend computation (Node.js/PostgreSQL) | Complex aggregations (monthly summaries, category breakdowns) should be handled on the server for efficiency and security.
CSV Generation | `csv-writer` (Node.js package) or built-in NestJS utilities | Reliable libraries for streaming or batch processing report data directly into the required CSV format for user download.

7. Infrastructure and Deployment (No Hosting Constraints)

Technology | Tool/Service | Justification
---|---|---
Containerization | Docker | Ensures consistency between development, testing, and production environments. Simplifies deployment irrespective of the final hosting provider. 
Deployment (Recommendation) | VPS on hostinger | Decoupling frontend hosting (fast static asset serving) from backend API hosting provides flexibility and scalability.

8. Future Scalability Considerations (Budgeting/Goal Tracking)
The selected stack (TypeScript, NestJS, PostgreSQL) is inherently scalable. For future budgeting and goal tracking, the existing database structure can support new tables easily via Prisma migrations. Real-time updates (if needed for concurrent tracking) could be introduced later using WebSockets integrated within the NestJS framework.

## Project Structure
PROJECT STRUCTURE DOCUMENT: MOYO EXPENSE TRACKER

1. OVERVIEW

This document outlines the directory and file structure for the Moyo Expense Tracker web application. This structure is designed to support the required features (expense tracking, reporting, user management) while ensuring scalability for future additions like budgeting and goal tracking, following modern web application development standards (likely utilizing a standard frontend/backend separation or a full-stack framework).

2. HIGH-LEVEL ARCHITECTURE

The application will follow a standard three-tier web architecture:
*   Client (Frontend): Responsible for UI/UX, data visualization, and user interaction (Styled based on Akaunting design principles).
*   Server (Backend/API): Responsible for business logic, data processing, and serving the frontend.
*   Database: Stores all persistent data (Users, Transactions, Categories).

3. DIRECTORY STRUCTURE (ROOT LEVEL)

```
/MoyoExpenseTracker
├── .vscode/             # VS Code configuration files (if any)
├── node_modules/        # Dependency directory (if using NPM/Yarn)
├── client/              # Frontend Application Source Code
├── server/              # Backend Application Source Code (API/Business Logic)
├── docs/                # Project Documentation (This folder contains this document)
│   └── projectStructure.md
├── .gitignore           # Specifies files/folders to ignore in version control
├── package.json         # Root package manager file (if using a monorepo setup)
└── README.md            # High-level project overview and setup instructions
```

4. DETAILED DIRECTORY STRUCTURE

4.1. /client (Frontend Application)

This directory will house the responsive web application source code (e.g., React, Vue, or Angular application).

```
/client
├── public/              # Static assets (index.html, favicon, etc.)
├── src/
│   ├── assets/          # Images, fonts, and static styling resources
│   │   ├── images/
│   │   └── styles/
│   │       ├── _variables.scss  # Defines blue color scheme, sizing variables
│   │       └── main.scss        # Global styles, importing Akaunting-like structure
│   ├── components/      # Reusable UI components (Buttons, Modals, Navbars)
│   │   ├── common/
│   │   └── layout/
│   ├── pages/           # Top-level view components (Mapped to routes)
│   │   ├── Dashboard.vue/jsx/tsx
│   │   ├── Transactions.vue/jsx/tsx
│   │   ├── CategoriesManager.vue/jsx/tsx
│   │   └── Reports.vue/jsx/tsx
│   ├── services/        # API interaction logic and utility functions
│   │   └── apiService.js
│   ├── store/           # State management (e.g., Vuex, Redux)
│   │   ├── modules/
│   │   │   ├── auth.js
│   │   │   └── finance.js (Handles transactions/categories state)
│   │   └── index.js
│   ├── utils/           # Frontend utility functions (Date formatting, validators)
│   ├── App.vue/jsx/tsx  # Main application wrapper
│   └── main.js/ts       # Entry point
└── package.json         # Frontend dependencies
```

4.2. /server (Backend/API Application)

This directory will contain the API logic, database interaction, and reporting engine.

```
/server
├── config/              # Environment variables, database connection settings
│   └── db.js
├── controllers/         # Request handlers (Input validation, calls to services)
│   ├── authController.js
│   └── transactionController.js
├── database/            # Database Schema Definitions (Models)
│   ├── models/
│   │   ├── User.js          # User authentication schema
│   │   ├── Transaction.js   # Income/Expense records
│   │   └── Category.js      # Standard and custom categories
│   └── seeders/         # Initial data population (Standard Categories)
├── middlewares/         # Authentication checks, logging
│   └── authMiddleware.js
├── routes/              # API endpoint definitions
│   ├── authRoutes.js
│   └── financeRoutes.js # Routes for adding/fetching transactions and reports
├── services/            # Core business logic (e.g., Report generation engine)
│   ├── categoryService.js
│   └── reportService.js # Logic for generating CSV exports, summaries, trends
├── utils/               # Backend utilities (e.g., CSV formatter)
│   └── csvGenerator.js  # Specific utility for meeting CSV export requirement
├── app.js               # Main server initialization file (e.g., Express setup)
└── package.json         # Backend dependencies (e.g., Express, Sequelize/Mongoose)
```

5. KEY DIRECTORY/FILE JUSTIFICATIONS

*   /client/src/assets/styles/\_variables.scss: Crucial for applying the blue color palette consistently across the UI, aligning with Akaunting's clean aesthetic.
*   /server/services/reportService.js: This module is critical as it handles all complex reporting requirements: Monthly summaries, category breakdowns, trend analysis, and custom date range calculations.
*   /server/utils/csvGenerator.js: Dedicated module to ensure the reporting requirements mandate a functional CSV export mechanism for all requested reports.
*   /client/src/pages/CategoriesManager.vue/jsx/tsx: Dedicated interface for users to manage their custom categories and subcategories, fulfilling the categorization structure requirement.
*   /server/database/models/Transaction.js: Must explicitly define fields for amount, type (Income/Expense), date, description, and linkage to Category.

## Database Schema Design
SCHEMADESIGN: Moyo ExpenseTracker Database Schema

1. Overview

This document outlines the proposed relational database schema design for the Moyo ExpenseTracker web application. The design prioritizes robust tracking of transactions (Income and Expenses), flexible categorization, and support for future features like budgeting. We will use a standard relational database structure (e.g., PostgreSQL or MySQL compatible).

2. Entity-Relationship Diagram (Conceptual Mapping)

The core entities are: User, Account (Source/Destination), Category, Transaction, and TransactionItem (for detailed breakdown if necessary, although direct category linking on Transaction is simpler for V1). Given the requirements, a simplified model focusing on Users, Sources, Categories, and Transactions is proposed for V1.

3. Detailed Table Schemas

3.1. Users Table (Authentication and User Management)

| Field Name | Data Type | Constraints | Description |
|---|---|---|---|
| user\_id | INT / UUID | PRIMARY KEY, Auto-Increment | Unique identifier for the user. |
| username | VARCHAR(100) | UNIQUE, NOT NULL | User login identifier. |
| email | VARCHAR(255) | UNIQUE, NOT NULL | User contact email. |
| password\_hash | VARCHAR(255) | NOT NULL | Hashed password for security. |
| created\_at | TIMESTAMP | NOT NULL, Default CURRENT\_TIMESTAMP | Record creation timestamp. |
| last\_login | TIMESTAMP | NULLABLE | Last successful login time. |

3.2. IncomeSources Table (Income Sources and Bank/Cash Accounts)

Since the requirement mentions tracking "income source" and "remaining money," this table represents the user's various financial pools (e.g., Bank Account A, Cash Wallet, Client Payment Source).

| Field Name | Data Type | Constraints | Description |
|---|---|---|---|
| source\_id | INT | PRIMARY KEY, Auto-Increment | Unique ID for the financial source/account. |
| user\_id | INT / UUID | FOREIGN KEY (Users.user\_id), NOT NULL | Owner of the source. |
| source\_name | VARCHAR(150) | NOT NULL | E.g., "Main Checking Account", "Petty Cash". |
| source\_type | ENUM('BANK', 'CASH', 'OTHER') | NOT NULL | Type of source. |
| initial\_balance | DECIMAL(15, 2) | NOT NULL, Default 0.00 | Starting balance (for reporting context). |
| is\_active | BOOLEAN | NOT NULL, Default TRUE | Whether the source is currently in use. |

3.3. Categories Table (For Expenses and Income Classification)

This supports user-defined custom categories and subcategories.

| Field Name | Data Type | Constraints | Description |
|---|---|---|---|
| category\_id | INT | PRIMARY KEY, Auto-Increment | Unique category ID. |
| user\_id | INT / UUID | FOREIGN KEY (Users.user\_id), NULLABLE | Owner. NULL for system/standard categories. |
| parent\_category\_id | INT | FOREIGN KEY (Categories.category\_id), NULLABLE | Self-referencing for subcategories. |
| category\_name | VARCHAR(100) | NOT NULL | Name of the category (e.g., "Utilities", "Marketing"). |
| category\_type | ENUM('EXPENSE', 'INCOME') | NOT NULL | Classification type. |
| is\_custom | BOOLEAN | NOT NULL, Default FALSE | TRUE if created by the user, FALSE if system default. |

*Constraint Note: A composite unique constraint should be placed on (user\_id, category\_name) for custom categories.*

3.4. Transactions Table (The Core Financial Records)

This table captures the monetary movement.

| Field Name | Data Type | Constraints | Description |
|---|---|---|---|
| transaction\_id | INT | PRIMARY KEY, Auto-Increment | Unique transaction identifier. |
| user\_id | INT / UUID | FOREIGN KEY (Users.user\_id), NOT NULL | Owner. |
| transaction\_date | DATE | NOT NULL | The date the transaction occurred (for reporting). |
| transaction\_type | ENUM('INCOME', 'EXPENSE') | NOT NULL | Type of movement. |
| amount | DECIMAL(15, 2) | NOT NULL | The absolute value of the transaction. |
| description | TEXT | NULLABLE | Detailed notes about the transaction. |
| category\_id | INT | FOREIGN KEY (Categories.category\_id), NOT NULL | Classification of the transaction. |
| source\_id | INT | FOREIGN KEY (IncomeSources.source\_id), NOT NULL | Where the money came from (Expense) or went to (Income). |
| created\_at | TIMESTAMP | NOT NULL, Default CURRENT\_TIMESTAMP | Record logging time. |

*Handling Income vs. Expense:*
* If `transaction_type` is 'EXPENSE', the `amount` is debited from the `source_id`.
* If `transaction_type` is 'INCOME', the `amount` is credited to the `source_id`.

3.5. System Defaults (Seeding Data)

The system will pre-populate the Categories table with standard entries for all new users (where `user_id` is NULL or a default shared ID).

Example Default Expense Categories: Rent, Utilities, Supplies, Marketing, Salaries, Travel.
Example Default Income Categories: Sales Revenue, Investment Income, Service Fee.

4. Relationships Summary

*   **One-to-Many:**
    *   User $
ightarrow$ IncomeSources
    *   User $
ightarrow$ Transactions
    *   User $
ightarrow$ Categories (Custom)
*   **One-to-Many (Hierarchical):**
    *   Category (Parent) $
ightarrow$ Category (Subcategory via `parent_category_id`)
*   **Many-to-One:**
    *   Transactions $
ightarrow$ IncomeSources (via `source_id`)
    *   Transactions $
ightarrow$ Categories (via `category_id`)

5. Support for Future Features (Budgeting/Goals)

To support future budgeting requirements, the following structure is anticipated, requiring only addition in V2:

5.1. Budgets Table (Placeholder for Future Expansion)

| Field Name | Data Type | Constraints | Description |
|---|---|---|---|
| budget\_id | INT | PRIMARY KEY, Auto-Increment | |
| user\_id | INT / UUID | FOREIGN KEY, NOT NULL | |
| budget\_name | VARCHAR(100) | NOT NULL | |
| start\_date | DATE | NOT NULL | |
| end\_date | DATE | NOT NULL | |
| category\_id | INT | FOREIGN KEY (Categories.category\_id), NOT NULL | The category this budget applies to. |
| budgeted\_amount | DECIMAL(15, 2) | NOT NULL | Target spending limit. |

6. Reporting and Data Export Considerations

*   **Monthly Summary/Custom Date Ranges:** Handled entirely by querying the Transactions table, joining to Categories and IncomeSources, filtering by `transaction_date`.
*   **Category Breakdown:** Handled by aggregating `amount` in the Transactions table grouped by `category_id`.
*   **Trend Analysis:** Achieved by aggregating data across time periods (months/quarters) using `transaction_date`.
*   **CSV Export:** The application layer will construct the CSV from SQL query results. No specific schema changes are needed, but field selection should prioritize non-null, essential data (Date, Type, Source, Category, Amount, Description).

7. Current Balance Calculation

The "remaining picture" is calculated dynamically at query time:

Current Balance for Source X = Initial Balance (IncomeSources.initial\_balance) + (SUM of all Income Transactions linked to X) - (SUM of all Expense Transactions linked to X).
The schema supports this by separating Income and Expense records clearly in the Transactions table.

## User Flow
USERFLOW DOCUMENT: MOYO EXPENSETRAKER

VERSION: 1.0
DATE: 2023-10-27

1. INTRODUCTION

This document details the user flows, interaction patterns, and preliminary wireframe descriptions for the Moyo ExpenseTracker web application. The design aims to mirror the professional, clean aesthetic of applications like Akaunting, utilizing a blue color palette suitable for small business owners needing clear financial oversight.

2. CORE USER PERSONA

Small Business Owner: Needs quick data entry, clear visual reports, and immediate understanding of current cash position (Income vs. Expenses). Primary concerns are tracking where money is going and ensuring sufficient funds remain.

3. USER FLOW DIAGRAMS & DETAILS

3.1. User Onboarding & Authentication Flow

| Step | Action/State | Wireframe Description | Interaction Notes |
| :--- | :--- | :--- | :--- |
| 1 | Landing Page (Pre-Login) | Simple landing page featuring the app name, core value proposition ("Track Business Finances Effortlessly"), and primary CTAs: "Login" and "Sign Up". Blue/White theme. | Minimalist design focusing on conversion. |
| 2 | Sign Up | Form fields: Full Name, Email, Password (with confirmation). Terms & Conditions link. | Password strength indicator required. Upon successful sign-up, redirect to Setup Wizard (Step 3). |
| 3 | Initial Setup Wizard (Mandatory) | Step 1/3: Business Name (Optional). Step 2/3: Set Base Currency (Dropdown selection). Step 3/3: Configure Default Categories (Pre-populated standard list displayed, option to skip initial configuration). | Crucial for initial data integrity. Must enforce currency selection. |
| 4 | Login | Standard Email/Password fields. "Forgot Password" link. | Secure authentication mechanism (e.g., JWT or session management). |
| 5 | Post-Login | Redirect to Dashboard (Home Screen). | Session established. |

3.2. Income Management Flow

Goal: Allow the user to quickly log sources of income.

| Step | Action/State | Wireframe Description | Interaction Notes |
| :--- | :--- | :--- | :--- |
| 1 | Navigation to Income Section | User clicks "Income" tab/link in the primary navigation sidebar. | Navigation should be persistent across the application. |
| 2 | Income List View | Table view displaying Date, Source, Amount, and Action buttons (Edit/Delete). Default view: List of all recorded incomes. | Pagination if the list grows large. Clear header: "Recorded Income". |
| 3 | Add New Income | User clicks "+ Add Income" button (Prominent, likely top right). Opens a modal or dedicated entry screen. | Modal preferred for speed. |
| 4 | Income Entry Form | Fields: Amount (Numeric input, required), Date (Date picker, defaults to today), Source/Description (Text input), Optional: Reference/Invoice Number. | Amount field should auto-format currency based on base settings. |
| 5 | Submission | User clicks "Save Income". | Confirmation toast message ("Income successfully recorded"). Modal closes. Data immediately reflected in the Income List and Dashboard summary. |

3.3. Expense Tracking & Categorization Flow (The Core Loop)

Goal: Fast, accurate recording of expenses with robust categorization.

| Step | Action/State | Wireframe Description | Interaction Notes |
| :--- | :--- | :--- | :--- |
| 1 | Initiation of Expense Entry | User clicks the global "+ Add Transaction" button (Highly visible, perhaps a floating action button (FAB) styled in blue). | This button should allow quick selection between "Income" or "Expense". |
| 2 | Expense Entry Form (Modal) | Fields: Amount (Required), Date (Defaults to Today), Description/Vendor (Required), Category (Dropdown/Searchable Select). | Emphasis on the Category field. |
| 3 | Category Selection | Dropdown/Searchable list showing Standard Categories (e.g., Rent, Utilities, Supplies) and User-Defined Custom Categories. | Must support immediate drill-down to Subcategories if applicable (e.g., Utilities -> Electricity). |
| 4 | Handling Uncategorized Expenses | If the user attempts to save without selecting a category, prompt with a warning. Option to select "Uncategorized" or force category selection. | Best practice is to force categorization or mark clearly as Uncategorized for later review. |
| 5 | Submission & Review | User clicks "Save Expense". | Data immediately updates the ledger and the Dashboard 'Remaining Balance' calculation. |

3.4. Category Management Flow

Goal: Allow small businesses to tailor tracking to their specific operational needs.

| Step | Action/State | Wireframe Description | Interaction Notes |
| :--- | :--- | :--- | :--- |
| 1 | Navigation | User navigates to "Settings" -> "Categories Management". | Dedicated settings area for administration. |
| 2 | Category List View | Hierarchical display (Tree or indented list) showing all active Categories and Subcategories. Icons/Colors can be optionally assigned per category (UX preference, not critical for V1). | Display associated expense count for context. |
| 3 | Add New Category | User clicks "+ New Category". Form fields: Name, Type (Expense/Income - though usually Expense here), Parent Category (Dropdown, empty if it's a top-level category). | If Parent Category is selected, this becomes a Subcategory. |
| 4 | Edit/Delete Category | Click action on an existing category opens an edit modal. | **Constraint:** Cannot delete a category if it has associated historical transactions. Must prompt user to reassign those transactions first. |

3.5. Reporting and Analysis Flow

Goal: Deliver clear, actionable insights based on requirements (Monthly Summary, Category Breakdown, Trends, Custom Range).

| Step | Action/State | Wireframe Description | Interaction Notes |
| :--- | :--- | :--- | :--- |
| 1 | Navigation | User clicks "Reports" tab. Defaults to the high-level Overview Report for the current month. | Dashboard should offer quick links to the most common reports. |
| 2 | Overview Report (Default) | Displays: Net Balance (Income - Expense for period), Total Income, Total Expenses. Visualized by a large clear gauge or text display using the primary blue palette. | Must immediately show the "how much is remaining" status critical for the target audience. |
| 3 | Report Filtering/Customization | Controls Section: Date Range Selector (Presets: This Month, Last Month, YTD; Custom Date Picker), Report Type Selector (Category Breakdown, Trend Analysis). | Custom date ranges must be precise (Start Date to End Date). |
| 4 | Category Breakdown View | Interactive Pie Chart or Bar Chart showing expense distribution across categories for the selected period. | Clicking a slice/bar should optionally drill down to the transactions contributing to that total. |
| 5 | Trend Analysis View | Line graph plotting Net Balance over time (e.g., plotting monthly net flow over the last 12 months). | Essential for identifying spending patterns. |
| 6 | Data Export | "Export CSV" button visible on the Report view toolbar. | When clicked, the report data matching the current filter settings (including transaction details if drilling down) is exported as a CSV file. |

4. INTERACTION PATTERNS & UX CONSIDERATIONS

4.1. Dashboard (Home Screen)

*   **Key Metrics:** Prominently display Net Position (Income minus Expense YTD/MTD).
*   **Visual Style:** Clean card-based layout inspired by Akaunting. Use blues for positive metrics (Income/Net) and possibly muted grays/reds for high expenses, keeping the overall feel professional and calm.
*   **Quick Actions:** Direct links or buttons to Add Income, Add Expense, and View Reports.

4.2. Data Entry Consistency

*   All manual entry modals/forms (Income, Expense, Category) must share a consistent layout structure: Primary information first (Amount, Date), secondary details last (Description, Notes).
*   Use standardized validation feedback (e.g., red borders on required fields that fail entry).

4.3. Future Scalability Hooks (Budgeting/Goals)

*   **Placeholder Data Structure:** Ensure the data models for Income/Expense transactions include fields capable of linking to future Budget entities (e.g., `budget_id` foreign key, even if unused in V1).
*   **UI Preparation:** Reserve space on the Dashboard or a dedicated "Planning" tab for future Budget summary widgets.

4.4. Security and State Management

*   Application requires robust state management to handle real-time updates to Dashboard summaries upon transaction entry.
*   All API interactions related to financial data must be secured via authenticated sessions.

5. TECHNICAL CONSIDERATIONS (UX Impact)

*   **Responsiveness:** As a web application targeting busy business owners, the design must be fully responsive, ensuring mobile access maintains data entry usability, even if desktop viewing is primary for reporting.
*   **Loading States:** Because reports can involve complex calculations, clear, non-intrusive loading indicators (spinners using the primary blue color) must be used during report generation or CSV export processing.

## Styling Guidelines
MOYO EXPENSETRAKER - STYLING GUIDELINES DOCUMENT

VERSION 1.0
DATE: 2023-10-27

1. INTRODUCTION

This document outlines the visual design standards, principles, and assets for the Moyo ExpenseTracker web application. The goal is to ensure a consistent, professional, and user-friendly experience that aligns with the preferences observed in applications like Akaunting, focusing on clarity and financial trustworthiness.

2. DESIGN PRINCIPLES (UX/UI)

2.1. Clarity and Trustworthiness
Financial data demands high readability and immediate comprehension. Every visualization and data point must be unambiguous. The design should project reliability.

2.2. Efficiency for Small Business Owners
The primary audience requires quick data entry and fast access to critical reporting insights. Minimize visual clutter, especially on dashboard and expense entry screens.

2.3. Akaunting Inspiration
Embrace a clean, modern aesthetic. Use ample white space, logical grouping of related data, and intuitive navigation patterns common in professional financial software.

2.4. Mobile Responsiveness
As a web application, the design must gracefully adapt to various screen sizes, prioritizing readability and usability on smaller viewports (though the focus is desktop/tablet use for detailed reporting).

3. COLOR PALETTE

The primary color is Blue, symbolizing trust, stability, and professionalism, complemented by colors that clearly delineate positive (income/assets) and negative (expenses/liabilities) states.

3.1. Primary Color (Brand Blue)
Used for primary actions, headers, active states, and branding elements.

*   Name: Moyo Blue
*   HEX: #1E88E5 (A professional, mid-tone blue)
*   RGB: 30, 136, 229
*   Usage: Primary buttons, navigation bar background, active tabs.

3.2. Secondary/Accent Colors
Used for highlighting or secondary interaction points.

*   Name: Light Sky Accent
*   HEX: #BBDEFB (Very light blue for backgrounds or subtle highlights)
*   Usage: Hover states, secondary buttons (e.g., \"View Details\").

3.3. Semantic Colors (Data Visualization and Status)

*   Income/Positive: Success Green
    *   HEX: #43A047
    *   Usage: Income entries, positive balance indicators, net profit graphs.
*   Expense/Negative: Warning Red
    *   HEX: #E53935
    *   Usage: Expense entries, negative balances, spending trend alerts.
*   Neutral/Informational: Medium Gray
    *   HEX: #757575
    *   Usage: Helper text, disabled states, secondary table borders.

3.4. Neutral Palette (Backgrounds and Text)

*   Background (Canvas): White / Off-White
    *   HEX: #FFFFFF (Primary content areas)
    *   HEX: #F5F5F5 (General application background/card separation)
*   Text (Primary): Near Black
    *   HEX: #212121
*   Text (Secondary/Subtle): Dark Gray
    *   HEX: #616161

4. TYPOGRAPHY

We will use a highly readable, professional sans-serif typeface suitable for displaying numerical data accurately.

4.1. Font Family
*   Primary Font: Roboto (or a similar clean, widely available sans-serif like Inter or system default). Roboto is preferred for its excellent numerical rendering.

4.2. Scaling and Hierarchy

| Element | Font Size (px) | Weight | Usage Context |
| :--- | :--- | :--- | :--- |
| H1 (Page Title) | 32px | Bold (700) | Primary screen titles (e.g., Dashboard) |
| H2 (Section Header) | 24px | Semi-Bold (600) | Major content sections |
| H3 (Card Title) | 18px | Medium (500) | Titles for cards and widgets |
| Body Large (Key Metrics) | 16px | Bold (700) | Displaying current balance, total income |
| Body Standard | 14px | Regular (400) | General paragraph text, descriptions |
| Data Table/Input | 14px | Regular (400) | Input fields, standard table rows |
| Captions/Helper Text | 12px | Regular (400) | Tooltips, small labels, metadata |

5. ICONOGRAPHY

Icons must be clear, simple, and universally recognizable, especially for standard financial concepts (e.g., money bag for income, receipt for expense, graph for reports).

*   Style: Outline or two-tone filled icons. Avoid overly complex or skeuomorphic designs.
*   Size Consistency: Standard sizes should be 16px, 20px, and 24px for UI elements.
*   Color Use: Icons should generally be rendered in the Neutral palette, changing to Primary Blue or Semantic Colors only when indicating an active state or specific data type (e.g., a Green income icon).

6. LAYOUT AND SPACING (THE GRID)

We utilize an 8-point grid system to ensure harmonious vertical and horizontal rhythm throughout the application. All spacing, padding, and margins should be multiples of 8 (8px, 16px, 24px, 32px, etc.).

6.1. Components Spacing
*   Card Padding: 24px internal padding.
*   Button Padding: Vertical padding of 12px, horizontal padding based on content (e.g., 16px or 24px).
*   Data Table Row Height: Minimum 40px for comfortable scanning.

6.2. Navigation Structure
The application should feature a persistent, clean left-hand navigation sidebar (for desktop views) utilizing the Primary Blue for the active state indicator.

7. INTERACTION AND FEEDBACK

7.1. Buttons and CTAs (Call to Action)
*   Primary Action: Solid Moyo Blue background, white text. Minimum height of 40px.
*   Secondary Action: White background, Moyo Blue border and text (Ghost style).
*   Hover State: Primary buttons darken slightly (e.g., HEX #1565C0).

7.2. Data Entry Forms (Expense Capture)
Forms must be extremely efficient. Utilize clear input labels that remain visible (no floating labels that disappear entirely). Mandatory fields must be clearly marked (e.g., with an asterisk *).

7.3. Data Visualization (Reports)
*   Graphs (Trend Analysis, Category Breakdown): Use strong visual separation. Ensure that the Blue, Green, and Red semantic colors are used consistently across all charts (Bar charts, Pie charts, Line graphs).
*   Tooltips: Essential for hover interactions on charts, providing exact figures, dates, and categories.

7.4. Feedback Messages
*   Success (e.g., Expense Saved): Subtle banner using Success Green background/text.
*   Error (e.g., Validation Failed): Subtle banner using Warning Red background/text.
*   System Notification (e.g., Data Exported): Subtle banner using Light Sky Accent background.
