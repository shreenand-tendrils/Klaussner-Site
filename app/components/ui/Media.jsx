/** Image OR video. Video wins when `videoUrl` is set; `image` doubles as poster. */
export function Media({image, videoUrl, alt = '', className = '', eager = false}) {
  if (videoUrl) {
    return (
      <video className={`[width:100%] [height:100%] [object-fit:cover] ${className}`} autoPlay muted loop playsInline preload="metadata" poster={image || undefined} aria-label={alt || undefined}>
        <source src={videoUrl} />
      </video>
    );
  }
  if (!image) return null;
  return <img className={`[width:100%] [height:100%] [object-fit:cover] ${className}`} src={image} alt={alt} loading={eager ? 'eager' : 'lazy'} />;
}
