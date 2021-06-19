// React Component for Button that opens a Modal showing other user's Profile info in Chat-rooms
import React from 'react';
import { Button, Modal } from 'rsuite';
import { useModalState } from '../../../misc/custom-hooks';

import ProfileAvatar from '../../Dashboard/ProfileAvatar';

const ProfileInfoBtnModal = ({ profile, ...btnProps }) => {
    // extracting profile info
    const { name, avatar, createdAt } = profile;

    // extracting the first name from full name
    const shortName = name.split(' ')[0];

    const memberSince = new Date(createdAt).toLocaleDateString();

    // state for Modal
    const { isOpen, open, close } = useModalState();

    return (
        <>
            <Button {...btnProps} onClick={open}>
                {shortName}
            </Button>

            <Modal show={isOpen} onHide={close}>
                <Modal.Header>
                    <Modal.Title>{shortName}</Modal.Title>
                </Modal.Header>

                <Modal.Body className="text-center">
                    <ProfileAvatar
                        src={avatar}
                        name={name}
                        className="width-200 height-200 img-fullsize font-huge"
                    />

                    <h4 className="mt-2">{name}</h4>

                    <p>Member since {memberSince}</p>
                </Modal.Body>

                <Modal.Footer>
                    <Button onClick={close}>Close</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default ProfileInfoBtnModal;
