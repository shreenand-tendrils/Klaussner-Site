import {Link} from 'react-router';
import {Media} from '~/components/ui/Media';
import {SectionButtons} from '~/components/ui/CmsLink';

export function Hero({
  badge = 'Klaussner Home Furnishings',
  heading = 'Modern Living, Tailored for You',
  subheading = 'Discover handcrafted sofas, sectionals, and recliners designed for timeless comfort.',
  videoUrl,
  image,
  ctaLabel,
  ctaUrl,
  secondaryCtaLabel,
  secondaryCtaUrl,
  size = 'full', // full | medium | compact
  align = 'left', // left | center
  buttons, // CMS list of extra buttons
}) {
  return (
    <section className={`relative flex [align-items:flex-end] [color:#fff] overflow-hidden [background:var(--green-950)] [min-height:100svh] [&_h1]:[font-size:clamp(2.5rem,4.5vw,4.2rem)] [&_h1]:[font-weight:400] [&_h1]:[line-height:1.12] [&_h1]:[margin-bottom:1.2rem] [&_p]:[font-size:clamp(1rem,1.2vw,1.15rem)] [&_p]:[color:#dde5d8] [&_p]:[margin:0_0_2rem] [&_p]:[line-height:1.55] [&_p]:[max-width:55ch] hero--${size} ${({'medium':'[min-height:min(72svh,700px)]!','compact':'[min-height:min(52svh,520px)]!'})[size]??''} hero--${align} ${({'medium':'[min-height:min(72svh,700px)]!','compact':'[min-height:min(52svh,520px)]!'})[align]??''}`}>
      <Media className="absolute [inset:0] [filter:brightness(.72)]" image={image} videoUrl={videoUrl} eager />
      <div className="absolute [inset:0] [background:linear-gradient(to_top,rgba(10,26,16,.85),rgba(10,26,16,.28)_45%,rgba(10,26,16,.1))]" />
      <div className="relative [z-index:2] [padding-block:5rem] mx-auto w-[min(100%_-_2*var(--gutter),var(--container))] w-[min(100%_-_2*var(--gutter),var(--container-wide))]!">
        <div className="[max-width:700px] [.hero--center_&]:mx-auto [.hero--center_&]:text-center">
          {badge && <span className="inline-block [background:var(--green-500)] [color:#fff] [padding:.3rem_.85rem] [font-size:.7rem] [letter-spacing:.25em] uppercase [font-weight:600] [border-radius:999px] [margin-bottom:1rem]">{badge}</span>}
          <h1>{heading}</h1>
          {subheading && <p>{subheading}</p>}
          <div className="[.hero--center_&]:justify-center flex [gap:1rem] flex-wrap hero__cta">
            {ctaLabel && ctaUrl && <Link to={ctaUrl} className="inline-flex items-center justify-center [padding:.9rem_1.8rem] [border:1px_solid_var(--green-800)] [border-radius:var(--radius-btn)] [background:var(--green-800)] [color:#fff] [font:inherit] [font-size:.78rem] [letter-spacing:.12em] uppercase cursor-pointer [transition:var(--transition)] [&:hover]:[background:var(--green-700)] [&:hover]:[border-color:var(--green-700)] [&[disabled]]:[opacity:.4] [&[disabled]]:pointer-events-none [.hero__cta_&]:[padding:.9rem_2.2rem] [.sec--green_&:not(.btn--ghost)]:[background:#fff] [.sec--green_&:not(.btn--ghost)]:[color:var(--green-900)] [.sec--green_&:not(.btn--ghost)]:[border-color:#fff] [.sec--dark_&:not(.btn--ghost)]:[background:#fff] [.sec--dark_&:not(.btn--ghost)]:[color:var(--green-900)] [.sec--dark_&:not(.btn--ghost)]:[border-color:#fff] [.ibanner_&:not(.btn--ghost)]:[background:#fff] [.ibanner_&:not(.btn--ghost)]:[color:var(--green-900)] [.ibanner_&:not(.btn--ghost)]:[border-color:#fff] [background:#fff]! [color:var(--green-900)]! [border-color:#fff]! [&:hover]:[background:var(--green-100)]! [&:hover]:[border-color:var(--green-100)]!">{ctaLabel}</Link>}
            {secondaryCtaLabel && secondaryCtaUrl && <Link to={secondaryCtaUrl} className="inline-flex items-center justify-center [padding:.9rem_1.8rem] [border:1px_solid_var(--green-800)] [border-radius:var(--radius-btn)] [background:var(--green-800)] [color:#fff] [font:inherit] [font-size:.78rem] [letter-spacing:.12em] uppercase cursor-pointer [transition:var(--transition)] [&:hover]:[background:var(--green-700)] [&:hover]:[border-color:var(--green-700)] [&[disabled]]:[opacity:.4] [&[disabled]]:pointer-events-none [.hero__cta_&]:[padding:.9rem_2.2rem] [.sec--green_&:not(.btn--ghost)]:[background:#fff] [.sec--green_&:not(.btn--ghost)]:[color:var(--green-900)] [.sec--green_&:not(.btn--ghost)]:[border-color:#fff] [.sec--dark_&:not(.btn--ghost)]:[background:#fff] [.sec--dark_&:not(.btn--ghost)]:[color:var(--green-900)] [.sec--dark_&:not(.btn--ghost)]:[border-color:#fff] [.ibanner_&:not(.btn--ghost)]:[background:#fff] [.ibanner_&:not(.btn--ghost)]:[color:var(--green-900)] [.ibanner_&:not(.btn--ghost)]:[border-color:#fff] [background:rgba(255,255,255,.1)]! [color:#fff]! [border-color:rgba(255,255,255,.45)]! [-webkit-backdrop-filter:blur(8px)] [backdrop-filter:blur(8px)] [&:hover]:[background:rgba(255,255,255,.22)]! [&:hover]:[border-color:#fff]!">{secondaryCtaLabel}</Link>}
          </div>
          <SectionButtons buttons={buttons} align={align} />
        </div>
      </div>
    </section>
  );
}
