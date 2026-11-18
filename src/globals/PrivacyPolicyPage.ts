import type { Field, GlobalConfig } from 'payload'
import { buildGlobalAccess } from '@/access'
import { getAppURL } from '@/lib/env'
import { DEFAULT_PRIVACY_POLICY as D } from '@/lib/privacy-policy/defaults'

const text = (name: string, label: string, defaultValue: string, maxLength = 240): Field => ({
  name, label, type: 'text', defaultValue, maxLength,
})
const paragraph = (name: string, label: string, defaultValue: string): Field => ({
  name, label, type: 'textarea', defaultValue,
})
const internalHref: Field = {
  name: 'buttonHref', label: 'Button link (internal path)', type: 'text',
  defaultValue: D.contact.buttonHref,
  validate: (value: unknown) =>
    typeof value === 'string' && /^\/(?!\/)[^\s]*$/.test(value)
      ? true : 'Enter a relative URL starting with one /, e.g. /reservation#contact',
}

export const PrivacyPolicyPage: GlobalConfig = {
  slug: 'privacy-policy-page',
  dbName: 'privacy_pol',
  label: 'Privacy Policy',
  access: buildGlobalAccess('privacy-policy-page'),
  admin: {
    group: 'Content',
    description: 'Edit, add, remove and reorder legal sections. Draft changes remain private until published.',
    preview: () => `${getAppURL()}/next/privacy-policy-preview`,
    livePreview: {
      url: () => `${getAppURL()}/privacy-policy`,
      breakpoints: [
        { label: 'Mobile', name: 'mobile', width: 390, height: 844 },
        { label: 'Tablet', name: 'tablet', width: 834, height: 1112 },
        { label: 'Desktop', name: 'desktop', width: 1440, height: 900 },
      ],
    },
  },
  versions: { max: 50, drafts: { autosave: { interval: 1000 } } },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Policy Sections',
          fields: [{
            name: 'sections', type: 'array', dbName: 'secs',
            label: 'Privacy Policy Sections',
            defaultValue: D.sections,
            labels: { singular: 'Policy section', plural: 'Policy sections' },
            admin: {
              initCollapsed: true,
              description: 'Add, remove, or drag to reorder. Each section appears automatically in the mobile and desktop table of contents. To remove all sections, remove every row.',
            },
            fields: [
              {
                name: 'anchor', type: 'text', label: 'Section anchor (URL)',
                required: true, maxLength: 90,
                admin: { description: 'Lowercase letters, numbers and hyphens. Existing anchors should be kept to preserve shared URLs.' },
                validate: (value: unknown) =>
                  typeof value === 'string' && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value)
                    ? true : 'Use lowercase letters, numbers and hyphens, e.g. your-rights',
              },
              { name: 'eyebrow', type: 'text', label: 'Small section label', maxLength: 100 },
              { name: 'title', type: 'text', label: 'Section heading', required: true, maxLength: 200 },
              {
                name: 'body', type: 'richText', label: 'Section content', required: true,
                admin: { description: 'Add paragraphs, bold text, headings, lists and links in the rich-text editor.' },
              },
            ],
          }],
        },
        {
          label: 'Page Header',
          fields: [{
            name: 'hero', type: 'group', label: 'Hero',
            fields: [
              text('eyebrow', 'Eyebrow', D.hero.eyebrow),
              text('titleMain', 'Title', D.hero.titleMain),
              text('titleAccent', 'Accent title', D.hero.titleAccent),
              paragraph('description', 'Description', D.hero.description),
              text('lastUpdated', 'Last updated (display text)', D.hero.lastUpdated),
              text('metaLabel', 'Meta label', D.hero.metaLabel),
              text('documentNumber', 'Decorative document number', D.hero.documentNumber),
            ],
          }],
        },
        {
          label: 'Privacy Highlights',
          fields: [{
            name: 'glance', type: 'group', label: 'At a Glance',
            fields: [
              text('eyebrow', 'Small label', D.glance.eyebrow),
              text('titleMain', 'Heading', D.glance.titleMain),
              text('titleAccent', 'Accent heading', D.glance.titleAccent),
              text('firstTitle', 'Card 1 title', D.glance.firstTitle),
              paragraph('firstText', 'Card 1 description', D.glance.firstText),
              text('secondTitle', 'Card 2 title', D.glance.secondTitle),
              paragraph('secondText', 'Card 2 description', D.glance.secondText),
              text('thirdTitle', 'Card 3 title', D.glance.thirdTitle),
              paragraph('thirdText', 'Card 3 description', D.glance.thirdText),
            ],
          }],
        },
        {
          label: 'Contact',
          fields: [{
            name: 'contact', type: 'group', label: 'Privacy contact information',
            fields: [
              text('businessName', 'Business / legal operator', D.contact.businessName),
              { name: 'privacyEmail', label: 'Privacy email', type: 'email', defaultValue: D.contact.privacyEmail },
              paragraph('businessAddress', 'Business address', D.contact.businessAddress),
              text('buttonLabel', 'Contact button label', D.contact.buttonLabel),
              internalHref,
              text('sidebarQuestion', 'Sidebar question', D.contact.sidebarQuestion),
              text('sidebarButtonLabel', 'Sidebar button label', D.contact.sidebarButtonLabel),
            ],
          }],
        },
        {
          label: 'Closing Section',
          fields: [{
            name: 'closing', type: 'group', label: 'Closing message',
            fields: [
              text('eyebrow', 'Small label', D.closing.eyebrow),
              text('titleMain', 'Title', D.closing.titleMain),
              text('titleAccent', 'Accent title', D.closing.titleAccent),
              paragraph('description', 'Description', D.closing.description),
              text('buttonLabel', 'Button text', D.closing.buttonLabel),
              {
                name: 'buttonHref', label: 'Button link (internal path)', type: 'text',
                defaultValue: D.closing.buttonHref,
                validate: (value: unknown) =>
                  typeof value === 'string' && /^\/(?!\/)[^\s]*$/.test(value)
                    ? true : 'Use a relative URL starting with /',
              },
            ],
          }],
        },
        {
          label: 'SEO',
          fields: [{
            name: 'seo', type: 'group', label: 'Search engine metadata',
            fields: [
              text('title', 'SEO title', D.seo.title),
              paragraph('description', 'SEO description', D.seo.description),
            ],
          }],
        },
      ],
    },
  ],
}
