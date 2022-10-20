import React, { useCallback, useRef, useState } from 'react';
import { useParams } from 'react-router';
import {
  Alert,
  Button,
  ControlLabel,
  Form,
  FormControl,
  FormGroup,
  Icon,
  Modal,
  Schema,
} from 'rsuite';
import { useModelState } from '../../../misc/custom-hooks';
import { functions } from '../../../misc/firebase';

const { StringType } = Schema.Types;

const model = Schema.Model({
  title: StringType().isRequired('Title is required!!'),
  message: StringType().isRequired('Message body is required'),
});

const INITIAL_FORM = {
  title: '',
  message: '',
};

const SendFcmBtnModal = () => {
  const { isOpen, open, close } = useModelState();
  const [formValue, setFormValue] = useState(INITIAL_FORM);
  const [isLoading, setIsLoading] = useState(false);
  const formRef = useRef();
  const { chatId } = useParams();

  const onFormChange = useCallback(value => {
    setFormValue(value);
  }, []);

  const onSubmit = async () => {
    if (!formRef.current.check()) {
      return;
    }
    setIsLoading(true);

    try {
      const sendFcm = functions.httpsCallable('sendFcm');
      await sendFcm({ chatId, ...formValue });
      setIsLoading(false);
      setFormValue(INITIAL_FORM);
      close();
      Alert.info('Notification has been send', 9000);
    } catch (error) {
      setIsLoading(false);
      Alert.error(error.message, 9000);
    }
  };

  return (
    <>
      <Button appearance="primary" size="xs" onClick={open}>
        <Icon icon="podcast" className="mr-1" />
        Broadcast Message
      </Button>
      <Modal show={isOpen} onHide={close}>
        <Modal.Header>
          <Modal.Title>Send Notification to room users</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form
            fluid
            ref={formRef}
            onChange={onFormChange}
            formValue={formValue}
            model={model}
          >
            <FormGroup>
              <ControlLabel>Title : </ControlLabel>
              <FormControl
                name="title"
                placeholder="Enter message title here..."
              />
            </FormGroup>
            <FormGroup>
              <ControlLabel>Message : </ControlLabel>
              <FormControl
                componentClass="textarea"
                rows={5}
                name="message"
                placeholder="Enter message body here..."
              />
            </FormGroup>
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button
            block
            appearance="primary"
            onClick={onSubmit}
            disabled={isLoading}
          >
            Publish Message
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default SendFcmBtnModal;
