import {defineType} from 'sanity';

// ── field helpers (compact) ──────────────────────────────────────────────────
const f = (name, type, extra = {}) => ({name, type, ...extra});
const text = (n, e) => f(n, 'string', e);
const long = (n, e) => f(n, 'text', {rows: 3, ...e});
const url = (n) => f(n, 'string', {description: 'Page path (/offers, /collections/x) or full https:// link', validation: (R) => R.uri({allowRelative: true, scheme: ['http', 'https', 'mailto', 'tel']})});
const num = (n, initialValue) => f(n, 'number', {initialValue});
const bool = (n) => f(n, 'boolean', {initialValue: false});
const choice = (n, list, initialValue = list[0]) => f(n, 'string', {options: {list, layout: 'radio'}, initialValue});
const image = (n = 'image') => f(n, 'image', {options: {hotspot: true}});
const video = () => f('video', 'file', {title: 'Video (mp4/webm)', options: {accept: 'video/mp4,video/webm'}});
const list = (n, fields, e = {}) => f(n, 'array', {of: [{type: 'object', fields}], ...e});
const obj = (n, fields) => f(n, 'object', {fields});
const theme = (d = 'light') => choice('theme', ['light', 'sand', 'green', 'dark'], d);
const anchor = text('anchorId', {description: 'Optional #id so menus can link to this section'});
const head = [text('eyebrow'), text('heading'), long('intro')];
const buttons = list('buttons', [text('label'), url('url'), choice('style', ['solid', 'outline'])], {description: 'Optional buttons that redirect anywhere'});
const mediaCol = (extra = []) => [image(), video(), text('imageAlt'), text('heading'), long('text'), text('buttonLabel'), url('buttonUrl'), ...extra];
const duoItem = [image(), video(), text('caption'), text('buttonLabel'), url('buttonUrl')];
const ratio = choice('ratio', ['4/3', '1/1', '3/4', '16/9']);
const align = choice('align', ['left', 'center']);

// Same names + fields as before, so every React section keeps working unchanged.
const SPEC = {
  Hero: [text('badge', {initialValue: 'Klaussner Home Furnishings'}), text('heading'), long('subheading'), image(), video(), text('ctaLabel'), url('ctaUrl'), text('secondaryCtaLabel'), url('secondaryCtaUrl'), choice('size', ['full', 'medium', 'compact']), align, buttons],
  ImageTextSection: [text('eyebrow'), text('heading'), long('body'), list('bullets', [text('text')]), image(), video(), text('imageAlt'), choice('imageSide', ['left', 'right']), text('ctaLabel'), url('ctaUrl'), text('secondaryCtaLabel'), url('secondaryCtaUrl'), theme(), anchor, buttons],
  FeatureGrid: [...head, choice('columns', ['2', '3', '4'], '3'), align, list('items', [text('icon', {description: 'Emoji or short symbol'}), image(), video(), text('title'), long('text'), text('linkLabel'), url('linkUrl')]), theme(), anchor, buttons],
  FAQ: [...head, list('items', [text('question'), long('answer')]), theme(), anchor, buttons],
  MediaGallery: [...head, choice('columns', ['2', '3', '4'], '3'), ratio, list('items', [image(), video(), text('caption')]), theme(), anchor, buttons],
  VideoSection: [...head, video(), text('embedUrl', {description: 'YouTube or Vimeo link (used instead of the uploaded file)'}), image('poster'), text('caption'), choice('width', ['container', 'wide', 'full']), theme(), anchor, buttons],
  Testimonials: [text('eyebrow'), text('heading'), list('items', [long('quote'), text('name'), text('role'), image()]), theme('sand'), anchor, buttons],
  Stats: [text('eyebrow'), text('heading'), list('items', [text('value'), text('label')]), theme('green'), anchor, buttons],
  RichText: [f('body', 'array', {of: [{type: 'block'}]}), choice('width', ['narrow', 'wide']), theme(), anchor, buttons],
  Banner: [text('text'), text('linkLabel'), url('linkUrl'), choice('theme', ['green', 'dark', 'sand'])],
  Spacer: [num('height', 48), bool('showLine')],
  DesignYourRoomCTA: [text('heading'), long('body'), text('ctaLabel'), url('ctaUrl'), image(), video()],
  Newsletter: [text('heading'), long('body'), theme('sand'), buttons],
  CollectionShelf: [text('eyebrow'), text('heading', {initialValue: 'Shop by room'}), num('limit', 4), text('linkLabel', {initialValue: 'All collections'}), theme(), buttons],
  ProductShelf: [text('eyebrow'), text('heading', {initialValue: 'Featured'}), text('collectionHandle', {description: 'Shopify collection handle, e.g. living-room. Blank = featured products.'}), num('limit', 4), text('linkLabel'), theme(), buttons],
  ThreeColumnSection: [...head, obj('left', mediaCol([choice('align', ['left', 'center', 'right'])])), obj('center', mediaCol([choice('align', ['center', 'left', 'right'])])), obj('right', mediaCol([choice('align', ['right', 'left', 'center'])])), choice('layout', ['equal', 'wide-center', 'wide-sides']), choice('valign', ['center', 'start', 'end']), theme(), anchor, buttons],
  SplitMediaSection: [...head, obj('left', duoItem), obj('right', duoItem), ratio, theme(), anchor, buttons],
  ImageBanner: [image(), video(), text('eyebrow'), text('heading'), long('text'), choice('textSide', ['left', 'center', 'right']), choice('height', ['compact', 'medium', 'tall']), num('shade', 40), buttons],
};

export const blockTypes = Object.entries(SPEC).map(([name, fields]) =>
  defineType({
    name, title: name.replace(/([a-z])([A-Z])/g, '$1 $2'), type: 'object', fields,
    preview: {select: {t: 'heading', t2: 'text', t3: 'question'}, prepare: ({t, t2}) => ({title: t || t2 || name, subtitle: name})},
  }),
);
export const blockNames = Object.keys(SPEC);
