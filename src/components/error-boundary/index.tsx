'use client';

import { catchError, type ErrorInfo } from 'next/error';

interface FallbackProps {
  message: string;
}

const Fallback = ({ message }: FallbackProps, { retry }: ErrorInfo) => (
  <div
    role="alert"
    className="flex flex-col items-center gap-3 rounded border border-line bg-surface p-6 text-sm text-muted"
  >
    <p>{message}</p>
    <button
      type="button"
      onClick={() => retry()}
      className="rounded border border-line bg-background px-3 py-1.5 text-main transition-colors duration-200 ease-out hover:border-main/40"
    >
      다시 시도
    </button>
  </div>
);

export default catchError(Fallback);
