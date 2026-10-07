import { cn } from '../../lib/utils';

interface BadgeProps {
  status: 'ACTIVE' | 'IDLE' | 'OFFLINE';
  className?: string;
}

const statusConfig = {
  ACTIVE: {
    className: 'badge-active',
    dot: 'bg-emerald-500',
    label: 'Active',
  },
  IDLE: {
    className: 'badge-idle',
    dot: 'bg-amber-500',
    label: 'Idle',
  },
  OFFLINE: {
    className: 'badge-offline',
    dot: 'bg-red-500',
    label: 'Offline',
  },
};

export function StatusBadge({ status, className }: BadgeProps) {
  const config = statusConfig[status];

  return (
    <span className={cn(config.className, className)}>
      <span className={cn('w-1.5 h-1.5 rounded-full', config.dot)} />
      {config.label}
    </span>
  );
}
