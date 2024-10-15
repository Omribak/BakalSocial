import { SvgIconComponent } from '@mui/icons-material';
import HttpsOutlinedIcon from '@mui/icons-material/HttpsOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import { UpdateFormValues } from '../../../Components/SettingsPage/UserProfileSection/contants';

import { UpdatePasswordValues } from '../../../Components/SettingsPage/PasswordSection/constants';
import { UserData } from '../../../Redux/User/UserSlice';

interface SettingNavItem {
  label: string;
  link: string;
  icon: SvgIconComponent;
}

export const SettingsNavLinks: SettingNavItem[] = [
  {
    label: 'Profile Settings',
    link: '/settings',
    icon: PersonOutlineOutlinedIcon
  },
  {
    label: 'Password',
    link: '/settings/passwordSettings',
    icon: HttpsOutlinedIcon
  }
];

interface UserSettingInput {
  label: string;
  required?: boolean;
  name: keyof UpdateFormValues;
  placeholder: string;
}

interface PasswordSettingInput {
  label: string;
  placeholder: string;
  required?: boolean;
  type: string;
  name: keyof UpdatePasswordValues;
}

export const UserSettingsInputs: UserSettingInput[] = [
  {
    label: 'Username',
    required: true,
    name: 'username',
    placeholder: 'Username'
  },
  {
    label: 'Email',
    required: true,
    name: 'email',
    placeholder: 'Email'
  },
  {
    label: 'Country',
    name: 'country',
    placeholder: 'Country'
  },
  {
    label: 'City',
    name: 'city',
    placeholder: 'City'
  }
];

export const PasswordSettingsInputs: PasswordSettingInput[] = [
  {
    label: 'New Password',
    placeholder: 'Password',
    required: true,
    name: 'password',
    type: 'password'
  },
  {
    label: 'Confirm Password',
    placeholder: 'Confirm Password',
    required: true,
    name: 'confirmPassword',
    type: 'password'
  }
];

interface SettingsRadioButton {
  label: string;
  value: number;
}

export const SettingsRadioButtons: SettingsRadioButton[] = [
  {
    label: 'Single',
    value: 1
  },
  {
    label: 'Married',
    value: 2
  },
  {
    label: 'Divorced',
    value: 3
  }
];
