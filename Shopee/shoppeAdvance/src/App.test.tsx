import { describe, expect, test } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App'
import matchers from '@testing-library/jest-dom/matchers'
import { BrowserRouter } from 'react-router-dom'

expect.extend(matchers)

describe('App', () => {
  test('App render and change page', async () => {
    const user = userEvent.setup()
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    )
    /**
     * waitFor sẽ run callback 1 vài lần
     * cho đến khi hết timeout hoặc expect pass
     * số lần run phụ thuộc vào timeout và interval
     * mặc định: timeout = 1000ms và interval = 50ms
     */

    // Verify vào đúng trang chủ
    await waitFor(() => {
      expect(document.title).toBe('Trang chủ | Shopee Clone')
    })
    user.click(screen.getByText('Login'))
    // Verify vào trang login
    await waitFor(() => {
      expect(document.title).toBe('Login | Shopee Clone')
      expect(screen.getByText('Do not have an account?')).toBeInTheDocument()
    })
    screen.debug(document.body.parentElement as HTMLElement, 999999999)
  })
})
