import matchers from '@testing-library/jest-dom/matchers'
import { screen, waitFor } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { logScreen, renderWithRouter } from './utils/testUtils'

expect.extend(matchers)

describe('App', () => {
  test('App render and change page', async () => {
    const { user } = renderWithRouter()
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
  })
  test('direct to page not found', async () => {
    const badPath = '/bad-path/dasd'
    renderWithRouter({ route: badPath })
    await waitFor(() => {
      // explain: /i is regex flag, it means case insensitive
      expect(screen.getByText(/Page Not Found/i)).toBeInTheDocument()
    })
    await logScreen()
  })
})
