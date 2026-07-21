import type { LegalBlock, LegalSection } from './types';

export type { LegalBlock, LegalSection };

export const privacyPolicyMeta = {
  title: 'Privacy Policy',
  subtitle: 'For Parents, Students, and Tutors',
  effectiveDate: '21 July 2026',
  intro:
    'CoachAcadem is a subsidiary of Right Intellectual Services Enterprise (RISE) Portal Ltd., a company established in the Dubai International Financial Centre (DIFC), United Arab Emirates.',
};

export const privacyPolicyToc = [
  { id: 'introduction', label: '1. Introduction and Scope' },
  { id: 'who-we-are', label: '2. Who We Are and How to Contact Us' },
  { id: 'governing-law', label: '3. Governing Law and Regulatory Framework' },
  { id: 'information-we-collect', label: '4. Information We Collect' },
  {
    id: 'how-we-use-information',
    label: '5. How and Why We Use Information, and Our Legal Basis',
  },
  {
    id: 'childrens-privacy',
    label: "6. Children's Privacy and Parental Consent",
  },
  { id: 'tutor-data', label: '7. Tutor Data and Vetting' },
  { id: 'cookies', label: '8. Cookies and Tracking Technologies' },
  { id: 'how-we-share', label: '9. How We Share Information' },
  { id: 'international-transfers', label: '10. International Data Transfers' },
  {
    id: 'data-security',
    label: '11. Data Security and Breach Notification',
  },
  { id: 'data-retention', label: '12. Data Retention' },
  { id: 'your-rights', label: '13. Your Rights' },
  { id: 'complaints', label: '14. Complaints' },
  {
    id: 'safeguarding-note',
    label: "15. Children's Safeguarding Note",
  },
  { id: 'changes', label: '16. Changes to This Policy' },
  { id: 'contact-us', label: '17. Contact Us' },
];

export const privacyPolicySections: LegalSection[] = [
  {
    id: 'introduction',
    title: '1. Introduction and Scope',
    blocks: [
      {
        type: 'paragraph',
        text: 'This Privacy Policy explains how CoachAcadem ("CoachAcadem", "we", "us", or "our"), a company incorporated in the Dubai International Financial Centre (DIFC), United Arab Emirates, collects, uses, discloses, and protects personal data in connection with our online tutoring platform, including our website, mobile applications, live tutoring sessions, and related services (collectively, the "Services").',
      },
      {
        type: 'paragraph',
        text: 'This Policy applies to three groups of individuals, and is written to address the distinct rights and expectations of each:',
      },
      {
        type: 'bullets',
        items: [
          "Parents and legal guardians who register a child for tutoring and manage the child's account;",
          'Students, including minors, who receive tutoring through the Services;',
          'Tutors who register with CoachAcadem to provide tutoring services through the platform.',
        ],
      },
      {
        type: 'paragraph',
        text: "Please read this Policy carefully. By creating an account, registering a child, or providing tutoring services through CoachAcadem, you acknowledge that you have read and understood this Policy, subject to the consent mechanisms described in Section 6 (Children's Privacy and Parental Consent) and Section 13 (Your Rights).",
      },
    ],
  },
  {
    id: 'who-we-are',
    title: '2. Who We Are and How to Contact Us',
    blocks: [
      {
        type: 'paragraph',
        text: 'Data Controller: CoachAcadem is a subsidiary of Right Intellectual Services Enterprise (RISE) Portal Ltd., a company registered in the Dubai International Financial Centre, with registered office at GA, SZ, Level 1, 208, DIFC, United Arab Emirates.',
      },
      {
        type: 'paragraph',
        text: 'Privacy contact: privacy@coachacadem.com — for any question, concern, or request relating to this Policy or your personal data.',
      },
      {
        type: 'paragraph',
        text: "Data Protection Officer / Privacy Lead: [Insert name/role if appointed — recommended given CoachAcadem processes children's data and sensitive personal data at scale, which typically triggers a DPO obligation under DIFC Law No. 5 of 2020.]",
      },
    ],
  },
  {
    id: 'governing-law',
    title: '3. Governing Law and Regulatory Framework',
    blocks: [
      {
        type: 'paragraph',
        text: 'CoachAcadem\'s processing of personal data is governed primarily by the DIFC Data Protection Law No. 5 of 2020, as amended ("DIFC Data Protection Law"), because CoachAcadem is established in the DIFC. Where CoachAcadem processes personal data of individuals located in the United Arab Emirates outside the DIFC ("onshore" UAE), that processing is additionally subject to UAE Federal Decree-Law No. 45 of 2021 on the Protection of Personal Data ("UAE PDPL") and its Executive Regulations.',
      },
      {
        type: 'paragraph',
        text: 'Where our Services involve children, we also apply the standards set out in UAE Federal Decree-Law No. 26 of 2025 on Child Digital Safety and any Cabinet decisions issued under it, regardless of which data protection law technically governs a given individual, as a matter of consistent practice across all CoachAcadem users.',
      },
      {
        type: 'paragraph',
        text: 'As an education-sector service provider, we also align our practices with the expectations of applicable UAE education regulators, including the Knowledge and Human Development Authority (KHDA) in Dubai, the Department of Education and Knowledge (ADEK) in Abu Dhabi, and the Ministry of Education (MOE), where relevant to our operations or to any school partnerships.',
      },
      {
        type: 'paragraph',
        text: 'This Policy does not apply US, EU, or other foreign privacy frameworks to your data by default. If you are located outside the UAE, your use of the Services and this Policy remain governed by DIFC/UAE law as described above, and Section 10 (International Data Transfers) explains the safeguards that apply if your data is transferred elsewhere.',
      },
    ],
  },
  {
    id: 'information-we-collect',
    title: '4. Information We Collect',
    blocks: [],
    subsections: [
      {
        id: 'information-all-users',
        title: '4.1 Information We Collect From All Users',
        blocks: [
          {
            type: 'bullets',
            items: [
              'Identity data: full name, date of birth, gender (where relevant to matching or verification).',
              'Contact data: email address, phone number, home or billing address.',
              'Account data: username, password (stored in hashed/encrypted form), account preferences.',
              'Technical data: IP address, device identifiers, browser type, operating system, and similar data collected automatically when you use the Services.',
              'Usage data: pages viewed, features used, session duration, and similar activity data.',
              'Communications: messages sent through the platform, support requests, and survey responses.',
            ],
          },
        ],
      },
      {
        id: 'information-parents-students',
        title: '4.2 Information We Collect From Parents and About Students',
        blocks: [
          {
            type: 'bullets',
            items: [
              'Parent/guardian identity and contact data, and proof of parental or guardianship authority where required for verification.',
              'Student identity data: name, date of birth, school, grade/year level, and subjects of interest.',
              'Academic data: assessment results, progress reports, tutor session notes, and learning goals.',
              'Payment and billing data necessary to process fees for tutoring sessions.',
            ],
          },
          {
            type: 'paragraph',
            text: "Sensitive Personal Data: Where a parent chooses to disclose information about a student's learning needs, disabilities, or health conditions (for example, to support an Individual Education Plan or special educational needs accommodation), this constitutes Sensitive Personal Data under the DIFC Data Protection Law. We collect and process this category of data only with the parent's explicit, separate consent, and only to the extent necessary to provide appropriate tutoring support.",
          },
        ],
      },
      {
        id: 'information-tutors',
        title: '4.3 Information We Collect From Tutors',
        blocks: [
          {
            type: 'paragraph',
            text: 'Because tutors are vetted service providers on our platform, we collect a broader category of information at onboarding to verify identity, eligibility, and safety to work with children:',
          },
          {
            type: 'bullets',
            items: [
              'Government-issued identification: Emirates ID and/or passport copy.',
              'Educational qualifications, certifications, and, where applicable, teaching licenses or KHDA/ADEK registration details.',
              'Police clearance certificate or equivalent background/safeguarding check.',
              'Employment or freelance permit status and related right-to-work documentation.',
              'Bank account or payment details for the purpose of processing tutor payouts.',
              'Professional references and, where relevant, results of reference checks.',
              'Session ratings, performance feedback, and platform conduct records.',
            ],
          },
        ],
      },
      {
        id: 'session-recordings',
        title: '4.4 Session Recordings',
        blocks: [
          {
            type: 'paragraph',
            text: 'Live tutoring sessions conducted through the Services may be recorded for quality assurance, safety, and dispute-resolution purposes. Where recording occurs, both the parent/student and the tutor are notified before or at the start of the session that recording is active. Recordings are treated as personal data of both the student and the tutor and are handled in accordance with the retention and security commitments in this Policy.',
          },
        ],
      },
    ],
  },
  {
    id: 'how-we-use-information',
    title: '5. How and Why We Use Information, and Our Legal Basis',
    blocks: [
      {
        type: 'paragraph',
        text: 'We only process personal data where we have a valid legal basis to do so under the DIFC Data Protection Law and, where applicable, the UAE PDPL. The table below sets out our main processing purposes and the corresponding legal basis for each.',
      },
      {
        type: 'table',
        headers: ['Purpose', 'Example', 'Legal Basis'],
        rows: [
          [
            'Providing the Services',
            'Creating accounts, matching students with tutors, delivering tutoring sessions',
            'Performance of a contract with you',
          ],
          [
            'Verifying tutor eligibility',
            'Reviewing ID, qualifications, background checks',
            'Legal obligation / legitimate interest in student safety',
          ],
          [
            'Processing payments',
            'Charging parents, paying tutors',
            'Performance of a contract',
          ],
          [
            'Customer support',
            'Responding to queries and complaints',
            'Legitimate interest / contract',
          ],
          [
            'Safeguarding',
            'Responding to child-safety concerns',
            'Legal obligation / vital interest of the child',
          ],
          [
            'Marketing communications',
            'Newsletters, promotional offers',
            'Consent (opt-in only)',
          ],
          [
            'Service improvement and analytics',
            'Understanding platform usage in aggregate',
            'Legitimate interest, subject to opt-out for non-essential cookies',
          ],
          [
            'Regulatory compliance',
            'Responding to KHDA/ADEK/MOE or regulator requests',
            'Legal obligation',
          ],
        ],
      },
      {
        type: 'paragraph',
        text: "We do not use a student's or tutor's personal data for any purpose incompatible with the purposes above without seeking further consent or identifying an appropriate legal basis and notifying you.",
      },
    ],
  },
  {
    id: 'childrens-privacy',
    title: "6. Children's Privacy and Parental Consent",
    blocks: [],
    subsections: [
      {
        id: 'parental-consent',
        title: '6.1 Verifiable Parental Consent',
        blocks: [
          {
            type: 'paragraph',
            text: "Before a student account is created for a child, we require the registering parent or legal guardian to complete a verification step confirming their identity and their parental or guardianship authority over the child. Consent to the collection and processing of a child's personal data is obtained explicitly from the parent/guardian at this stage — not inferred from continued use of the Services.",
          },
        ],
      },
      {
        id: 'age-threshold',
        title: '6.2 Age Threshold',
        blocks: [
          {
            type: 'paragraph',
            text: 'Given that CoachAcadem is an education platform designed around serving minors, we require verifiable parental or guardian consent for the creation and management of any student account belonging to a person under 18 years of age, in addition to the specific protections that apply to children under 13 under UAE Federal Decree-Law No. 26 of 2025 on Child Digital Safety.',
          },
        ],
      },
      {
        id: 'parental-control',
        title: '6.3 Parental Control and Access',
        blocks: [
          {
            type: 'paragraph',
            text: 'Parents/guardians can, at any time, through their account dashboard or by contacting privacy@coachacadem.com:',
          },
          {
            type: 'bullets',
            items: [
              'View the personal data held about their child;',
              "Review their child's session history and progress records;",
              "Request correction or deletion of their child's data;",
              "Withdraw consent for further processing and close the child's account.",
            ],
          },
          {
            type: 'paragraph',
            text: 'We will action such requests within the timeframes described in Section 13 (Your Rights).',
          },
        ],
      },
      {
        id: 'no-behavioral-advertising',
        title: '6.4 No Behavioral Advertising or Profiling of Children',
        blocks: [
          {
            type: 'paragraph',
            text: "We do not use a child's personal data to serve targeted or behavioral advertising, to build advertising profiles, or to share it with third parties for their own marketing purposes. Any use of student data for personalizing tutoring content or matching is limited to what is reasonably necessary to deliver the Services.",
          },
        ],
      },
      {
        id: 'sensitive-data-children',
        title: '6.5 Sensitive Personal Data of Children',
        blocks: [
          {
            type: 'paragraph',
            text: "Where a parent discloses information about a child's health, disability, or special educational needs, we treat this as Sensitive Personal Data, collect it only with explicit separate consent, restrict internal access to personnel who need it to support the child's tutoring, and do not use it for any secondary purpose.",
          },
        ],
      },
      {
        id: 'safeguarding',
        title: '6.6 Safeguarding',
        blocks: [
          {
            type: 'paragraph',
            text: 'If CoachAcadem becomes aware of information suggesting a child may be at risk of harm, we may share the minimum necessary information with relevant UAE authorities or education regulators notwithstanding the confidentiality commitments elsewhere in this Policy. This reflects our safeguarding obligations as an education-sector service provider.',
          },
        ],
      },
      {
        id: 'school-regulator-sharing',
        title: '6.7 School and Regulator Data Sharing',
        blocks: [
          {
            type: 'paragraph',
            text: 'Where CoachAcadem partners with a school, or where a UAE education regulator (KHDA, ADEK, or MOE) lawfully requests student progress data as part of a regulatory audit or inspection, we may share the relevant data on that legal basis. We will limit any such disclosure to what is necessary and will inform the parent where we are permitted to do so.',
          },
        ],
      },
    ],
  },
  {
    id: 'tutor-data',
    title: '7. Tutor Data and Vetting',
    blocks: [],
    subsections: [
      {
        id: 'verification-purpose',
        title: '7.1 Purpose Limitation for Verification Data',
        blocks: [
          {
            type: 'paragraph',
            text: 'Identity documents, qualification records, and background/police clearance certificates collected during tutor onboarding are used solely to verify eligibility to tutor on the platform and to meet our safeguarding obligations. This data is not used for marketing or any unrelated purpose.',
          },
        ],
      },
      {
        id: 'vetting-retention',
        title: '7.2 Retention of Vetting Records',
        blocks: [
          {
            type: 'paragraph',
            text: "We retain tutor vetting documentation for the duration of the tutor's engagement with CoachAcadem and for 3 years after the tutor leaves the platform, to meet legal, safeguarding, and dispute-resolution obligations, after which it is securely deleted.",
          },
        ],
      },
      {
        id: 'payment-tax',
        title: '7.3 Payment and Tax Data',
        blocks: [
          {
            type: 'paragraph',
            text: 'Tutor bank details and invoicing information are used to process payouts and are shared only with our payment processor and, where legally required, UAE tax or labor authorities.',
          },
        ],
      },
      {
        id: 'profile-visibility',
        title: '7.4 Tutor Profile Visibility',
        blocks: [
          {
            type: 'paragraph',
            text: 'Tutors control certain elements of what is shown publicly on their profile (such as their name, subjects taught, qualifications summary, and ratings). Identity documents, payment details, and home address are never made visible to parents or students. Tutors may request adjustments to what is displayed on their public profile by contacting us.',
          },
        ],
      },
      {
        id: 'contact-protection',
        title: '7.5 Protection of Tutor Contact Details',
        blocks: [
          {
            type: 'paragraph',
            text: "CoachAcadem does not share a tutor's personal phone number, personal email address, or home address with parents or students without the tutor's consent. Platform communications between tutors and parents/students are routed through CoachAcadem's messaging system by default.",
          },
        ],
      },
      {
        id: 'tutor-rights',
        title: '7.6 Tutor Data Subject Rights',
        blocks: [
          {
            type: 'paragraph',
            text: 'Tutors have the same data subject rights described in Section 13 (Your Rights) over their own personal data, including the right to access, correct, or request erasure of their vetting and profile data, subject to our legal retention obligations described above.',
          },
        ],
      },
    ],
  },
  {
    id: 'cookies',
    title: '8. Cookies and Tracking Technologies',
    blocks: [
      {
        type: 'paragraph',
        text: 'We use cookies and similar technologies for the following purposes:',
      },
      {
        type: 'bullets',
        items: [
          'Essential: required for the Services to function (for example, keeping you logged in); cannot be disabled.',
          'Personalization: remember your preferences, such as language or region.',
          'Analytics: help us understand how the Services are used, in aggregate.',
          'Marketing/targeting: used to measure and, where consented to, personalize promotional content.',
        ],
      },
      {
        type: 'paragraph',
        text: 'Non-essential cookies (personalization, analytics, marketing) are only set with your prior opt-in consent via our cookie banner. You may withdraw consent at any time through your cookie preference settings. We do not deploy marketing or behavioral-advertising cookies on pages primarily directed at, or used to deliver, services to children.',
      },
    ],
  },
  {
    id: 'how-we-share',
    title: '9. How We Share Information',
    blocks: [
      {
        type: 'paragraph',
        text: 'We do not sell personal data. We may share personal data in the following circumstances:',
      },
      {
        type: 'bullets',
        items: [
          'With service providers/processors who support our operations (e.g., cloud hosting, payment processing, background-check providers, video-conferencing providers for tutoring sessions), under written data processing agreements limiting their use of the data.',
          'With UAE law enforcement, judicial, or regulatory authorities where legally required, including education regulators (KHDA/ADEK/MOE) in connection with their oversight functions.',
          'For safeguarding purposes, as described in Section 6.6.',
          'In connection with a merger, acquisition, or sale of assets, subject to continued protection of personal data under this Policy or an equivalent standard.',
          'With your consent, for any other purpose we specifically disclose to you at the time.',
        ],
      },
    ],
  },
  {
    id: 'international-transfers',
    title: '10. International Data Transfers',
    blocks: [
      {
        type: 'paragraph',
        text: "Personal data collected through the Services is primarily hosted and processed in the United Arab Emirates. Where we engage a service provider located outside the UAE/DIFC, we ensure an appropriate transfer safeguard is in place before the transfer occurs, consistent with the DIFC Data Protection Law's requirements, which may include: a determination that the destination jurisdiction provides an adequate level of protection; DIFC Commissioner-approved standard contractual clauses with the recipient; or another mechanism recognized under DIFC law. We do not rely on blanket user consent as a substitute for these safeguards.",
      },
    ],
  },
  {
    id: 'data-security',
    title: '11. Data Security and Breach Notification',
    blocks: [
      {
        type: 'paragraph',
        text: "We implement reasonable and appropriate technical and organizational measures designed to protect personal data against unauthorized access, disclosure, alteration, or destruction, including encryption of data in transit and at rest, access controls limiting staff access to personal data (particularly children's data) on a need-to-know basis, and secure retention and deletion practices for session recordings.",
      },
      {
        type: 'paragraph',
        text: 'No system is completely secure, and we cannot guarantee absolute security. In the event of a personal data breach that poses a risk to individuals, we will notify the DIFC Commissioner of Data Protection and/or the UAE Data Office, as applicable, and affected individuals, without undue delay and in accordance with our legal obligations.',
      },
    ],
  },
  {
    id: 'data-retention',
    title: '12. Data Retention',
    blocks: [
      {
        type: 'paragraph',
        text: 'We retain personal data only for as long as necessary to fulfil the purposes described in this Policy, including to provide the Services, meet legal and regulatory obligations, resolve disputes, and enforce our agreements. Indicative retention periods include:',
      },
      {
        type: 'bullets',
        items: [
          'Active account data: retained while the account remains active.',
          'Student academic/progress records: retained for 6-12 months after account closure, to support continuity of learning records and potential regulator requests.',
          'Tutor vetting documentation: retained per Section 7.2.',
          'Session recordings: retained for 90 days unless required for longer as part of an active safeguarding or dispute matter.',
          'Payment records: retained as required by applicable UAE financial record-keeping obligations.',
        ],
      },
      {
        type: 'paragraph',
        text: 'On request, or automatically at the end of the applicable retention period, data is securely deleted or anonymized.',
      },
    ],
  },
  {
    id: 'your-rights',
    title: '13. Your Rights',
    blocks: [
      {
        type: 'paragraph',
        text: 'Subject to applicable law, parents/guardians (on behalf of a child), students who have reached the age of majority, and tutors each have the following rights over their own personal data:',
      },
      {
        type: 'bullets',
        items: [
          'Right of access to the personal data we hold about you;',
          'Right to rectification of inaccurate or incomplete data;',
          'Right to erasure of your data, subject to our legal retention obligations;',
          'Right to restrict or object to certain processing;',
          'Right to data portability, where technically feasible;',
          'Right not to be subject to a decision based solely on automated processing that produces legal or similarly significant effects;',
          'Right to withdraw consent at any time, without affecting the lawfulness of processing before withdrawal;',
          'Right to lodge a complaint with the DIFC Commissioner of Data Protection or, where the UAE PDPL applies to your data, the UAE Data Office.',
        ],
      },
      {
        type: 'paragraph',
        text: 'To exercise any of these rights, contact us at privacy@coachacadem.com. We will respond within one month of a verified request, extendable by a further two months for complex requests, in which case we will explain the reason for the extension.',
      },
    ],
  },
  {
    id: 'complaints',
    title: '14. Complaints',
    blocks: [
      {
        type: 'paragraph',
        text: 'If you have a concern about how we handle personal data that we have not resolved to your satisfaction, you may lodge a complaint with:',
      },
      {
        type: 'bullets',
        items: [
          'The DIFC Commissioner of Data Protection (for data governed by the DIFC Data Protection Law); or',
          'The UAE Data Office (for data governed by the UAE PDPL).',
        ],
      },
      {
        type: 'paragraph',
        text: 'We encourage you to contact us first at privacy@coachacadem.com so we can try to resolve your concern directly.',
      },
    ],
  },
  {
    id: 'safeguarding-note',
    title: "15. Children's Safeguarding Note",
    blocks: [
      {
        type: 'paragraph',
        text: 'CoachAcadem is committed to the safety and wellbeing of every student on our platform. This Policy operates alongside our separate Child Safeguarding Policy [insert link/reference], which governs how we prevent, identify, and respond to child-safety concerns, including tutor conduct standards and reporting procedures.',
      },
    ],
  },
  {
    id: 'changes',
    title: '16. Changes to This Policy',
    blocks: [
      {
        type: 'paragraph',
        text: "We may update this Policy from time to time to reflect changes in our practices or in applicable law. We will post the updated Policy on our Services with a revised effective date, and will provide at least [14–30] days' advance notice of material changes. Where a material change affects how we process a child's personal data, we will seek renewed parental consent before the change takes effect.",
      },
    ],
  },
  {
    id: 'contact-us',
    title: '17. Contact Us',
    blocks: [
      {
        type: 'paragraph',
        text: 'If you have any questions, comments, or requests relating to this Privacy Policy, please contact:',
      },
      {
        type: 'paragraph',
        text: 'Email: privacy@coachacadem.com',
      },
      {
        type: 'paragraph',
        text: 'Physical address: CoachAcadem, RISE Ltd., GA, SZ, Level 1, 208, DIFC, United Arab Emirates',
      },
    ],
  },
];
