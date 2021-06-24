/* eslint-disable no-console */
// React Component to display the Chats on the Chat page
import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { Alert } from 'rsuite';
import { auth, database, storage } from '../../../misc/firebase';
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

    // function to handle Admin (to be sent as a prop to the MessageItem Component)
    const handleAdmin = useCallback(
        async uid => {
            const adminsref = database.ref(`rooms/${chatId}/admins`);
            let alertMessage;

            await adminsref.transaction(admins => {
                if (admins) {
                    if (admins[uid]) {
                        // if the user is already an Admin, remove them from Admin
                        admins[uid] = null;
                        alertMessage = 'Admin permission revoked';
                    } else {
                        // make the user Admin
                        admins[uid] = true;
                        alertMessage = 'Admin permission granted';
                    }
                }
                return admins;
            });

            Alert.info(alertMessage, 4000);
        },
        [chatId]
    );

    // function to handle number of likes for a message
    const handleLikes = useCallback(async msgId => {
        const messagesRef = database.ref(`messages/${msgId}`);
        const { uid } = auth.currentUser;
        let alertMessage;

        await messagesRef.transaction(msg => {
            if (msg) {
                if (msg.likes && msg.likes[uid]) {
                    // if the user has already liked a message, unlike it
                    msg.likeCount--;
                    msg.likes[uid] = null;
                    alertMessage = 'You unliked this message';
                } else {
                    // like the message
                    msg.likeCount++;

                    if (!msg.likes) {
                        msg.likes = {};
                    }

                    msg.likes[uid] = true;
                    alertMessage = 'You liked this message';
                }
            }
            return msg;
        });

        Alert.info(alertMessage, 4000);
    }, []);

    // function to delete a message
    const handleDelete = useCallback(
        async (msgId, file) => {
            // ask user to confirm delete
            // eslint-disable-next-line no-alert
            if (!window.confirm('Delete this message?')) {
                // if the user closes this, return
                return;
            }

            // else, delete the message
            // message to be deleted can also be the last message sent
            // use the "messages" to refer to the message state
            const isLastMessage = messages[messages.length - 1].id === msgId;

            const updates = {};
            updates[`/messages/${msgId}`] = null;

            if (isLastMessage && messages.length === 1) {
                updates[`/rooms/${chatId}/lastMessage`] = null;
            }

            if (isLastMessage && messages.length > 1) {
                updates[`/rooms/${chatId}/lastMessage`] = {
                    ...messages[messages.length - 2],
                    msgId: messages[messages.length - 2].id,
                };
            }

            // updating the database
            try {
                await database.ref().update(updates);

                Alert.success('Message deleted', 4000);
            } catch (err) {
                // eslint-disable-next-line consistent-return
                return Alert.error(err.message, 5000);
                /* explanation of having "return" in the above line:
                    - Suppose the message to be deleted is an uploaded file.
                    - If the deletion of the file from the realtime database 
                      (happening in this try-catch) fails, to make sure the code below
                      it doesn't execute, we have the "return" statement.
                    - In case of failed delete from the database, the code below would still erase
                      the files from the storage, if we didn't put "return" statement above.
                */
            }

            // if the deleted message is an uploaded file,
            // remove it from the storage (different from the realtime database) as well.
            if (file) {
                try {
                    // creating reference to storage, where uploaded files are stored
                    const fileRef = storage.refFromURL(file.url);
                    await fileRef.delete(); // delete file from storage
                } catch (err) {
                    Alert.error(err.message, 5000);
                }
            }
        },
        [chatId, messages]
    );

    // console.log(messages);
    return (
        <ul className="msg-list custom-scroll">
            {isChatEmpty && <li>No messages yet</li>}
            {canShowMessages &&
                messages.map(msg => (
                    <MessageItem
                        key={msg.id}
                        message={msg}
                        handleAdmin={handleAdmin}
                        handleLikes={handleLikes}
                        handleDelete={handleDelete}
                    />
                ))}
        </ul>
    );
};

export default Messages;
