import { SvgIconComponent } from '@mui/icons-material';

export interface AddPostItem {
  label: string;
  icon: string;
}

export interface PostItem {
  id: number;
  username: string;
  profile_image: string;
  time: number;
  image: string;
  num_likes: number;
  num_comments: number;
  content: string;
}

export interface UserPosts {
  profile_image: string;
  post_username: string;
  post_content: string;
}

export interface Friend {
  id: number;
  name: string;
  profileImage: string;
}
