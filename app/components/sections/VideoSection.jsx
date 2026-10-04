import {SectionShell, SectionHeading} from '~/components/ui/SectionShell';

// Turns YouTube / Vimeo page links into embed URLs. Anything else is rejected.
function toEmbed(url) {
  try {
    const u = new URL(url);
    const h = u.hostname.replace(/^www\./, '');
    if (h === 'youtu.be') return `https://www.youtube-nocookie.com/embed/${u.pathname.slice(1)}`;
    if (h === 'youtube.com' && u.searchParams.get('v')) return `https://www.youtube-nocookie.com/embed/${u.searchParams.get('v')}`;
    if (h === 'youtube.com' && u.pathname.startsWith('/embed/')) return `https://www.youtube-nocookie.com/embed/${u.pathname.split('/')[2]}`;
    if (h === 'vimeo.com' && /^\/\d+/.test(u.pathname)) return `https://player.vimeo.com/video/${u.pathname.split('/')[1]}`;
  } catch { /* invalid url */ }
  return null;
}

/** Either an uploaded video file (videoUrl) or a YouTube/Vimeo link (embedUrl). */
export function VideoSection({eyebrow, heading, intro, videoUrl, embedUrl, poster, caption, theme = 'light', width = 'container', anchorId}) {
  const embed = embedUrl ? toEmbed(embedUrl) : null;
  return (
    <SectionShell theme={theme} width={width} anchorId={anchorId}>
      <SectionHeading eyebrow={eyebrow} heading={heading} intro={intro} align="center" />
      <div className="[aspect-ratio:16/9] [border-radius:var(--radius-lg)] overflow-hidden [background:#000] [&_iframe]:[width:100%] [&_iframe]:[height:100%] [&_iframe]:[border:0] [&_iframe]:[object-fit:cover] [&_video]:[width:100%] [&_video]:[height:100%] [&_video]:[border:0] [&_video]:[object-fit:cover]">
        {embed ? (
          <iframe src={embed} title={heading || 'Video'} loading="lazy" allow="fullscreen; picture-in-picture" allowFullScreen referrerPolicy="strict-origin-when-cross-origin" />
        ) : videoUrl ? (
          <video controls playsInline preload="metadata" poster={poster || undefined}><source src={videoUrl} /></video>
        ) : null}
      </div>
      {caption && <p className="[font-size:.85rem] [color:var(--color-muted)] [margin-top:.5rem] text-center">{caption}</p>}
    </SectionShell>
  );
}
