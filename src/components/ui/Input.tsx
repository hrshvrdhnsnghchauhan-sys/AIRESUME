import { forwardRef, type InputHTMLAttributes, type TextareaHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
  hint?: string;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, id, ...props }, ref) => {
    const inputId = id || props.name;
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-ink-700">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            'h-11 w-full rounded-xl border border-ink-300 bg-white px-3.5 text-sm text-ink-900 shadow-sm transition-all duration-200 placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-brand-500/25 focus:border-brand-500',
            error ? 'border-error-500 focus:ring-error-500/25' : '',
            className,
          )}
          {...props}
        />
        {error ? (
          <p className="text-xs text-error-600">{error}</p>
        ) : hint ? (
          <p className="text-xs text-ink-500">{hint}</p>
        ) : null}
      </div>
    );
  },
);
Input.displayName = 'Input';

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string;
  error?: string;
  hint?: string;
};

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, hint, id, ...props }, ref) => {
    const textareaId = id || props.name;
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={textareaId} className="text-sm font-medium text-ink-700">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          className={cn(
            'min-h-[100px] w-full rounded-xl border border-ink-300 bg-white px-3.5 py-2.5 text-sm text-ink-900 shadow-sm transition-all duration-200 placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-brand-500/25 focus:border-brand-500 resize-y',
            error ? 'border-error-500 focus:ring-error-500/25' : '',
            className,
          )}
          {...props}
        />
        {error ? (
          <p className="text-xs text-error-600">{error}</p>
        ) : hint ? (
          <p className="text-xs text-ink-500">{hint}</p>
        ) : null}
      </div>
    );
  },
);
Textarea.displayName = 'Textarea';
