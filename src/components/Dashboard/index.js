// React Component to contain code for Dashboard Component
// the Dashboard Component is written inside the DashboardToggle Component's Drawer Component
import React from 'react';
import { Drawer, Button } from 'rsuite';
import { useProfile } from '../../context/profile.context';

const Dashboard = ({ onSignOut }) => {
    // getting access to Profile Context
    /* 
        Since ProfileContextProvider wraps the Homepage Component, it also
        encompasses its children Components.
    */
    const { profile } = useProfile();

    return (
        <>
            <Drawer.Header>
                <Drawer.Title>Dashboard</Drawer.Title>
            </Drawer.Header>

            <Drawer.Body>
                <h3>Hey, {profile.name} </h3>
            </Drawer.Body>

            <Drawer.Footer>
                <Button block color="red" onClick={onSignOut}>
                    Sign out
                </Button>
            </Drawer.Footer>
        </>
    );
};

export default Dashboard;
