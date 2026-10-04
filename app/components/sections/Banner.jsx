import {Link} from 'react-router';

/** Slim announcement / promo strip. */
export function Banner({text, linkLabel, linkUrl, theme = 'green'}) {
  if (!text) return null;
  return (
    <div className={`[padding:.6rem_var(--gutter)] text-center [font-size:.85rem] [&_p]:[margin:0] [&_a]:underline [&_a]:[text-underline-offset:3px] [&_a]:[font-weight:600] [&.sec--sand]:[color:var(--color-ink)] sec--${theme} ${({'pad-none':'[padding-block:0]!','pad-sm':'[padding-block:calc(var(--section-y)/2)]!','pad-lg':'[padding-block:calc(var(--section-y)*1.4)]!','sand':'[background:var(--color-sand)]','green':'[background:var(--green-800)] [color:#fff]','dark':'[background:var(--green-950)] [color:#fff]'})[theme]??''}`}>
      <p>{text}{linkLabel && linkUrl && <> <Link to={linkUrl}>{linkLabel}</Link></>}</p>
    </div>
  );
}
