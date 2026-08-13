import { Type, Palette } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ResumeTheme } from '@/types';

interface TemplateSelectorProps {
  template: string;
  setTemplate: (t: string) => void;
  theme: ResumeTheme;
  setTheme: (t: ResumeTheme) => void;
  colors: string[];
  fonts: string[];
}

const templatesInfo = [
  { id: 'modern', name: 'Modern', description: 'Clean lines, bold headers' },
  { id: 'minimal', name: 'Minimalist', description: 'Focus on content' },
  { id: 'classic', name: 'Classic', description: 'Traditional structure' },
  { id: 'executive', name: 'Executive', description: 'Sophisticated & detailed' },
];

export default function TemplateSelector({
  template,
  setTemplate,
  theme,
  setTheme,
  colors,
  fonts,
}: TemplateSelectorProps) {
  return (
    <div className="space-y-6">
      {/* Templates */}
      <div>
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-ink-500">Layout</p>
        <div className="grid grid-cols-2 gap-3">
          {templatesInfo.map((t) => (
            <button
              key={t.id}
              onClick={() => setTemplate(t.id)}
              className={cn(
                'flex flex-col items-start rounded-xl border p-3 text-left transition-all',
                template === t.id
                  ? 'border-brand-500 bg-brand-500/10'
                  : 'border-ink-200 bg-surface hover:border-ink-300'
              )}
            >
              <div className="mb-2 h-16 w-full rounded-md bg-ink-100 p-2 shadow-inner">
                {/* Micro preview of layout */}
                <div className="h-2 w-3/4 rounded bg-ink-300 mb-1"></div>
                <div className="h-1.5 w-1/2 rounded bg-ink-200 mb-2"></div>
                <div className="flex gap-1">
                  <div className="h-8 w-1/3 rounded bg-ink-200"></div>
                  <div className="h-8 w-2/3 rounded bg-ink-200"></div>
                </div>
              </div>
              <span className="text-sm font-semibold text-ink-900">{t.name}</span>
              <span className="text-[10px] text-ink-500 line-clamp-1">{t.description}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Colors */}
      <div className="border-t border-ink-200 pt-4">
        <p className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-ink-500">
          <Palette className="h-3.5 w-3.5" />
          Color Palette
        </p>
        <div className="flex flex-wrap gap-2">
          {colors.map((c) => (
            <button
              key={c}
              onClick={() => setTheme({ ...theme, primaryColor: c })}
              className={cn(
                'h-8 w-8 rounded-full ring-2 ring-offset-2 ring-offset-surface transition-all',
                theme.primaryColor === c ? 'ring-brand-500 scale-110' : 'ring-transparent hover:scale-105'
              )}
              style={{ backgroundColor: c }}
            />
          ))}
        </div>
      </div>

      {/* Typography */}
      <div className="border-t border-ink-200 pt-4">
        <p className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-ink-500">
          <Type className="h-3.5 w-3.5" />
          Typography
        </p>
        <div className="space-y-2">
          {fonts.map((f) => (
            <button
              key={f}
              onClick={() => setTheme({ ...theme, fontFamily: f })}
              className={cn(
                'w-full rounded-lg border px-3 py-2 text-left text-sm transition-all',
                theme.fontFamily === f
                  ? 'border-brand-500 bg-brand-500/10 text-brand-600'
                  : 'border-ink-200 bg-surface text-ink-700 hover:bg-ink-100'
              )}
              style={{ fontFamily: f }}
            >
              {f}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
