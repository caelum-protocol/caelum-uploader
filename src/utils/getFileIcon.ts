export default function getFileIcon(type: string): string {
  if (type.startsWith('image/')) return '🖼️';
  if (type.startsWith('video/')) return '🎞️';
  if (type === 'application/pdf') return '📄';
  if (type === 'application/json') return '🔣';
  return '📁';
}