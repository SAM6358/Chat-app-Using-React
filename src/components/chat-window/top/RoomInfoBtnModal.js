import React from 'react';
import { Button, Modal } from 'rsuite';
import { useCurrentRoom } from '../../../context/current-room.context';
import { useModelState } from '../../../misc/custom-hooks';

const RoomInfoBtnModal = () => {
  const { isOpen, open, close } = useModelState();
  const name = useCurrentRoom(object => object.name);
  const description = useCurrentRoom(object => object.description);

  return (
    <div>
      <Button appearance="link" className="px-0" onClick={open}>
        Room Information
      </Button>
      <Modal show={isOpen} onHide={close}>
        <Modal.Header>
          <Modal.Title>About {name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h6 className="mb-1"> Description : </h6>
          <p>{description}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button block color="green" onClick={close}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default RoomInfoBtnModal;
