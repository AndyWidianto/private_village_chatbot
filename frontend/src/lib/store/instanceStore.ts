import { create } from "zustand";
import type { Device } from "../types";

interface InstanceStore {
    instances: Device[];
    instance: Device | null;
    updateInstance: (data: Device[]) => void;
    setInstance: (data: Device) => void;
}
export const useInstanceStore = create<InstanceStore>((set) => ({
    instances: [],
    instance: null,
    updateInstance: (data) => {
        set({
            instances: data
        })
    },
    setInstance: (data) => {
        set({
            instance: data
        })
    }
}))


