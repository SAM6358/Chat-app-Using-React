import React, { useCallback, useState } from 'react';
import { ReactMic } from 'react-mic';
import { useParams } from 'react-router';
import { Alert, Icon, InputGroup } from 'rsuite';
import { storage } from '../../../misc/firebase';

const AudioMssgBtn = ({ afterUpload }) => {
  const [isRecording, setIsRecording] = useState(false);
  const { chatId } = useParams();

  const [isUploading, setIsUploading] = useState(false);

  const onClick = useCallback(() => {
    setIsRecording(val => !val);
  }, []);

  const onStop = useCallback(
    async data => {
      setIsUploading(true);
      try {
        const snapShot = await storage
          .ref(`chat/${chatId}`)
          .child(`audio_${Date.now()}.mp3`)
          .put(data.blob, {
            cacheControl: `public, max-age=${3600 * 24 * 3}`,
          });
        const audio = {
          contentType: snapShot.metadata.contentType,
          name: snapShot.metadata.name,
          url: await snapShot.ref.getDownloadURL(),
        };
        setIsUploading(false);
        afterUpload([audio]);
      } catch (error) {
        setIsUploading(false);
        Alert.error(error.message, 4000);
      }
    },
    [afterUpload, chatId]
  );

  return (
    <InputGroup.Button
      onClick={onClick}
      disabled={isUploading}
      className={isRecording ? 'animate-blink' : ''}
    >
      <Icon icon="microphone" />
      <ReactMic
        record={isRecording}
        className="d-none"
        onStop={onStop}
        mimeType="audio/mp3"
      />
    </InputGroup.Button>
  );
};

export default AudioMssgBtn;
