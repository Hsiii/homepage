import { useMemo, useSyncExternalStore } from 'react';

import type { Keybind } from '@/utils/keybinds';
import {
    keybindChangeEvent,
    keybindStorageKey,
    parseKeybinds,
} from '@/utils/keybinds';

const subscribe = (callback: () => void) => {
    globalThis.addEventListener('storage', callback);
    globalThis.addEventListener(keybindChangeEvent, callback);
    return () => {
        globalThis.removeEventListener('storage', callback);
        globalThis.removeEventListener(keybindChangeEvent, callback);
    };
};
const getSnapshot = () => {
    try {
        return globalThis.localStorage.getItem(keybindStorageKey) ?? undefined;
    } catch {
        return undefined;
    }
};
const getServerSnapshot = () => undefined;

const saveKeybinds = (next: readonly Keybind[]): boolean => {
    try {
        globalThis.localStorage.setItem(
            keybindStorageKey,
            JSON.stringify(next)
        );
        globalThis.dispatchEvent(new Event(keybindChangeEvent));
        return true;
    } catch {
        return false;
    }
};

export const useKeybinds = (): {
    keybinds: Keybind[];
    saveKeybinds: (next: readonly Keybind[]) => boolean;
} => {
    const stored = useSyncExternalStore(
        subscribe,
        getSnapshot,
        getServerSnapshot
    );
    const keybinds = useMemo(() => parseKeybinds(stored), [stored]);
    return { keybinds, saveKeybinds };
};
