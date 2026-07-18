import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import SettingsForm from './SettingsForm'

describe('SettingsForm', () => {
  it('renders with empty fields', () => {
    render(<SettingsForm />)

    expect(screen.getByLabelText(/display name/i)).toHaveValue('')
    expect(screen.getByLabelText(/email/i)).toHaveValue('')
  })

  it('shows the correct error message for an invalid email', async () => {
    const user = userEvent.setup()
    render(<SettingsForm />)

    await user.type(screen.getByLabelText(/email/i), 'not-an-email')

    expect(
      await screen.findByText('Please enter a valid email address'),
    ).toBeInTheDocument()
  })

  it('disables the submit button when the form is invalid', () => {
    render(<SettingsForm />)

    expect(screen.getByRole('button', { name: /save changes/i })).toBeDisabled()
  })

  it('enables the submit button when the form is valid', async () => {
    const user = userEvent.setup()
    render(<SettingsForm />)

    await user.type(screen.getByLabelText(/display name/i), 'Jane Doe')
    await user.type(screen.getByLabelText(/email/i), 'jane@example.com')

    expect(
      screen.getByRole('button', { name: /save changes/i }),
    ).toBeEnabled()
  })
})
