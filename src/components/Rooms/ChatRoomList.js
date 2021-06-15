//
import React from 'react';
import { Nav } from 'rsuite';
import RoomItem from './RoomItem';

const ChatRoomList = ({ aboveElementHeight }) => {
    return (
        <Nav
            appearance="subtle"
            vertical
            reversed
            className="overflow-y-scroll custom-scroll"
            style={{ height: `calc(100% - ${aboveElementHeight}px)` }} // calculating height of the Component
            /* NOTE: the above calculation solves the problem of having different size of the 
              ChatRoomList Component for different screens.
              It is calculated by subtracting the height of elements/Components above it
              (div containing DashboardToggle and CreateRoomBtnModal) from 100%

            */
        >
            <Nav.Item>
                <RoomItem />
            </Nav.Item>
        </Nav>
    );
};

export default ChatRoomList;
