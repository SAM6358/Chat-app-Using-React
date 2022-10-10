import React from 'react';
import TimeAgo from 'timeago-react';
import PresenceDot from '../../PresenceDot';
import ProfileAvatar from '../../ProfileAvatar';
import ProfileInfoBtnModal from './ProfileInfoBtnModal';

const MessageItem = ({ message }) => {
  const { author, createdAt, text } = message;

  return (
    <li className="padded mb-1">
      <div className="d-flex align-items-center font-bolder mb-1">
        <PresenceDot uid={author.uid} />
        <ProfileAvatar
          src={author.avatar}
          Name={author.Name}
          className="ml-1"
          size="md"
        />
        <ProfileInfoBtnModal
          profile={author}
          appearance="link"
          className="pd-0 ml-1 text-black"
        />
        <TimeAgo
          datetime={createdAt}
          className="font-normal text-black-45 ml-2"
        />
      </div>

      <div>
        <span className="word-break-all">{text}</span>
      </div>
    </li>
  );
};

export default MessageItem;
