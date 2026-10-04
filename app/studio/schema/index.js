import {defineType} from 'sanity';
import {blockNames, blockTypes} from './blocks';

const sections = {name: 'sections', title: 'Page sections (drag to reorder)', type: 'array', of: blockNames.map((type) => ({type}))};

export const page = defineType({
  name: 'page', title: 'Page', type: 'document',
  fields: [
    {name: 'title', type: 'string', validation: (R) => R.required()},
    {name: 'url', title: 'URL path', type: 'string', description: 'e.g. "/" for home, "/room-inspiration", "/offers"', validation: (R) => R.required().custom((v) => (v && !v.startsWith('/') ? 'Must start with /' : true))},
    {name: 'description', title: 'SEO description', type: 'text', rows: 2},
    sections,
    {name: 'showInNav', title: 'Show in navbar/footer', type: 'boolean', initialValue: false, group: 'nav'},
    {name: 'navLabel', type: 'string', hidden: ({document}) => !document?.showInNav, group: 'nav'},
    {name: 'navOrder', type: 'number', initialValue: 100, hidden: ({document}) => !document?.showInNav, group: 'nav'},
    {name: 'navPlacement', type: 'string', options: {list: ['header', 'footer', 'both'], layout: 'radio'}, initialValue: 'both', hidden: ({document}) => !document?.showInNav, group: 'nav'},
    {name: 'navStyle', type: 'string', options: {list: ['link', 'pill'], layout: 'radio'}, initialValue: 'link', hidden: ({document}) => !document?.showInNav, group: 'nav'},
  ],
  groups: [{name: 'nav', title: 'Navigation'}],
  preview: {select: {title: 'title', subtitle: 'url'}},
});

export const section = defineType({
  name: 'section', title: 'Reusable section', type: 'document',
  description: 'Slot-based blocks, e.g. home-hero, home-editorial, living-room-hero, living-room-content, {collection-handle}-hero/-content',
  fields: [
    {name: 'title', type: 'string'},
    {name: 'slot', type: 'string', description: 'e.g. home-hero, living-room-hero, sofas-content', validation: (R) => R.required()},
    sections,
  ],
  preview: {select: {title: 'title', subtitle: 'slot'}},
});

export const schemaTypes = [page, section, ...blockTypes];
