"use client";

import React, { createContext, useContext, useEffect, useReducer } from "react";
import type { JobApplication, StageId } from "@/types/job";

interface ApplicationsState {
  applications: JobApplication[];
  isHydrated: boolean;
}

const STORAGE_KEY = "nextjs-job-tracker/applications";

function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(date.getDate() + days);
  return next.toISOString();
}

const initialState: ApplicationsState = {
  applications: [],
  isHydrated: false,
};

type ApplicationsAction =
  | { type: "HYDRATE"; payload: JobApplication[] }
  | { type: "ADD_APPLICATION"; payload: JobApplication }
  | { type: "UPDATE_APPLICATION"; payload: JobApplication }
  | { type: "DELETE_APPLICATION"; payload: { id: string } }
  | { type: "MOVE_STAGE"; payload: { id: string; stage: StageId } };

function reducer(state: ApplicationsState, action: ApplicationsAction): ApplicationsState {
  switch (action.type) {
    case "HYDRATE":
      return { applications: action.payload, isHydrated: true };
    case "ADD_APPLICATION":
      return {
        ...state,
        applications: [action.payload, ...state.applications],
      };
    case "UPDATE_APPLICATION":
      return {
        ...state,
        applications: state.applications.map((job) =>
          job.id === action.payload.id ? action.payload : job
        ),
      };
    case "DELETE_APPLICATION":
      return {
        ...state,
        applications: state.applications.filter((job) => job.id !== action.payload.id),
      };
    case "MOVE_STAGE": {
      const now = new Date();
      return {
        ...state,
        applications: state.applications.map((job) => {
          if (job.id !== action.payload.id) return job;
          let nextFollowUpAt = job.nextFollowUpAt;
          if (action.payload.stage === "applied") {
            nextFollowUpAt = addDays(now, 3);
          } else if (action.payload.stage === "interview") {
            nextFollowUpAt = addDays(now, 2);
          }
          return {
            ...job,
            stage: action.payload.stage,
            nextFollowUpAt,
            lastUpdatedAt: now.toISOString(),
          };
        }),
      };
    }
    default:
      return state;
  }
}

const ApplicationsContext = createContext<{
  state: ApplicationsState;
  dispatch: React.Dispatch<ApplicationsAction>;
} | null>(null);

export function ApplicationsProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as JobApplication[];
        dispatch({ type: "HYDRATE", payload: parsed });
        return;
      } catch (error) {
        console.error("Failed to parse stored applications", error);
      }
    }
    dispatch({ type: "HYDRATE", payload: [] });
  }, []);

  useEffect(() => {
    if (!state.isHydrated) return;
    if (typeof window === "undefined") return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state.applications));
  }, [state.applications, state.isHydrated]);

  return (
    <ApplicationsContext.Provider value={{ state, dispatch }}>
      {children}
    </ApplicationsContext.Provider>
  );
}

export function useApplications() {
  const ctx = useContext(ApplicationsContext);
  if (!ctx) throw new Error("useApplications must be used within ApplicationsProvider");
  return ctx;
}
