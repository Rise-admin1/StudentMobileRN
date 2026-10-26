export type HelpItem = {
  id: string;
  title: string;
  content: string;
};

export type HelpCategory = {
  title: string;
  icon: string;
  items: HelpItem[];
};

export const helpCategories: HelpCategory[] = [
  {
    title: 'Getting started',
    icon: 'compass-outline',
    items: [
      {
        id: 'account-types',
        title: 'What each account can do',
        content:
          'Coach Academ has four account types. You choose one when you register, and that choice decides what you see in the app.\n\n' +
          'Student. Find tutors and courses, save courses, buy a class or a series, join live sessions, track your own progress, chat with tutors you have paid, post reviews, and use Community. You can also accept a parent who wants to follow your learning.\n\n' +
          'Tutor. Create and publish courses, teach live classes, see your schedule and teaching progress, chat with students who bought your course, reply to their parents, rate students, share your profile, and use Community. Tutors can also create or join an organization.\n\n' +
          'Organization. A tutor account that runs a team. The person who creates the organization is the team lead. They invite other tutors, share an invite code, see members, and add more tutor seats when the team grows.\n\n' +
          'Parent. Link a student by email, see that student’s courses, classes, hours, and tutor ratings, message tutors of courses the student has purchased, and view billing for linked students. Parents use the Students, Chat, and Profile tabs.',
      },
      {
        id: 'create-account',
        title: 'Create an account',
        content:
          '1. Open the app and choose Register.\n' +
          '2. Pick Student, Tutor, Organization, or Parent.\n' +
          '3. Add your name, email, password, and a short description. You can add a profile photo.\n' +
          '4. Students choose subjects, a curriculum, and a grade. Tutors and organizations choose the subjects, curricula, and grades they teach.\n' +
          '5. If you chose Organization, also add the organization name, your role (Owner, Manager, or Tutor), the organization email, website, trade license, and how many tutors you expect.\n' +
          '6. Submit the form, then sign in with the same email and password.\n\n' +
          'The first time you sign in, a short introduction explains the main things your account type can do.',
      },
      {
        id: 'sign-in',
        title: 'Sign in or reset your password',
        content:
          'On the welcome screen, choose Login and enter the email and password for your account.\n\n' +
          'If you forgot the password, open Forgot password on the login screen, enter your email, and follow the reset link. Then set a new password.\n\n' +
          'To change a password you still know, go to Profile, open Settings, then Change Password. Enter the current password and the new password twice.',
      },
      {
        id: 'edit-profile',
        title: 'Update your profile',
        content:
          'Go to Profile and tap Edit profile, or open Settings and choose Edit Profile.\n\n' +
          'You can change your name, photo, and the short description on your profile. Students also see subject tags from registration on this screen.\n\n' +
          'Tutors can share their public profile from the share icon at the top of Profile. The link opens your tutor page so students can find you.',
      },
      {
        id: 'delete-account',
        title: 'Delete your account',
        content:
          'Go to Profile, open Settings, and choose Delete Account in the danger zone.\n\n' +
          'Follow the confirmation on that screen. Deleting an account removes your access to classes, chats, and purchases tied to it, so only continue if you are sure.\n\n' +
          'To sign out without deleting anything, use Logout at the bottom of Settings.',
      },
    ],
  },
  {
    title: 'Students',
    icon: 'school-outline',
    items: [
      {
        id: 'find-course',
        title: 'Find a course',
        content:
          'Home is your starting point. Use the search bar, Featured courses, or Browse courses. See all opens the full course list, where you can search by course or tutor name.\n\n' +
          'To narrow the list, tap the filter icon and enter a grade and curriculum, then apply the filter.\n\n' +
          'Open a course to read the description, price in AED, what you will learn, the tutor, reviews, and how many spots are left on a group course.',
      },
      {
        id: 'save-course',
        title: 'Save a course for later',
        content:
          'On a course page, use the save icon to keep it. Saved courses are on Home under the Saved tile.\n\n' +
          'Tap the same icon again to remove it from Saved.',
      },
      {
        id: 'buy-private',
        title: 'Buy a private class or private series',
        content:
          'Private courses are taught one-to-one. A private class is a single live session. A private series is several hours split into topics.\n\n' +
          '1. Open the course and tap Enroll now.\n' +
          '2. Pick a date and time on the booking calendar.\n' +
          '3. Review the booking summary.\n' +
          '4. Pay with a credit or debit card. Prices are in AED.\n\n' +
          'After payment, the course appears under Your Courses on Profile, and the session appears on your schedule.',
      },
      {
        id: 'buy-group',
        title: 'Buy a group class or group series',
        content:
          'Group courses already have a time set by the tutor. A group class is one shared session. A group series is a set of topics with their own times.\n\n' +
          '1. Open the course and check the spots left.\n' +
          '2. Tap Enroll now. You go straight to payment because the schedule is already set.\n' +
          '3. Pay with a credit or debit card.\n\n' +
          'If the course is full, the button says Course full. If you already bought it, the button says Already enrolled. If the class time has passed, enrollment is closed.',
      },
      {
        id: 'join-class',
        title: 'Join a live class',
        content:
          'Upcoming classes show on Home under Up next, and the full list is on Schedule. You can open Schedule from Home or from the calendar on your Profile.\n\n' +
          'Tap a class to see the course, the tutor, the date, and the time. Choose Join to open the Zoom meeting.\n\n' +
          'Use a stable internet connection before the class starts. If Join does not open, update the app or contact support from Settings.',
      },
      {
        id: 'student-progress',
        title: 'Track your progress',
        content:
          'On Home, tap Progress.\n\n' +
          'You will see your courses, completed courses, completed classes, upcoming classes, and hours completed. Each course shows how far you are, your last or next session, and the hours finished out of the total.',
      },
      {
        id: 'student-chat',
        title: 'Message your tutor',
        content:
          'Chat unlocks after you buy that tutor’s course.\n\n' +
          'On the course page, tap the chat icon. You can also open the Chat tab to see existing conversations. Search the list if you have several tutors.\n\n' +
          'In a student chat you can send text, a photo, or a voice note. The tutor’s online status shows on the conversation.',
      },
      {
        id: 'student-review',
        title: 'Review a course',
        content:
          'After you purchase a course, the course page lets you leave a star rating and a written review.\n\n' +
          'To see reviews you have already posted, go to Profile, open Settings, then Your Reviews.',
      },
      {
        id: 'student-community',
        title: 'Use Community',
        content:
          'The Community tab lists groups you can open. Search by name if the list is long.\n\n' +
          'Open a community to read messages and send your own. Member counts are shown on each card.',
      },
      {
        id: 'parent-request',
        title: 'Accept or reject a parent',
        content:
          'A parent can invite your student account by email. The request appears on your Profile under Parent requests.\n\n' +
          'Accept if you want that parent to see your courses, classes, hours, and tutor ratings, and to message your tutors. Reject if you do not.\n\n' +
          'After you accept, the card says Linked to your account. To unlink later, tap Unlink and contact support. The link stays until support removes it.',
      },
      {
        id: 'student-billing',
        title: 'Receipts and refunds',
        content:
          'Go to Profile, open Settings, then Billing. Each purchase shows the course, amount, date, and status. Tap the invoice when you need a receipt.\n\n' +
          'You can request a refund when the payment is complete and the next class is at least 2 days away (UAE time). Tap Request refund, write the reason, and submit.\n\n' +
          'The purchase then shows Refund pending. After review it becomes Refunded or Refund declined. You will also get an email about the decision.',
      },
      {
        id: 'report-block',
        title: 'Report a course or block someone',
        content:
          'On a course page, open the menu to report the course. Describe what happened and send the report. You can review reports you have sent in Settings under Your Reports.\n\n' +
          'You can also block a tutor from that course menu. Blocked people are listed in Settings under Blocked Users, where you can review who you have blocked.',
      },
      {
        id: 'student-ratings',
        title: 'Ratings from your tutors',
        content:
          'Tutors can rate you after a class. Those ratings appear on your Profile under Ratings, with the tutor’s name and comment.\n\n' +
          'A linked parent can see the same ratings when they open your learning activity.',
      },
    ],
  },
  {
    title: 'Tutors',
    icon: 'person-outline',
    items: [
      {
        id: 'zoom-setup',
        title: 'Set up Zoom before you teach',
        content:
          'Course creation stays locked until your Zoom account is ready.\n\n' +
          'Check the email you used to register, including spam, for a Zoom activation invite. Accept that invite. Then return to the app and create a course.\n\n' +
          'If you try before this is done, the app tells you the Zoom account is not verified yet.',
      },
      {
        id: 'create-course',
        title: 'Create a course',
        content:
          'On Home or Profile, tap Create course.\n\n' +
          'Step 1. Who is this course for? Choose One student or A group.\n' +
          'Step 2. How do you want to teach? Choose One live class (1–2 hours) or A series of classes (3–20 hours split into topics).\n\n' +
          'A private one-class course is free to create. Group classes and series use a paid tutor plan. If that plan is locked, the app opens the purchase screen before the form.\n\n' +
          'The form has four parts:\n' +
          '1. About this course. Add a 16:9 cover photo, title, short description, and price in AED.\n' +
          '2. Who it’s for. Choose the subject, curriculum, grade, and teaching language. Set the duration. For a group class, pick the class date and time. For a series, add topics of 1–3 hours each so the hours add up to the total. For a group series, also pick a date and time for every topic. Those dates must fall within a window equal to the total hours, counted in days from the start.\n' +
          '3. What students will learn. Add short outcomes, one at a time. Three to six points is a good range.\n' +
          '4. Verify and publish. Upload your subject license and Emirates ID as PDFs, agree to the teaching agreement, then tap Publish course.\n\n' +
          'If you leave and come back, a saved draft is marked Draft saved on that course type.',
      },
      {
        id: 'after-publish',
        title: 'After you publish a course',
        content:
          'A new course is reviewed before students can find and buy it. It stays on your Profile under Your Courses while that happens.\n\n' +
          'If it is sent back, you will see the reason on the course card. Update the course and save it to send it again, or use Resubmit on the card.\n\n' +
          'Once it is approved, students can search for it, save it, and enroll.',
      },
      {
        id: 'edit-course',
        title: 'Edit a course',
        content:
          'Open Profile and find the course under Your Courses. Use Edit on the course card to change it.\n\n' +
          'Settings also has an Edit Subject row. That row asks you to contact support if you need help changing a live course.',
      },
      {
        id: 'teach-class',
        title: 'Teach a class and rate a student',
        content:
          'Your next classes appear on Home. Open Schedule for the full list, or use the calendar on Profile.\n\n' +
          'Tap a class to see the student, date, and time. Choose Join to open Zoom.\n\n' +
          'On the same class, choose Rate student to leave a star rating and a note. The student sees this on their Profile, and a linked parent can see it too.',
      },
      {
        id: 'tutor-progress',
        title: 'See teaching progress',
        content:
          'On Home, tap Progress.\n\n' +
          'Tutors see courses, completed classes, upcoming classes, and hours taught. Open a course row to see how that class is moving, including how many students are in it when it is a group course.',
      },
      {
        id: 'tutor-chat',
        title: 'Message students',
        content:
          'Students can start a chat after they buy your course. Those conversations appear in the Chat tab.\n\n' +
          'You can reply with text, a photo, or a voice note. Search the list when you have many conversations.',
      },
      {
        id: 'tutor-parent-chat',
        title: 'Message a parent',
        content:
          'When a parent messages you about a course their child bought, that thread appears in your Chat tab along with student chats.\n\n' +
          'Parent messages are text. Reply there to keep the parent updated about that course.',
      },
      {
        id: 'share-profile',
        title: 'Share your tutor profile',
        content:
          'Open Profile and tap the share icon. Send the link by message, email, or any other app.\n\n' +
          'Anyone with the link can view your tutor profile and your approved courses.',
      },
      {
        id: 'tutor-community',
        title: 'Use Community',
        content:
          'Open the Community tab, search if you need to, and tap a group.\n\n' +
          'You can read the conversation and send messages to the members in that community.',
      },
    ],
  },
  {
    title: 'Organizations',
    icon: 'business-outline',
    items: [
      {
        id: 'org-overview',
        title: 'How organizations work',
        content:
          'An organization is a team of tutors on one Coach Academ account group. The tutor who creates it is the team lead.\n\n' +
          'The team lead can invite tutors, copy or share an 8-character invite code, refresh that code, see members, buy more tutor seats, and delete the organization.\n\n' +
          'Other tutors can join with the code. A new organization includes 3 member seats. The team lead can add more later.\n\n' +
          'You can register as an organization from the start, or create one later from a tutor account.',
      },
      {
        id: 'create-org',
        title: 'Create an organization',
        content:
          'During registration, choose Organization and fill in the organization name, your role, organization email, website, trade license, and expected number of tutors, along with the subjects and grades you teach.\n\n' +
          'If you already have a tutor account:\n' +
          '1. Go to Profile, open Settings, then Organization Settings.\n' +
          '2. Tap Create Organization.\n' +
          '3. Enter the organization name and email.\n' +
          '4. Choose your role: Owner, Manager, or Tutor.\n' +
          '5. Upload the trade license as a PDF.\n' +
          '6. Create the organization.\n\n' +
          'You become the team lead and can invite tutors right away.',
      },
      {
        id: 'join-org',
        title: 'Join an organization',
        content:
          'Ask the team lead for the invite code. It is 8 letters or numbers.\n\n' +
          '1. Go to Profile, open Settings, then Organization Settings.\n' +
          '2. Tap Join Organization.\n' +
          '3. Enter the code and join.\n\n' +
          'You will land on the members list for that organization. Each tutor can belong to one organization.',
      },
      {
        id: 'invite-tutors',
        title: 'Invite tutors',
        content:
          'Team leads manage invites from Organization Settings.\n\n' +
          'The invite code can be copied or shared. Share sends a message the tutor can use to join. Refresh Code replaces the old code, and the previous code stops working.\n\n' +
          'You can also invite a specific tutor. Open Organization Members and tap Invite Tutor, then enter the tutor’s email. They need a tutor account on that email.',
      },
      {
        id: 'org-members',
        title: 'Members and extra seats',
        content:
          'Open Organization Settings, then Organization Members.\n\n' +
          'The page shows the organization name, how many seats are used, and each person’s role: Owner, Manager, or Tutor.\n\n' +
          'The team lead can remove a tutor from the team, and can tap Increase Tutor Capacity to buy a larger seat plan. Payment uses the app store account on the device.',
      },
      {
        id: 'delete-org',
        title: 'Delete an organization',
        content:
          'Only the team lead can delete the organization.\n\n' +
          '1. Open Organization Settings.\n' +
          '2. In the danger zone, tap Delete Organization.\n' +
          '3. Enter your account password and confirm.\n\n' +
          'Members are removed from the organization. This cannot be undone. Tutors keep their own Coach Academ accounts and can join or create another organization afterward.',
      },
    ],
  },
  {
    title: 'Parents',
    icon: 'people-outline',
    items: [
      {
        id: 'parent-overview',
        title: 'What parents can do',
        content:
          'A parent account is for following a child’s tutoring. You do not buy or teach courses yourself.\n\n' +
          'You can link one or more student accounts, see each student’s courses, upcoming classes, hours, and tutor ratings, message tutors of courses that student has purchased, and open billing for those purchases.\n\n' +
          'Your tabs are Students, Chat, and Profile. Course search and Community are for student and tutor accounts.',
      },
      {
        id: 'link-student',
        title: 'Link a student',
        content:
          'The child needs their own student account first. Use the email on that account.\n\n' +
          '1. Open the Students tab.\n' +
          '2. Under Link a student, enter the student email.\n' +
          '3. Tap Send invite.\n\n' +
          'The invite stays under Pending invites until the student accepts it on their Profile. After they accept, the student appears under Linked students.\n\n' +
          'Nothing about their classes is visible to you before they accept.',
      },
      {
        id: 'view-child',
        title: 'View a student’s learning',
        content:
          'On the Students tab, tap a linked student.\n\n' +
          'Learning activity shows courses, completed courses, classes done, and hours. Below that you will see upcoming classes, each enrolled course with its progress, and tutor reviews of the student.',
      },
      {
        id: 'parent-chat',
        title: 'Message a tutor',
        content:
          'You can message a tutor only after a linked student has purchased that tutor’s course.\n\n' +
          '1. Open the Chat tab.\n' +
          '2. Start a new message and pick the tutor. Each row shows the tutor, the course, and the student.\n' +
          '3. Write your message and send it.\n\n' +
          'The tutor sees this thread in their Chat tab and can reply. Parent chats are text messages.',
      },
      {
        id: 'parent-billing',
        title: 'Billing for a linked student',
        content:
          'Go to Profile, open Settings, then Billing.\n\n' +
          'Purchases are grouped by student. Each one shows the course, amount, date, and status. Open the invoice when you need a receipt.\n\n' +
          'When a refund is still allowed, tap Request refund, explain why, and submit. A refund can be requested when payment is complete and the next class is at least 2 days away (UAE time). The status changes to Refund pending until Coach Academ finishes the review.',
      },
      {
        id: 'unlink-student',
        title: 'Unlink a student',
        content:
          'On the Students tab, tap the unlink icon on a linked student.\n\n' +
          'Unlinking is handled by support. Choose Contact Support and send the student email and your request. The link stays in place until support removes it.\n\n' +
          'The student can make the same request from Parent requests on their Profile.',
      },
    ],
  },
  {
    title: 'Help and account care',
    icon: 'construct-outline',
    items: [
      {
        id: 'payments',
        title: 'How payments work',
        content:
          'Students pay for courses in the app with a credit or debit card. Prices are shown in AED.\n\n' +
          'Tutors pay separately, through the app store, when they unlock group classes, course series, or extra organization seats. A private one-class course does not need that tutor plan.\n\n' +
          'Receipts for course purchases are in Settings under Billing.',
      },
      {
        id: 'troubleshooting',
        title: 'If something is not working',
        content:
          'Check that you are on the latest version of the app. Home shows Update available when a new version can be installed.\n\n' +
          'For video or Zoom trouble, confirm the internet connection and try Wi-Fi if you were on mobile data. Then open Schedule and tap the class again to Join.\n\n' +
          'If a screen fails to load, pull down to refresh. Sign out from Settings and sign in again if the problem stays.',
      },
      {
        id: 'contact-support',
        title: 'Contact support',
        content:
          'Go to Profile, open Settings, then Contact Us. You can also tap Contact Support at the top of this Help Center.\n\n' +
          'Use that form for payment issues, a parent or student unlink, a course you cannot edit, or anything this guide does not answer.\n\n' +
          'The privacy policy is linked from Settings and opens on the Coach Academ website.',
      },
    ],
  },
];

export const getHelpItem = (id?: string | string[]) => {
  const key = Array.isArray(id) ? id[0] : id;
  if (!key) return undefined;
  for (const category of helpCategories) {
    const item = category.items.find((entry) => entry.id === key);
    if (item) return item;
  }
  return undefined;
};
