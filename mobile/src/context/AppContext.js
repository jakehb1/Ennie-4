import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
} from "react";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  /* ── Symptom tracking ── */
  const [pins, setPins] = useState([]);
  const [baselinePins, setBaselinePins] = useState([]);
  const [finalPins, setFinalPins] = useState([]);

  /* ── Session / queue ── */
  const [selectedTier, setSelectedTier] = useState(null); // "free" | "today" | "week"
  const [queuePosition, setQueuePosition] = useState(null);
  const [inQueue, setInQueue] = useState(false);

  /* ── Condition ── */
  const [userCondition, setUserCondition] = useState("");

  /* ── UI preferences ── */
  const [darkMode, setDarkMode] = useState(false);

  /* ── Pin helpers ── */
  const addPin = useCallback((pin) => {
    setPins((prev) => [...prev, { ...pin, id: Date.now().toString() }]);
  }, []);

  const removePin = useCallback((pinId) => {
    setPins((prev) => prev.filter((p) => p.id !== pinId));
  }, []);

  const updatePin = useCallback((pinId, updates) => {
    setPins((prev) =>
      prev.map((p) => (p.id === pinId ? { ...p, ...updates } : p))
    );
  }, []);

  const clearPins = useCallback(() => setPins([]), []);

  /* ── Snapshot pins for session lifecycle ── */
  const captureBaseline = useCallback(() => {
    setBaselinePins([...pins]);
  }, [pins]);

  const captureFinal = useCallback(() => {
    setFinalPins([...pins]);
  }, [pins]);

  /* ── Queue helpers ── */
  const enterQueue = useCallback((position) => {
    setInQueue(true);
    setQueuePosition(position);
  }, []);

  const leaveQueue = useCallback(() => {
    setInQueue(false);
    setQueuePosition(null);
  }, []);

  /* ── Dark mode ── */
  const toggleDarkMode = useCallback(() => {
    setDarkMode((prev) => !prev);
  }, []);

  /* ── Reset all state (e.g. after session ends) ── */
  const resetSession = useCallback(() => {
    setPins([]);
    setBaselinePins([]);
    setFinalPins([]);
    setSelectedTier(null);
    setQueuePosition(null);
    setInQueue(false);
    setUserCondition("");
  }, []);

  const value = useMemo(
    () => ({
      // State
      pins,
      baselinePins,
      finalPins,
      selectedTier,
      queuePosition,
      inQueue,
      userCondition,
      darkMode,
      // Setters
      setPins,
      setBaselinePins,
      setFinalPins,
      setSelectedTier,
      setQueuePosition,
      setInQueue,
      setUserCondition,
      setDarkMode,
      // Helpers
      addPin,
      removePin,
      updatePin,
      clearPins,
      captureBaseline,
      captureFinal,
      enterQueue,
      leaveQueue,
      toggleDarkMode,
      resetSession,
    }),
    [
      pins,
      baselinePins,
      finalPins,
      selectedTier,
      queuePosition,
      inQueue,
      userCondition,
      darkMode,
      addPin,
      removePin,
      updatePin,
      clearPins,
      captureBaseline,
      captureFinal,
      enterQueue,
      leaveQueue,
      toggleDarkMode,
      resetSession,
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}

export default AppContext;
