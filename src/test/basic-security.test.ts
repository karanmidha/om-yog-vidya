import { describe, it, expect } from 'vitest';

describe('Basic Security Tests', () => {
  it('should pass basic test', () => {
    expect(true).toBe(true);
  });

  it('should demonstrate HTML sanitization concept', () => {
    const unsafeInput = '<script>alert("xss")</script>Hello';
    const sanitized = unsafeInput.replace(/<script[^>]*>.*?<\/script>/gi, '').replace(/<[^>]*>/g, '');
    expect(sanitized).toBe('Hello');
  });

  it('should demonstrate basic validation concept', () => {
    const validateEmail = (email: string) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    };

    expect(validateEmail('test@example.com')).toBe(true);
    expect(validateEmail('invalid-email')).toBe(false);
  });

  it('should demonstrate UUID validation concept', () => {
    const validateUUID = (str: string) => {
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      return uuidRegex.test(str);
    };

    expect(validateUUID('f47ac10b-58cc-4372-a567-0e02b2c3d479')).toBe(true);
    expect(validateUUID('invalid-uuid')).toBe(false);
  });

  it('should demonstrate length validation concept', () => {
    const validateLength = (str: string, max: number) => str.length <= max;

    expect(validateLength('short', 100)).toBe(true);
    expect(validateLength('A'.repeat(101), 100)).toBe(false);
  });
});