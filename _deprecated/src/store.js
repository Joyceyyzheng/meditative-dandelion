import create from "zustand";

const useStore = create((set) => ({
  modelActive: false,
  setModelActive: () => set((state) => ({ modelActive: !state.modelActive })),
  flowerActive: false,
  setFlowerActive: () =>
    set((state) => ({ flowerActive: !state.flowerActive })),
  globalControlsEnabled: false,
  setGlobalControlsEnabled: () =>
    set((state) => ({ globalControlsEnabled: !state.globalControlsEnabled })),
  //day number
  dayNumber: 0,
  setDayNumber: (dayNumber) => set({ dayNumber }),
  incrementDayNumber: () =>
    set((state) => ({
      dayNumber: state.dayNumber >= 7 ? 1 : state.dayNumber + 1, //⚠️ where to modify the day number -> days
    })),
  dayPhase: true,
  setDayPhase: (dayPhase) => set({ dayPhase }),
}));

export default useStore;
