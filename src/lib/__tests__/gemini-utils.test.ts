import { safeJsonParse, sanitizeJsonString } from '@/lib/gemini';

describe('safeJsonParse', () => {
  it('parses valid JSON', () => {
    const result = safeJsonParse<{ a: number }>('{"a": 1}');
    expect(result).toEqual({ a: 1 });
  });

  it('handles control characters inside string values', () => {
    // Build a JSON string with a literal newline inside a value
    const raw = '{"msg": "hello\nworld"}';
    const result = safeJsonParse<{ msg: string }>(raw);
    expect(result.msg).toBe('hello\nworld');
  });

  it('throws on completely invalid JSON', () => {
    expect(() => safeJsonParse('not json at all')).toThrow();
  });

  it('handles nested objects and arrays', () => {
    const json = '{"a": {"b": [1, 2, {"c": true}]}}';
    const result = safeJsonParse<{ a: { b: (number | { c: boolean })[] } }>(json);
    expect(result.a.b).toHaveLength(3);
    expect(result.a.b[2]).toEqual({ c: true });
  });

  it('handles JSON with escaped quotes', () => {
    const json = '{"say": "he said \\"hello\\""}';
    const result = safeJsonParse<{ say: string }>(json);
    expect(result.say).toBe('he said "hello"');
  });
});

describe('sanitizeJsonString', () => {
  it('returns an identical string when there are no control characters', () => {
    const clean = '{"name": "Alice", "age": 30}';
    expect(sanitizeJsonString(clean)).toBe(clean);
  });

  it('replaces literal newline inside string values with \\n', () => {
    const raw = '{"msg": "line1\nline2"}';
    const sanitized = sanitizeJsonString(raw);
    expect(sanitized).toBe('{"msg": "line1\\nline2"}');
    // Should now parse cleanly
    expect(JSON.parse(sanitized)).toEqual({ msg: 'line1\nline2' });
  });

  it('replaces literal tab inside string values with \\t', () => {
    const raw = '{"msg": "col1\tcol2"}';
    const sanitized = sanitizeJsonString(raw);
    expect(sanitized).toBe('{"msg": "col1\\tcol2"}');
  });

  it('replaces literal carriage return inside string values with \\r', () => {
    const raw = '{"msg": "a\rb"}';
    const sanitized = sanitizeJsonString(raw);
    expect(sanitized).toBe('{"msg": "a\\rb"}');
  });

  it('does NOT break structural whitespace (newlines/tabs outside strings)', () => {
    const raw = '{\n  "key": "value"\n}';
    const sanitized = sanitizeJsonString(raw);
    // Structural whitespace outside strings should be preserved as-is
    expect(sanitized).toBe(raw);
    expect(JSON.parse(sanitized)).toEqual({ key: 'value' });
  });

  it('handles escaped backslashes correctly', () => {
    // The value contains a literal backslash followed by n (not a newline)
    const raw = '{"path": "C:\\\\new"}';
    const sanitized = sanitizeJsonString(raw);
    expect(sanitized).toBe(raw);
    expect(JSON.parse(sanitized)).toEqual({ path: 'C:\\new' });
  });
});
