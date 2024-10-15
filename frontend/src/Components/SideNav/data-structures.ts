import {
  Bookmark,
  Chat,
  Group,
  PlayCircle,
  QuestionMark,
  RssFeed,
  Work
} from '@mui/icons-material';
import { SideNavItem } from './Interfaces';

export const SideNavLinks: SideNavItem[] = [
  {
    label: 'Friends',
    icon: 'https://bakalsocial-bucket.s3.il-central-1.amazonaws.com/app-images/sidenav-friends.png'
  },
  {
    label: 'Groups',
    icon: 'https://bakalsocial-bucket.s3.il-central-1.amazonaws.com/app-images/sidenav-groups.png'
  },
  {
    label: 'Marketplace',
    icon: 'https://bakalsocial-bucket.s3.il-central-1.amazonaws.com/app-images/sidenav-marketplace.png'
  },
  {
    label: 'Events',
    icon: 'https://bakalsocial-bucket.s3.il-central-1.amazonaws.com/app-images/sidenav-events.png'
  },
  {
    label: 'Gallery',
    icon: 'https://bakalsocial-bucket.s3.il-central-1.amazonaws.com/app-images/sidenav-gallery.png'
  },
  {
    label: 'Videos',
    icon: 'https://bakalsocial-bucket.s3.il-central-1.amazonaws.com/app-images/sidenav-videos.png'
  },
  {
    label: 'Messages',
    icon: 'https://bakalsocial-bucket.s3.il-central-1.amazonaws.com/app-images/sidenav-messages.png',
    link: '/messages'
  }
];

// export const SideNavSecondSection: SideNavItem[] = [
//   {
//     label: 'Events',
//     icon: 'https://bakalsocial-bucket.s3.il-central-1.amazonaws.com/app-images/sidenav-events.png'
//   },
//   {
//     label: 'Gallery',
//     icon: 'https://bakalsocial-bucket.s3.il-central-1.amazonaws.com/app-images/sidenav-gallery.png'
//   },
//   {
//     label: 'Videos',
//     icon: 'https://bakalsocial-bucket.s3.il-central-1.amazonaws.com/app-images/sidenav-videos.png'
//   },
//   {
//     label: 'Messages',
//     icon: 'https://bakalsocial-bucket.s3.il-central-1.amazonaws.com/app-images/sidenav-messages.png',
//     link: '/messages'
//   }
// ];
