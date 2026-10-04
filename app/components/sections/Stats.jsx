import {SectionShell, SectionHeading} from '~/components/ui/SectionShell';

export function Stats({eyebrow, heading, items = [], theme = 'green', anchorId}) {
  return (
    <SectionShell theme={theme} pad="sm" anchorId={anchorId}>
      <SectionHeading eyebrow={eyebrow} heading={heading} align="center" />
      <dl className="grid [gap:var(--space-6)] [grid-template-columns:repeat(2,1fr)] [margin:0] text-center min-[900px]:[grid-template-columns:repeat(4,1fr)] [&_dd]:[margin:0] [&_dd]:[font-family:var(--font-display)] [&_dd]:[font-size:clamp(2.2rem,4vw,3.4rem)] [&_dd]:[line-height:1] [&_dt]:[margin-top:.4rem] [&_dt]:[font-size:.85rem] [&_dt]:[letter-spacing:.08em] [&_dt]:uppercase [&_dt]:[color:var(--green-200)]">
        {items.map((s, i) => <div key={i}><dd>{s.value}</dd><dt>{s.label}</dt></div>)}
      </dl>
    </SectionShell>
  );
}
