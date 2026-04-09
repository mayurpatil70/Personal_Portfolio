/**
 * Form data persistence utility
 * Saves and retrieves form data from localStorage
 * Intelligently reuses previously entered data
 */

export interface FormData {
  name?: string;
  email?: string;
  whatsapp?: string;
  subject?: string;
  message?: string;
  [key: string]: string | undefined;
}

const STORAGE_KEY = "portfolioFormData";

// Fields that should be reused and remembered
const PERSISTENT_FIELDS = ["name", "email", "whatsapp"];

/**
 * Save form data to localStorage
 * Only saves fields that are marked as persistent
 */
export const saveFormData = (data: FormData): void => {
  const persistentData: FormData = {};

  PERSISTENT_FIELDS.forEach((field) => {
    if (data[field]) {
      persistentData[field] = data[field];
    }
  });

  if (Object.keys(persistentData).length > 0) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(persistentData));
  }
};

/**
 * Get saved form data from localStorage
 * Returns only persistent fields
 */
export const getSavedFormData = (): FormData => {
  if (typeof window === "undefined") return {};

  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (error) {
    console.error("Error reading form data from localStorage:", error);
  }

  return {};
};

/**
 * Clear saved form data
 */
export const clearFormData = (): void => {
  if (typeof window !== "undefined") {
    localStorage.removeItem(STORAGE_KEY);
  }
};

/**
 * Get initial form values with saved data
 * Merges default values with saved persistent data
 */
export const getInitialFormValues = (defaultValues: FormData): FormData => {
  const savedData = getSavedFormData();
  return { ...defaultValues, ...savedData };
};
