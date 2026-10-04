import {useState} from 'react';
import {SectionShell} from '~/components/ui/SectionShell';

export function Newsletter({heading = 'Stay in the loop', body = 'New arrivals and design notes, occasionally.', theme = 'sand'}) {
  const [done, setDone] = useState(false);
  return (
    <SectionShell theme={theme} className="[&_form]:flex [&_form]:[gap:.5rem] [&_form]:[max-width:480px] [&_form]:mx-auto [&_input]:flex-1 [&_input]:[padding:.9rem] [&_input]:[border:1px_solid_var(--color-line)] [&_input]:[font:inherit] [&_input]:[background:#fff]">
      <div className="text-center [max-width:560px] mx-auto">
        <h2>{heading}</h2>
        <p className="[.sec--green_&]:[color:#d6e0cf] [.sec--dark_&]:[color:#c3cfbd] [color:var(--color-muted)] [margin:0_0_var(--space-6)]">{body}</p>
        {done ? <p role="status">Thank you — you're subscribed.</p> : (
          <form onSubmit={(e) => { e.preventDefault(); setDone(true); }}>
            <label className="absolute [left:-999px] [&:focus]:[left:1rem] [&:focus]:[top:1rem] [&:focus]:[z-index:100] [&:focus]:[background:#fff] [&:focus]:[padding:.5rem_1rem] [&:focus]:[border-radius:var(--radius-sm)]" htmlFor="nl">Email</label>
            <input id="nl" type="email" required placeholder="Email address" />
            <button className="inline-flex items-center justify-center [padding:.9rem_1.8rem] [border:1px_solid_var(--green-800)] [border-radius:var(--radius-btn)] [background:var(--green-800)] [color:#fff] [font:inherit] [font-size:.78rem] [letter-spacing:.12em] uppercase cursor-pointer [transition:var(--transition)] [&:hover]:[background:var(--green-700)] [&:hover]:[border-color:var(--green-700)] [&[disabled]]:[opacity:.4] [&[disabled]]:pointer-events-none [.hero__cta_&]:[padding:.9rem_2.2rem] [.sec--green_&:not(.btn--ghost)]:[background:#fff] [.sec--green_&:not(.btn--ghost)]:[color:var(--green-900)] [.sec--green_&:not(.btn--ghost)]:[border-color:#fff] [.sec--dark_&:not(.btn--ghost)]:[background:#fff] [.sec--dark_&:not(.btn--ghost)]:[color:var(--green-900)] [.sec--dark_&:not(.btn--ghost)]:[border-color:#fff] [.ibanner_&:not(.btn--ghost)]:[background:#fff] [.ibanner_&:not(.btn--ghost)]:[color:var(--green-900)] [.ibanner_&:not(.btn--ghost)]:[border-color:#fff]">Subscribe</button>
          </form>
        )}
      </div>
    </SectionShell>
  );
}
