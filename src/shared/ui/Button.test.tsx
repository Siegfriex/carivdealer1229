/**
 * Button Component Tests
 */

import { describe, test, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Button } from './Button';

describe('Button Component', () => {
  test('렌더링 확인', () => {
    render(<Button>클릭</Button>);
    expect(screen.getByText('클릭')).toBeInTheDocument();
  });

  test('클릭 이벤트 처리', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>클릭</Button>);

    fireEvent.click(screen.getByText('클릭'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test('disabled 상태 확인', () => {
    render(<Button disabled>클릭</Button>);
    expect(screen.getByText('클릭')).toBeDisabled();
  });

  test('loading 상태 표시', () => {
    render(<Button loading>클릭</Button>);
    expect(screen.getByText('클릭')).toBeDisabled();
    // Loader2 아이콘 확인 가능
  });

  test('variant 적용', () => {
    const { container } = render(<Button variant="primary">Primary</Button>);
    const button = container.querySelector('button');
    expect(button?.className).toContain('bg-primary');
  });

  test('fullWidth 적용', () => {
    const { container } = render(<Button fullWidth>Full</Button>);
    const button = container.querySelector('button');
    expect(button?.className).toContain('w-full');
  });
});
