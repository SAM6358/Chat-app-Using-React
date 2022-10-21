import React from 'react';
import { useParams } from 'react-router';
import { Button, Icon, IconButton, Modal } from 'rsuite';
import { useCurrentRoom } from '../../../context/current-room.context';
import { useModelState } from '../../../misc/custom-hooks';
import { auth, database } from '../../../misc/firebase';

const AskFcmBtmModal = () => {
  const isReceivingFcm = useCurrentRoom(val => val.isReceivingFcm);
  const { isOpen, open, close } = useModelState();
  const { chatId } = useParams();

  const onCancel = () => {
    database
      .ref(`/rooms/${chatId}/fcmUsers`)
      .child(auth.currentUser.uid)
      .remove();
  };
  const onAccept = () => {
    database
      .ref(`/rooms/${chatId}/fcmUsers`)
      .child(auth.currentUser.uid)
      .set(true);
  };

  return (
    <>
      <IconButton
        icon={<Icon icon="podcast" />}
        color="blue"
        size="sm"
        circle
        appearance={isReceivingFcm ? 'default' : 'ghost'}
        onClick={open}
      />
      <Modal show={isOpen} onHide={close} size="xs" backdrop="static">
        <Modal.Header>
          <Modal.Title className="text-center">
            Notifications Permission
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {isReceivingFcm ? (
            <div className="text-center">
              <Icon className="text-green mb-3" icon="check-circle" size="5x" />
              <h6>You are currently subscribed to Brodcast messages.</h6>
            </div>
          ) : (
            <div className="text-center">
              <Icon
                className="text-blue mb-3"
                icon="question-circle"
                size="5x"
              />
              <h6>
                Do you want to subscribe to Brodcast messages sent by admins of
                this room?
              </h6>
            </div>
          )}
          <p className="mt-2">
            To receive notifications make sure you have allowed to show
            Notifications in your Browser settings.
          </p>
          <p>
            Permission:{' '}
            {Notification.permission === 'granted' ? (
              <span className="text-green">Granted</span>
            ) : (
              <span className="text-red">Denied</span>
            )}
          </p>
        </Modal.Body>
        <Modal.Footer>
          {isReceivingFcm ? (
            <Button color="green" onClick={onCancel}>
              No, I changed my mind
            </Button>
          ) : (
            <Button onClick={onAccept} color="green">
              Yes,I do
            </Button>
          )}
          <Button onClick={close}>Close</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AskFcmBtmModal;
