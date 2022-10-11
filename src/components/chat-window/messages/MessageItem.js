import React, { memo } from 'react';
import { Button } from 'rsuite';
import TimeAgo from 'timeago-react';
import { useCurrentRoom } from '../../../context/current-room.context';
import { useHover, useMediaQuery } from '../../../misc/custom-hooks';
import { auth } from '../../../misc/firebase';
import PresenceDot from '../../PresenceDot';
import ProfileAvatar from '../../ProfileAvatar';
import IconBtnControl from './IconBtnControl';
import ProfileInfoBtnModal from './ProfileInfoBtnModal';

const MessageItem = ({ message, handleAdmin, handleLike, handleDelete }) => {
  const { author, createdAt, text, likes, likesCount } = message;

  const [selfRef, isHovered] = useHover();

  const isAdmin = useCurrentRoom(v => v.isAdmin);
  const admins = useCurrentRoom(v => v.admins);

  const isMsgAuthorAdmin = admins.includes(author.uid);
  const isAuthor = auth.currentUser.uid === author.uid;
  const canGrantAdmin = isAdmin && !isAuthor;

  const isLiked = likes && Object.keys(likes).includes(auth.currentUser.uid);
  const isMobile = useMediaQuery('(max-width: 992px)');
  const canShowIcons = isMobile || isHovered;

  return (
    <li
      className={`padded mb-1 cursor-pointer ${isHovered ? 'bg-black-02' : ''}`}
      ref={selfRef}
    >
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
        >
          {canGrantAdmin && (
            <Button block onClick={() => handleAdmin(author.uid)} color="blue">
              {isMsgAuthorAdmin ? 'Revoke admin access' : 'Grant admin access'}
            </Button>
          )}
        </ProfileInfoBtnModal>
        <TimeAgo
          datetime={createdAt}
          className="font-normal text-black-45 ml-2"
        />
        <IconBtnControl
          {...(isLiked ? { color: 'red' } : {})}
          isVisible={canShowIcons}
          tooltip="Click to like the message"
          iconName="heart"
          onClick={() => {
            handleLike(message.id);
          }}
          badgeContent={likesCount}
        />
        {isAuthor && (
          <IconBtnControl
            isVisible={canShowIcons}
            tooltip="Delete this message"
            iconName="trash"
            onClick={() => {
              handleDelete(message.id);
            }}
          />
        )}
      </div>

      <div>
        <span className="word-break-all">{text}</span>
      </div>
    </li>
  );
};

export default memo(MessageItem);
