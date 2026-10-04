import {Link} from 'react-router';
import {CollectionGrid} from '~/components/collection/CollectionGrid';
import {useCommerce} from '~/components/cms/CommerceContext';
import {SectionShell, SectionHeading} from '~/components/ui/SectionShell';

export function CollectionShelf({eyebrow, heading = 'Shop by room', limit = 4, linkLabel = 'All collections', theme = 'light', collections: passed}) {
  const ctx = useCommerce();
  const list = (passed ?? ctx.collections ?? []).slice(0, Number(limit) || 4);
  return (
    <SectionShell theme={theme}>
      <div className="flex justify-between items-end [margin-bottom:var(--space-8)] [gap:1rem] [&>a]:[font-size:.85rem] [&>a]:underline [&>a]:[text-underline-offset:5px] [&>a]:[color:var(--green-700)] section-head"><SectionHeading eyebrow={eyebrow} heading={heading} />{linkLabel && <Link to="/collections">{linkLabel}</Link>}</div>
      <CollectionGrid collections={list} />
    </SectionShell>
  );
}
