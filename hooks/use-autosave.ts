"use client"

import { useEffect, useRef, useCallback } from "react"
import { useCVStore, selectCV, selectIsDirty } from "@/lib/store/cv-store"

const AUTOSAVE_DELAY = 1000 // 1 second debounce
const STORAGE_KEY = "cv-builder-autosave"

export function useAutosave() {
  const cv = useCVStore(selectCV)
  const isDirty = useCVStore(selectIsDirty)
  const markSaved = useCVStore((state) => state.markSaved)
  const lastSaved = useCVStore((state) => state.lastSaved)

  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const previousCVRef = useRef<string | null>(null)

  const save = useCallback(() => {
    const serialized = JSON.stringify(cv)

    // Don't save if nothing changed
    if (serialized === previousCVRef.current) {
      return
    }

    try {
      localStorage.setItem(STORAGE_KEY, serialized)
      previousCVRef.current = serialized
      markSaved()
    } catch (error) {
      console.error("Failed to autosave:", error)
    }
  }, [cv, markSaved])

  // Debounced autosave
  useEffect(() => {
    if (!isDirty) return

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    timeoutRef.current = setTimeout(save, AUTOSAVE_DELAY)

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [cv, isDirty, save])

  // Load saved data on mount
  useEffect(() => {
    const loadSaved = () => {
      try {
        const saved = localStorage.getItem(STORAGE_KEY)
        if (saved) {
          const parsed = JSON.parse(saved)
          useCVStore.getState().setCV(parsed)
          previousCVRef.current = saved
        }
      } catch (error) {
        console.error("Failed to load autosaved data:", error)
      }
    }

    loadSaved()
  }, [])

  return {
    lastSaved,
    isDirty,
  }
}

export function clearAutosave() {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch (error) {
    console.error("Failed to clear autosave:", error)
  }
}
