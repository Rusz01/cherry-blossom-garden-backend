import type { Block } from 'payload'

import { linkField } from '@/fields/link'
import { FEATURE_ICON_OPTIONS } from '@/utilities/featureIcons'

const heading = (required = false) =>
  ({ name: 'heading', type: 'text', required, maxLength: 160 }) as const

const eyebrow = { name: 'eyebrow', type: 'text', maxLength: 60, admin: { description: 'Small label above the heading.' } } as const

export const HeroBlock: Block = {
  slug: 'hero',
  interfaceName: 'HeroBlock',
  labels: { singular: 'Hero', plural: 'Heroes' },
  imageAltText: 'Large introductory section with heading, text and buttons',
  fields: [
    eyebrow,
    heading(true),
    { name: 'subheading', type: 'textarea', maxLength: 400 },
    { name: 'media', type: 'upload', relationTo: 'media' },
    {
      name: 'layout',
      type: 'select',
      defaultValue: 'split',
      options: [
        { label: 'Split (text + image)', value: 'split' },
        { label: 'Centered', value: 'centered' },
      ],
    },
    {
      name: 'actions',
      type: 'array',
      maxRows: 2,
      labels: { singular: 'Button', plural: 'Buttons' },
      fields: [linkField({ appearance: true })],
    },
  ],
}

export const RichTextBlock: Block = {
  slug: 'richText',
  interfaceName: 'RichTextBlock',
  labels: { singular: 'Rich text', plural: 'Rich text' },
  fields: [
    { name: 'content', type: 'richText', required: true },
    {
      name: 'width',
      type: 'select',
      defaultValue: 'narrow',
      options: [
        { label: 'Narrow (reading width)', value: 'narrow' },
        { label: 'Wide', value: 'wide' },
      ],
    },
  ],
}

export const ImageBlock: Block = {
  slug: 'image',
  interfaceName: 'ImageBlock',
  labels: { singular: 'Image', plural: 'Images' },
  fields: [
    { name: 'image', type: 'upload', relationTo: 'media', required: true },
    { name: 'caption', type: 'text', maxLength: 200 },
    {
      name: 'size',
      type: 'select',
      defaultValue: 'contained',
      options: [
        { label: 'Contained', value: 'contained' },
        { label: 'Full width', value: 'full' },
      ],
    },
  ],
}

export const ImageTextBlock: Block = {
  slug: 'imageText',
  interfaceName: 'ImageTextBlock',
  labels: { singular: 'Image and text', plural: 'Image and text' },
  fields: [
    eyebrow,
    heading(),
    { name: 'content', type: 'richText' },
    { name: 'image', type: 'upload', relationTo: 'media', required: true },
    {
      name: 'imagePosition',
      type: 'radio',
      defaultValue: 'right',
      options: [
        { label: 'Left', value: 'left' },
        { label: 'Right', value: 'right' },
      ],
      admin: { layout: 'horizontal' },
    },
    { name: 'action', type: 'checkbox', label: 'Add a button' },
    { ...linkField({ name: 'link', appearance: true, required: false }), admin: { condition: (_, s) => Boolean(s?.action) } },
  ],
}

export const CallToActionBlock: Block = {
  slug: 'callToAction',
  interfaceName: 'CallToActionBlock',
  labels: { singular: 'Call to action', plural: 'Calls to action' },
  fields: [
    heading(true),
    { name: 'text', type: 'textarea', maxLength: 400 },
    {
      name: 'style',
      type: 'select',
      defaultValue: 'dark',
      options: [
        { label: 'Dark', value: 'dark' },
        { label: 'Light', value: 'light' },
      ],
    },
    {
      name: 'actions',
      type: 'array',
      minRows: 1,
      maxRows: 2,
      labels: { singular: 'Button', plural: 'Buttons' },
      fields: [linkField({ appearance: true })],
    },
  ],
}

export const FeatureGridBlock: Block = {
  slug: 'featureGrid',
  interfaceName: 'FeatureGridBlock',
  labels: { singular: 'Feature grid', plural: 'Feature grids' },
  fields: [
    eyebrow,
    heading(),
    { name: 'intro', type: 'textarea', maxLength: 400 },
    {
      name: 'columns',
      type: 'select',
      defaultValue: '3',
      options: ['2', '3', '4'].map((value) => ({ label: `${value} columns`, value })),
    },
    {
      name: 'features',
      type: 'array',
      minRows: 1,
      maxRows: 12,
      labels: { singular: 'Feature', plural: 'Features' },
      admin: { components: { RowLabel: '/components/admin/RowLabel#TitleRowLabel' } },
      fields: [
        { name: 'title', type: 'text', required: true, maxLength: 100 },
        { name: 'description', type: 'textarea', maxLength: 300 },
        { name: 'icon', type: 'select', options: [...FEATURE_ICON_OPTIONS] },
      ],
    },
  ],
}

export const FAQBlock: Block = {
  slug: 'faq',
  interfaceName: 'FAQBlock',
  labels: { singular: 'FAQ', plural: 'FAQs' },
  fields: [
    heading(),
    {
      name: 'items',
      type: 'array',
      minRows: 1,
      labels: { singular: 'Question', plural: 'Questions' },
      admin: { components: { RowLabel: '/components/admin/RowLabel#QuestionRowLabel' } },
      fields: [
        { name: 'question', type: 'text', required: true, maxLength: 200 },
        { name: 'answer', type: 'textarea', required: true, maxLength: 2000 },
      ],
    },
    {
      name: 'includeSchema',
      label: 'Publish as FAQPage structured data',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description:
          'Adds schema.org FAQPage JSON-LD for search and answer engines. Only use for genuine questions and answers visible on the page.',
      },
    },
  ],
}

export const TestimonialsBlock: Block = {
  slug: 'testimonials',
  interfaceName: 'TestimonialsBlock',
  labels: { singular: 'Testimonials', plural: 'Testimonials' },
  fields: [
    heading(),
    {
      name: 'items',
      type: 'array',
      minRows: 1,
      labels: { singular: 'Testimonial', plural: 'Testimonials' },
      admin: {
        description: 'Only publish real testimonials you have permission to use.',
        components: { RowLabel: '/components/admin/RowLabel#AuthorRowLabel' },
      },
      fields: [
        { name: 'quote', type: 'textarea', required: true, maxLength: 800 },
        {
          type: 'row',
          fields: [
            { name: 'author', type: 'text', required: true, maxLength: 100, admin: { width: '50%' } },
            { name: 'role', label: 'Role / company', type: 'text', maxLength: 120, admin: { width: '50%' } },
          ],
        },
        { name: 'avatar', type: 'upload', relationTo: 'media' },
      ],
    },
  ],
}

export const GalleryBlock: Block = {
  slug: 'gallery',
  interfaceName: 'GalleryBlock',
  labels: { singular: 'Gallery', plural: 'Galleries' },
  fields: [
    heading(),
    { name: 'images', type: 'upload', relationTo: 'media', hasMany: true, required: true, minRows: 1, maxRows: 24 },
    {
      name: 'columns',
      type: 'select',
      defaultValue: '3',
      options: ['2', '3', '4'].map((value) => ({ label: `${value} columns`, value })),
    },
  ],
}

export const pageBlocks: Block[] = [
  HeroBlock,
  RichTextBlock,
  ImageBlock,
  ImageTextBlock,
  CallToActionBlock,
  FeatureGridBlock,
  FAQBlock,
  TestimonialsBlock,
  GalleryBlock,
]
