1. Project Goal

Build a frontend-only Job Application Tracker in Next.js that feels like a small B2B / internal tool.

The tool should let a user:

Track job applications as they move through stages:

Applied → Online Test → Interview → Offer → Rejected

View and manage applications in:

A Kanban board view (columns per stage).

A Table view (sortable, filterable).

See follow-up reminders (Follow up in X days, Overdue, etc.).

Use quick filters (country, remote/on-site, salary band).

Persist data in the browser (e.g. localStorage), no backend.

Focus on:

Clean, predictable state handling.

Simple but professional internal-tool UX (no marketing fluff).

2. Tech Stack & Constraints

Use:

Next.js (App Router).

TypeScript.

React function components and hooks.

Tailwind CSS (preferred) for styling.

Client-side persistence with localStorage.

Do not add a real backend or database. All data should live in client state and sync to localStorage.

3. Data Model

Create a central TypeScript type for each job application.

// types/job.ts
export type WorkMode = "remote" | "onsite" | "hybrid";

export type StageId =
  | "applied"
  | "online_test"
  | "interview"
  | "offer"
  | "rejected";

export interface JobApplication {
  id: string;              // uuid
  company: string;
  role: string;
  location: string;        // e.g. "Berlin, Germany"
  workMode: WorkMode;      // remote / onsite / hybrid
  salary?: number | null;  // numeric value (e.g. annual)
  salaryCurrency?: string; // e.g. "EUR", "AED"
  source?: string;         // "LinkedIn", "Company site", etc.
  recruiter?: string;      // recruiter/person name
  notes?: string;
  stage: StageId;

  appliedAt: string;       // ISO date string
  nextFollowUpAt?: string | null; // ISO date string or null
  lastUpdatedAt: string;   // ISO date string
}


Also create a stage config:

// config/stages.ts
import type { StageId } from "@/types/job";

export interface StageConfig {
  id: StageId;
  label: string;
}

export const STAGES: StageConfig[] = [
  { id: "applied",      label: "Applied" },
  { id: "online_test",  label: "Online Test" },
  { id: "interview",    label: "Interview" },
  { id: "offer",        label: "Offer" },
  { id: "rejected",     label: "Rejected" },
];

4. Application State & Architecture

Use a single global store for job applications and filters.

4.1 Applications State

Create a React context + reducer for managing JobApplication[].

// store/applications-context.tsx
"use client";

import React, { createContext, useContext, useReducer, useEffect } from "react";
import type { JobApplication, StageId } from "@/types/job";

interface ApplicationsState {
  applications: JobApplication[];
  isHydrated: boolean;
}

type ApplicationsAction =
  | { type: "HYDRATE"; payload: JobApplication[] }
  | { type: "ADD_APPLICATION"; payload: JobApplication }
  | { type: "UPDATE_APPLICATION"; payload: JobApplication }
  | { type: "DELETE_APPLICATION"; payload: { id: string } }
  | { type: "MOVE_STAGE"; payload: { id: string; stage: StageId } };

const ApplicationsContext = createContext<{
  state: ApplicationsState;
  dispatch: React.Dispatch<ApplicationsAction>;
} | null>(null);


Implement:

A reducer that updates state based on actions.

MOVE_STAGE should:

Update stage.

Update lastUpdatedAt to new Date().toISOString().

Optionally adjust nextFollowUpAt (e.g. +3 days on applied, +2 days on interview).

4.2 Persistence (localStorage)

Inside the provider:

On mount (client side), read from localStorage:

Key: "nextjs-job-tracker/applications".

Parse JSON and dispatch HYDRATE.

On state change, write applications to localStorage.

Make sure hydration only runs on the client (guard with typeof window !== "undefined").

4.3 Filters State

Define filters in a separate hook or context.

// store/filters.ts
export interface FiltersState {
  search: string;
  stageIds: StageId[];           // empty = all
  workMode: WorkMode | "all";
  country: string | "all";       // derived from locations
  salaryBand: "all" | "<50k" | "50-80k" | "80-120k" | "120k+";
}


Provide:

A simple React hook or context with:

State and setter functions.

A helper to filter applications: filterApplications(applications, filters).

Filtering rules:

search: matches company or role (case-insensitive substring).

stageIds: if not empty, include only those stages.

workMode: if not "all", match workMode.

country: if not "all", match last part of location after final comma (e.g. “Germany” in “Berlin, Germany”).

salaryBand: bucket salary into:

<50k

50-80k

80-120k

120k+
Ignore missing/undefined salaries when a band is selected.

5. Follow-up Reminder Logic

Derive a follow-up status from nextFollowUpAt and today’s date.

Create a helper:

// lib/followUp.ts
import type { JobApplication } from "@/types/job";

export type FollowUpStatus =
  | { type: "none" }
  | { type: "overdue"; days: number }
  | { type: "today" }
  | { type: "upcoming"; days: number };

export function getFollowUpStatus(job: JobApplication, now = new Date()): FollowUpStatus {
  // If nextFollowUpAt is null/undefined, return { type: "none" }.
  // Otherwise compare dates:
  // - If in the past: type "overdue" (round difference in days).
  // - If same calendar day: type "today".
  // - If in future: type "upcoming" with days until.
}


Use this status to render small badges:

overdue: red badge, text like Overdue by 2 days.

today: orange badge, text: Follow up today.

upcoming: neutral badge: Follow up in 3 days.

none: no badge.

6. UI Layout & Pages (Next.js App Router)

Use App Router with a simple layout.

6.1 Folder Structure (high-level)
/app
  layout.tsx
  page.tsx           // main dashboard: board + table toggles

/components
  layout/TopNav.tsx
  layout/PageShell.tsx

  filters/FiltersBar.tsx

  board/BoardView.tsx
  board/BoardColumn.tsx
  board/BoardCard.tsx

  table/TableView.tsx
  table/TableHeader.tsx
  table/TableRow.tsx

  jobs/JobFormModal.tsx
  jobs/JobDetailsDrawer.tsx
  jobs/FollowUpBadge.tsx

/config
  stages.ts

/lib
  followUp.ts

/store
  applications-context.tsx
  filters-context.tsx (or filters hook)

  // etc.

types
  job.ts

6.2 layout.tsx

A minimal layout with:

App title: “Job Application Tracker”.

Optional top nav with:

App name.

Simple text summary (e.g. total applications).

6.3 page.tsx

page.tsx should:

Wrap content with ApplicationsProvider and FiltersProvider.

Display:

A summary bar: total jobs, counts per stage (using STAGES).

A view switcher: tabs or buttons:

Board | Table.

The FiltersBar.

Either <BoardView /> or <TableView /> depending on selected tab.

Provide a “New Application” primary button that opens JobFormModal.

7. Filters Bar Component

FiltersBar should:

Live at the top of the page, under summary bar.

Include:

Search input (placeholder: “Search by company or role…”).

Stage filter (chips or multi-select; default “All stages”).

Work mode filter (segmented buttons: All | Remote | On-site | Hybrid).

Country filter (dropdown built from distinct countries in current applications; plus “All countries” option).

Salary band selector (All | <50k | 50–80k | 80–120k | 120k+).

Filters should:

Be controlled inputs connected to FiltersState.

Update filters via the filters context or hook.

8. Board View (Kanban)
8.1 BoardView.tsx

Responsibility:

Receive full applications from context.

Apply filters using filter helper.

Group filtered applications by stage.

Render one BoardColumn per stage in STAGES order.

Layout:

Horizontal scrollable area (CSS: flex with overflow-x-auto).

Each column has a fixed min-width (e.g. min-w-[280px]).

8.2 BoardColumn.tsx

Props:

stage: StageConfig.

jobs: JobApplication[].

Render:

Header: stage.label + count.

+ Add button to open JobFormModal with stage preselected.

List of BoardCard components.

8.3 BoardCard.tsx

Card shows:

Company (bold).

Role (smaller text).

Location + workMode tag (e.g. small pill: “Remote”, “On-site”).

Salary short text (if available, e.g. “€90k”).

FollowUpBadge (using getFollowUpStatus).

Interactions:

Clicking the card opens JobDetailsDrawer.

Support drag-and-drop between columns using a library like @hello-pangea/dnd or similar.

On drop, call dispatch({ type: "MOVE_STAGE", payload: { id, stage } }).

If drag-and-drop is too heavy, you can initially implement:

A small stage dropdown or buttons on the card to change stage.

Then optionally add drag-and-drop.

9. Table View
9.1 TableView.tsx

Responsibility:

Receive applications from context.

Apply filters.

Provide client-side sorting:

By appliedAt (default: newest first).

By salary (high to low).

By stage.

Render table headers + rows.

Columns:

Company

Role

Stage

Location

Work mode

Salary

Source

Recruiter

Next follow-up (with FollowUpBadge or formatted date)

Last updated

Table behavior:

Clicking a row opens JobDetailsDrawer.

Header cells for sortable columns show sort indicator and toggle sort on click.

10. Job Creation & Editing
10.1 JobFormModal.tsx

Use a modal dialog for:

Creating new jobs.

Editing existing jobs.

Fields:

Company (required).

Role (required).

Location.

Work mode (select).

Salary + currency.

Source.

Recruiter.

Notes (textarea).

Stage (select, default applied).

Applied date (default today).

Next follow-up date (optional but can auto-suggest).

On submit:

For new jobs:

Generate id (e.g. crypto.randomUUID()).

Set appliedAt, lastUpdatedAt.

If nextFollowUpAt is empty, auto-set:

For applied: today + 3 days.

For interview: today + 2 days.

For existing jobs:

Preserve id and appliedAt.

Update other fields.

Set lastUpdatedAt to now.

Dispatch appropriate action:

ADD_APPLICATION or UPDATE_APPLICATION.

10.2 JobDetailsDrawer.tsx

A side-panel drawer showing full job details:

All fields in a tidy layout.

Follow-up status badge.

Buttons:

Edit (opens JobFormModal in edit mode).

Delete (with confirmation).

Quick stage change buttons (e.g. “Move to Interview”, “Mark as Rejected”).

11. Styling & UX Guidelines

General style:

Clean and minimal, like an internal admin tool:

Light neutral background.

Simple card shadows.

Rounded corners.

Consistent spacing.

Specific guidelines:

Use Tailwind utility classes.

Ensure everything is responsive:

Board columns scroll horizontally on small screens.

Table can scroll horizontally if needed.

Provide clear hover and focus states.

Use subtle transitions (e.g. transition-colors, transition-shadow).

No hero banner or marketing sections; go straight into the tool.

12. Summary of Key Requirements

Next.js (App Router) + TypeScript + Tailwind.

Frontend-only; data stored in localStorage.

Central JobApplication[] store with context + reducer.

Filters (search, stage, work mode, country, salary band).

Derived follow-up status logic with badges.

Two main views:

Board (per-stage columns, cards).

Table (sortable, filterable).

Modal for new/edit job.

Drawer for job details.

Clean, internal-tool style UX.

Follow these instructions step by step to implement the project.
