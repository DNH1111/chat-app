// React Component for button to upload profile Avatar
import React, { useState } from 'react';
import AvatarEditor from 'react-avatar-editor';
import { Alert, Button, Modal } from 'rsuite';
import { useModalState } from '../../misc/custom-hooks';

const fileInputTypes = '.png, .jpeg, .jpg';
const acceptedFileTypes = ['image/png', 'image/jpeg', 'image/pjpeg'];

// function to check if the file type is valid
const isValidFile = file => acceptedFileTypes.includes(file.type);

const AvatarUploadBtn = () => {
    // using custom-hook useModalState for to handle Modal show and hide props
    const { isOpen, open, close } = useModalState();

    // state for uploaded image file
    const [img, setImg] = useState(null);

    // function to handle file upload
    const onFileInputChange = event => {
        // getting the reference of files uploaded
        const currFiles = event.target.files;

        if (currFiles.length === 1) {
            const file = currFiles[0];

            if (isValidFile(file)) {
                setImg(file);
                open();
            } else {
                Alert.warning('Invalid file type', 4000);
            }
        }
    };

    return (
        <div className="mt-3 text-center">
            <div>
                <label
                    htmlFor="avatar-upload"
                    className="d-block cursor-pointer padder "
                >
                    Select New Avatar
                    <input
                        id="avatar-upload"
                        type="file"
                        className="d-none"
                        accept={fileInputTypes}
                        onChange={onFileInputChange}
                    />
                </label>

                <Modal show={isOpen} onHide={close}>
                    <Modal.Header>
                        <Modal.Title>Adjust and upload Avatar</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {img && (
                            <div className="d-flex justify-content-center align-items-center h-100">
                                <AvatarEditor
                                    image={img}
                                    width={200}
                                    height={200}
                                    border={10}
                                    borderRadius={100}
                                    rotate={0}
                                />
                            </div>
                        )}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button block appearance="ghost">
                            Upload new Avatar
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        </div>
    );
};

export default AvatarUploadBtn;
