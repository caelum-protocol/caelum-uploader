import formatBytes from '../utils/formatBytes';

describe('formatBytes', () => {
  it('formats 0 bytes', () => {
    expect(formatBytes(0)).toBe('0 Bytes');
  });

  it('formats 1024 bytes as 1 KB', () => {
    expect(formatBytes(1024)).toBe('1 KB');
  });

  it('formats 1048576 bytes as 1 MB', () => {
    expect(formatBytes(1048576)).toBe('1 MB');
  });
});