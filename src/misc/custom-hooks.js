// custom hooks
import { useEffect, useState, useCallback } from 'react';
import { database } from './firebase';

// custom-hook to keep track of state of a Drawer (opened, closed)
export function useModalState(defaultValue = false) {
    const [isOpen, setIsOpen] = useState(defaultValue);

    // using useCallBack() hook for these two so new copies of these functions don't have to be created on every re-render
    const open = useCallback(() => setIsOpen(true), []);
    const close = useCallback(() => setIsOpen(false), []);

    return { isOpen, open, close };
}

export const useMediaQuery = query => {
    const [matches, setMatches] = useState(
        () => window.matchMedia(query).matches
    );

    useEffect(() => {
        const queryList = window.matchMedia(query);
        setMatches(queryList.matches);

        const listener = evt => setMatches(evt.matches);

        queryList.addListener(listener);
        return () => queryList.removeListener(listener);
    }, [query]);

    return matches;
};

// custom-hook to get realtime presence from users
export function usePresence(uid) {
    // state for presence
    const [presence, setPresence] = useState(null);

    useEffect(() => {
        const userStatusRef = database.ref(`/status/${uid}`);

        userStatusRef.on('value', snap => {
            if (snap.exists) {
                // get data
                const data = snap.val();

                // update presence state
                setPresence(data);
            }
        });

        // cleanup function to unsubscribe resources
        return () => {
            userStatusRef.off();
        };
    }, [uid]);

    return presence;
}
