import {Media} from '~/components/ui/Media';
import {SectionButtons} from '~/components/ui/CmsLink';

const HEIGHTS = {compact: '36vh', medium: '56vh', tall: '78vh'};

/** Full-width image/video banner with text on the left, center or right. */
export function ImageBanner({image, videoUrl, eyebrow, heading, text, textSide = 'left', height = 'medium', shade = 40, buttons}) {
  return (
    <section className={`relative flex items-center overflow-hidden [color:#fff] [min-height:var(--ib-h,60vh)] [&_h2]:[margin:0] [&_h2]:[color:#fff] [&_p]:[margin:0] [&_p]:[color:#e9efe3] ibanner ibanner--${textSide}`} style={{'--ib-h': HEIGHTS[height] ?? HEIGHTS.medium, '--ib-shade': Math.min(Math.max(Number(shade) || 0, 0), 90) / 100}}>
      <Media className="absolute [inset:0] [width:100%] [height:100%] [object-fit:cover]" image={image} videoUrl={videoUrl} alt="" />
      <div className="absolute [inset:0] [background:#0a1a10] [opacity:var(--ib-shade,.4)]" />
      <div className="relative [width:100%] [padding-block:var(--section-y)] flex [.ibanner--center_&]:justify-center [.ibanner--center_&]:text-center [.ibanner--right_&]:justify-end [.ibanner--right_&]:text-right mx-auto w-[min(100%_-_2*var(--gutter),var(--container))] w-[min(100%_-_2*var(--gutter),var(--container-wide))]!">
        <div className="[max-width:34rem] grid [gap:1rem] [justify-items:start] [.ibanner--center_&]:[justify-items:center] [.ibanner--right_&]:[justify-items:end]">
          {eyebrow && <p className="[font-size:.72rem] [letter-spacing:.18em] uppercase [color:var(--green-700)] [font-weight:600] [margin:0_0_var(--space-3)] [.sec--green_&]:[color:var(--green-400)] [.sec--dark_&]:[color:var(--green-400)] [.pdp__eyebrow-row_&]:[margin:0]">{eyebrow}</p>}
          {heading && <h2>{heading}</h2>}
          {text && <p>{text}</p>}
          <SectionButtons buttons={buttons} align={textSide} />
        </div>
      </div>
    </section>
  );
}
