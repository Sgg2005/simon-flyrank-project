import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import './SettingsForm.css'

const defaultValues = {
  displayName: '',
  email: '',
}

const settingsSchema = z.object({
  displayName: z
    .string()
    .trim()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be at most 50 characters'),
  email: z
    .string()
    .trim()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
})

export default function SettingsForm({ onSubmit }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isDirty },
    reset,
  } = useForm({
    defaultValues,
    resolver: zodResolver(settingsSchema),
    mode: 'onChange',
  })

  function handleReset() {
    reset(defaultValues)
  }

  return (
    <form
      className="settings-form"
      onSubmit={handleSubmit(onSubmit ?? (() => {}))}
      noValidate
    >
      <header className="settings-form__header">
        <h1>Settings</h1>
        <p>Manage your profile.</p>
      </header>

      <fieldset className="settings-form__section">
        <legend>Profile</legend>

        <div className="settings-form__field">
          <label htmlFor="displayName">Display name</label>
          <input
            id="displayName"
            type="text"
            autoComplete="name"
            maxLength={50}
            aria-invalid={errors.displayName ? 'true' : 'false'}
            aria-describedby={
              errors.displayName ? 'displayName-error' : undefined
            }
            {...register('displayName')}
          />
          {errors.displayName && (
            <p
              id="displayName-error"
              className="settings-form__error"
              role="alert"
            >
              {errors.displayName.message}
            </p>
          )}
        </div>

        <div className="settings-form__field">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            aria-invalid={errors.email ? 'true' : 'false'}
            aria-describedby={errors.email ? 'email-error' : undefined}
            {...register('email')}
          />
          {errors.email && (
            <p id="email-error" className="settings-form__error" role="alert">
              {errors.email.message}
            </p>
          )}
        </div>
      </fieldset>

      <div className="settings-form__actions">
        <button
          type="submit"
          className="settings-form__button settings-form__button--primary"
          disabled={!isValid || !isDirty}
        >
          Save changes
        </button>
        <button
          type="button"
          className="settings-form__button settings-form__button--secondary"
          onClick={handleReset}
        >
          Reset to defaults
        </button>
      </div>
    </form>
  )
}
