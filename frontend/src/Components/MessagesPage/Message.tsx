import React from 'react';
import './Message.css';
import { useSelector } from 'react-redux';
import { RootState } from '../../Redux/store';
import { format } from 'timeago.js';

interface MessageProps {
  message: any;
  user: any;
}

const Message: React.FC<MessageProps> = ({ message, user }) => {
  const { MessageLoading } = useSelector(
    (state: RootState) => state.MessagesReducer
  );

  return (
    <div className="MessageWrapper">
      <div className="MessageImgAndContent">
        <img
          src={message?.profilePicture}
          alt="none"
          className="MessageImage"
        />
        <p className={message.sender === user?._id ? 'UserText' : 'FriendText'}>
          {message.text}
        </p>
      </div>
      <p className="MessageTime">{format(message.createdAt)}</p>
    </div>
  );
};

export default Message;
