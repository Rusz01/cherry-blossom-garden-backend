import type { DefaultTypedEditorState } from '@payloadcms/richtext-lexical'

export type PolicySectionContent = {
  anchor: string
  title: string
  eyebrow: string
  body: DefaultTypedEditorState
}

export type PrivacyPolicyContent = {
  seo: { title: string; description: string }
  hero: {
    eyebrow: string; titleMain: string; titleAccent: string
    description: string; lastUpdated: string; metaLabel: string; documentNumber: string
  }
  glance: {
    eyebrow: string; titleMain: string; titleAccent: string
    firstTitle: string; firstText: string
    secondTitle: string; secondText: string
    thirdTitle: string; thirdText: string
  }
  contact: {
    businessName: string; privacyEmail: string; businessAddress: string
    buttonLabel: string; buttonHref: string
    sidebarQuestion: string; sidebarButtonLabel: string
  }
  closing: {
    eyebrow: string; titleMain: string; titleAccent: string
    description: string; buttonLabel: string; buttonHref: string
  }
  sections: PolicySectionContent[]
}

// Generated directly from the original React page by the merge script.
// These are the displayed defaults until the first CMS version is published.
export const DEFAULT_PRIVACY_POLICY = {
  "seo": {
    "title": "Privacy Policy | Cherry Blossom Garden",
    "description": "Learn how Cherry Blossom Garden handles your personal information, reservations, enquiries, communications and privacy choices."
  },
  "hero": {
    "eyebrow": "Cherry Blossom Garden / Legal",
    "titleMain": "Privacy",
    "titleAccent": "Policy.",
    "description": "Your trust is part of our hospitality. Discover how we treat your information with care, transparency and respect.",
    "lastUpdated": "26 October 2026",
    "metaLabel": "Privacy & Data Protection",
    "documentNumber": "01 / LEGAL"
  },
  "glance": {
    "eyebrow": "A Simple Promise",
    "titleMain": "Privacy, with",
    "titleAccent": "care.",
    "firstTitle": "Clear Purpose",
    "firstText": "We explain why information is requested and how it may be used.",
    "secondTitle": "Respectful Handling",
    "secondText": "Personal information should be protected and handled responsibly.",
    "thirdTitle": "Your Choices",
    "thirdText": "Ask questions, manage preferences and make eligible privacy requests."
  },
  "contact": {
    "businessName": "Cherry Blossom Garden",
    "privacyEmail": "",
    "businessAddress": "",
    "buttonLabel": "Send a privacy enquiry",
    "buttonHref": "/reservation#contact",
    "sidebarQuestion": "Have a privacy question?",
    "sidebarButtonLabel": "Get in touch"
  },
  "closing": {
    "eyebrow": "Cherry Blossom Garden",
    "titleMain": "Your trust means",
    "titleAccent": "everything.",
    "description": "Thank you for taking the time to understand how your information is handled.",
    "buttonLabel": "Return to Homepage",
    "buttonHref": "/"
  },
  "sections": [
    {
      "anchor": "introduction",
      "title": "Our Commitment to Your Privacy",
      "eyebrow": "Our Promise",
      "body": {
        "root": {
          "type": "root",
          "children": [
            {
              "type": "paragraph",
              "children": [
                {
                  "type": "text",
                  "text": "At Cherry Blossom Garden, we believe great hospitality extends beyond the dining experience. It also means respecting your privacy and treating the information you share with us responsibly.",
                  "detail": 0,
                  "format": 0,
                  "mode": "normal",
                  "style": "",
                  "version": 1
                }
              ],
              "direction": "ltr",
              "format": "",
              "indent": 0,
              "version": 1,
              "textFormat": 0,
              "textStyle": ""
            },
            {
              "type": "paragraph",
              "children": [
                {
                  "type": "text",
                  "text": "This Privacy Policy explains what personal information we collect, why we use it, how it may be shared, and the choices available to you.",
                  "detail": 0,
                  "format": 0,
                  "mode": "normal",
                  "style": "",
                  "version": 1
                }
              ],
              "direction": "ltr",
              "format": "",
              "indent": 0,
              "version": 1,
              "textFormat": 0,
              "textStyle": ""
            },
            {
              "type": "paragraph",
              "children": [
                {
                  "type": "text",
                  "text": "It applies to information collected through our website, reservation enquiries, contact forms, communications and other relevant interactions with Cherry Blossom Garden.",
                  "detail": 0,
                  "format": 0,
                  "mode": "normal",
                  "style": "",
                  "version": 1
                }
              ],
              "direction": "ltr",
              "format": "",
              "indent": 0,
              "version": 1,
              "textFormat": 0,
              "textStyle": ""
            }
          ],
          "direction": "ltr",
          "format": "",
          "indent": 0,
          "version": 1
        }
      }
    },
    {
      "anchor": "who-we-are",
      "title": "Who We Are",
      "eyebrow": "The Organisation",
      "body": {
        "root": {
          "type": "root",
          "children": [
            {
              "type": "paragraph",
              "children": [
                {
                  "type": "text",
                  "text": "Cherry Blossom Garden is a garden-inspired hospitality destination offering dining, family experiences, entertainment and spaces for special occasions.",
                  "detail": 0,
                  "format": 0,
                  "mode": "normal",
                  "style": "",
                  "version": 1
                }
              ],
              "direction": "ltr",
              "format": "",
              "indent": 0,
              "version": 1,
              "textFormat": 0,
              "textStyle": ""
            },
            {
              "type": "paragraph",
              "children": [
                {
                  "type": "text",
                  "text": "For the personal information covered by this notice, the business operating Cherry Blossom Garden is responsible for explaining its handling of that information and responding to privacy enquiries.",
                  "detail": 0,
                  "format": 0,
                  "mode": "normal",
                  "style": "",
                  "version": 1
                }
              ],
              "direction": "ltr",
              "format": "",
              "indent": 0,
              "version": 1,
              "textFormat": 0,
              "textStyle": ""
            },
            {
              "type": "paragraph",
              "children": [
                {
                  "type": "text",
                  "text": "You can contact our team using the details in the Contact Us section below.",
                  "detail": 0,
                  "format": 0,
                  "mode": "normal",
                  "style": "",
                  "version": 1
                }
              ],
              "direction": "ltr",
              "format": "",
              "indent": 0,
              "version": 1,
              "textFormat": 0,
              "textStyle": ""
            }
          ],
          "direction": "ltr",
          "format": "",
          "indent": 0,
          "version": 1
        }
      }
    },
    {
      "anchor": "information-we-collect",
      "title": "Information We Collect",
      "eyebrow": "Your Information",
      "body": {
        "root": {
          "type": "root",
          "children": [
            {
              "type": "paragraph",
              "children": [
                {
                  "type": "text",
                  "text": "The information we receive depends on how you interact with Cherry Blossom Garden.",
                  "detail": 0,
                  "format": 0,
                  "mode": "normal",
                  "style": "",
                  "version": 1
                }
              ],
              "direction": "ltr",
              "format": "",
              "indent": 0,
              "version": 1,
              "textFormat": 0,
              "textStyle": ""
            },
            {
              "type": "heading",
              "children": [
                {
                  "type": "text",
                  "text": "Information you provide directly",
                  "detail": 0,
                  "format": 0,
                  "mode": "normal",
                  "style": "",
                  "version": 1
                }
              ],
              "direction": "ltr",
              "format": "",
              "indent": 0,
              "version": 1,
              "tag": "h3"
            },
            {
              "type": "list",
              "children": [
                {
                  "type": "listitem",
                  "children": [
                    {
                      "type": "text",
                      "text": "Your name and contact information.",
                      "detail": 0,
                      "format": 0,
                      "mode": "normal",
                      "style": "",
                      "version": 1
                    }
                  ],
                  "direction": "ltr",
                  "format": "",
                  "indent": 0,
                  "version": 1,
                  "value": 1
                },
                {
                  "type": "listitem",
                  "children": [
                    {
                      "type": "text",
                      "text": "Email address and telephone number.",
                      "detail": 0,
                      "format": 0,
                      "mode": "normal",
                      "style": "",
                      "version": 1
                    }
                  ],
                  "direction": "ltr",
                  "format": "",
                  "indent": 0,
                  "version": 1,
                  "value": 1
                },
                {
                  "type": "listitem",
                  "children": [
                    {
                      "type": "text",
                      "text": "Requested reservation date, time and number of guests.",
                      "detail": 0,
                      "format": 0,
                      "mode": "normal",
                      "style": "",
                      "version": 1
                    }
                  ],
                  "direction": "ltr",
                  "format": "",
                  "indent": 0,
                  "version": 1,
                  "value": 1
                },
                {
                  "type": "listitem",
                  "children": [
                    {
                      "type": "text",
                      "text": "Preferred dining space, occasion and special requests.",
                      "detail": 0,
                      "format": 0,
                      "mode": "normal",
                      "style": "",
                      "version": 1
                    }
                  ],
                  "direction": "ltr",
                  "format": "",
                  "indent": 0,
                  "version": 1,
                  "value": 1
                },
                {
                  "type": "listitem",
                  "children": [
                    {
                      "type": "text",
                      "text": "Enquiry messages and correspondence with our team.",
                      "detail": 0,
                      "format": 0,
                      "mode": "normal",
                      "style": "",
                      "version": 1
                    }
                  ],
                  "direction": "ltr",
                  "format": "",
                  "indent": 0,
                  "version": 1,
                  "value": 1
                },
                {
                  "type": "listitem",
                  "children": [
                    {
                      "type": "text",
                      "text": "Newsletter preferences, if a subscription service is made available.",
                      "detail": 0,
                      "format": 0,
                      "mode": "normal",
                      "style": "",
                      "version": 1
                    }
                  ],
                  "direction": "ltr",
                  "format": "",
                  "indent": 0,
                  "version": 1,
                  "value": 1
                }
              ],
              "direction": "ltr",
              "format": "",
              "indent": 0,
              "version": 1,
              "listType": "bullet",
              "start": 1,
              "tag": "ul"
            },
            {
              "type": "heading",
              "children": [
                {
                  "type": "text",
                  "text": "Technical information",
                  "detail": 0,
                  "format": 0,
                  "mode": "normal",
                  "style": "",
                  "version": 1
                }
              ],
              "direction": "ltr",
              "format": "",
              "indent": 0,
              "version": 1,
              "tag": "h3"
            },
            {
              "type": "paragraph",
              "children": [
                {
                  "type": "text",
                  "text": "When you visit our website, technical information such as your IP address, browser type, device details, access times and website activity may be processed by our hosting or security services.",
                  "detail": 0,
                  "format": 0,
                  "mode": "normal",
                  "style": "",
                  "version": 1
                }
              ],
              "direction": "ltr",
              "format": "",
              "indent": 0,
              "version": 1,
              "textFormat": 0,
              "textStyle": ""
            },
            {
              "type": "paragraph",
              "children": [
                {
                  "type": "text",
                  "text": "We encourage you not to include unnecessary sensitive personal information in general enquiry forms.",
                  "detail": 0,
                  "format": 0,
                  "mode": "normal",
                  "style": "",
                  "version": 1
                }
              ],
              "direction": "ltr",
              "format": "",
              "indent": 0,
              "version": 1,
              "textFormat": 0,
              "textStyle": ""
            }
          ],
          "direction": "ltr",
          "format": "",
          "indent": 0,
          "version": 1
        }
      }
    },
    {
      "anchor": "how-we-use-information",
      "title": "How We Use Your Information",
      "eyebrow": "Purpose & Use",
      "body": {
        "root": {
          "type": "root",
          "children": [
            {
              "type": "paragraph",
              "children": [
                {
                  "type": "text",
                  "text": "We use relevant personal information to provide our services and communicate with you.",
                  "detail": 0,
                  "format": 0,
                  "mode": "normal",
                  "style": "",
                  "version": 1
                }
              ],
              "direction": "ltr",
              "format": "",
              "indent": 0,
              "version": 1,
              "textFormat": 0,
              "textStyle": ""
            },
            {
              "type": "list",
              "children": [
                {
                  "type": "listitem",
                  "children": [
                    {
                      "type": "text",
                      "text": "Receive and respond to reservation requests.",
                      "detail": 0,
                      "format": 0,
                      "mode": "normal",
                      "style": "",
                      "version": 1
                    }
                  ],
                  "direction": "ltr",
                  "format": "",
                  "indent": 0,
                  "version": 1,
                  "value": 1
                },
                {
                  "type": "listitem",
                  "children": [
                    {
                      "type": "text",
                      "text": "Contact you about booking availability or changes.",
                      "detail": 0,
                      "format": 0,
                      "mode": "normal",
                      "style": "",
                      "version": 1
                    }
                  ],
                  "direction": "ltr",
                  "format": "",
                  "indent": 0,
                  "version": 1,
                  "value": 1
                },
                {
                  "type": "listitem",
                  "children": [
                    {
                      "type": "text",
                      "text": "Respond to enquiries, feedback and requests.",
                      "detail": 0,
                      "format": 0,
                      "mode": "normal",
                      "style": "",
                      "version": 1
                    }
                  ],
                  "direction": "ltr",
                  "format": "",
                  "indent": 0,
                  "version": 1,
                  "value": 1
                },
                {
                  "type": "listitem",
                  "children": [
                    {
                      "type": "text",
                      "text": "Help arrange dining experiences and celebrations.",
                      "detail": 0,
                      "format": 0,
                      "mode": "normal",
                      "style": "",
                      "version": 1
                    }
                  ],
                  "direction": "ltr",
                  "format": "",
                  "indent": 0,
                  "version": 1,
                  "value": 1
                },
                {
                  "type": "listitem",
                  "children": [
                    {
                      "type": "text",
                      "text": "Maintain the functionality and security of our website.",
                      "detail": 0,
                      "format": 0,
                      "mode": "normal",
                      "style": "",
                      "version": 1
                    }
                  ],
                  "direction": "ltr",
                  "format": "",
                  "indent": 0,
                  "version": 1,
                  "value": 1
                },
                {
                  "type": "listitem",
                  "children": [
                    {
                      "type": "text",
                      "text": "Meet applicable legal, record-keeping and regulatory requirements.",
                      "detail": 0,
                      "format": 0,
                      "mode": "normal",
                      "style": "",
                      "version": 1
                    }
                  ],
                  "direction": "ltr",
                  "format": "",
                  "indent": 0,
                  "version": 1,
                  "value": 1
                },
                {
                  "type": "listitem",
                  "children": [
                    {
                      "type": "text",
                      "text": "Send optional marketing communications where permitted and appropriately authorised.",
                      "detail": 0,
                      "format": 0,
                      "mode": "normal",
                      "style": "",
                      "version": 1
                    }
                  ],
                  "direction": "ltr",
                  "format": "",
                  "indent": 0,
                  "version": 1,
                  "value": 1
                }
              ],
              "direction": "ltr",
              "format": "",
              "indent": 0,
              "version": 1,
              "listType": "bullet",
              "start": 1,
              "tag": "ul"
            },
            {
              "type": "paragraph",
              "children": [
                {
                  "type": "text",
                  "text": "We aim to use personal information only for the purposes explained when it is collected or for other compatible, lawful purposes.",
                  "detail": 0,
                  "format": 0,
                  "mode": "normal",
                  "style": "",
                  "version": 1
                }
              ],
              "direction": "ltr",
              "format": "",
              "indent": 0,
              "version": 1,
              "textFormat": 0,
              "textStyle": ""
            }
          ],
          "direction": "ltr",
          "format": "",
          "indent": 0,
          "version": 1
        }
      }
    },
    {
      "anchor": "lawful-basis",
      "title": "Our Reasons for Processing Data",
      "eyebrow": "Legal Grounds",
      "body": {
        "root": {
          "type": "root",
          "children": [
            {
              "type": "paragraph",
              "children": [
                {
                  "type": "text",
                  "text": "Where applicable data protection law requires a specific legal basis for processing, the basis will depend on the activity involved.",
                  "detail": 0,
                  "format": 0,
                  "mode": "normal",
                  "style": "",
                  "version": 1
                }
              ],
              "direction": "ltr",
              "format": "",
              "indent": 0,
              "version": 1,
              "textFormat": 0,
              "textStyle": ""
            },
            {
              "type": "list",
              "children": [
                {
                  "type": "listitem",
                  "children": [
                    {
                      "type": "text",
                      "text": "Taking steps to provide a service:",
                      "detail": 0,
                      "format": 1,
                      "mode": "normal",
                      "style": "",
                      "version": 1
                    },
                    {
                      "type": "text",
                      "text": " handling reservations and requests made by you.",
                      "detail": 0,
                      "format": 0,
                      "mode": "normal",
                      "style": "",
                      "version": 1
                    }
                  ],
                  "direction": "ltr",
                  "format": "",
                  "indent": 0,
                  "version": 1,
                  "value": 1
                },
                {
                  "type": "listitem",
                  "children": [
                    {
                      "type": "text",
                      "text": "Legitimate interests:",
                      "detail": 0,
                      "format": 1,
                      "mode": "normal",
                      "style": "",
                      "version": 1
                    },
                    {
                      "type": "text",
                      "text": " managing enquiries, maintaining security and improving operations where permitted by law.",
                      "detail": 0,
                      "format": 0,
                      "mode": "normal",
                      "style": "",
                      "version": 1
                    }
                  ],
                  "direction": "ltr",
                  "format": "",
                  "indent": 0,
                  "version": 1,
                  "value": 1
                },
                {
                  "type": "listitem",
                  "children": [
                    {
                      "type": "text",
                      "text": "Legal obligations:",
                      "detail": 0,
                      "format": 1,
                      "mode": "normal",
                      "style": "",
                      "version": 1
                    },
                    {
                      "type": "text",
                      "text": " retaining or disclosing information where applicable law requires it.",
                      "detail": 0,
                      "format": 0,
                      "mode": "normal",
                      "style": "",
                      "version": 1
                    }
                  ],
                  "direction": "ltr",
                  "format": "",
                  "indent": 0,
                  "version": 1,
                  "value": 1
                },
                {
                  "type": "listitem",
                  "children": [
                    {
                      "type": "text",
                      "text": "Consent:",
                      "detail": 0,
                      "format": 1,
                      "mode": "normal",
                      "style": "",
                      "version": 1
                    },
                    {
                      "type": "text",
                      "text": " activities such as optional marketing or non-essential tracking where consent is required.",
                      "detail": 0,
                      "format": 0,
                      "mode": "normal",
                      "style": "",
                      "version": 1
                    }
                  ],
                  "direction": "ltr",
                  "format": "",
                  "indent": 0,
                  "version": 1,
                  "value": 1
                }
              ],
              "direction": "ltr",
              "format": "",
              "indent": 0,
              "version": 1,
              "listType": "bullet",
              "start": 1,
              "tag": "ul"
            },
            {
              "type": "paragraph",
              "children": [
                {
                  "type": "text",
                  "text": "Where we rely on your consent, you may withdraw it at any time, without affecting processing that took place before withdrawal.",
                  "detail": 0,
                  "format": 0,
                  "mode": "normal",
                  "style": "",
                  "version": 1
                }
              ],
              "direction": "ltr",
              "format": "",
              "indent": 0,
              "version": 1,
              "textFormat": 0,
              "textStyle": ""
            }
          ],
          "direction": "ltr",
          "format": "",
          "indent": 0,
          "version": 1
        }
      }
    },
    {
      "anchor": "reservations",
      "title": "Reservations & Enquiries",
      "eyebrow": "Your Visit",
      "body": {
        "root": {
          "type": "root",
          "children": [
            {
              "type": "paragraph",
              "children": [
                {
                  "type": "text",
                  "text": "When you request a reservation, we ask for the information needed to understand your visit, including your preferred date, time, dining experience, guest count and contact details.",
                  "detail": 0,
                  "format": 0,
                  "mode": "normal",
                  "style": "",
                  "version": 1
                }
              ],
              "direction": "ltr",
              "format": "",
              "indent": 0,
              "version": 1,
              "textFormat": 0,
              "textStyle": ""
            },
            {
              "type": "paragraph",
              "children": [
                {
                  "type": "text",
                  "text": "If you contact us through our general enquiry form, we ask for your name, email address and message.",
                  "detail": 0,
                  "format": 0,
                  "mode": "normal",
                  "style": "",
                  "version": 1
                }
              ],
              "direction": "ltr",
              "format": "",
              "indent": 0,
              "version": 1,
              "textFormat": 0,
              "textStyle": ""
            },
            {
              "type": "paragraph",
              "children": [
                {
                  "type": "text",
                  "text": "This information is intended to help our team respond to your request, communicate relevant details and provide an appropriate guest experience.",
                  "detail": 0,
                  "format": 0,
                  "mode": "normal",
                  "style": "",
                  "version": 1
                }
              ],
              "direction": "ltr",
              "format": "",
              "indent": 0,
              "version": 1,
              "textFormat": 0,
              "textStyle": ""
            },
            {
              "type": "paragraph",
              "children": [
                {
                  "type": "text",
                  "text": "Submitting a reservation request does not, by itself, guarantee a confirmed booking. Please refer to the confirmation communicated by our team.",
                  "detail": 0,
                  "format": 0,
                  "mode": "normal",
                  "style": "",
                  "version": 1
                }
              ],
              "direction": "ltr",
              "format": "",
              "indent": 0,
              "version": 1,
              "textFormat": 0,
              "textStyle": ""
            }
          ],
          "direction": "ltr",
          "format": "",
          "indent": 0,
          "version": 1
        }
      }
    },
    {
      "anchor": "marketing",
      "title": "Newsletters & Marketing",
      "eyebrow": "Stay Connected",
      "body": {
        "root": {
          "type": "root",
          "children": [
            {
              "type": "paragraph",
              "children": [
                {
                  "type": "text",
                  "text": "If we offer an email newsletter and you choose to subscribe, we may use your email address to share updates about dining experiences, seasonal menus, events and special occasions.",
                  "detail": 0,
                  "format": 0,
                  "mode": "normal",
                  "style": "",
                  "version": 1
                }
              ],
              "direction": "ltr",
              "format": "",
              "indent": 0,
              "version": 1,
              "textFormat": 0,
              "textStyle": ""
            },
            {
              "type": "paragraph",
              "children": [
                {
                  "type": "text",
                  "text": "Where consent is required, promotional messages will be sent only after obtaining appropriate permission. You can stop receiving these messages by using an unsubscribe option or contacting us.",
                  "detail": 0,
                  "format": 0,
                  "mode": "normal",
                  "style": "",
                  "version": 1
                }
              ],
              "direction": "ltr",
              "format": "",
              "indent": 0,
              "version": 1,
              "textFormat": 0,
              "textStyle": ""
            },
            {
              "type": "paragraph",
              "children": [
                {
                  "type": "text",
                  "text": "You do not need to subscribe to marketing communications to make a reservation enquiry.",
                  "detail": 0,
                  "format": 0,
                  "mode": "normal",
                  "style": "",
                  "version": 1
                }
              ],
              "direction": "ltr",
              "format": "",
              "indent": 0,
              "version": 1,
              "textFormat": 0,
              "textStyle": ""
            }
          ],
          "direction": "ltr",
          "format": "",
          "indent": 0,
          "version": 1
        }
      }
    },
    {
      "anchor": "cookies",
      "title": "Cookies & Website Technologies",
      "eyebrow": "Digital Experience",
      "body": {
        "root": {
          "type": "root",
          "children": [
            {
              "type": "paragraph",
              "children": [
                {
                  "type": "text",
                  "text": "Cookies and similar technologies can help websites function, remember preferences, maintain security and understand how visitors use their services.",
                  "detail": 0,
                  "format": 0,
                  "mode": "normal",
                  "style": "",
                  "version": 1
                }
              ],
              "direction": "ltr",
              "format": "",
              "indent": 0,
              "version": 1,
              "textFormat": 0,
              "textStyle": ""
            },
            {
              "type": "paragraph",
              "children": [
                {
                  "type": "text",
                  "text": "Our website or its service providers may use technologies necessary for website operation and security.",
                  "detail": 0,
                  "format": 0,
                  "mode": "normal",
                  "style": "",
                  "version": 1
                }
              ],
              "direction": "ltr",
              "format": "",
              "indent": 0,
              "version": 1,
              "textFormat": 0,
              "textStyle": ""
            },
            {
              "type": "paragraph",
              "children": [
                {
                  "type": "text",
                  "text": "If optional analytics, advertising or other non-essential tracking technologies are enabled, we will explain their purposes and provide consent choices where required by applicable law.",
                  "detail": 0,
                  "format": 0,
                  "mode": "normal",
                  "style": "",
                  "version": 1
                }
              ],
              "direction": "ltr",
              "format": "",
              "indent": 0,
              "version": 1,
              "textFormat": 0,
              "textStyle": ""
            },
            {
              "type": "paragraph",
              "children": [
                {
                  "type": "text",
                  "text": "You may also control certain cookies through your browser settings. Disabling essential website functionality may affect your experience.",
                  "detail": 0,
                  "format": 0,
                  "mode": "normal",
                  "style": "",
                  "version": 1
                }
              ],
              "direction": "ltr",
              "format": "",
              "indent": 0,
              "version": 1,
              "textFormat": 0,
              "textStyle": ""
            }
          ],
          "direction": "ltr",
          "format": "",
          "indent": 0,
          "version": 1
        }
      }
    },
    {
      "anchor": "data-sharing",
      "title": "When We Share Information",
      "eyebrow": "Trusted Services",
      "body": {
        "root": {
          "type": "root",
          "children": [
            {
              "type": "paragraph",
              "children": [
                {
                  "type": "text",
                  "text": "Providing our services may involve sharing limited information with organisations that help operate our website and hospitality services.",
                  "detail": 0,
                  "format": 0,
                  "mode": "normal",
                  "style": "",
                  "version": 1
                }
              ],
              "direction": "ltr",
              "format": "",
              "indent": 0,
              "version": 1,
              "textFormat": 0,
              "textStyle": ""
            },
            {
              "type": "paragraph",
              "children": [
                {
                  "type": "text",
                  "text": "Depending on the services in use, these may include:",
                  "detail": 0,
                  "format": 0,
                  "mode": "normal",
                  "style": "",
                  "version": 1
                }
              ],
              "direction": "ltr",
              "format": "",
              "indent": 0,
              "version": 1,
              "textFormat": 0,
              "textStyle": ""
            },
            {
              "type": "list",
              "children": [
                {
                  "type": "listitem",
                  "children": [
                    {
                      "type": "text",
                      "text": "Website hosting and technical support providers.",
                      "detail": 0,
                      "format": 0,
                      "mode": "normal",
                      "style": "",
                      "version": 1
                    }
                  ],
                  "direction": "ltr",
                  "format": "",
                  "indent": 0,
                  "version": 1,
                  "value": 1
                },
                {
                  "type": "listitem",
                  "children": [
                    {
                      "type": "text",
                      "text": "Reservation and communication service providers.",
                      "detail": 0,
                      "format": 0,
                      "mode": "normal",
                      "style": "",
                      "version": 1
                    }
                  ],
                  "direction": "ltr",
                  "format": "",
                  "indent": 0,
                  "version": 1,
                  "value": 1
                },
                {
                  "type": "listitem",
                  "children": [
                    {
                      "type": "text",
                      "text": "Email delivery and mailing-list services.",
                      "detail": 0,
                      "format": 0,
                      "mode": "normal",
                      "style": "",
                      "version": 1
                    }
                  ],
                  "direction": "ltr",
                  "format": "",
                  "indent": 0,
                  "version": 1,
                  "value": 1
                },
                {
                  "type": "listitem",
                  "children": [
                    {
                      "type": "text",
                      "text": "Security and operational technology providers.",
                      "detail": 0,
                      "format": 0,
                      "mode": "normal",
                      "style": "",
                      "version": 1
                    }
                  ],
                  "direction": "ltr",
                  "format": "",
                  "indent": 0,
                  "version": 1,
                  "value": 1
                },
                {
                  "type": "listitem",
                  "children": [
                    {
                      "type": "text",
                      "text": "Authorities or professional advisers where disclosure is lawfully required or justified.",
                      "detail": 0,
                      "format": 0,
                      "mode": "normal",
                      "style": "",
                      "version": 1
                    }
                  ],
                  "direction": "ltr",
                  "format": "",
                  "indent": 0,
                  "version": 1,
                  "value": 1
                }
              ],
              "direction": "ltr",
              "format": "",
              "indent": 0,
              "version": 1,
              "listType": "bullet",
              "start": 1,
              "tag": "ul"
            },
            {
              "type": "paragraph",
              "children": [
                {
                  "type": "text",
                  "text": "Information should be shared only where reasonably necessary and subject to suitable safeguards. We do not authorise third parties to use information for unrelated purposes merely because they provide a service to us.",
                  "detail": 0,
                  "format": 0,
                  "mode": "normal",
                  "style": "",
                  "version": 1
                }
              ],
              "direction": "ltr",
              "format": "",
              "indent": 0,
              "version": 1,
              "textFormat": 0,
              "textStyle": ""
            }
          ],
          "direction": "ltr",
          "format": "",
          "indent": 0,
          "version": 1
        }
      }
    },
    {
      "anchor": "international-transfers",
      "title": "International Data Processing",
      "eyebrow": "Across Borders",
      "body": {
        "root": {
          "type": "root",
          "children": [
            {
              "type": "paragraph",
              "children": [
                {
                  "type": "text",
                  "text": "Some technology or communication providers may process information in countries other than the country where you live.",
                  "detail": 0,
                  "format": 0,
                  "mode": "normal",
                  "style": "",
                  "version": 1
                }
              ],
              "direction": "ltr",
              "format": "",
              "indent": 0,
              "version": 1,
              "textFormat": 0,
              "textStyle": ""
            },
            {
              "type": "paragraph",
              "children": [
                {
                  "type": "text",
                  "text": "Where cross-border processing occurs, we aim to apply appropriate contractual, technical and legal protections required by applicable law.",
                  "detail": 0,
                  "format": 0,
                  "mode": "normal",
                  "style": "",
                  "version": 1
                }
              ],
              "direction": "ltr",
              "format": "",
              "indent": 0,
              "version": 1,
              "textFormat": 0,
              "textStyle": ""
            },
            {
              "type": "paragraph",
              "children": [
                {
                  "type": "text",
                  "text": "You may contact us to request further information about relevant international processing arrangements.",
                  "detail": 0,
                  "format": 0,
                  "mode": "normal",
                  "style": "",
                  "version": 1
                }
              ],
              "direction": "ltr",
              "format": "",
              "indent": 0,
              "version": 1,
              "textFormat": 0,
              "textStyle": ""
            }
          ],
          "direction": "ltr",
          "format": "",
          "indent": 0,
          "version": 1
        }
      }
    },
    {
      "anchor": "data-retention",
      "title": "How Long We Keep Information",
      "eyebrow": "Data Retention",
      "body": {
        "root": {
          "type": "root",
          "children": [
            {
              "type": "paragraph",
              "children": [
                {
                  "type": "text",
                  "text": "We aim not to keep personal information longer than reasonably necessary for the purposes for which it was collected.",
                  "detail": 0,
                  "format": 0,
                  "mode": "normal",
                  "style": "",
                  "version": 1
                }
              ],
              "direction": "ltr",
              "format": "",
              "indent": 0,
              "version": 1,
              "textFormat": 0,
              "textStyle": ""
            },
            {
              "type": "paragraph",
              "children": [
                {
                  "type": "text",
                  "text": "Retention depends on the nature of the information, the service requested, applicable legal obligations and any need to resolve disputes or maintain appropriate business records.",
                  "detail": 0,
                  "format": 0,
                  "mode": "normal",
                  "style": "",
                  "version": 1
                }
              ],
              "direction": "ltr",
              "format": "",
              "indent": 0,
              "version": 1,
              "textFormat": 0,
              "textStyle": ""
            },
            {
              "type": "paragraph",
              "children": [
                {
                  "type": "text",
                  "text": "When information is no longer needed, it should be securely deleted or anonymised, subject to applicable retention requirements.",
                  "detail": 0,
                  "format": 0,
                  "mode": "normal",
                  "style": "",
                  "version": 1
                }
              ],
              "direction": "ltr",
              "format": "",
              "indent": 0,
              "version": 1,
              "textFormat": 0,
              "textStyle": ""
            }
          ],
          "direction": "ltr",
          "format": "",
          "indent": 0,
          "version": 1
        }
      }
    },
    {
      "anchor": "data-security",
      "title": "How We Protect Your Information",
      "eyebrow": "Security & Care",
      "body": {
        "root": {
          "type": "root",
          "children": [
            {
              "type": "paragraph",
              "children": [
                {
                  "type": "text",
                  "text": "Protecting personal information is an important part of maintaining the trust of our guests.",
                  "detail": 0,
                  "format": 0,
                  "mode": "normal",
                  "style": "",
                  "version": 1
                }
              ],
              "direction": "ltr",
              "format": "",
              "indent": 0,
              "version": 1,
              "textFormat": 0,
              "textStyle": ""
            },
            {
              "type": "paragraph",
              "children": [
                {
                  "type": "text",
                  "text": "We aim to use reasonable organisational and technical safeguards appropriate to the information handled, including limiting access to people who need information for legitimate operational purposes.",
                  "detail": 0,
                  "format": 0,
                  "mode": "normal",
                  "style": "",
                  "version": 1
                }
              ],
              "direction": "ltr",
              "format": "",
              "indent": 0,
              "version": 1,
              "textFormat": 0,
              "textStyle": ""
            },
            {
              "type": "paragraph",
              "children": [
                {
                  "type": "text",
                  "text": "No website or electronic communication system can guarantee absolute security. If you believe your information has been compromised, please contact us promptly.",
                  "detail": 0,
                  "format": 0,
                  "mode": "normal",
                  "style": "",
                  "version": 1
                }
              ],
              "direction": "ltr",
              "format": "",
              "indent": 0,
              "version": 1,
              "textFormat": 0,
              "textStyle": ""
            }
          ],
          "direction": "ltr",
          "format": "",
          "indent": 0,
          "version": 1
        }
      }
    },
    {
      "anchor": "your-rights",
      "title": "Your Privacy Rights & Choices",
      "eyebrow": "Your Control",
      "body": {
        "root": {
          "type": "root",
          "children": [
            {
              "type": "paragraph",
              "children": [
                {
                  "type": "text",
                  "text": "Depending on the laws applicable to your circumstances, you may have rights to:",
                  "detail": 0,
                  "format": 0,
                  "mode": "normal",
                  "style": "",
                  "version": 1
                }
              ],
              "direction": "ltr",
              "format": "",
              "indent": 0,
              "version": 1,
              "textFormat": 0,
              "textStyle": ""
            },
            {
              "type": "list",
              "children": [
                {
                  "type": "listitem",
                  "children": [
                    {
                      "type": "text",
                      "text": "Request access to your personal information.",
                      "detail": 0,
                      "format": 0,
                      "mode": "normal",
                      "style": "",
                      "version": 1
                    }
                  ],
                  "direction": "ltr",
                  "format": "",
                  "indent": 0,
                  "version": 1,
                  "value": 1
                },
                {
                  "type": "listitem",
                  "children": [
                    {
                      "type": "text",
                      "text": "Ask for inaccurate information to be corrected.",
                      "detail": 0,
                      "format": 0,
                      "mode": "normal",
                      "style": "",
                      "version": 1
                    }
                  ],
                  "direction": "ltr",
                  "format": "",
                  "indent": 0,
                  "version": 1,
                  "value": 1
                },
                {
                  "type": "listitem",
                  "children": [
                    {
                      "type": "text",
                      "text": "Request deletion of certain information.",
                      "detail": 0,
                      "format": 0,
                      "mode": "normal",
                      "style": "",
                      "version": 1
                    }
                  ],
                  "direction": "ltr",
                  "format": "",
                  "indent": 0,
                  "version": 1,
                  "value": 1
                },
                {
                  "type": "listitem",
                  "children": [
                    {
                      "type": "text",
                      "text": "Object to or restrict certain processing.",
                      "detail": 0,
                      "format": 0,
                      "mode": "normal",
                      "style": "",
                      "version": 1
                    }
                  ],
                  "direction": "ltr",
                  "format": "",
                  "indent": 0,
                  "version": 1,
                  "value": 1
                },
                {
                  "type": "listitem",
                  "children": [
                    {
                      "type": "text",
                      "text": "Withdraw consent where processing depends on it.",
                      "detail": 0,
                      "format": 0,
                      "mode": "normal",
                      "style": "",
                      "version": 1
                    }
                  ],
                  "direction": "ltr",
                  "format": "",
                  "indent": 0,
                  "version": 1,
                  "value": 1
                },
                {
                  "type": "listitem",
                  "children": [
                    {
                      "type": "text",
                      "text": "Request a portable copy of eligible information.",
                      "detail": 0,
                      "format": 0,
                      "mode": "normal",
                      "style": "",
                      "version": 1
                    }
                  ],
                  "direction": "ltr",
                  "format": "",
                  "indent": 0,
                  "version": 1,
                  "value": 1
                },
                {
                  "type": "listitem",
                  "children": [
                    {
                      "type": "text",
                      "text": "Raise a concern with a relevant privacy authority.",
                      "detail": 0,
                      "format": 0,
                      "mode": "normal",
                      "style": "",
                      "version": 1
                    }
                  ],
                  "direction": "ltr",
                  "format": "",
                  "indent": 0,
                  "version": 1,
                  "value": 1
                }
              ],
              "direction": "ltr",
              "format": "",
              "indent": 0,
              "version": 1,
              "listType": "bullet",
              "start": 1,
              "tag": "ul"
            },
            {
              "type": "paragraph",
              "children": [
                {
                  "type": "text",
                  "text": "These rights are not absolute and may be subject to applicable exceptions. We may need to verify your identity before acting on a request.",
                  "detail": 0,
                  "format": 0,
                  "mode": "normal",
                  "style": "",
                  "version": 1
                }
              ],
              "direction": "ltr",
              "format": "",
              "indent": 0,
              "version": 1,
              "textFormat": 0,
              "textStyle": ""
            },
            {
              "type": "paragraph",
              "children": [
                {
                  "type": "text",
                  "text": "You can submit a privacy-related enquiry through our contact channel described below.",
                  "detail": 0,
                  "format": 0,
                  "mode": "normal",
                  "style": "",
                  "version": 1
                }
              ],
              "direction": "ltr",
              "format": "",
              "indent": 0,
              "version": 1,
              "textFormat": 0,
              "textStyle": ""
            }
          ],
          "direction": "ltr",
          "format": "",
          "indent": 0,
          "version": 1
        }
      }
    },
    {
      "anchor": "children",
      "title": "Children's Privacy",
      "eyebrow": "Families & Children",
      "body": {
        "root": {
          "type": "root",
          "children": [
            {
              "type": "paragraph",
              "children": [
                {
                  "type": "text",
                  "text": "Cherry Blossom Garden welcomes families, but our website is not intended to encourage children to submit personal information independently without appropriate permission.",
                  "detail": 0,
                  "format": 0,
                  "mode": "normal",
                  "style": "",
                  "version": 1
                }
              ],
              "direction": "ltr",
              "format": "",
              "indent": 0,
              "version": 1,
              "textFormat": 0,
              "textStyle": ""
            },
            {
              "type": "paragraph",
              "children": [
                {
                  "type": "text",
                  "text": "If a parent or guardian believes a child has supplied personal information inappropriately, they may contact us to request a review.",
                  "detail": 0,
                  "format": 0,
                  "mode": "normal",
                  "style": "",
                  "version": 1
                }
              ],
              "direction": "ltr",
              "format": "",
              "indent": 0,
              "version": 1,
              "textFormat": 0,
              "textStyle": ""
            }
          ],
          "direction": "ltr",
          "format": "",
          "indent": 0,
          "version": 1
        }
      }
    },
    {
      "anchor": "external-links",
      "title": "Links to Other Websites",
      "eyebrow": "External Services",
      "body": {
        "root": {
          "type": "root",
          "children": [
            {
              "type": "paragraph",
              "children": [
                {
                  "type": "text",
                  "text": "Our website may contain links to social media platforms, partner websites and other independently operated services.",
                  "detail": 0,
                  "format": 0,
                  "mode": "normal",
                  "style": "",
                  "version": 1
                }
              ],
              "direction": "ltr",
              "format": "",
              "indent": 0,
              "version": 1,
              "textFormat": 0,
              "textStyle": ""
            },
            {
              "type": "paragraph",
              "children": [
                {
                  "type": "text",
                  "text": "These websites may have their own privacy policies and practices. We encourage you to review their notices before sharing information directly with them.",
                  "detail": 0,
                  "format": 0,
                  "mode": "normal",
                  "style": "",
                  "version": 1
                }
              ],
              "direction": "ltr",
              "format": "",
              "indent": 0,
              "version": 1,
              "textFormat": 0,
              "textStyle": ""
            }
          ],
          "direction": "ltr",
          "format": "",
          "indent": 0,
          "version": 1
        }
      }
    },
    {
      "anchor": "policy-updates",
      "title": "Changes to This Privacy Policy",
      "eyebrow": "Policy Updates",
      "body": {
        "root": {
          "type": "root",
          "children": [
            {
              "type": "paragraph",
              "children": [
                {
                  "type": "text",
                  "text": "We may update this Privacy Policy to reflect changes in our services, technology, legal requirements or information-handling practices.",
                  "detail": 0,
                  "format": 0,
                  "mode": "normal",
                  "style": "",
                  "version": 1
                }
              ],
              "direction": "ltr",
              "format": "",
              "indent": 0,
              "version": 1,
              "textFormat": 0,
              "textStyle": ""
            },
            {
              "type": "paragraph",
              "children": [
                {
                  "type": "text",
                  "text": "The latest version will be made available on this page with an updated revision date. Where required, we will provide additional notice of significant changes.",
                  "detail": 0,
                  "format": 0,
                  "mode": "normal",
                  "style": "",
                  "version": 1
                }
              ],
              "direction": "ltr",
              "format": "",
              "indent": 0,
              "version": 1,
              "textFormat": 0,
              "textStyle": ""
            }
          ],
          "direction": "ltr",
          "format": "",
          "indent": 0,
          "version": 1
        }
      }
    },
    {
      "anchor": "contact",
      "title": "Contact Us About Privacy",
      "eyebrow": "Get in Touch",
      "body": {
        "root": {
          "type": "root",
          "children": [
            {
              "type": "paragraph",
              "children": [
                {
                  "type": "text",
                  "text": "If you have questions about this Privacy Policy, want to understand how your information is handled, or would like to make a privacy-related request, please contact the team responsible for Cherry Blossom Garden.",
                  "detail": 0,
                  "format": 0,
                  "mode": "normal",
                  "style": "",
                  "version": 1
                }
              ],
              "direction": "ltr",
              "format": "",
              "indent": 0,
              "version": 1,
              "textFormat": 0,
              "textStyle": ""
            }
          ],
          "direction": "ltr",
          "format": "",
          "indent": 0,
          "version": 1
        }
      }
    }
  ]
} as PrivacyPolicyContent

const safeAnchor = (raw: string) => raw
  .toLowerCase()
  .trim()
  .replace(/[^a-z0-9-]+/g, '-')
  .replace(/^-+|-+$/g, '')

export function normalizePrivacyPolicy(value?: unknown): PrivacyPolicyContent {
  const D = DEFAULT_PRIVACY_POLICY
  type Raw = {
    seo?: Partial<PrivacyPolicyContent['seo']> | null
    hero?: Partial<PrivacyPolicyContent['hero']> | null
    glance?: Partial<PrivacyPolicyContent['glance']> | null
    contact?: Partial<PrivacyPolicyContent['contact']> | null
    closing?: Partial<PrivacyPolicyContent['closing']> | null
    sections?: Array<Partial<PolicySectionContent> | null> | null
  }
  const raw = value && typeof value === 'object' ? value as Raw : {} as Raw
  const seen = new Set<string>()
  const inputSections = Array.isArray(raw.sections) ? raw.sections : D.sections
  const sections = inputSections
    .filter((entry): entry is Partial<PolicySectionContent> =>
      Boolean(entry && typeof entry.title === 'string' && entry.title.trim()))
    .map((entry, i) => {
      const base = safeAnchor(entry.anchor || entry.title || '') || `section-${i + 1}`
      let anchor = base
      let suffix = 2
      while (seen.has(anchor)) anchor = `${base}-${suffix++}`
      seen.add(anchor)
      return {
        anchor,
        title: entry.title || '',
        eyebrow: entry.eyebrow ?? '',
        body: entry.body ?? D.sections[0].body,
      }
    })
  return {
    seo: { ...D.seo, ...raw.seo },
    hero: { ...D.hero, ...raw.hero },
    glance: { ...D.glance, ...raw.glance },
    contact: { ...D.contact, ...raw.contact },
    closing: { ...D.closing, ...raw.closing },
    sections,
  }
}
