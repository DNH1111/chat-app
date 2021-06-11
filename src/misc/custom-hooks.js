// custom hooks
import { useEffect, useState, useCallback } from 'react';

// custom-hook to keep track of state of a Drawer (opened, closed)
export function useModalState(defaultValue = false) {
    const [isOPen, setIsOpen] = useState(defaultValue);

    // using useCallBack() hook for these two so new copies of these functions don't have to be created on every re-render
    const open = useCallback(() => setIsOpen(true), []);
    const close = useCallback(() => setIsOpen(false), []);

    return { isOPen, open, close };
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
