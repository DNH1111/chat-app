// React Component for Chat
import React from 'react';
import { useParams } from 'react-router';
import { Loader } from 'rsuite';

import Top from '../../components/Chat-window/top';
import Messages from '../../components/Chat-window/messages';
import Bottom from '../../components/Chat-window/bottom';
import { useRooms } from '../../context/rooms.context';
import { CurrentRoomProvider } from '../../context/current-room.context';

const Chat = () => {
    // getting chat ID
    const { chatId } = useParams();

    // get rooms data from Rooms Context
    const roomsData = useRooms();

    if (!roomsData) {
        return (
            <Loader
                center
                vertical
                size="md"
                content="Loading..."
                speed="slow"
            />
        );
    }

    // get current room data (the one which user clicked on)
    const currentRoom = roomsData.find(room => room.id === chatId);

    const { name, description } = currentRoom;

    // const object to be passed to CurrentRoom Context
    const currentRoomData = {
        name,
        description,
    };

    if (!currentRoom) {
        return <h6 className="text-center mt-page">Chat {chatId} not found</h6>;
    }

    return (
        <CurrentRoomProvider data={currentRoomData}>
            <div className="chat-top">
                <Top />
            </div>

            <div className="chat-middle">
                <Messages />
            </div>

            <div className="chat-bottom">
                <Bottom />
            </div>
        </CurrentRoomProvider>
    );
};

export default Chat;
