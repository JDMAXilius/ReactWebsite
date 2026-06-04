// Global state via useReducer (Flux pattern — Ch01)
import { createContext, useContext, useReducer, useCallback, type ReactNode } from "react";
import { PROJECTS, type Project } from "../data/mock";

type Theme = "dark" | "light";
type Page = "dashboard" | "projects" | "analytics" | "team" | "settings";

type AppState = {
  theme: Theme;
  page: Page;
  projects: Project[];
  sidebarOpen: boolean;
};

type AppAction =
  | { type: "SET_THEME"; payload: Theme }
  | { type: "SET_PAGE"; payload: Page }
  | { type: "ADD_PROJECT"; payload: Project }
  | { type: "UPDATE_PROJECT"; payload: Project }
  | { type: "DELETE_PROJECT"; payload: string }
  | { type: "TOGGLE_SIDEBAR" };

const initialState: AppState = {
  theme: "dark",
  page: "dashboard",
  projects: PROJECTS,
  sidebarOpen: true,
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case "SET_THEME":
      document.documentElement.setAttribute("data-theme", action.payload);
      return { ...state, theme: action.payload };
    case "SET_PAGE":
      return { ...state, page: action.payload };
    case "ADD_PROJECT":
      return { ...state, projects: [action.payload, ...state.projects] };
    case "UPDATE_PROJECT":
      return { ...state, projects: state.projects.map(p => p.id === action.payload.id ? action.payload : p) };
    case "DELETE_PROJECT":
      return { ...state, projects: state.projects.filter(p => p.id !== action.payload) };
    case "TOGGLE_SIDEBAR":
      return { ...state, sidebarOpen: !state.sidebarOpen };
    default:
      return state;
  }
}

type AppContextValue = {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  navigate: (page: Page) => void;
  toggleTheme: () => void;
};

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const navigate = useCallback((page: Page) => {
    dispatch({ type: "SET_PAGE", payload: page });
  }, []);

  const toggleTheme = useCallback(() => {
    dispatch({ type: "SET_THEME", payload: state.theme === "dark" ? "light" : "dark" });
  }, [state.theme]);

  return (
    <AppContext.Provider value={{ state, dispatch, navigate, toggleTheme }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
