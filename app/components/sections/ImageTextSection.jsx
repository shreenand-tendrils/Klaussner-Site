import {Link} from 'react-router';
import {Media} from '~/components/ui/Media';
import {SectionShell} from '~/components/ui/SectionShell';

/** Left/right split: media + text. Works as "image left", "image right", or video. */
export function ImageTextSection({
  eyebrow = 'Our craft',
  heading = 'Made slowly, made to stay',
  body = 'Every frame is kiln-dried, every cushion hand-tailored. This is furniture designed to be passed along.',
  bullets = [],
  image,
  videoUrl = '/videos/klaussner-hero.mp4',
  imageAlt = 'Craft detail',
  imageSide = 'left',
  ctaLabel = 'Material Stories',
  ctaUrl = '/material-stories',
  secondaryCtaLabel,
  secondaryCtaUrl,
  theme = 'light',
  anchorId,
}) {
  return (
    <SectionShell theme={theme} anchorId={anchorId}>
      <div className={`grid [gap:2rem] items-center min-[900px]:[grid-template-columns:1fr_1fr] min-[900px]:[gap:5rem] ${imageSide === 'right' ? 'split--right' : ''}`}>
        <Media className="[aspect-ratio:4/3] [border-radius:var(--radius-lg)] min-[900px]:[.split--right_&]:[order:2]" image={image} videoUrl={videoUrl} alt={imageAlt} />
        <div className="split__text">
          {eyebrow && <p className="[font-size:.72rem] [letter-spacing:.18em] uppercase [color:var(--green-700)] [font-weight:600] [margin:0_0_var(--space-3)] [.sec--green_&]:[color:var(--green-400)] [.sec--dark_&]:[color:var(--green-400)] [.pdp__eyebrow-row_&]:[margin:0]">{eyebrow}</p>}
          <h2>{heading}</h2>
          {body && <p className="[.sec--green_&]:[color:#d6e0cf] [.sec--dark_&]:[color:#c3cfbd] [color:var(--color-muted)] [margin:0_0_var(--space-6)]">{body}</p>}
          {bullets?.length > 0 && (
            <ul className={`[list-style:none] [padding:0] [margin:0_0_var(--space-6)] grid [gap:.5rem] [&_li]:[padding-left:1.6rem] [&_li]:relative [&_li::before]:[content:''] [&_li::before]:absolute [&_li::before]:[left:0] [&_li::before]:[top:.55em] [&_li::before]:[width:.7rem] [&_li::before]:[height:.7rem] [&_li::before]:[border-radius:50%] [&_li::before]:[background:var(--green-500)]`}>{bullets.map((b, i) => <li key={i}>{b.text ?? b}</li>)}</ul>
          )}
          {(ctaLabel || secondaryCtaLabel) && (
            <div className="flex [gap:.75rem] flex-wrap">
              {ctaLabel && <Link className="inline-flex items-center justify-center [padding:.9rem_1.8rem] [border:1px_solid_var(--green-800)] [border-radius:var(--radius-btn)] [background:var(--green-800)] [color:#fff] [font:inherit] [font-size:.78rem] [letter-spacing:.12em] uppercase cursor-pointer [transition:var(--transition)] [&:hover]:[background:var(--green-700)] [&:hover]:[border-color:var(--green-700)] [&[disabled]]:[opacity:.4] [&[disabled]]:pointer-events-none" to={ctaUrl}>{ctaLabel}</Link>}
              {secondaryCtaLabel && secondaryCtaUrl && <Link className="inline-flex items-center justify-center [padding:.9rem_1.8rem] [border:1px_solid_var(--green-800)] [border-radius:var(--radius-btn)] [background:transparent] [color:var(--green-800)] [font:inherit] [font-size:.78rem] [letter-spacing:.12em] uppercase cursor-pointer [transition:var(--transition)] hover:bg-[var(--green-800)] hover:text-white" to={secondaryCtaUrl}>{secondaryCtaLabel}</Link>}
            </div>
          )}
        </div>
      </div>
    </SectionShell>
  );
}