import { useState } from 'react';
import { ROLES } from '../lib/constants';
import { getInitials } from '../lib/utils';

const inputClass = 'mt-1 block w-full rounded-md border bg-surface-card px-3 py-2 text-base text-ink';
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Lists the team and lets anyone add (FR3), edit or remove (FR4) a member. Shown inside the modal.
export default function TeamPanel({ members, currentUserId, onAdd, onUpdate, onRemove }) {
  const [message, setMessage] = useState('');

  return (
    <div className="flex flex-col gap-6">
      <section aria-labelledby="team-list-heading">
        <h3 id="team-list-heading" className="mb-2 font-bold">
          {members.length} {members.length === 1 ? 'member' : 'members'}
        </h3>
        <ul className="divide-y divide-line-soft rounded-lg border border-line">
          {members.map((member) => (
            <li key={member.id} className="p-3">
              <MemberRow
                member={member}
                members={members}
                isYou={member.id === currentUserId}
                onUpdate={(values) => {
                  onUpdate(member.id, values);
                  setMessage(`${values.name} updated`);
                }}
                onRemove={() => {
                  onRemove(member);
                  setMessage(`${member.name} removed from the team`);
                }}
              />
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

// One team member: view, edit in place, or confirm removal.
function MemberRow({ member, members, isYou, onUpdate, onRemove }) {
  const [mode, setMode] = useState('view'); // 'view' | 'edit' | 'confirm'
  const smallButton = 'min-h-[36px] rounded-md px-3 text-sm font-bold';

  if (mode === 'edit') {
    return (
      <MemberForm
        heading={`Edit ${member.name}`}
        submitLabel="Save member"
        members={members}
        initial={{ name: member.name, email: member.email, role: member.role }}
        excludeId={member.id}
        onSubmit={(values) => {
          onUpdate(values);
          setMode('view');
        }}
        onCancel={() => setMode('view')}
      />
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-3">
        <MemberSummary member={member} isYou={isYou} />
        {mode === 'view' && (
          <div className="flex gap-1">
            <button type="button" onClick={() => setMode('edit')} className={`${smallButton} text-brand-ink hover:bg-brand-soft`}>
              Edit<span className="sr-only"> {member.name}</span>
            </button>
            {!isYou && (
              <button type="button" onClick={() => setMode('confirm')} className={`${smallButton} text-bug hover:bg-bug-soft`}>
                Remove<span className="sr-only"> {member.name}</span>
              </button>
            )}
          </div>
        )}
      </div>

      {mode === 'confirm' && (
        <div role="group" aria-label={`Confirm removing ${member.name}`} className="rounded-lg border-2 border-bug bg-bug-soft p-3">
          <p className="mb-2 text-sm font-bold">
            Remove {member.name}? Their tasks will become unassigned.
          </p>
          <div className="flex flex-wrap justify-end gap-2">
            {/* autoFocus moves keyboard focus to the safe choice first */}
            <button type="button" autoFocus onClick={() => setMode('view')} className={`${smallButton} border border-line-strong bg-surface-card`}>
              Keep
            </button>
            <button type="button" onClick={onRemove} className={`${smallButton} bg-danger text-white hover:bg-danger-hover`}>
              Yes, remove
            </button>
          </div>
        </div>
      )}
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
      className={`${inputClass} ${errors[key] ? 'border-bug ring-1 ring-bug' : 'border-line-strong'}`}
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
        <select id={`${idPrefix}-role`} value={values.role} onChange={update('role')} className={`${inputClass} border-line-strong`}>
          {ROLES.map((role) => (
            <option key={role} value={role}>
              {role}
            </option>
          ))}
        </select>,
      )}
      <div className="flex flex-wrap justify-end gap-3">
        {onCancel && (
          <button type="button" onClick={onCancel} className="min-h-[44px] rounded-md border border-line-strong bg-surface-card px-4 font-bold hover:bg-surface-hover">
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
