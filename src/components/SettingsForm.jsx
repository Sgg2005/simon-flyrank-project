import { useEffect, useState } from 'react'
import './SettingsForm.css'

const STORAGE_KEY = 'flyrank-settings'

const DEFAULT_SETTINGS = {
  displayName: '',
  email: '',
  theme: 'system',
  emailNotifications: true,
  weeklyDigest: false,
}

function loadSettings() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return DEFAULT_SETTINGS
    return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) }
  } catch {
    return DEFAULT_SETTINGS
  }
}

function applyTheme(theme) {
  if (theme === 'system') {
    document.documentElement.removeAttribute('data-theme')
  } else {
    document.documentElement.setAttribute('data-theme', theme)
  }
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

export default function SettingsForm() {
  const [settings, setSettings] = useState(loadSettings)
  const [savedSettings, setSavedSettings] = useState(loadSettings)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState(null)

  useEffect(() => {
    applyTheme(savedSettings.theme)
  }, [savedSettings.theme])

  function updateField(name, value) {
    setSettings((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: undefined }))
    setStatus(null)
  }

  function validate(values) {
    const nextErrors = {}

    if (values.displayName.trim().length > 50) {
      nextErrors.displayName = 'Display name must be 50 characters or fewer.'
    }

    if (values.email.trim() && !isValidEmail(values.email.trim())) {
      nextErrors.email = 'Enter a valid email address.'
    }

    return nextErrors
  }

  function handleSubmit(event) {
    event.preventDefault()

    const trimmed = {
      ...settings,
      displayName: settings.displayName.trim(),
      email: settings.email.trim(),
    }

    const nextErrors = validate(trimmed)
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      setStatus(null)
      return
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed))
    setSettings(trimmed)
    setSavedSettings(trimmed)
    applyTheme(trimmed.theme)
    setErrors({})
    setStatus('saved')
  }

  function handleReset() {
    setSettings(DEFAULT_SETTINGS)
    setSavedSettings(DEFAULT_SETTINGS)
    setErrors({})
    setStatus('reset')
    localStorage.removeItem(STORAGE_KEY)
    applyTheme(DEFAULT_SETTINGS.theme)
  }

  const isDirty =
    JSON.stringify(settings) !== JSON.stringify(savedSettings)

  return (
    <form className="settings-form" onSubmit={handleSubmit} noValidate>
      <header className="settings-form__header">
        <h1>Settings</h1>
        <p>Manage your profile and preferences.</p>
      </header>

      <fieldset className="settings-form__section">
        <legend>Profile</legend>

        <div className="settings-form__field">
          <label htmlFor="displayName">Display name</label>
          <input
            id="displayName"
            name="displayName"
            type="text"
            autoComplete="name"
            maxLength={50}
            value={settings.displayName}
            onChange={(event) =>
              updateField('displayName', event.target.value)
            }
            aria-invalid={Boolean(errors.displayName)}
            aria-describedby={
              errors.displayName ? 'displayName-error' : undefined
            }
          />
          {errors.displayName && (
            <p id="displayName-error" className="settings-form__error" role="alert">
              {errors.displayName}
            </p>
          )}
        </div>

        <div className="settings-form__field">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            value={settings.email}
            onChange={(event) => updateField('email', event.target.value)}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? 'email-error' : undefined}
          />
          {errors.email && (
            <p id="email-error" className="settings-form__error" role="alert">
              {errors.email}
            </p>
          )}
        </div>
      </fieldset>

      <fieldset className="settings-form__section">
        <legend>Preferences</legend>

        <div className="settings-form__field">
          <label htmlFor="theme">Theme</label>
          <select
            id="theme"
            name="theme"
            value={settings.theme}
            onChange={(event) => updateField('theme', event.target.value)}
          >
            <option value="system">System</option>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </div>

        <div className="settings-form__field settings-form__field--checkbox">
          <input
            id="emailNotifications"
            name="emailNotifications"
            type="checkbox"
            checked={settings.emailNotifications}
            onChange={(event) =>
              updateField('emailNotifications', event.target.checked)
            }
          />
          <label htmlFor="emailNotifications">Email notifications</label>
        </div>

        <div className="settings-form__field settings-form__field--checkbox">
          <input
            id="weeklyDigest"
            name="weeklyDigest"
            type="checkbox"
            checked={settings.weeklyDigest}
            onChange={(event) =>
              updateField('weeklyDigest', event.target.checked)
            }
          />
          <label htmlFor="weeklyDigest">Weekly digest</label>
        </div>
      </fieldset>

      <div className="settings-form__actions">
        <button type="submit" className="settings-form__button settings-form__button--primary" disabled={!isDirty}>
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

      {status === 'saved' && (
        <p className="settings-form__status" role="status">
          Settings saved successfully.
        </p>
      )}
      {status === 'reset' && (
        <p className="settings-form__status" role="status">
          Settings reset to defaults.
        </p>
      )}
    </form>
  )
}
