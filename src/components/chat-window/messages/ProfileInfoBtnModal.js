import React from 'react';
import { Button, Modal } from 'rsuite';
import { useModelState } from '../../../misc/custom-hooks';
import ProfileAvatar from '../../ProfileAvatar';

const ProfileInfoBtnModal = ({ profile, children, ...btnProps }) => {
  const { isOpen, open, close } = useModelState();
  const shortName = profile.Name.split(' ')[0];

  const { Name, createdAt, avatar } = profile;

  const memberSince = new Date(createdAt).toLocaleDateString();

  return (
    <div>
      <Button {...btnProps} onClick={open}>
        {shortName}
      </Button>
      <Modal show={isOpen} onHide={close}>
        <Modal.Header>
          <Modal.Title>{shortName} Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          <ProfileAvatar
            src={avatar}
            Name={Name}
            className="width-200 height-200 img-fullsize font-huge"
          />
          <h4 className="mt-2">{Name}</h4>
          <p>Member since : {memberSince} </p>
        </Modal.Body>
        <Modal.Footer>
          {children}
          <Button block color="cyan" onClick={close}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ProfileInfoBtnModal;
