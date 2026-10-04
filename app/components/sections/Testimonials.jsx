import {Media} from '~/components/ui/Media';
import {SectionShell, SectionHeading} from '~/components/ui/SectionShell';

export function Testimonials({eyebrow = 'Reviews', heading = 'Loved in homes everywhere', items = [], theme = 'sand', anchorId}) {
  return (
    <SectionShell theme={theme} anchorId={anchorId}>
      <SectionHeading eyebrow={eyebrow} heading={heading} align="center" />
      <div className="grid [gap:var(--space-6)] min-[900px]:[grid-template-columns:repeat(3,1fr)]">
        {items.map((t, i) => (
          <figure className="[margin:0] [background:#fff] [border:1px_solid_var(--color-line)] [border-radius:var(--radius-lg)] [padding:1.75rem] [&_blockquote]:[margin:0_0_1.25rem] [&_blockquote]:[font-family:var(--font-display)] [&_blockquote]:[font-size:1.35rem] [&_blockquote]:[line-height:1.35] [&_figcaption]:flex [&_figcaption]:items-center [&_figcaption]:[gap:.75rem] [&_figcaption]:[font-size:.9rem] [&_small]:block [&_small]:[color:var(--color-muted)]" key={i}>
            <blockquote>{t.quote}</blockquote>
            <figcaption>
              {t.image && <Media className="[width:44px] [height:44px] [border-radius:50%]" image={t.image} alt={t.name} />}
              <span><strong>{t.name}</strong>{t.role && <small>{t.role}</small>}</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </SectionShell>
  );
}
