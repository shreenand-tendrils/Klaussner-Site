import {Media} from '~/components/ui/Media';
import {CmsLink} from '~/components/ui/CmsLink';
import {SectionHeading, SectionShell} from '~/components/ui/SectionShell';

function Item({m}) {
  if (!m || (!m.image && !m.videoUrl)) return null;
  return (
    <figure className="[margin:0] grid [gap:.75rem] [align-content:start]">
      <Media className="[width:100%] [aspect-ratio:var(--duo-ratio,4/3)] [border-radius:var(--radius-lg)] [object-fit:cover]" image={m.image} videoUrl={m.videoUrl} alt={m.caption || ''} />
      {m.caption && <figcaption>{m.caption}</figcaption>}
      {m.buttonLabel && m.buttonUrl && <CmsLink to={m.buttonUrl} className="inline-flex items-center justify-center [padding:.9rem_1.8rem] [border:1px_solid_var(--green-800)] [border-radius:var(--radius-btn)] [background:var(--green-800)] [color:#fff] [font:inherit] [font-size:.78rem] [letter-spacing:.12em] uppercase cursor-pointer [transition:var(--transition)] [&:hover]:[background:var(--green-700)] [&:hover]:[border-color:var(--green-700)] [&[disabled]]:[opacity:.4] [&[disabled]]:pointer-events-none [.hero__cta_&]:[padding:.9rem_2.2rem] [.sec--green_&:not(.btn--ghost)]:[background:#fff] [.sec--green_&:not(.btn--ghost)]:[color:var(--green-900)] [.sec--green_&:not(.btn--ghost)]:[border-color:#fff] [.sec--dark_&:not(.btn--ghost)]:[background:#fff] [.sec--dark_&:not(.btn--ghost)]:[color:var(--green-900)] [.sec--dark_&:not(.btn--ghost)]:[border-color:#fff] [.ibanner_&:not(.btn--ghost)]:[background:#fff] [.ibanner_&:not(.btn--ghost)]:[color:var(--green-900)] [.ibanner_&:not(.btn--ghost)]:[border-color:#fff] [background:transparent]! [color:var(--green-800)]! [&:hover]:[background:var(--green-800)]! [&:hover]:[color:#fff]! [&:hover]:[border-color:var(--green-800)]! [.sec--green_&]:[color:#fff]! [.sec--green_&]:[border-color:rgba(255,255,255,.5)]! [.sec--dark_&]:[color:#fff]! [.sec--dark_&]:[border-color:rgba(255,255,255,.5)]! [.ibanner_&]:[color:#fff]! [.ibanner_&]:[border-color:rgba(255,255,255,.6)]! btn--ghost">{m.buttonLabel}</CmsLink>}
    </figure>
  );
}

/** Two media blocks side by side — e.g. video on the left, image on the right (or any mix). */
export function SplitMediaSection({eyebrow, heading, intro, left, right, ratio = '4/3', theme = 'light', anchorId}) {
  return (
    <SectionShell theme={theme} width="wide" anchorId={anchorId}>
      <SectionHeading eyebrow={eyebrow} heading={heading} intro={intro} />
      <div className="grid [gap:1.25rem] [&_figcaption]:[font-size:.9rem] [&_figcaption]:[color:var(--color-muted)] min-[800px]:[grid-template-columns:1fr_1fr] min-[800px]:[gap:2rem]" style={{'--duo-ratio': ratio}}><Item m={left} /><Item m={right} /></div>
    </SectionShell>
  );
}
