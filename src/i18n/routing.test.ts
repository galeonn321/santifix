import { describe, expect, it } from 'vitest';
import { routing } from './routing';

describe('localized routes', () => {
  it('supports English and Spanish with English as the default', () => {
    expect(routing.locales).toEqual(['en', 'es']);
    expect(routing.defaultLocale).toBe('en');
  });
});
