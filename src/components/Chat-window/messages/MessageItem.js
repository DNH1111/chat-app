// React Component for Chat body
import React, { memo } from 'react';
import TimeAgo from 'timeago-react';
import { Button } from 'rsuite';

import ProfileAvatar from '../../Dashboard/ProfileAvatar';
import ProfileInfoBtnModal from './ProfileInfoBtnModal';
import PresenceDot from '../../PresenceDot';
import IconBtnControl from './IconBtnControl';
import { useCurrentRoom } from '../../../context/current-room.context';
import { auth } from '../../../misc/firebase';
import { useHover, useMediaQuery } from '../../../misc/custom-hooks';

const MessageItem = ({ message, handleAdmin, handleLikes, handleDelete }) => {
    // retrieving message elements
    const { author, createdAt, text, likes, likeCount } = message;

    // using the useHover() custom-hook
    /* returns two values:
        1. reference: which will be assigned to an Element.
        2. isHovered: to tell if the Element is hovered on.
    */
    const [selfRef, isHovered] = useHover();

    const isMobile = useMediaQuery('(max-width: 992px)');

    // getting data from CurrentRoom Context
    const isAdmin = useCurrentRoom(v => v.isAdmin);
    const admins = useCurrentRoom(v => v.admins);

    const isMsgAuthorAdmin = admins.includes(author.uid);
    const isAuthor = auth.currentUser.uid === author.uid;
    const canGrantAdmin = isAdmin && !isAuthor;

    const canShowIcons = isMobile || isHovered;

    // to see if the current user has liked the message or not
    const isLiked = likes && Object.keys(likes).includes(auth.currentUser.uid);

    return (
        <li
            className={`padded mb-1 cursor-pointer ${
                isHovered ? 'bg-black-02' : ''
            }`}
            ref={selfRef}
        >
            <div className="d-flex align-items-center font-bolder mb-1">
                <PresenceDot uid={author.uid} />

                <ProfileAvatar
                    src={author.avatar}
                    name={author.name}
                    className="ml-1"
                    size="xs"
                />

                <ProfileInfoBtnModal
                    profile={author}
                    appearance="link"
                    className="p-0 ml-1 text-black"
                >
                    {canGrantAdmin && (
                        <Button
                            block
                            onClick={() => handleAdmin(author.uid)}
                            color="blue"
                        >
                            {isMsgAuthorAdmin
                                ? 'Remove admin permission'
                                : 'Give admin access for this room'}
                        </Button>
                    )}
                </ProfileInfoBtnModal>
                <TimeAgo
                    datetime={createdAt}
                    className="font-normal text-black-45 ml-2"
                />

                <IconBtnControl
                    // eslint-disable-next-line no-constant-condition
                    {...(isLiked ? { color: 'red' } : {})}
                    isVisible={canShowIcons}
                    iconName="heart"
                    tooltip="Like this messsage"
                    onClick={() => handleLikes(message.id)}
                    badgeContent={likeCount}
                />

                {isAuthor && (
                    <IconBtnControl
                        // eslint-disable-next-line no-constant-condition
                        isVisible={canShowIcons}
                        iconName="close"
                        tooltip="Delete messsage"
                        onClick={() => handleDelete(message.id)}
                    />
                )}
            </div>

            <div>
                <span className="word-break-all">{text}</span>
            </div>
        </li>
    );
};

export default memo(MessageItem);
