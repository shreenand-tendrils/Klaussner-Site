import {CommerceProvider} from '~/components/cms/CommerceContext';
import {cmsComponents} from '~/components/cms/registry';

/** Renders a Sanity entry (page or section). Shows `fallback` (coded UI) when there's no entry, so the site always renders. */
export function CmsSection({section, commerce}) {
  if (!section?._type) return null;
  const {_type, _key, ...props} = section;
  const C = cmsComponents[_type];
  if (!C) return null;
  return (
    <CommerceProvider value={commerce ?? {collections: [], products: []}}>
      <C key={_key} {...props} />
    </CommerceProvider>
  );
}

export function CmsContent({entry, fallback = null, commerce}) {
  if (!entry?.sections?.length) return fallback;
  return (
    <>
      {entry.sections.map((section) => (
        <CmsSection key={section._key} section={section} commerce={commerce} />
      ))}
    </>
  );
}
