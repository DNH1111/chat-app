import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, database } from '../misc/firebase';

// creating Context object
const ProfileContext = createContext();

/*  NOTES ON CONTEXT
    
    a Context object provides a "Provider" to other Components, 
    so that those Components can use Context data.
    
    In other words, the Provider provides Context data to the 
    consuming Components.

    the Context Provider should be wrapper around the consuming Components,
    to whom the Context data is to be provided.

    Any Components coming inside the Provider wrapper would be able to access
    Context data.

    A Provider can be wrapped around different Components separately. In that case,
    the each Component would be accessing different "copies" of the Context to which
    the Provider belongs.

    the Components get access to Context data from the Provider
    through a Context hook, called useContext().
*/

// exporting Provider function that would be used to provide profileContext
export const ProfileProvider = ({ children }) => {
    // variable to keep track of whether the user is signed-in
    const [profile, setProfile] = useState(null);

    // state for loading spinner
    const [isLoading, setIsLoading] = useState(true);

    // calling useEffect() to alter the state of "profile" on every Component mount
    useEffect(() => {
        let userRef;

        const authUnsub = auth.onAuthStateChanged(user => {
            // if a usern has signed-in, user would have info of the user
            // else, it would be null

            /* 
                NOTICE: We didn't have to sign-in the user in this file. 
                        After the user succesfully signs in, firebase manages sessions, and 
                        makes user (user info) available globally. 
            */
            if (user) {
                // if user is signed-in
                // accessing user database to get user name and createdAt parameters
                /* database.ref.on('value') is an event listener that is triggered when there's 
                   a change in the database at the specified path. 
                   "snap" used in the callback function of the "on" function gives the contents
                   of the database where the change took place.
                   "snap.val()" returns a JSON value of the contents of the database that were changed.
                */
                userRef = database.ref(`/profiles/${user.uid}`);
                userRef.on('value', snap => {
                    const [name, createdAt] = snap.val();

                    const userData = {
                        name,
                        createdAt,
                        uid: user.uid,
                        email: user.email,
                    };

                    setProfile(userData);
                    setIsLoading(false);
                });
            } else {
                // if the user has signed-out, or is not signed-in, unsubscribe the user reference...
                if (userRef) {
                    userRef.off();
                }

                // ...and set profile to null and isLoading to false
                setProfile(null);
                setIsLoading(false);
            }
        });

        return () => {
            authUnsub(); // unsubscribing the auth when the Component is unmounted

            if (userRef) {
                // unusbscribing user reference
                userRef.off();
            }
        };
    }, []);

    // Context data can be passed using "value = {ContextData}"" inside the Provider tag
    return (
        <ProfileContext.Provider value={{ profile, isLoading }}>
            {children}
        </ProfileContext.Provider>
    );
};

// custom-hook to use the useContext() hook for the ProfileContext
export const useProfile = () => {
    useContext(ProfileContext);
};
