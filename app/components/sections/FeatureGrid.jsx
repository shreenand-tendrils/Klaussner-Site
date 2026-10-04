import {Link} from 'react-router';
import {Media} from '~/components/ui/Media';
import {SectionShell, SectionHeading} from '~/components/ui/SectionShell';

export function FeatureGrid({eyebrow, heading, intro, items = [], columns = '3', theme = 'light', align = 'left', anchorId}) {
  return (
    <SectionShell theme={theme} anchorId={anchorId}>
      <SectionHeading eyebrow={eyebrow} heading={heading} intro={intro} align={align} />
      <div className={`grid [gap:var(--space-8)_var(--space-6)] [grid-template-columns:1fr] features--${columns} ${({2:'min-[640px]:[grid-template-columns:repeat(2,1fr)]!',3:'min-[640px]:[grid-template-columns:repeat(2,1fr)]! min-[1000px]:[grid-template-columns:repeat(3,1fr)]!',4:'min-[640px]:[grid-template-columns:repeat(2,1fr)]! min-[1000px]:[grid-template-columns:repeat(4,1fr)]!','center':'text-center'})[columns]??''} features--${align} ${({2:'min-[640px]:[grid-template-columns:repeat(2,1fr)]!',3:'min-[640px]:[grid-template-columns:repeat(2,1fr)]! min-[1000px]:[grid-template-columns:repeat(3,1fr)]!',4:'min-[640px]:[grid-template-columns:repeat(2,1fr)]! min-[1000px]:[grid-template-columns:repeat(4,1fr)]!','center':'text-center'})[align]??''}`}>
        {items.map((it, i) => (
          <article className="[background:rgba(255,255,255,.7)] [border:1px_solid_var(--color-line)] [border-radius:var(--radius-lg)] [padding:1.5rem] [.sec--green_&]:[background:rgba(255,255,255,.06)] [.sec--green_&]:[border-color:rgba(255,255,255,.14)] [.sec--dark_&]:[background:rgba(255,255,255,.06)] [.sec--dark_&]:[border-color:rgba(255,255,255,.14)] [&_p]:[margin:0_0_.75rem] [&_p]:[color:var(--color-muted)] [.sec--green_&_p]:[color:#cdd8c6] [.sec--dark_&_p]:[color:#cdd8c6]" key={i}>
            {(it.image || it.videoUrl) ? <Media className="[aspect-ratio:3/2] [border-radius:var(--radius-md)] [margin-bottom:1rem]" image={it.image} videoUrl={it.videoUrl} alt={it.title} /> : it.icon ? <span className="inline-grid place-items-center [width:3rem] [height:3rem] [border-radius:var(--radius-md)] [background:var(--green-100)] [font-size:1.4rem] [margin-bottom:1rem]" aria-hidden="true">{it.icon}</span> : null}
            {it.title && <h3>{it.title}</h3>}
            {it.text && <p>{it.text}</p>}
            {it.linkLabel && it.linkUrl && <Link className="[font-size:.85rem] [font-weight:600] [color:var(--green-700)] [.sec--green_&]:[color:var(--green-400)] [.sec--dark_&]:[color:var(--green-400)]" to={it.linkUrl}>{it.linkLabel} →</Link>}
          </article>
        ))}
      </div>
    </SectionShell>
  );
}
