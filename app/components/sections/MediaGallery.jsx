import {Media} from '~/components/ui/Media';
import {SectionShell, SectionHeading} from '~/components/ui/SectionShell';

/** Grid of images and/or videos with captions. */
export function MediaGallery({eyebrow, heading, intro, items = [], columns = '3', ratio = '4/3', theme = 'light', anchorId}) {
  return (
    <SectionShell theme={theme} anchorId={anchorId}>
      <SectionHeading eyebrow={eyebrow} heading={heading} intro={intro} />
      <div className={`grid [gap:var(--space-4)] [grid-template-columns:repeat(2,1fr)] [&_figure]:[margin:0] [&_figcaption]:[font-size:.85rem] [&_figcaption]:[color:var(--color-muted)] [&_figcaption]:[margin-top:.5rem] gallery--${columns} ${({3:'min-[900px]:[grid-template-columns:repeat(3,1fr)]!',4:'min-[900px]:[grid-template-columns:repeat(4,1fr)]!','premium':'[min-width:0]'})[columns]??''}`} style={{'--ratio': ratio}}>
        {items.map((it, i) => (
          <figure key={i}>
            <Media className="[aspect-ratio:var(--ratio,4/3)] [border-radius:var(--radius-md)]" image={it.image} videoUrl={it.videoUrl} alt={it.caption || ''} />
            {it.caption && <figcaption>{it.caption}</figcaption>}
          </figure>
        ))}
      </div>
    </SectionShell>
  );
}
