import { useState } from 'react';
import { ROLES } from '../lib/constants';
import { getInitials } from '../lib/utils';

const inputClass = 'mt-1 block w-full rounded-md border bg-white px-3 py-2 text-base text-ink';
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Lists the team and lets anyone add a member (FR3). Shown inside the modal.
export default function TeamPanel({ members, currentUserId, onAdd }) {
  const [message, setMessage] = useState('');

  return (
    <div className="flex flex-col gap-6">
      <section aria-labelledby="team-list-heading">
        <h3 id="team-list-heading" className="mb-2 font-bold">
          {members.length} {members.length === 1 ? 'member' : 'members'}
        </h3>
        <ul className="divide-y divide-slate-200 rounded-lg border border-slate-300">
          {members.map((member) => (
            <li key={member.id} className="flex items-center gap-3 p-3">
              <MemberSummary member={member} isYou={member.id === currentUserId} />
            </li>
          ))}
        </ul>
      </section>

      <MemberForm
        heading="Add a team member"
        submitLabel="Add member"
        members={members}
        onSubmit={(values) => {
          onAdd(values);
          setMessage(`${values.name} added to the team`);
        }}
        resetAfterSubmit
      />

      {/* Announces the result; the page-level message area is hidden while the modal is open. */}
      <p role="status" className="text-sm font-bold text-feature">
        {message}
      </p>
    </div>
  );
}

export function MemberSummary({ member, isYou }) {
  return (
    <>
      <span aria-hidden="true" className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-brand text-sm font-bold text-white">
        {getInitials(member.name)}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block font-bold">
          {member.name} {isYou && <span className="font-normal text-ink-muted">(you)</span>}
        </span>
        <span className="block break-words text-sm text-ink-muted">
          {member.role} · {member.email}
        </span>
      </span>
    </>
  );
}

// Shared name / email / role form, used to add a member (and later to edit one).
export function MemberForm({ heading, submitLabel, members, initial, excludeId, onSubmit, onCancel, resetAfterSubmit }) {
  const blank = { name: '', email: '', role: 'Other' };
  const [values, setValues] = useState(initial ?? blank);
  const [errors, setErrors] = useState({});
  const idPrefix = `member-${excludeId ?? 'new'}`;

  const update = (field) => (event) => setValues((v) => ({ ...v, [field]: event.target.value }));

  function handleSubmit(event) {
    event.preventDefault();
    const name = values.name.trim();
    const email = values.email.trim().toLowerCase();
    const next = {};
    if (!name) next.name = 'Enter a name.';
    if (!EMAIL_PATTERN.test(email)) next.email = 'Enter an email address like name@example.com.';
    else if (members.some((m) => m.id !== excludeId && m.email.toLowerCase() === email)) {
      next.email = 'Someone in the team already uses this email.';
    }
    setErrors(next);
    if (Object.keys(next).length > 0) {
      document.getElementById(`${idPrefix}-${next.name ? 'name' : 'email'}`)?.focus();
      return;
    }
    onSubmit({ name, email, role: values.role });
    if (resetAfterSubmit) setValues(blank);
  }

  const field = (key, label, input) => (
    <div>
      <label htmlFor={`${idPrefix}-${key}`} className="block font-bold">
        {label}
      </label>
      {input}
      {errors[key] && (
        <p id={`${idPrefix}-${key}-error`} className="mt-1 text-sm font-bold text-bug">
          {errors[key]}
        </p>
      )}
    </div>
  );

  const textInput = (key, type, autoComplete) => (
    <input
      id={`${idPrefix}-${key}`}
      type={type}
      autoComplete={autoComplete}
      value={values[key]}
      onChange={update(key)}
      aria-invalid={errors[key] ? 'true' : undefined}
      aria-describedby={errors[key] ? `${idPrefix}-${key}-error` : undefined}
      className={`${inputClass} ${errors[key] ? 'border-bug ring-1 ring-bug' : 'border-slate-400'}`}
    />
  );

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-3 rounded-lg bg-surface-page p-4" aria-label={heading}>
      <h3 className="font-bold">{heading}</h3>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {field('name', 'Name', textInput('name', 'text', 'off'))}
        {field('email', 'Email', textInput('email', 'email', 'off'))}
      </div>
      {field(
        'role',
        'Role',
        <select id={`${idPrefix}-role`} value={values.role} onChange={update('role')} className={`${inputClass} border-slate-400`}>
          {ROLES.map((role) => (
            <option key={role} value={role}>
              {role}
            </option>
          ))}
        </select>,
      )}
      <div className="flex flex-wrap justify-end gap-3">
        {onCancel && (
          <button type="button" onClick={onCancel} className="min-h-[44px] rounded-md border border-slate-400 bg-white px-4 font-bold hover:bg-slate-100">
            Cancel
          </button>
        )}
        <button type="submit" className="min-h-[44px] rounded-md bg-brand px-5 font-bold text-white hover:bg-brand-hover">
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
