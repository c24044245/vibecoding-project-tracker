import { BugIcon, FeatureIcon } from './Icons';
import { TASK_TYPES } from '../lib/constants';

// Feature and bug look different by colour, icon AND text, so they can be told apart
// without seeing colour (FR13, NFR2). Used on cards and in the form so styling is consistent.
const STYLES = {
  feature: { Icon: FeatureIcon, className: 'bg-feature-soft text-feature border-feature' },
  bug: { Icon: BugIcon, className: 'bg-bug-soft text-bug border-bug' },
};

export default function TypeBadge({ type }) {
  const { Icon, className } = STYLES[type] ?? STYLES.feature;
  const label = (TASK_TYPES[type] ?? TASK_TYPES.feature).label;

  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-bold ${className}`}>
      <Icon />
      {label}
    </span>
  );
}
