import {createContext, useContext} from 'react';
import {SectionButtons} from '~/components/ui/CmsLink';

// Every CMS section gets a "buttons" field; the registry passes it down through this context
// so SectionShell can render it at the bottom of ANY section without touching each component.
export const ButtonsContext = createContext(null);

/**
 * Common wrapper for every CMS section.
 * theme: light | sand | green | dark   ·   width: container | wide | full   ·   pad: none | sm | md | lg
 */
export function SectionShell({theme = 'light', width = 'container', pad = 'md', anchorId, className = '', children}) {
  const buttons = useContext(ButtonsContext);
  return (
    <section id={anchorId || undefined} className={`[padding-block:var(--section-y)] sec--${theme} ${({'pad-none':'[padding-block:0]!','pad-sm':'[padding-block:calc(var(--section-y)/2)]!','pad-lg':'[padding-block:calc(var(--section-y)*1.4)]!','sand':'[background:var(--color-sand)]','green':'[background:var(--green-800)] [color:#fff]','dark':'[background:var(--green-950)] [color:#fff]'})[theme]??''} sec--pad-${pad} ${({'none':'[padding-block:0]!','sm':'[padding-block:calc(var(--section-y)/2)]!','lg':'[padding-block:calc(var(--section-y)*1.4)]!'})[pad]??''} ${className}`}>
      <div className={width === 'full' ? '' : width === 'wide' ? 'mx-auto w-[min(100%_-_2*var(--gutter),var(--container))] w-[min(100%_-_2*var(--gutter),var(--container-wide))]!' : 'mx-auto w-[min(100%_-_2*var(--gutter),var(--container))]'}>
        {children}
        <SectionButtons buttons={buttons} />
      </div>
    </section>
  );
}

export function SectionHeading({eyebrow, heading, intro, align = 'left'}) {
  if (!eyebrow && !heading && !intro) return null;
  return (
    <header className={`[max-width:62ch] [margin-bottom:var(--space-8)] [.section-head_&]:[margin-bottom:0] sec__head--${align} ${({'center':'mx-auto text-center'})[align]??''}`}>
      {eyebrow && <p className="[font-size:.72rem] [letter-spacing:.18em] uppercase [color:var(--green-700)] [font-weight:600] [margin:0_0_var(--space-3)] [.sec--green_&]:[color:var(--green-400)] [.sec--dark_&]:[color:var(--green-400)] [.pdp__eyebrow-row_&]:[margin:0]">{eyebrow}</p>}
      {heading && <h2>{heading}</h2>}
      {intro && <p className="[.sec--green_&]:[color:#d6e0cf] [.sec--dark_&]:[color:#c3cfbd] [color:var(--color-muted)] [margin:0_0_var(--space-6)]">{intro}</p>}
    </header>
  );
}
