import {
  Person,
  QuestionMark,
  Settings,
  SvgIconComponent
} from '@mui/icons-material';

interface ProfileMenuLink {
  label: string;
  link: string;
  icon: SvgIconComponent;
}

export const MenuLinks: ProfileMenuLink[] = [
  {
    label: 'Profile',
    link: '/user-profile',
    icon: Person
  },
  {
    label: 'Settings',
    link: '/settings',
    icon: Settings
  }
];
