import React, { useEffect, useRef, useState } from 'react';
import './MessagesPage.css';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../Redux/store';
import { GetFollowing } from '../../../Redux/User/UserSlice';
import {
  CreateNewConversation,
  CreateNewMessage,
  GetChatMessages,
  GetUserConversations,
  updateChatMessages
} from '../../../Redux/Messages/MessagesSlice';
import { BlueButton } from '../../../GlobalStyles/globalStyles';
import Message from '../../../Components/MessagesPage/Message';
import { io } from 'socket.io-client';
import useResponsiveType from '../../../custom-hooks/useResponsiveType';
import { ArrowBack } from '@mui/icons-material';

const MessagesPage = () => {
  const socket = useRef<any>();
  const { isLaptop } = useResponsiveType();
  const [hideMessageBox, setHideMessageBox] = useState(true);
  const [currentChat, setCurrentChat] = useState<boolean | null>(null);
  const [currentFriend, setCurrentFriend] = useState<any | null>(null);
  const [arrivalMessage, setArrivalMessage] = useState<any>(null);
  const [currentConversation, setCurrentConversation] = useState<any | null>(
    null
  );
  const [messageText, setMessageText] = useState('');
  const { user, followingUsers } = useSelector(
    (state: RootState) => state.UserReducer
  );

  const { UserConversations, CurrentChatMessages } = useSelector(
    (state: RootState) => state.MessagesReducer
  );

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (user?._id) {
      socket.current = io('ws://localhost:8900');
      socket.current.on('getMessage', (data: any) => {
        setArrivalMessage({
          sender: data.senderId,
          text: data.text,
          profilePicture: data.profilePicture,
          createdAt: Date.now()
        });
        console.log('data is:');
        console.log(data);
      });
    }
  }, [user]);

  useEffect(() => {
    if (
      arrivalMessage &&
      currentConversation?.members.includes(arrivalMessage.sender)
    ) {
      // Dispatch the updateChatMessages action to Redux store
      dispatch(updateChatMessages(arrivalMessage));
    }
  }, [arrivalMessage, currentConversation, dispatch]);

  useEffect(() => {
    if (user?._id) {
      socket.current.emit('addUser', user?._id);
      socket.current.on('getUsers', (users: any) => {
        console.log(users);
      });
    }
  }, [user]);

  useEffect(() => {
    if (user?._id) {
      dispatch(GetFollowing(user._id));
    }
  }, [dispatch, user?._id]);

  useEffect(() => {
    if (user?._id) {
      dispatch(GetUserConversations(user?._id));
    }
  }, [dispatch, user?._id]);

  useEffect(() => {
    if (currentConversation?._id) {
      dispatch(GetChatMessages(currentConversation._id));
    }
  }, [dispatch, currentConversation]);

  const SelectChat = (friend: any) => {
    const existingConversation = UserConversations.find(
      (conversation: any) =>
        conversation.members.includes(friend._id) &&
        conversation.members.includes(user?._id)
    );

    if (existingConversation) {
      setCurrentChat(true);
      setCurrentConversation(existingConversation);
    } else {
      setCurrentChat(false);
    }
    setCurrentFriend(friend);
  };

  const CreateChat = async () => {
    const conversationData = {
      senderId: user?._id,
      receiverId: currentFriend._id
    };

    try {
      const result = await dispatch(CreateNewConversation(conversationData));
      if (CreateNewConversation.fulfilled.match(result)) {
        setCurrentChat(true);
        if (isLaptop) {
          setHideMessageBox(false);
        }
      }
    } catch (error) {
      console.error('Error creating conversation:', error);
    }
  };

  const SendNewMessage = () => {
    console.log(user?.profilePicture);
    const conversationData = {
      conversationId: currentConversation._id,
      sender: user?._id,
      text: messageText
    };
    dispatch(CreateNewMessage(conversationData));

    const receiverId = currentFriend._id;
    socket.current.emit('sendMessage', {
      senderId: user?._id,
      receiverId,
      text: messageText,
      profilePicture: user?.profilePicture
    });
    setMessageText('');
  };

  const BackButtonClick = () => {
    setCurrentChat(null);
    setHideMessageBox(true);
    setCurrentConversation(null);
  };

  return (
    <div className="MessagesPageWrapper">
      {!currentChat && hideMessageBox && (
        <div
          className={
            !isLaptop ? 'FreindsListWrapper' : 'FriendsListWrapperMobile'
          }
        >
          <h1>Friends</h1>
          <div className="MessagesFriendsList">
            {followingUsers.map((friend: any) => (
              <button
                className="FriendMessageBtn"
                onClick={() => SelectChat(friend)}
              >
                <img
                  src={friend.profilePicture}
                  alt="none"
                  className="MessagesFriendPicture"
                />
                {friend.username}
              </button>
            ))}
          </div>
        </div>
      )}

      {currentChat != null ? (
        !currentChat ? (
          <div className="StartChatWrapper">
            <h1 className="StartNewChatText">Start a new chat</h1>
            <BlueButton className="StartChatBtn" onClick={CreateChat}>
              Start
            </BlueButton>
          </div>
        ) : (
          <div>
            <div className="MessagesBox">
              <button className="BoxBackButton" onClick={BackButtonClick}>
                <ArrowBack />
              </button>
              {CurrentChatMessages.map((message) => (
                <Message message={message} user={user} />
              ))}
            </div>
            <div className="SendMessage">
              <textarea
                placeholder="Type your message here..."
                className="SendMessageTextArea"
                value={messageText}
                onChange={(e: any) => {
                  setMessageText(e.target.value);
                }}
              ></textarea>
              <BlueButton
                onClick={() => SendNewMessage()}
                disabled={!messageText.trim()}
              >
                Send
              </BlueButton>
            </div>
          </div>
        )
      ) : (
        !isLaptop && (
          <h1 className="NoConversationText">
            Open a Conversation to start a chat
          </h1>
        )
      )}
    </div>
  );
};

export default MessagesPage;
