import type { LegalSection } from './types';

export const termsOfUseMeta = {
  title: 'Terms and Conditions',
  subtitle: 'For Parents, Students, and Tutors Using the CoachAcadem Platform',
  effectiveDate: '21 July 2026',
  intro:
    'CoachAcadem is a subsidiary of Right Intellectual Services Enterprise (RISE) Portal Ltd., a company established in the Dubai International Financial Centre (DIFC), United Arab Emirates.',
  supplemental:
    'Read this document together with the CoachAcadem Privacy Policy and Child Safeguarding Policy.',
};

export const termsOfUseToc = [
  { id: 'introduction', label: '1. Introduction and Acceptance' },
  { id: 'definitions', label: '2. Definitions' },
  { id: 'eligibility', label: '3. Eligibility and Account Registration' },
  { id: 'services', label: '4. Description of the Services' },
  { id: 'parent-obligations', label: '5. Parent and Student Obligations' },
  { id: 'tutor-obligations', label: '6. Tutor Obligations and Status' },
  {
    id: 'fees-payments',
    label: '7. Fees, Payments, Cancellations, and Refunds',
  },
  { id: 'session-conduct', label: '8. Session Conduct and Recording' },
  {
    id: 'user-content',
    label: '9. User Content and Intellectual Property',
  },
  { id: 'prohibited-conduct', label: '10. Prohibited Conduct' },
  {
    id: 'platform-availability',
    label: '11. Platform Availability and Changes to the Services',
  },
  {
    id: 'non-circumvention',
    label: '12. Non-Circumvention and Referral Restrictions',
  },
  {
    id: 'disclaimers',
    label: '13. Disclaimers and Limitation of Liability',
  },
  { id: 'suspension', label: '14. Suspension and Termination' },
  { id: 'confidentiality', label: '15. Confidentiality' },
  { id: 'data-protection', label: '16. Data Protection' },
  {
    id: 'dispute-resolution',
    label: '17. Dispute Resolution and Governing Law',
  },
  { id: 'force-majeure', label: '18. Force Majeure' },
  { id: 'changes', label: '19. Changes to These Terms' },
  { id: 'miscellaneous', label: '20. Miscellaneous' },
  { id: 'contact-us', label: '21. Contact Us' },
];

export const termsOfUseSections: LegalSection[] = [
  {
    id: 'introduction',
    title: '1. Introduction and Acceptance',
    blocks: [
      {
        type: 'paragraph',
        text: 'These Terms and Conditions ("Terms") govern access to and use of the website, mobile applications, and tutoring services (collectively, the "Services") provided by CoachAcadem, a subsidiary of Right Intellectual Services Enterprise (RISE) Portal Ltd., ("CoachAcadem", "we", "us", "our"), a company established in the Dubai International Financial Centre (DIFC), United Arab Emirates.',
      },
      {
        type: 'paragraph',
        text: "By creating an account, registering a child for tutoring, or providing tutoring services through CoachAcadem, you agree to be bound by these Terms. If you are registering a child, you confirm that you are the child's parent or legal guardian and that you have authority to accept these Terms on the child's behalf. If you do not agree to these Terms, you must not use the Services.",
      },
      {
        type: 'paragraph',
        text: 'These Terms should be read together with our Privacy Policy and our Child Safeguarding Policy, both of which are incorporated by reference and available at [insert links].',
      },
    ],
  },
  {
    id: 'definitions',
    title: '2. Definitions',
    blocks: [
      {
        type: 'paragraph',
        text: '"Parent": a parent or legal guardian who registers and manages a Student account.',
      },
      {
        type: 'paragraph',
        text: '"Student": a person, including a minor, who receives tutoring through the Services.',
      },
      {
        type: 'paragraph',
        text: '"Tutor": an individual approved by CoachAcadem to provide tutoring services through the platform, engaged as an independent contractor and not as an employee of CoachAcadem.',
      },
      {
        type: 'paragraph',
        text: '"Session": a scheduled tutoring interaction between a Tutor and a Student conducted through the Services.',
      },
      {
        type: 'paragraph',
        text: '"User Content": any content submitted to the platform by a Parent, Student, or Tutor, including messages, session materials, and profile information.',
      },
      {
        type: 'paragraph',
        text: '"Platform": the CoachAcadem website, application, and underlying technology through which the Services are delivered.',
      },
    ],
  },
  {
    id: 'eligibility',
    title: '3. Eligibility and Account Registration',
    blocks: [],
    subsections: [
      {
        id: 'parents-students',
        title: '3.1 Parents and Students',
        blocks: [
          {
            type: 'paragraph',
            text: "A Student account may only be created by a Parent who verifies their identity and their parental or guardianship authority in accordance with our Privacy Policy. Parents are responsible for the accuracy of information provided and for supervising their child's use of the Services in a manner appropriate to the child's age.",
          },
        ],
      },
      {
        id: 'tutors',
        title: '3.2 Tutors',
        blocks: [
          {
            type: 'paragraph',
            text: "An individual may only become an approved Tutor after successfully completing CoachAcadem's vetting process, as described in our Child Safeguarding Policy, including identity verification, qualification checks, and a police clearance certificate or equivalent background check. CoachAcadem may decline or revoke Tutor approval at its sole discretion, including where vetting requirements are not met or are no longer met.",
          },
        ],
      },
      {
        id: 'account-security',
        title: '3.3 Account Security',
        blocks: [
          {
            type: 'paragraph',
            text: 'Users are responsible for maintaining the confidentiality of their account credentials and for all activity that occurs under their account. Any suspected unauthorized use must be reported to CoachAcadem immediately.',
          },
        ],
      },
    ],
  },
  {
    id: 'services',
    title: '4. Description of the Services',
    blocks: [
      {
        type: 'paragraph',
        text: 'CoachAcadem operates an online platform that connects Parents and Students with independent Tutors for tutoring Sessions. CoachAcadem facilitates matching, scheduling, payment processing, and the technical infrastructure for Sessions. Except as otherwise stated in these Terms, CoachAcadem is not itself a school, tuition center licensed to deliver a curriculum, or employer of Tutors, and does not guarantee any particular academic outcome from use of the Services.',
      },
      {
        type: 'paragraph',
        text: "Where CoachAcadem's operations require licensing or registration with UAE education regulators (including KHDA, ADEK, or the Ministry of Education) for the specific services it offers, CoachAcadem will maintain such licensing or registration as required and will reflect its registered status in its marketing and platform materials.",
      },
    ],
  },
  {
    id: 'parent-obligations',
    title: '5. Parent and Student Obligations',
    blocks: [
      {
        type: 'bullets',
        items: [
          'Provide accurate registration and payment information and keep it up to date;',
          'Ensure the Student attends scheduled Sessions or cancels/reschedules in accordance with Section 7;',
          "Ensure the Student's use of the Services complies with these Terms and with the standards of respectful conduct expected of all platform users;",
          'Promptly report any safeguarding concern in accordance with our Child Safeguarding Policy;',
          "Not use the Services to contact or engage a Tutor for private tutoring outside the Platform in circumvention of CoachAcadem's fees, as further described in Section 12.",
        ],
      },
    ],
  },
  {
    id: 'tutor-obligations',
    title: '6. Tutor Obligations and Status',
    blocks: [],
    subsections: [
      {
        id: 'independent-contractor',
        title: '6.1 Independent Contractor Status',
        blocks: [
          {
            type: 'paragraph',
            text: 'Tutors provide services as independent contractors and not as employees, agents, or partners of CoachAcadem. Tutors are responsible for their own tax filings, any freelance permit or right-to-work documentation required under UAE law (including any permit required by the Ministry of Human Resources and Emiratisation or the relevant free zone/emirate authority), and their own equipment and internet connectivity necessary to deliver Sessions.',
          },
        ],
      },
      {
        id: 'code-of-conduct',
        title: '6.2 Compliance with the Code of Conduct',
        blocks: [
          {
            type: 'paragraph',
            text: 'Tutors must comply at all times with the Tutor Code of Conduct set out in our Child Safeguarding Policy, including restrictions on off-platform contact with Students, session conduct standards, and mandatory reporting obligations.',
          },
        ],
      },
      {
        id: 'qualifications',
        title: '6.3 Qualifications and Representations',
        blocks: [
          {
            type: 'paragraph',
            text: 'Tutors warrant that all qualifications, certifications, and background-check documentation provided to CoachAcadem are genuine and accurate, and agree to promptly notify CoachAcadem of any change in circumstances relevant to their eligibility to tutor (including any criminal charge, conviction, or safeguarding concern raised against them, whether or not connected to CoachAcadem).',
          },
        ],
      },
      {
        id: 'tutor-non-circumvention',
        title: '6.4 Non-Circumvention',
        blocks: [
          {
            type: 'paragraph',
            text: "Tutors may not solicit or accept payment from a Parent or Student to provide tutoring outside the Platform in order to avoid CoachAcadem's fees, for the period of their engagement with CoachAcadem and for [12] months after a Tutor and Student are matched through the Platform, except where the Parent and Tutor had a pre-existing tutoring relationship independent of CoachAcadem.",
          },
        ],
      },
    ],
  },
  {
    id: 'fees-payments',
    title: '7. Fees, Payments, Cancellations, and Refunds',
    blocks: [],
    subsections: [
      {
        id: 'fees',
        title: '7.1 Fees',
        blocks: [
          {
            type: 'paragraph',
            text: "Session fees are as displayed on the Platform at the time of booking. CoachAcadem may charge a service fee in addition to the Tutor's session rate, as disclosed at checkout.",
          },
        ],
      },
      {
        id: 'payment-processing',
        title: '7.2 Payment Processing',
        blocks: [
          {
            type: 'paragraph',
            text: "Payments are processed through CoachAcadem's third-party payment processor. CoachAcadem does not store full payment card details. Tutor payouts are made on the schedule disclosed to Tutors at onboarding, net of CoachAcadem's service fee.",
          },
        ],
      },
      {
        id: 'cancellations',
        title: '7.3 Cancellations and Rescheduling',
        blocks: [
          {
            type: 'paragraph',
            text: 'Sessions may be cancelled or rescheduled in accordance with the cancellation window displayed at booking (e.g., free cancellation up to [24] hours before a Session). Cancellations made after this window may be charged in full or in part, as disclosed at booking.',
          },
        ],
      },
      {
        id: 'refunds',
        title: '7.4 Refunds',
        blocks: [
          {
            type: 'paragraph',
            text: "Refunds are considered in accordance with CoachAcadem's refund policy [insert link/detail], and in all cases in accordance with the UAE Federal Consumer Protection Law No. 15 of 2020 and its Executive Regulations, to the extent applicable to the transaction.",
          },
        ],
      },
    ],
  },
  {
    id: 'session-conduct',
    title: '8. Session Conduct and Recording',
    blocks: [
      {
        type: 'paragraph',
        text: 'Sessions must be conducted in accordance with the standards set out in our Child Safeguarding Policy. Where Sessions are recorded for quality, safety, or dispute-resolution purposes, this is disclosed to both the Tutor and the Parent/Student in accordance with Section 4.4 of our Privacy Policy. By participating in a Session, Tutors and Students/Parents consent to such recording for those stated purposes.',
      },
    ],
  },
  {
    id: 'user-content',
    title: '9. User Content and Intellectual Property',
    blocks: [],
    subsections: [
      {
        id: 'coachacadem-ip',
        title: '9.1 CoachAcadem IP',
        blocks: [
          {
            type: 'paragraph',
            text: "The Platform, including its software, design, trademarks, and course materials created by or licensed to CoachAcadem, is the property of CoachAcadem or its licensors and is protected by applicable intellectual property laws. No right is granted to use CoachAcadem's branding or materials outside the Services without prior written consent.",
          },
        ],
      },
      {
        id: 'user-content-license',
        title: '9.2 User Content License',
        blocks: [
          {
            type: 'paragraph',
            text: 'By submitting User Content (such as session materials, messages, or profile content), you grant CoachAcadem a non-exclusive, worldwide, royalty-free license to use, host, and display that content solely for the purpose of operating and improving the Services. You retain ownership of your own content.',
          },
        ],
      },
      {
        id: 'tutor-materials',
        title: '9.3 Tutor-Created Materials',
        blocks: [
          {
            type: 'paragraph',
            text: 'Tutors retain ownership of original teaching materials they create, subject to the license granted above. Tutors must not upload or use materials that infringe the intellectual property rights of any third party.',
          },
        ],
      },
    ],
  },
  {
    id: 'prohibited-conduct',
    title: '10. Prohibited Conduct',
    blocks: [
      {
        type: 'paragraph',
        text: 'Users must not:',
      },
      {
        type: 'bullets',
        items: [
          'Violate the Child Safeguarding Policy or Tutor Code of Conduct;',
          'Use the Services for any unlawful purpose, or in a manner that violates UAE law, including the UAE Cybercrimes Law;',
          "Attempt to circumvent CoachAcadem's platform fees as described in Section 6.4;",
          'Upload content that is defamatory, obscene, discriminatory, or otherwise inappropriate, particularly given the presence of minors on the Platform;',
          'Misrepresent their identity, qualifications, or authority to act on behalf of a child;',
          'Attempt to gain unauthorized access to the Platform or interfere with its operation.',
        ],
      },
      {
        type: 'paragraph',
        text: 'CoachAcadem may suspend or terminate access to the Services for any breach of this Section, in accordance with Section 14.',
      },
    ],
  },
  {
    id: 'platform-availability',
    title: '11. Platform Availability and Changes to the Services',
    blocks: [
      {
        type: 'paragraph',
        text: 'CoachAcadem will use reasonable efforts to keep the Platform available but does not guarantee uninterrupted or error-free operation. We may modify, suspend, or discontinue any part of the Services, including specific features, at our discretion, and will provide reasonable notice of material changes where practicable.',
      },
    ],
  },
  {
    id: 'non-circumvention',
    title: '12. Non-Circumvention and Referral Restrictions',
    blocks: [
      {
        type: 'paragraph',
        text: "As set out in Section 6.4, Parents, Students, and Tutors agree not to use information or introductions made through the Platform to establish a direct tutoring arrangement outside the Platform for the purpose of avoiding CoachAcadem's fees. CoachAcadem reserves the right to charge a placement fee or take other action, including suspension of accounts, where this provision is breached.",
      },
    ],
  },
  {
    id: 'disclaimers',
    title: '13. Disclaimers and Limitation of Liability',
    blocks: [],
    subsections: [
      {
        id: 'no-guarantee',
        title: '13.1 No Guarantee of Outcomes',
        blocks: [
          {
            type: 'paragraph',
            text: 'CoachAcadem facilitates access to independent Tutors but does not guarantee specific academic results, grades, or outcomes from any Session or course of tutoring.',
          },
        ],
      },
      {
        id: 'disclaimer',
        title: '13.2 Disclaimer',
        blocks: [
          {
            type: 'paragraph',
            text: 'To the fullest extent permitted by applicable law, the Services are provided on an "as is" and "as available" basis, without warranties of any kind, whether express or implied, except as cannot be excluded under UAE law, including the Federal Consumer Protection Law No. 15 of 2020.',
          },
        ],
      },
      {
        id: 'limitation-liability',
        title: '13.3 Limitation of Liability',
        blocks: [
          {
            type: 'paragraph',
            text: "To the fullest extent permitted by applicable law, CoachAcadem's aggregate liability arising out of or relating to these Terms or the Services shall not exceed the fees paid by the relevant Parent to CoachAcadem in the [12] months preceding the claim. Nothing in these Terms limits liability for death or personal injury caused by negligence, fraud, or any other liability that cannot be excluded or limited under UAE or DIFC law.",
          },
        ],
      },
      {
        id: 'tutor-conduct',
        title: '13.4 Tutor Conduct',
        blocks: [
          {
            type: 'paragraph',
            text: "While CoachAcadem vets Tutors in accordance with its Child Safeguarding Policy, Tutors act as independent contractors, and CoachAcadem's liability for the acts or omissions of a Tutor is limited to the extent permitted by applicable law, without prejudice to CoachAcadem's own safeguarding, vetting, and reporting obligations under its Child Safeguarding Policy.",
          },
        ],
      },
    ],
  },
  {
    id: 'suspension',
    title: '14. Suspension and Termination',
    blocks: [
      {
        type: 'paragraph',
        text: 'CoachAcadem may suspend or terminate a Parent, Student, or Tutor account, with or without notice, where: there is a breach of these Terms, the Child Safeguarding Policy, or the Tutor Code of Conduct; continued access poses a risk to a Student\'s safety; or CoachAcadem is required to do so by law or regulator direction. Users may close their own account at any time by contacting CoachAcadem, subject to completion of any outstanding Sessions or payments.',
      },
    ],
  },
  {
    id: 'confidentiality',
    title: '15. Confidentiality',
    blocks: [
      {
        type: 'paragraph',
        text: 'Each party agrees to keep confidential any non-public information obtained through use of the Services, except where disclosure is required by law, necessary for safeguarding purposes under our Child Safeguarding Policy, or otherwise permitted under our Privacy Policy.',
      },
    ],
  },
  {
    id: 'data-protection',
    title: '16. Data Protection',
    blocks: [
      {
        type: 'paragraph',
        text: 'CoachAcadem processes personal data in accordance with its Privacy Policy, which is governed primarily by the DIFC Data Protection Law No. 5 of 2020 and, where applicable, UAE Federal Decree-Law No. 45 of 2021 on the Protection of Personal Data. By using the Services, you acknowledge that you have read the Privacy Policy.',
      },
    ],
  },
  {
    id: 'dispute-resolution',
    title: '17. Dispute Resolution and Governing Law',
    blocks: [],
    subsections: [
      {
        id: 'governing-law',
        title: '17.1 Governing Law',
        blocks: [
          {
            type: 'paragraph',
            text: 'These Terms are governed by and construed in accordance with the laws of the Dubai International Financial Centre, and, to the extent applicable, the federal laws of the United Arab Emirates.',
          },
        ],
      },
      {
        id: 'jurisdiction',
        title: '17.2 Jurisdiction',
        blocks: [
          {
            type: 'paragraph',
            text: "The parties submit to the exclusive jurisdiction of the DIFC Courts (established under DIFC Law No. 2 of 2025 and its predecessor legislation) in respect of any dispute arising out of or in connection with these Terms, save that CoachAcadem may seek interim or injunctive relief in any court of competent jurisdiction where necessary to protect a Student's safety or CoachAcadem's rights.",
          },
        ],
      },
      {
        id: 'adr',
        title: '17.3 Alternative Dispute Resolution',
        blocks: [
          {
            type: 'paragraph',
            text: 'Before initiating formal proceedings, the parties agree to attempt to resolve any dispute in good faith through direct negotiation, and may agree to refer the dispute to mediation or arbitration (including under the DIFC-LCIA Arbitration Rules or any successor body) as an alternative to litigation.',
          },
        ],
      },
      {
        id: 'consumer-protection',
        title: '17.4 Consumer Protection',
        blocks: [
          {
            type: 'paragraph',
            text: 'Nothing in this Section limits any right a Parent may have as a consumer under the UAE Federal Consumer Protection Law No. 15 of 2020 that cannot lawfully be excluded or restricted by agreement.',
          },
        ],
      },
    ],
  },
  {
    id: 'force-majeure',
    title: '18. Force Majeure',
    blocks: [
      {
        type: 'paragraph',
        text: 'Neither party is liable for any failure or delay in performance caused by circumstances beyond its reasonable control, including natural disaster, government action, internet or telecommunications failure, or public health emergency, provided the affected party notifies the other and uses reasonable efforts to mitigate the impact.',
      },
    ],
  },
  {
    id: 'changes',
    title: '19. Changes to These Terms',
    blocks: [
      {
        type: 'paragraph',
        text: "CoachAcadem may update these Terms from time to time. We will provide at least 14–30 days' notice of material changes by posting an updated version on the Platform and, where the change materially affects a Student's use of the Services, by notifying the relevant Parent directly. Continued use of the Services after the effective date of an update constitutes acceptance of the revised Terms.",
      },
    ],
  },
  {
    id: 'miscellaneous',
    title: '20. Miscellaneous',
    blocks: [
      {
        type: 'bullets',
        items: [
          'Entire Agreement: These Terms, together with the Privacy Policy and Child Safeguarding Policy, constitute the entire agreement between the parties regarding the Services.',
          'Severability: If any provision of these Terms is held invalid or unenforceable, the remaining provisions continue in full force and effect.',
          "Assignment: Users may not assign their rights under these Terms without CoachAcadem's prior written consent; CoachAcadem may assign these Terms in connection with a merger, acquisition, or sale of assets.",
          'No Waiver: A failure to enforce any provision of these Terms does not constitute a waiver of that provision.',
          'Notices: Notices under these Terms should be sent to the contact details in Section 21.',
        ],
      },
    ],
  },
  {
    id: 'contact-us',
    title: '21. Contact Us',
    blocks: [
      {
        type: 'paragraph',
        text: 'If you have any questions about these Terms, please contact:',
      },
      {
        type: 'paragraph',
        text: 'Email: legal@coachacadem.com',
      },
      {
        type: 'paragraph',
        text: 'Postal address: CoachAcadem a, subsidiary of Right Intellectual Services Enterprise (RISE) Portal Ltd., GA, SZ, Level 1, 208, DIFC, United Arab Emirates',
      },
    ],
  },
];
