import { AlertTriangle, Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  isLoading?: boolean;
  variant?: 'danger' | 'warning';
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'Confirm',
  isLoading = false,
  variant = 'danger',
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl animate-slide-up">
        <div className="p-6">
          <div
            className={cn(
              'w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4',
              variant === 'danger' ? 'bg-red-100' : 'bg-amber-100'
            )}
          >
            <AlertTriangle
              className={variant === 'danger' ? 'text-red-600' : 'text-amber-600'}
              size={24}
            />
          </div>
          <h3 className="text-lg font-semibold text-surface-900 text-center mb-2">{title}</h3>
          <p className="text-sm text-surface-500 text-center leading-relaxed">{message}</p>
        </div>
        <div className="px-6 pb-6 flex gap-3">
          <button onClick={onClose} className="btn-secondary flex-1" disabled={isLoading}>
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={cn(
              'btn flex-1',
              variant === 'danger'
                ? 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500'
                : 'bg-amber-600 text-white hover:bg-amber-700 focus:ring-amber-500'
            )}
          >
            {isLoading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Deleting...
              </>
            ) : (
              confirmLabel
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
