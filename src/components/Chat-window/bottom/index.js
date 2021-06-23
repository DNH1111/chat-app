// React Component to form the Bottom part of the Chat page
import React, { useCallback, useState } from 'react';
import { Icon, InputGroup, Input, Alert } from 'rsuite';
import firebase from 'firebase/app';
import { useParams } from 'react-router';

import { useProfile } from '../../../context/profile.context';
import { database } from '../../../misc/firebase';
import AttachmentBtnModal from './AttachmentBtnModal';

// function to assemble user's message with details to be saved in the database
function assembleMessage(profile, chatId) {
    return {
        room: chatId,
        author: {
            name: profile.name,
            uid: profile.uid,
            createdAt: profile.createdAt,
            ...(profile.avatar ? { avatar: profile.avatar } : {}),
        },
        createdAt: firebase.database.ServerValue.TIMESTAMP, // time at which message was sent
        likeCount: 0,
    };
}

const Bottom = () => {
    // accessing Profile Context to get user info
    const { profile } = useProfile();

    const { chatId } = useParams();

    // state for message input
    const [input, setInput] = useState('');

    // state for loading
    const [isLoading, setIsLoading] = useState(false);

    // function to handle message input - executes when the onChange() event of message input is triggered
    /* REMINDER: onChange() event of rsuite Input Component provides value and event to work with.
                 For a normal input Component, the onChange() would have provided only the event.
    */
    const onInputChange = useCallback(value => {
        // updating input state
        setInput(value);
    }, []);

    // function to handle send Button click
    const onSendClick = async () => {
        // if empty message
        if (input.trim() === '') {
            return;
        }

        // assembling message data
        const messageData = assembleMessage(profile, chatId);
        messageData.text = input;

        const updates = {};

        const messageId = database.ref('messages').push().key;

        updates[`/messages/${messageId}`] = messageData;
        updates[`/rooms/${chatId}/lastMessage`] = {
            ...messageData,
            msgId: messageId,
        };

        setIsLoading(true);
        try {
            // updating database with update contents
            /* NOTICE: the keys of the "updates" object are actually paths to different 
                       documents in the database. Updating the database as shown below
                       would make all the updates in one ago. This is an "atomic" way.
            */
            await database.ref().update(updates);

            // reset states after updating database
            setInput('');
            setIsLoading(false);
        } catch (err) {
            setIsLoading(false);
            Alert.error(err.message, 4000);
        }
    };

    // function to handle keyboard ENTER press after message is typed
    const onKeyDown = event => {
        if (event.keyCode === 13) {
            // key code for ENTER
            event.preventDefault(); // to stop any default procedures taking place if ENTER is pressed
            onSendClick();
        }
    };

    return (
        <div>
            <InputGroup>
                <AttachmentBtnModal />
                <Input
                    placeholder="Type your message here..."
                    value={input}
                    onChange={onInputChange}
                    onKeyDown={onKeyDown}
                />

                <InputGroup.Button
                    color="blue"
                    appearance="primary"
                    onClick={onSendClick}
                    disabled={isLoading}
                >
                    <Icon icon="send" />
                </InputGroup.Button>
            </InputGroup>
        </div>
    );
};

export default Bottom;
