import {SectionShell, SectionHeading} from '~/components/ui/SectionShell';

export function Faq({eyebrow = 'FAQ', heading = 'Frequently asked questions', intro, items = [], theme = 'light', anchorId}) {
  const ld = items.length ? JSON.stringify({
    '@context': 'https://schema.org', '@type': 'FAQPage',
    mainEntity: items.map((q) => ({'@type': 'Question', name: q.question, acceptedAnswer: {'@type': 'Answer', text: q.answer}})),
  }) : null;
  return (
    <SectionShell theme={theme} anchorId={anchorId}>
      <div className="grid [gap:2rem] [max-width:960px] mx-auto min-[900px]:[grid-template-columns:1fr_1.6fr] min-[900px]:[max-width:none] min-[900px]:[gap:5rem]">
        <SectionHeading eyebrow={eyebrow} heading={heading} intro={intro} />
        <div>
          {items.map((q, i) => (
            <details className={`[border:1px_solid_var(--color-line)] [border-radius:var(--radius-md)] [background:#fff] [padding:1rem_1.25rem] [margin-bottom:.75rem] [color:var(--color-ink)] [&_summary]:cursor-pointer [&_summary]:[font-weight:600] [&_summary]:[list-style:none] [&_summary]:flex [&_summary]:justify-between [&_summary]:[gap:1rem] [&_summary::after]:[content:'+'] [&_summary::after]:[color:var(--green-700)] [&_summary::after]:[font-size:1.3rem] [&_summary::after]:[line-height:1] [&[open]_summary::after]:[content:'–'] [&_p]:[margin:.75rem_0_0] [&_p]:[color:var(--color-muted)]`} key={i}>
              <summary>{q.question}</summary>
              <p>{q.answer}</p>
            </details>
          ))}
        </div>
      </div>
      {ld && <script type="application/ld+json" dangerouslySetInnerHTML={{__html: ld}} />}
    </SectionShell>
  );
}
