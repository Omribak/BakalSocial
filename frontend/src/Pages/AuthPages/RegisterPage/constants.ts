interface Input {
  id: string;
  name: keyof RegValues;
  type: string;
  placeholder: string;
  label: string;
}

export const inputs: Input[] = [
  {
    id: '1',
    name: 'username',
    type: 'text',
    placeholder: 'Username*',
    label: 'Username'
  },
  {
    id: '2',
    name: 'email',
    type: 'text',
    placeholder: 'Email*',
    label: 'Email'
  },
  {
    id: '3',
    name: 'password',
    type: 'password',
    placeholder: 'Password*',
    label: 'Password'
  },
  {
    id: '4',
    name: 'country',
    type: 'text',
    placeholder: 'Country',
    label: 'Country'
  },
  {
    id: '5',
    name: 'city',
    type: 'text',
    placeholder: 'City',
    label: 'City'
  },
  {
    id: '6',
    name: 'birthday',
    type: 'date',
    placeholder: 'Birthday',
    label: 'Birthday'
  }
];

export type RegValues = {
  username: string;
  email: string;
  password: string;
  country: string;
  city: string;
  birthday: string;
};

export interface FormErrors {
  username?: string;
  email?: string;
  password?: string;
  country?: string;
  city?: string;
  birthday?: string;
}
