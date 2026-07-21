import type { LegalSection } from './types';

export const childSafeguardingPolicyMeta = {
  title: 'Child Safeguarding Policy',
  subtitle: 'Protecting Every Student on the CoachAcadem Platform',
  effectiveDate: '21 July 2026',
  intro:
    'CoachAcadem is a subsidiary of Right Intellectual Services Enterprise (RISE) Portal Ltd., a company established in the Dubai International Financial Centre (DIFC), United Arab Emirates.',
  supplemental:
    'This Policy operates alongside, and should be read together with, the CoachAcadem Privacy Policy (see Section 15 and Section 6.6).',
};

export const childSafeguardingPolicyToc = [
  { id: 'introduction', label: '1. Introduction and Purpose' },
  { id: 'scope', label: '2. Scope' },
  { id: 'legal-framework', label: '3. Legal and Regulatory Framework' },
  { id: 'definitions', label: '4. Definitions' },
  { id: 'guiding-principles', label: '5. Guiding Principles' },
  { id: 'roles-responsibilities', label: '6. Roles and Responsibilities' },
  { id: 'safer-recruitment', label: '7. Safer Recruitment of Tutors' },
  { id: 'tutor-code-of-conduct', label: '8. Tutor Code of Conduct' },
  {
    id: 'online-digital-safety',
    label: '9. Online and Digital Safety in Tutoring Sessions',
  },
  {
    id: 'recognizing-signs',
    label: '10. Recognizing Signs of Abuse or Harm',
  },
  { id: 'reporting', label: '11. Reporting a Concern' },
  {
    id: 'confidentiality',
    label: '12. Confidentiality and Information Sharing',
  },
  {
    id: 'responding-allegations',
    label: '13. Responding to Allegations Against a Tutor or Staff Member',
  },
  { id: 'training', label: '14. Training and Awareness' },
  { id: 'record-keeping', label: '15. Record Keeping' },
  {
    id: 'monitoring-review',
    label: '16. Monitoring and Review of This Policy',
  },
  { id: 'contact-us', label: '17. Contact Us' },
];

export const childSafeguardingPolicySections: LegalSection[] = [
  {
    id: 'introduction',
    title: '1. Introduction and Purpose',
    blocks: [
      {
        type: 'paragraph',
        text: 'CoachAcadem, a subsidiary of Right Intellectual Services Enterprise (RISE) Portal Ltd., ("CoachAcadem", "we", "us", "our") is committed to creating a safe environment for every student who uses our online tutoring platform. This Child Safeguarding Policy sets out how we prevent, identify, and respond to child-safety concerns, the standards we expect of tutors and staff, and how students, parents, and guardians can raise a concern.',
      },
      {
        type: 'paragraph',
        text: "This Policy is referenced in, and operates alongside, our Privacy Policy — in particular Section 6.6 (Safeguarding) and Section 15 (Children's Safeguarding Note) of that document. Where this Policy requires us to share personal data for safeguarding purposes, that sharing is a permitted exception to the confidentiality commitments set out in our Privacy Policy, consistent with Section 9 (How We Share Information) of that document.",
      },
      {
        type: 'paragraph',
        text: 'Every person who works with or on behalf of CoachAcadem — including employees, contractors, and tutors — shares responsibility for keeping children safe. Safeguarding is not the sole responsibility of any one role; it is a condition of being part of the CoachAcadem platform.',
      },
    ],
  },
  {
    id: 'scope',
    title: '2. Scope',
    blocks: [
      {
        type: 'paragraph',
        text: 'This Policy applies to:',
      },
      {
        type: 'bullets',
        items: [
          'All tutors registered on the CoachAcadem platform, whether engaged as employees, contractors, or freelancers;',
          'All CoachAcadem employees and contractors who have any contact with, or access to data about, students;',
          "All students who use CoachAcadem's Services, particularly those under 18 years of age;",
          'All live tutoring sessions, messaging, and any other interaction that takes place through the CoachAcadem platform between a tutor and a student.',
        ],
      },
      {
        type: 'paragraph',
        text: "This Policy applies to conduct that occurs on the CoachAcadem platform and, where relevant to a person's suitability to work with children, to conduct occurring outside the platform that comes to our attention.",
      },
    ],
  },
  {
    id: 'legal-framework',
    title: '3. Legal and Regulatory Framework',
    blocks: [
      {
        type: 'paragraph',
        text: 'This Policy is built around the following UAE legal and regulatory framework:',
      },
      {
        type: 'bullets',
        items: [
          'UAE Federal Law No. 3 of 2016 concerning Child Rights ("Wadeema\'s Law"), which establishes the general legal framework for child protection in the UAE, including the obligation to report suspected abuse or neglect;',
          'UAE Federal Decree-Law No. 26 of 2025 on Child Digital Safety, which governs the protection of children in online and digital environments, including platforms such as CoachAcadem;',
          'UAE Federal Decree-Law No. 34 of 2021 on Combating Rumours and Cybercrimes, insofar as it addresses the unlawful use of digital platforms to harm, exploit, or endanger children;',
          "Guidance and expectations issued by UAE education regulators — the Knowledge and Human Development Authority (KHDA) in Dubai, the Department of Education and Knowledge (ADEK) in Abu Dhabi, and the Ministry of Education (MOE) — including the MOE's Child Protection Unit framework;",
          'The DIFC Data Protection Law No. 5 of 2020, which governs how safeguarding-related personal data is collected, used, and shared (see Section 12 of this Policy).',
        ],
      },
      {
        type: 'paragraph',
        text: 'Where this Policy sets a higher standard than the minimum required by law, the higher CoachAcadem standard applies.',
      },
    ],
  },
  {
    id: 'definitions',
    title: '4. Definitions',
    blocks: [
      {
        type: 'paragraph',
        text: 'Child: any person under the age of 18.',
      },
      {
        type: 'paragraph',
        text: 'Abuse: physical abuse, emotional/psychological abuse, sexual abuse, neglect, or exploitation of a child, whether occurring once or repeatedly.',
      },
      {
        type: 'paragraph',
        text: 'Online harm: grooming, sexual exploitation, cyberbullying, exposure to inappropriate content, or any other harm to a child facilitated through digital means, including through a tutoring platform.',
      },
      {
        type: 'paragraph',
        text: 'Designated Safeguarding Lead (DSL): the individual within CoachAcadem with overall responsibility for safeguarding, as identified in Section 6.',
      },
      {
        type: 'paragraph',
        text: 'Disclosure: any occasion on which a child, parent, tutor, or other person tells CoachAcadem, directly or indirectly, about actual or suspected abuse or harm.',
      },
    ],
  },
  {
    id: 'guiding-principles',
    title: '5. Guiding Principles',
    blocks: [
      {
        type: 'bullets',
        items: [
          'The best interests of the child are our first consideration in every safeguarding decision.',
          'We take a zero-tolerance approach to any form of abuse, exploitation, or inappropriate conduct toward a student.',
          "Safeguarding is everyone's responsibility — every tutor and staff member is expected to act, not assume someone else will.",
          'We act promptly and proportionately on any concern, however small it may seem.',
          'We listen to and take seriously any concern raised by a child, parent, or guardian.',
          'We support tutors and staff who raise concerns in good faith, and do not tolerate retaliation against them.',
        ],
      },
    ],
  },
  {
    id: 'roles-responsibilities',
    title: '6. Roles and Responsibilities',
    blocks: [],
    subsections: [
      {
        id: 'dsl',
        title: '6.1 Designated Safeguarding Lead (DSL)',
        blocks: [
          {
            type: 'paragraph',
            text: 'CoachAcadem appoints a Designated Safeguarding Lead responsible for: receiving and acting on safeguarding concerns; liaising with UAE authorities and education regulators where necessary; overseeing tutor vetting standards; ensuring safeguarding training is delivered; and maintaining safeguarding records in accordance with Section 15.',
          },
          {
            type: 'paragraph',
            text: '*Designated Safeguarding Lead: [Insert name/role] — Contact: [Insert email/phone]',
          },
          {
            type: 'paragraph',
            text: '*Deputy Designated Safeguarding Lead: [Insert name/role] — Contact: [Insert email/phone] (to ensure cover when the DSL is unavailable)',
          },
        ],
      },
      {
        id: 'leadership',
        title: '6.2 Leadership and Board Oversight',
        blocks: [
          {
            type: 'paragraph',
            text: "CoachAcadem's senior leadership is accountable for ensuring this Policy is resourced, followed, and reviewed, and for ensuring the DSL has the authority and independence needed to act on concerns without commercial considerations overriding a child's safety.",
          },
        ],
      },
      {
        id: 'tutors-staff',
        title: '6.3 Tutors and Staff',
        blocks: [
          {
            type: 'paragraph',
            text: 'All tutors and staff must: complete safeguarding training before working with students; follow the Tutor Code of Conduct in Section 8; report any concern immediately in accordance with Section 11; and never investigate a concern themselves or attempt to resolve it directly with the family or the alleged individual.',
          },
        ],
      },
      {
        id: 'parents-guardians',
        title: '6.4 Parents and Guardians',
        blocks: [
          {
            type: 'paragraph',
            text: 'Parents and guardians are encouraged to talk to their child about how to stay safe online, to review session activity through their parental dashboard, and to raise any concern with CoachAcadem promptly using the channels in Section 11.',
          },
        ],
      },
    ],
  },
  {
    id: 'safer-recruitment',
    title: '7. Safer Recruitment of Tutors',
    blocks: [
      {
        type: 'paragraph',
        text: 'Every tutor must complete the following vetting steps before being approved to tutor a student, consistent with Section 7 (Tutor Data and Vetting) of our Privacy Policy:',
      },
      {
        type: 'bullets',
        items: [
          'Identity verification via Emirates ID and/or passport;',
          'A valid police clearance certificate or equivalent background/safeguarding check, renewed periodically as set out in our internal vetting schedule;',
          'Verification of educational qualifications and, where applicable, teaching license or KHDA/ADEK registration;',
          "At least [two] professional references, with specific reference to the applicant's suitability to work with children;",
          'A structured interview that includes safeguarding-specific questions;',
          'Acknowledgement and signature of this Policy and the Tutor Code of Conduct.',
        ],
      },
      {
        type: 'paragraph',
        text: 'A tutor who does not pass every stage of vetting is not permitted to tutor on the platform. Vetting is repeated at defined intervals for as long as the tutor remains active on CoachAcadem, and immediately if any concern arises.',
      },
    ],
  },
  {
    id: 'tutor-code-of-conduct',
    title: '8. Tutor Code of Conduct',
    blocks: [
      {
        type: 'paragraph',
        text: 'All tutors must:',
      },
      {
        type: 'bullets',
        items: [
          "Communicate with students only through CoachAcadem's platform messaging and video tools — never through personal phone numbers, personal email, or third-party messaging or social media apps;",
          'Keep all sessions professional, conduct one-to-one video sessions in appropriate attire and settings, and ensure the video background does not reveal private/personal spaces beyond what is reasonable;',
          'Never request or arrange to meet a student in person outside the platform;',
          'Never request, accept, or send gifts, money, or favors to or from a student;',
          'Never ask a student to keep any part of their interaction secret from a parent or CoachAcadem;',
          'Never discuss or share personal, romantic, or sexual matters with a student;',
          "Immediately end and report any session in which a student discloses something concerning, or in which the tutor witnesses something concerning about the student's wellbeing;",
          "Never record, screenshot, or store any part of a session outside CoachAcadem's official recording system;",
          'Report any breach of this Code of Conduct by another tutor or staff member that they become aware of.',
        ],
      },
      {
        type: 'paragraph',
        text: 'Breach of this Code of Conduct may result in immediate suspension, removal from the platform, and referral to UAE authorities where appropriate, in accordance with Section 13.',
      },
    ],
  },
  {
    id: 'online-digital-safety',
    title: '9. Online and Digital Safety in Tutoring Sessions',
    blocks: [
      {
        type: 'bullets',
        items: [
          "All live sessions take place through CoachAcadem's platform, which provides a controlled, monitorable environment rather than open third-party video tools.",
          'Where sessions are recorded (see Section 4.4 of our Privacy Policy), recordings are available for safeguarding review by the DSL where a concern is raised.',
          'Direct messaging between a tutor and a student is limited to platform channels, which may be reviewed by CoachAcadem where a concern is raised.',
          "Parents may, at their option, be present or periodically check in during a younger student's session.",
          'Students are given simple, age-appropriate guidance on what to do if a tutor or another user makes them feel uncomfortable, including how to end a session and how to tell a parent or CoachAcadem.',
        ],
      },
    ],
  },
  {
    id: 'recognizing-signs',
    title: '10. Recognizing Signs of Abuse or Harm',
    blocks: [
      {
        type: 'paragraph',
        text: 'Tutors and staff should be alert to signs that may indicate a child is experiencing abuse, neglect, or online harm, including but not limited to:',
      },
      {
        type: 'bullets',
        items: [
          "Unexplained changes in a student's behavior, mood, or engagement during sessions;",
          'A student disclosing, directly or indirectly, that they are being hurt, frightened, or made to feel unsafe;',
          'Signs of neglect, such as a student appearing consistently unsupervised, unwell, or distressed without explanation;',
          'Indications of online grooming or exploitation, such as a student being asked to keep secrets, being offered gifts, or receiving inappropriate contact from any source;',
          "A parent, guardian, or another tutor raising a concern about a specific student's welfare.",
        ],
      },
      {
        type: 'paragraph',
        text: 'Tutors and staff are not expected to diagnose or investigate — only to notice, record what they observed factually, and report it immediately in accordance with Section 11.',
      },
    ],
  },
  {
    id: 'reporting',
    title: '11. Reporting a Concern',
    blocks: [],
    subsections: [
      {
        id: 'internal-reporting',
        title: '11.1 Internal Reporting',
        blocks: [
          {
            type: 'paragraph',
            text: 'Any tutor, staff member, parent, or student who has a safeguarding concern should report it immediately to the Designated Safeguarding Lead using [Insert reporting channel — email/phone/in-app report button]. Reports can be made confidentially, and CoachAcadem will not disclose the identity of the person reporting beyond what is necessary to act on the concern.',
          },
        ],
      },
      {
        id: 'external-reporting',
        title: '11.2 External Reporting to UAE Authorities',
        blocks: [
          {
            type: 'paragraph',
            text: 'Where a concern indicates a child may be at risk of serious harm, CoachAcadem will, in addition to internal escalation, report to the relevant UAE authority without delay. Key UAE reporting channels include:',
          },
          {
            type: 'table',
            headers: ['Authority', 'Purpose', 'Contact'],
            rows: [
              [
                'Ministry of Interior — Child Protection Centre',
                'National hotline for reporting suspected child abuse',
                "116111 (toll-free) / 'Hemayati' app / MoI Child Protection Centre website",
              ],
              [
                'Ministry of Education — Child Protection Unit',
                "Reporting concerns linked to a student's education setting",
                '80085 / CPU@moe.gov.ae',
              ],
              [
                'Dubai Foundation for Women and Children',
                'Support and reporting for cases involving Dubai-based families',
                '800111',
              ],
              [
                'EWAA Shelter for Women and Children (Abu Dhabi)',
                'Support and reporting for cases involving Abu Dhabi-based families',
                '8007283',
              ],
              [
                'Police (emergency)',
                'Immediate risk to life or safety',
                '999',
              ],
            ],
          },
          {
            type: 'paragraph',
            text: 'Tutors and staff should never delay reporting an urgent safety concern in order to first notify CoachAcadem internally — where a child is in immediate danger, contact UAE emergency services (999) directly, then inform the DSL as soon as possible.',
          },
        ],
      },
    ],
  },
  {
    id: 'confidentiality',
    title: '12. Confidentiality and Information Sharing',
    blocks: [
      {
        type: 'paragraph',
        text: 'Safeguarding information is shared strictly on a need-to-know basis. However, where sharing information is necessary to protect a child, this takes priority over routine confidentiality or data-minimization practice. This is consistent with Section 6.6 and Section 9 of our Privacy Policy, which recognize safeguarding disclosure to relevant authorities as a lawful basis for sharing personal data notwithstanding our general confidentiality commitments.',
      },
      {
        type: 'paragraph',
        text: 'We will inform a parent or guardian that a safeguarding report has been made where it is safe and appropriate to do so, but will not do so where this could increase risk to the child.',
      },
    ],
  },
  {
    id: 'responding-allegations',
    title: '13. Responding to Allegations Against a Tutor or Staff Member',
    blocks: [
      {
        type: 'bullets',
        items: [
          "On receipt of an allegation, the DSL will assess the level of risk and, where there is any indication of immediate risk to a student, will suspend the tutor's access to the platform pending investigation;",
          'CoachAcadem will not conduct its own investigation in place of the appropriate UAE authority where the allegation may constitute a criminal offence — in such cases, we will report to the Ministry of Interior Child Protection Centre or the police and cooperate fully with any official investigation;',
          "Where an allegation does not meet the threshold for police referral but breaches our Code of Conduct, CoachAcadem will conduct an internal review and may issue a warning, require retraining, or permanently remove the tutor from the platform;",
          "Records of allegations and their outcomes are retained in accordance with Section 15, separately from a tutor's general platform account data.",
          'A tutor who is the subject of an allegation will be treated fairly and informed of the process, consistent with the priority given to student safety.',
        ],
      },
    ],
  },
  {
    id: 'training',
    title: '14. Training and Awareness',
    blocks: [
      {
        type: 'bullets',
        items: [
          'All tutors and relevant staff complete mandatory safeguarding training before their first session with a student, covering this Policy, the Tutor Code of Conduct, recognizing signs of harm, and reporting procedures;',
          'Refresher training is required at least annually, or sooner if this Policy is materially updated;',
          'The DSL and Deputy DSL receive additional, role-specific safeguarding training appropriate to their responsibilities;',
          'Training completion is recorded and monitored by CoachAcadem.',
        ],
      },
    ],
  },
  {
    id: 'record-keeping',
    title: '15. Record Keeping',
    blocks: [
      {
        type: 'paragraph',
        text: 'Safeguarding records — including concerns raised, actions taken, and outcomes — are kept separately from general account and academic records, with access restricted to the DSL, Deputy DSL, and other individuals who need access to act on a specific matter.',
      },
      {
        type: 'paragraph',
        text: 'Safeguarding records are retained for [INSERT PERIOD — commonly a longer period than standard account data, given potential future relevance] to meet legal, regulatory, and child-protection obligations, and are handled in accordance with the security and retention principles in our Privacy Policy, adapted as necessary to reflect the sensitivity of safeguarding data.',
      },
    ],
  },
  {
    id: 'monitoring-review',
    title: '16. Monitoring and Review of This Policy',
    blocks: [
      {
        type: 'paragraph',
        text: 'This Policy is reviewed at least annually, and sooner following any safeguarding incident, a change in UAE law, or updated guidance from KHDA, ADEK, or the Ministry of Education. The DSL is responsible for proposing updates to senior leadership for approval.',
      },
    ],
  },
  {
    id: 'contact-us',
    title: '17. Contact Us',
    blocks: [
      {
        type: 'paragraph',
        text: 'To raise a safeguarding concern or ask a question about this Policy, contact:',
      },
      {
        type: 'paragraph',
        text: 'Designated Safeguarding Lead: [Insert name/role] — [Insert email/phone]',
      },
      {
        type: 'paragraph',
        text: 'General safeguarding inbox: safeguarding@coachacadem.com',
      },
      {
        type: 'paragraph',
        text: 'If a child is in immediate danger, contact UAE Police on 999, or the Ministry of Interior Child Protection Centre on 116111, without delay.',
      },
    ],
  },
];
