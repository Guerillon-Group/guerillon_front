export function resolveImageUrl(url?: string | null): string {
  if (!url) return '/placeholder.svg'
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) {
    return url
  }
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://backr.test/api/v1'
  const apiBase = apiUrl.replace(/\/api\/v1\/?$/, '').replace(/\/api\/?$/, '')
  const cleanUrl = url.startsWith('/') ? url : `/${url}`
  return `${apiBase}${cleanUrl}`
}
