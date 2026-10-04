import {SectionShell} from '~/components/ui/SectionShell';

/** Free-form article text from Sanity's rich-text editor (trusted CMS content). */
export function RichText({html, width = 'narrow', theme = 'light', anchorId}) {
  return (
    <SectionShell theme={theme} anchorId={anchorId}>
      <div className={`[max-width:72ch] mx-auto [&_h2]:[margin-top:2rem] [&_h3]:[margin-top:2rem] [&_a]:[color:var(--green-700)] [&_a]:underline [&_a]:[text-underline-offset:3px] [&_img]:[border-radius:var(--radius-md)] [&_img]:[margin-block:1.5rem] prose--${width} ${({'wide':'[max-width:none]!'})[width]??''}`} dangerouslySetInnerHTML={{__html: html || ''}} />
    </SectionShell>
  );
}
