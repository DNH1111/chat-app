/* eslint-disable no-console */
// React Component to display the Chats on the Chat page
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { database } from '../../../misc/firebase';
import { transformToArrayWithId } from '../../../misc/helpers';
import MessageItem from './MessageItem';

const Messages = () => {
    // get chat ID
    const { chatId } = useParams();

    // state for messages
    const [messages, setMessages] = useState(null);

    const isChatEmpty = messages && messages.length === 0;
    const canShowMessages = messages && messages.length > 0;

    // useEffect() hook for changing message states. So that each message is added to database
    useEffect(() => {
        const messagesRef = database.ref('/messages');

        // listener for messages in current chat room
        messagesRef
            .orderByChild('room')
            .equalTo(chatId)
            .on('value', snap => {
                // using user-defined function to convert contents of snap.val() into suitable form
                const data = transformToArrayWithId(snap.val());

                // updating message state
                setMessages(data);
            });

        // cleanup function to unsubscribe resources after use
        return () => {
            messagesRef.off('value');
        };
    }, [chatId]);

    // console.log(messages);
    return (
        <ul className="msg-list custom-scroll">
            {isChatEmpty && <li>No messages yet</li>}
            {canShowMessages &&
                messages.map(msg => <MessageItem key={msg.id} message={msg} />)}
        </ul>
    );
};

export default Messages;
