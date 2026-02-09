/**
 * 재사용 테이블 컴포넌트
 * Table, TableHead, TableBody, TableRow, TableHeader, TableCell 조합으로 사용.
 */

import type { PropsWithChildren, ThHTMLAttributes, TdHTMLAttributes } from 'react';

export const Table = ({ children, className = '' }: PropsWithChildren<{ className?: string }>) => {
  return (
    <div className="overflow-x-auto">
      <table className={`w-full ${className}`}>{children}</table>
    </div>
  );
};

export const TableHead = ({ children, className = '' }: PropsWithChildren<{ className?: string }>) => {
  return <thead className={`bg-gray-50 ${className}`}>{children}</thead>;
};

export const TableBody = ({ children, className = '' }: PropsWithChildren<{ className?: string }>) => {
  return <tbody className={`bg-white divide-y divide-gray-200 ${className}`}>{children}</tbody>;
};

export const TableRow = ({ children, className = '', ...props }: PropsWithChildren<{ className?: string; onClick?: () => void }>) => {
  return (
    <tr className={`hover:bg-gray-50 transition-fast ${className}`} {...props}>
      {children}
    </tr>
  );
};

export const TableHeader = ({
  children,
  className = '',
  ...props
}: PropsWithChildren<ThHTMLAttributes<HTMLTableCellElement>>) => {
  return (
    <th
      className={`px-6 py-3 text-left text-button font-medium text-gray-600 uppercase tracking-wide ${className}`}
      {...props}
    >
      {children}
    </th>
  );
};

export const TableCell = ({
  children,
  className = '',
  ...props
}: PropsWithChildren<TdHTMLAttributes<HTMLTableCellElement>>) => {
  return (
    <td className={`px-6 py-4 text-body text-gray-900 ${className}`} {...props}>
      {children}
    </td>
  );
};
