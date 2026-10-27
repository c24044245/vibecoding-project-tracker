import { useState } from 'react';
import { ROLES } from '../lib/constants';
import { getInitials } from '../lib/utils';

const inputClass = 'mt-1 block w-full rounded-md border bg-surface-card px-3 py-2 text-base text-ink';
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Sign-in screen (FR1). There is no backend, so this creates a local profile in this browser.
 * It is not secure, by design at this stage (NFR24).
 */
export default function SignIn({ members, onSignIn }) {
  const [values, setValues] = useState({ name: '', email: '', role: '' });
  const [errors, setErrors] = useState({});

  const update = (field) => (event) => setValues((v) => ({ ...v, [field]: event.target.value }));

  function handleSubmit(event) {
    event.preventDefault();
    const name = values.name.trim();
    const email = values.email.trim().toLowerCase();
    const next = {};
    if (!name) next.name = 'Enter your name.';
    if (!EMAIL_PATTERN.test(email)) next.email = 'Enter an email address like name@example.com.';
    setErrors(next);

    if (Object.keys(next).length > 0) {
      document.getElementById(next.name ? 'signin-name' : 'signin-email')?.focus();
      return;
    }
    onSignIn({ name, email, role: values.role || 'Other' });
  }

  return (
    <div className="mx-auto w-full max-w-md px-4 py-10">
      <div className="rounded-2xl bg-surface-card p-6 shadow-sm sm:p-8">
        <h1 className="mb-2 text-2xl font-bold">Sign in to Vibe Tracker</h1>
        <p className="mb-6 text-ink-muted">Track your vibe coding tasks and the prompts behind them.</p>

        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
          <Field id="signin-name" label="Your name" error={errors.name}>
            <input
              id="signin-name"
              type="text"
              autoComplete="name"
              value={values.name}
              onChange={update('name')}
              maxLength={60}
              aria-invalid={errors.name ? 'true' : undefined}
              aria-describedby={errors.name ? 'signin-name-error' : undefined}
              className={`${inputClass} ${errors.name ? 'border-bug ring-1 ring-bug' : 'border-line-strong'}`}
            />
          </Field>

          <Field id="signin-email" label="Email" error={errors.email}>
            <input
              id="signin-email"
              type="email"
              autoComplete="email"
              value={values.email}
              onChange={update('email')}
              aria-invalid={errors.email ? 'true' : undefined}
              aria-describedby={errors.email ? 'signin-email-error' : undefined}
              className={`${inputClass} ${errors.email ? 'border-bug ring-1 ring-bug' : 'border-line-strong'}`}
            />
          </Field>

          <Field id="signin-role" label="Your role" hint="(optional)">
            <select id="signin-role" value={values.role} onChange={update('role')} className={`${inputClass} border-line-strong`}>
              <option value="">Choose a role</option>
              {ROLES.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </Field>

          <button type="submit" className="mt-2 min-h-[48px] rounded-md bg-brand px-5 text-lg font-bold text-white hover:bg-brand-hover">
            Sign in
          </button>
        </form>

        <p className="mt-4 rounded-md bg-brand-soft p-3 text-sm">
          Your details stay in this browser. Nothing is sent to a server, and there is no password.
        </p>

        {members.length > 0 && (
          <div className="mt-6 border-t border-line-soft pt-5">
            <h2 className="mb-3 font-bold">Or continue as an example teammate</h2>
            <ul className="flex flex-col gap-2">
              {members.slice(0, 3).map((member) => (
                <li key={member.id}>
                  <button
                    type="button"
                    onClick={() => onSignIn(member)}
                    className="flex min-h-[48px] w-full items-center gap-3 rounded-md border border-line px-3 text-left hover:border-brand-ink hover:bg-brand-soft"
                  >
                    <span aria-hidden="true" className="flex h-8 w-8 items-center justify-center rounded-full bg-brand text-xs font-bold text-white">
                      {getInitials(member.name)}
                    </span>
                    <span>
                      <span className="block font-bold">{member.name}</span>
                      <span className="block text-sm text-ink-muted">{member.role}</span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

function Field({ id, label, hint, error, children }) {
  return (
    <div>
      <label htmlFor={id} className="block font-bold">
        {label} {hint && <span className="font-normal text-ink-muted">{hint}</span>}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} className="mt-1 text-sm font-bold text-bug">
          {error}
        </p>
      )}
    </div>
  );
}
