import matchers from '@testing-library/jest-dom/matchers'
import { screen, waitFor, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import path from 'src/constants/path'
import { logScreen, renderWithRouter } from 'src/utils/testUtils'
import { describe, expect, beforeEach, beforeAll, it } from 'vitest'
expect.extend(matchers)

describe('Login', () => {
  let emailInput: HTMLInputElement
  let passwordInput: HTMLInputElement
  let submitButton: HTMLButtonElement
  beforeAll(async () => {
    renderWithRouter({ route: path.login })
    await waitFor(() => {
      expect(screen.queryByPlaceholderText('Email')).toBeInTheDocument()
    })
    emailInput = document.querySelector('form input[type="email"]') as HTMLInputElement
    passwordInput = document.querySelector('form input[type="password"]') as HTMLInputElement
    submitButton = document.querySelector('form button[type="submit"]') as HTMLButtonElement
  })

  it('Show error required when not input ', async () => {
    fireEvent.submit(submitButton)
    // /*
    // If you have a large response message and you only want to check that a specific substring
    //  (e.g., "Email does not exist") exists in the message,  can use a regular expression (RegExp) to match the substring.
    //  NOTE: if with case need accuracy, you should use ('Email does not exist') instead of (/Email does not exist/i)
    // */
    await waitFor(() => {
      expect(screen.queryByText(/Email does not/i)).toBeTruthy()
      expect(screen.queryByText(/Password must contain at least one uppercase letter/i)).toBeTruthy()
    })
  })
  it('Show error when input wrong value', async () => {
    /*
    NOTE: i want to refactor my code to remove the duplication and make it more reusable.
    One way to achieve this is by extracting the common code into a separate function that can be called from each test case.
    */
    fireEvent.change(emailInput, {
      target: {
        value: 'trungtuyendimagmail.com'
      }
    })
    fireEvent.change(passwordInput, {
      target: {
        value: '@sun01@'
      }
    })
    expect(await screen.findByText(/Email does not correct format/i)).toBeInTheDocument()
    expect(await screen.findByText(/Password must contain at least one uppercase letter/i)).toBeInTheDocument()
  })
  it('Login success', async () => {
    fireEvent.change(emailInput, {
      target: {
        value: 'trungtuyendima@gmail.com'
      }
    })
    fireEvent.change(passwordInput, {
      target: {
        value: 'Hung25032001@'
      }
    })
    fireEvent.submit(submitButton)
    await waitFor(() => {
      expect(screen.queryByText(/Email hoặc password không đúng/i)).toBeFalsy()
    })
    await waitFor(() => {
      expect(document.title).toBe('Trang chủ | Shopee Clone')
    })
  })
})
