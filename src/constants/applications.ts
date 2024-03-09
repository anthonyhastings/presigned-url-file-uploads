export type Application = {
  id: string;
  name: string;
  received: string;
  fileId: string;
  coverNote?: string;
};

const defaultApplications: Application[] = [];

// Global singleton store to persist across module instances / processes
declare global {
  var __APPLICATIONS_STORE__: Application[] | undefined;
}

const ensureStore = (): Application[] => {
  if (!globalThis.__APPLICATIONS_STORE__) {
    globalThis.__APPLICATIONS_STORE__ = [...defaultApplications];
  }

  return globalThis.__APPLICATIONS_STORE__;
};

export const getApplications = (): Application[] => ensureStore();

export const updateApplications = (data: Application[]): Application[] => {
  globalThis.__APPLICATIONS_STORE__ = data;
  return ensureStore();
};
