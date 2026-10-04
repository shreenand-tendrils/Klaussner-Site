import {Media} from '~/components/ui/Media';
import {CmsLink} from '~/components/ui/CmsLink';
import {SectionHeading, SectionShell} from '~/components/ui/SectionShell';

const TEMPLATES = {equal: '1fr 1fr 1fr', 'wide-center': '1fr 1.6fr 1fr', 'wide-sides': '1.4fr 1fr 1.4fr'};

function Col({c, pos}) {
  if (!c) return null;
  const has = c.image || c.videoUrl || c.heading || c.text || (c.buttonLabel && c.buttonUrl);
  if (!has) return <div className="grid [gap:1rem] [align-content:start] [&_h3]:[margin:0] [&_p]:[margin:0] [&_p]:[color:var(--color-muted)] [.sec--green_&_p]:[color:#d6e0cf] [.sec--dark_&_p]:[color:#d6e0cf]" aria-hidden="true" />;
  return (
    <div className={`grid [gap:1rem] [align-content:start] [&_h3]:[margin:0] [&_p]:[margin:0] [&_p]:[color:var(--color-muted)] [.sec--green_&_p]:[color:#d6e0cf] [.sec--dark_&_p]:[color:#d6e0cf] cols3__col--${c.align || pos} ${({'center':'text-center [justify-items:center]','right':'text-right [justify-items:end]'})[c.align || pos]??''}`}>
      <Media className="[width:100%] [aspect-ratio:4/3] [border-radius:var(--radius-lg)]" image={c.image} videoUrl={c.videoUrl} alt={c.imageAlt || c.heading || ''} />
      {c.heading && <h3>{c.heading}</h3>}
      {c.text && <p>{c.text}</p>}
      {c.buttonLabel && c.buttonUrl && <CmsLink to={c.buttonUrl} className="inline-flex items-center justify-center [padding:.9rem_1.8rem] [border:1px_solid_var(--green-800)] [border-radius:var(--radius-btn)] [background:var(--green-800)] [color:#fff] [font:inherit] [font-size:.78rem] [letter-spacing:.12em] uppercase cursor-pointer [transition:var(--transition)] [&:hover]:[background:var(--green-700)] [&:hover]:[border-color:var(--green-700)] [&[disabled]]:[opacity:.4] [&[disabled]]:pointer-events-none [.hero__cta_&]:[padding:.9rem_2.2rem] [.sec--green_&:not(.btn--ghost)]:[background:#fff] [.sec--green_&:not(.btn--ghost)]:[color:var(--green-900)] [.sec--green_&:not(.btn--ghost)]:[border-color:#fff] [.sec--dark_&:not(.btn--ghost)]:[background:#fff] [.sec--dark_&:not(.btn--ghost)]:[color:var(--green-900)] [.sec--dark_&:not(.btn--ghost)]:[border-color:#fff] [.ibanner_&:not(.btn--ghost)]:[background:#fff] [.ibanner_&:not(.btn--ghost)]:[color:var(--green-900)] [.ibanner_&:not(.btn--ghost)]:[border-color:#fff]">{c.buttonLabel}</CmsLink>}
    </div>
  );
}

/** Left · Center · Right. Each column independently: image OR video, heading, text, redirect button. Stacks on mobile. */
export function ThreeColumnSection({eyebrow, heading, intro, left, center, right, layout = 'equal', valign = 'center', theme = 'light', anchorId}) {
  return (
    <SectionShell theme={theme} width="wide" anchorId={anchorId}>
      <SectionHeading eyebrow={eyebrow} heading={heading} intro={intro} align="center" />
      <div className="grid [gap:2.5rem_2rem] [align-items:var(--cols-valign,center)] min-[900px]:[grid-template-columns:var(--cols-tpl,1fr_1fr_1fr)] min-[900px]:[gap:3rem]" style={{'--cols-tpl': TEMPLATES[layout] ?? TEMPLATES.equal, '--cols-valign': valign}}>
        <Col c={left} pos="left" /><Col c={center} pos="center" /><Col c={right} pos="right" />
      </div>
    </SectionShell>
  );
}
