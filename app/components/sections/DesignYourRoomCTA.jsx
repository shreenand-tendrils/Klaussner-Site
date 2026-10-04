import {Link} from 'react-router';
import {Media} from '~/components/ui/Media';

export function DesignYourRoomCTA({
  heading = 'Design your room', body = 'Arrange our pieces in your space before you buy.',
  ctaLabel = 'Start designing', ctaUrl = '/design-your-room', image, videoUrl,
}) {
  return (
    <section className="[padding-block:var(--section-y)] relative [background:var(--green-800)] [color:#fff] text-center overflow-hidden [&_p]:[color:#dbe6d4] [&_p]:[max-width:55ch] [&_p]:[margin:0_auto_var(--space-6)]">
      {(image || videoUrl) && <Media className="absolute [inset:0] [opacity:.28]" image={image} videoUrl={videoUrl} />}
      <div className="mx-auto w-[min(100%_-_2*var(--gutter),var(--container))] relative">
        <h2>{heading}</h2>
        {body && <p>{body}</p>}
        {ctaLabel && <Link className="inline-flex items-center justify-center [padding:.9rem_1.8rem] [border:1px_solid_var(--green-800)] [border-radius:var(--radius-btn)] [background:var(--green-800)] [color:#fff] [font:inherit] [font-size:.78rem] [letter-spacing:.12em] uppercase cursor-pointer [transition:var(--transition)] [&:hover]:[background:var(--green-700)] [&:hover]:[border-color:var(--green-700)] [&[disabled]]:[opacity:.4] [&[disabled]]:pointer-events-none [.hero__cta_&]:[padding:.9rem_2.2rem] [.sec--green_&:not(.btn--ghost)]:[background:#fff] [.sec--green_&:not(.btn--ghost)]:[color:var(--green-900)] [.sec--green_&:not(.btn--ghost)]:[border-color:#fff] [.sec--dark_&:not(.btn--ghost)]:[background:#fff] [.sec--dark_&:not(.btn--ghost)]:[color:var(--green-900)] [.sec--dark_&:not(.btn--ghost)]:[border-color:#fff] [.ibanner_&:not(.btn--ghost)]:[background:#fff] [.ibanner_&:not(.btn--ghost)]:[color:var(--green-900)] [.ibanner_&:not(.btn--ghost)]:[border-color:#fff] [background:#fff]! [color:var(--green-900)]! [border-color:#fff]! [&:hover]:[background:var(--green-100)]! [&:hover]:[border-color:var(--green-100)]!" to={ctaUrl}>{ctaLabel}</Link>}
      </div>
    </section>
  );
}
