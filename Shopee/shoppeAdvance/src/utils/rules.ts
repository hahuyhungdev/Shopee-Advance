import type { RegisterOptions, UseFormGetValues } from 'react-hook-form'
type Rules = {
  [key in 'email' | 'password' | 'confirm_password']?: RegisterOptions
}
// because if not use ts, us don't know what is the type of rules and very danger to use it.
// it's the reason why we use typescript with options fields of react-hook-form
//  we use react-hook-form, we can use the same rules as react-hook-form

export const getRulse = (
  getValues: UseFormGetValues<{
    email: string
    password: string
    confirm_password: string
  }>
): Rules => ({
  email: {
    required: {
      value: true,
      message: 'Email does not correct format'
    },
    pattern: {
      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
      message: 'Invalid email address'
    },
    minLength: {
      value: 5,
      message: 'Email must have at least 5 characters'
    },
    maxLength: {
      value: 160,
      message: 'Email must have at most 160 characters'
    }
  },
  password: {
    required: {
      value: true,
      message: 'Password does not exist'
    },
    minLength: {
      value: 6,
      message: 'Password must have at least 6 characters'
    },
    maxLength: {
      value: 20,
      message: 'Password must have at most 20 characters'
    }
  },
  confirm_password: {
    required: {
      value: true,
      message: 'Password does not exist'
    },
    minLength: {
      value: 6,
      message: 'Password must have at least 6 characters'
    },
    maxLength: {
      value: 20,
      message: 'Password must have at most 20 characters'
    },
    validate: {
      matchesPreviousPassword: (value) => {
        const { password } = getValues()

        return password === value || 'Passwords should match!'
      }
    }
  }
})
