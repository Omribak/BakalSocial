import {
  Collections,
  EmojiEmotions,
  Label,
  LocationOn
} from '@mui/icons-material';
import { AddPostItem, Friend, PostItem, UserPosts } from './interfaces';

const AddPostItemFolder = './app-images/upload-post-images';

export const AddPostItems: AddPostItem[] = [
  { label: 'Upload Image', icon: `${AddPostItemFolder}/photovideo.png` }
];

export const PostsItems: PostItem[] = [
  {
    id: 1,
    username: 'Omri Bakal',
    profile_image: './app-images/profile-demo.jpg',
    time: 5,
    num_likes: 10,
    num_comments: 5,
    image: './app-images/post-demo1.jpg',
    content: 'There is no place like home.'
  },
  {
    id: 2,
    username: 'Dora Hawks',
    profile_image: './app-images/profile-demo.jpg',
    time: 10,
    num_likes: 2,
    num_comments: 7,
    image: '/app-images/post-demo2.jpg',
    content: 'Bring them home now!'
  }
];

export const DummyUserPosts: UserPosts[] = [
  {
    profile_image: './app-images/profile-demo.jpg',
    post_username: 'John Doe',
    post_content:
      'Had a great day hiking in the mountains! The views were amazing. 🏞️ #hiking #nature'
  },
  {
    profile_image: './app-images/profile-demo.jpg',
    post_username: 'Jane Smith',
    post_content:
      'Just finished reading an incredible book. Highly recommend it to anyone who loves thrillers! 📚 #bookreview #thriller'
  }
];

export const onlineFriends: Friend[] = [
  {
    id: 1,
    name: 'Emily James',
    profileImage: '/app-images/profile-demo.jpg'
  },
  {
    id: 2,
    name: 'John Doe',
    profileImage: '/app-images/profile-demo.jpg'
  },
  {
    id: 3,
    name: 'Jane Smith',
    profileImage: '/app-images/profile-demo.jpg'
  },
  {
    id: 4,
    name: 'Alice Johnson',
    profileImage: '/app-images/profile-demo.jpg'
  }
];
