/* eslint-disable no-param-reassign */
import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { Alert } from 'rsuite';
import { auth, database } from '../../../misc/firebase';
import { transformToArrWithId } from '../../../misc/helpers';
import MessageItem from './MessageItem';

const Messages = () => {
  const { chatId } = useParams();
  const [messages, setMessages] = useState();

  const ischatEmpty = messages && messages.length === 0;
  const canDisplayMsg = messages && messages.length > 0;

  useEffect(() => {
    const messagesRef = database.ref('/messages');

    messagesRef
      .orderByChild('roomId')
      .equalTo(chatId)
      .on('value', snap => {
        const data = transformToArrWithId(snap.val());
        setMessages(data);
      });
    return () => {
      messagesRef.off('value');
    };
  }, [chatId]);

  const handleAdmin = useCallback(
    async uid => {
      const adminsRef = database.ref(`/rooms/${chatId}/admins`);

      let alertMsg;

      await adminsRef.transaction(admins => {
        if (admins) {
          if (admins[uid]) {
            admins[uid] = null;
            alertMsg = 'Revoked admin access';
          } else {
            admins[uid] = true;
            alertMsg = 'Granted admin access';
          }
        }

        return admins;
      });
      Alert.info(alertMsg, 4000);
    },
    [chatId]
  );

  const handleLike = useCallback(async msgId => {
    const { uid } = auth.currentUser;
    const messageref = database.ref(`/messages/${msgId}`);

    let alertMsg;

    await messageref.transaction(msg => {
      if (msg) {
        if (msg.likes && msg.likes[uid]) {
          msg.likes[uid] = null;
          msg.likesCount -= 1;
          alertMsg = 'Like removed';
        } else {
          msg.likesCount += 1;
          if (!msg.likes) {
            msg.likes = {};
          }
          msg.likes[uid] = true;
          alertMsg = 'Like added';
        }
      }
      return msg;
    });
    Alert.info(alertMsg, 4000);
  }, []);

  return (
    <ul className="msg-list custom-scroll">
      {ischatEmpty && <li>No messages yet...</li>}
      {canDisplayMsg &&
        messages.map(msg => (
          <MessageItem
            key={msg.id}
            message={msg}
            handleAdmin={handleAdmin}
            handleLike={handleLike}
          />
        ))}
    </ul>
  );
};

export default Messages;
