import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { database } from '../../../misc/firebase';
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

  return (
    <ul className="msg-list custom-scroll">
      {ischatEmpty && <li>No messages yet...</li>}
      {canDisplayMsg &&
        messages.map(msg => <MessageItem key={msg.id} message={msg} />)}
    </ul>
  );
};

export default Messages;
