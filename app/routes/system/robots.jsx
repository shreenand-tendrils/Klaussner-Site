export function loader({request}) {
  const {origin} = new URL(request.url);
  return new Response(`User-agent: *\nDisallow: /cart\nDisallow: /account\nDisallow: /search\nDisallow: /studio\nSitemap: ${origin}/sitemap.xml\n`,
    {headers: {'Content-Type': 'text/plain', 'Cache-Control': 'public, max-age=3600'}});
}