"use client";

export const SELECTED_ROLE_STORAGE_KEY = "skillpath:selected-role";

export function getSelectedRoleFromStorage() {
  if (typeof window === "undefined") {
    return "";
  }

  return window.localStorage.getItem(SELECTED_ROLE_STORAGE_KEY) ?? "";
}

export function saveSelectedRoleToStorage(role: string) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(SELECTED_ROLE_STORAGE_KEY, role);
  window.dispatchEvent(new Event("skillpath:selected-role-change"));
}
