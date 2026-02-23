import React, { createContext, useContext, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

const NavigationContext = createContext({ direction: 1, navigateTo: () => { } });

export const useNavDirection = () => useContext(NavigationContext);

/**
 * Wraps children with a direction-aware navigation context.
 * `direction`:  1 = slide new page in from the right (going "forward")
 *              -1 = slide new page in from the left  (going "back")
 */
export const NavigationProvider = ({ children }) => {
    const [direction, setDirection] = useState(1);
    const rawNavigate = useNavigate();

    const navigateTo = useCallback((path, dir = 1) => {
        setDirection(dir);
        rawNavigate(path);
    }, [rawNavigate]);

    return (
        <NavigationContext.Provider value={{ direction, navigateTo }}>
            {children}
        </NavigationContext.Provider>
    );
};
