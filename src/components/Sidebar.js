// React Component for Sidebar
import React from 'react';
import DashboardToggle from './Dashboard/DashboardToggle';
import '../styles/utility.scss';
import CreateRoomBtnModal from './Dashboard/CreateRoomBtnModal';

const Sidebar = () => {
    return (
        <div className="h-100 pt-2">
            <div>
                <DashboardToggle />
                <CreateRoomBtnModal />
            </div>
            bottom
        </div>
    );
};

export default Sidebar;
