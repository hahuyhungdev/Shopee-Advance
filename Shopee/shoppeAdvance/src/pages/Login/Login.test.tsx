import matchers from '@testing-library/jest-dom/matchers'
import { screen, waitFor, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import path from 'src/constants/path'
import { logScreen, renderWithRouter } from 'src/utils/testUtils'
import { describe, expect, beforeEach, beforeAll, it } from 'vitest'
expect.extend(matchers)

describe('Login', () => {
  const user = userEvent.setup()
  beforeAll(async () => {
    renderWithRouter({ route: path.login })
    await waitFor(() => {
      expect(screen.getByPlaceholderText('Email')).toBeInTheDocument()
    })
  })
  const submitLoginForm = async (email: string, password: string) => {
    const emailInput = document.querySelector('form input[name="email"]') as HTMLInputElement
    const passwordInput = document.querySelector('form input[name="password"]') as HTMLInputElement
    fireEvent.change(emailInput, { target: { value: email } })
    fireEvent.change(passwordInput, { target: { value: password } })
    const loginBtn = document.querySelector('form button[type="submit"]') as Element
    fireEvent.submit(loginBtn)
  }
  it('Show error required when not input ', async () => {
    const loginBtn = document.querySelector('form button[type="submit"]') as Element
    // user.click(loginBtn)
    fireEvent.submit(loginBtn)
    // /*
    // If you have a large response message and you only want to check that a specific substring
    //  (e.g., "Email does not exist") exists in the message,  can use a regular expression (RegExp) to match the substring.
    //  NOTE: if with case need accuracy, you should use ('Email does not exist') instead of (/Email does not exist/i)
    // */
    const checkEmail = await screen.findByText(/Email does not/i)
    expect(checkEmail).toBeInTheDocument()
    // expect(await screen.findByText('Email does not exist')).toBeTruthy()
    expect(await screen.findByText(/Password must contain at least one uppercase letter/i)).toBeInTheDocument()
  })
  it('Show error when input wrong value', async () => {
    // const emailInput = document.querySelector('form input[name="email"]') as HTMLInputElement
    // const passwordInput = document.querySelector('form input[name="password"]') as HTMLInputElement
    // fireEvent.change(emailInput, { target: { value: 'trungtuyendimagmail.com' } })
    // fireEvent.change(passwordInput, { target: { value: '@sun01@' } })
    // const loginBtn = document.querySelector('form button[type="submit"]') as Element
    // fireEvent.submit(loginBtn)
    /* 
    NOTE: i want to refactor my code to remove the duplication and make it more reusable.
    One way to achieve this is by extracting the common code into a separate function that can be called from each test case.
    */
    await submitLoginForm('trungtuyendimagmail.com', '@sun01@')
    expect(await screen.findByText(/Email does not correct format/i)).toBeInTheDocument()
    expect(await screen.findByText(/Password must contain at least one uppercase letter/i)).toBeInTheDocument()
  })
  it('Show error when input incorrect login credentials', async () => {
    await submitLoginForm('trungtuyendima@gmail.com', 'Hung2503200@')
    expect(await screen.findByText(/Email hoặc password không đúng/i)).toBeInTheDocument()
  })
})
