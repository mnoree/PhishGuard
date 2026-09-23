(function () {
  'use strict';
  const S = window.PGStore;
  if (localStorage.getItem(S.key('initialized')) === 'true') {
    // Lightweight migration so an existing demo session also receives the new SMS scenario.
    const scenarios = S.getScenarios();
    let scenarioChanged = false;
    scenarios.forEach(s => { if (!s.channel) { s.channel = s.id === 'sc-sms-code' ? 'sms' : 'email'; scenarioChanged = true; } if (!Array.isArray(s.redFlags)) { s.redFlags = []; scenarioChanged = true; } });
    if (!scenarios.some(s => s.id === 'sc-sms-code')) {
      scenarios.push({ id: 'sc-sms-code', channel: 'sms', title: 'Unexpected Verification Code', category: 'SMS Social Engineering', courseId: 'course-social', difficulty: 'Intermediate', sender: 'Nora · New number', phone: '+966 50 000 0000', subject: 'Quick favor', body: 'Hey Sara, it’s Nora. I’m using another number right now. I’m locked out of an account and need the verification code that just came through. Can you send it to me?', cta: 'Reply to message', redFlags: ['New or unknown number', 'Impersonation of a known contact', 'Request for a verification code'] });
      S.write('scenarios', scenarios);
    } else if (scenarioChanged) { S.write('scenarios', scenarios); }
    const campaigns = S.getCampaigns();
    if (!campaigns.some(c => c.id === 'camp-sms')) {
      campaigns.push({ id: 'camp-sms', name: 'SMS Impersonation Check', scenarioId: 'sc-sms-code', channel: 'sms', device: 'mobile', status: 'active', createdBy: 'usr-admin-01', targetUserIds: ['usr-sara-01'], createdAt: new Date().toISOString(), publishedAt: new Date().toISOString() });
      S.write('campaigns', campaigns);
    }
    return;
  }

  const users = [
    { id: 'usr-admin-01', role: 'admin', fullName: 'System Administrator', email: 'admin@phishguard.demo', password: 'Admin123!', company: 'PhishGuard Demo', position: 'Security Administrator' },
    { id: 'usr-sara-01', role: 'user', fullName: 'Sara Ahmed', email: 'sara@phishguard.demo', password: 'User123!', company: 'PhishGuard Demo', position: 'Employee' },
    { id: 'usr-omar-01', role: 'user', fullName: 'Omar Ali', email: 'omar@phishguard.demo', password: 'User123!', company: 'PhishGuard Demo', position: 'Employee' }
  ];

  const scenarios = [
    { id: 'sc-password', channel: 'email', title: 'Unusual Sign-in Activity', category: 'Credential Phishing', courseId: 'course-password', difficulty: 'Beginner', sender: 'security@m1crosoft-support.com', subject: 'Unusual sign-in activity', body: 'We detected an unusual sign-in attempt on your account. Review the activity within 24 hours to keep your account secure.', cta: 'Review Activity', redFlags: ['Look-alike sender domain', 'Urgent deadline', 'Unexpected security request'] },
    { id: 'sc-invoice', channel: 'email', title: 'Updated Invoice', category: 'Business Email', courseId: 'course-links', difficulty: 'Intermediate', sender: 'billing@vendor-payments.example', subject: 'Updated invoice requires review', body: 'An updated invoice is available. Please review the attached payment details before the end of the day.', cta: 'View Invoice', redFlags: ['Unexpected invoice', 'Pressure to act quickly', 'Unfamiliar sender'] },
    { id: 'sc-sms-code', channel: 'sms', title: 'Unexpected Verification Code', category: 'SMS Social Engineering', courseId: 'course-social', difficulty: 'Intermediate', sender: 'Nora · New number', phone: '+966 50 000 0000', subject: 'Quick favor', body: 'Hey Sara, it’s Nora. I’m using another number right now. I’m locked out of an account and need the verification code that just came through. Can you send it to me?', cta: 'Reply to message', redFlags: ['New or unknown number', 'Impersonation of a known contact', 'Request for a verification code'] },
    { id: 'sc-job', channel: 'email', title: 'Remote Job Offer', category: 'Social Engineering', courseId: 'course-social', difficulty: 'Advanced', sender: 'careers@talent-opportunities.example', subject: 'You have been shortlisted', body: 'Your profile has been shortlisted. Complete the verification form to proceed with the interview process.', cta: 'Complete Verification', redFlags: ['Unsolicited offer', 'Request for personal information', 'Suspicious domain'] }
  ];

  const campaigns = [
    { id: 'camp-password', name: 'Password Reset Awareness', scenarioId: 'sc-password', channel: 'email', device: 'desktop', status: 'active', createdBy: 'usr-admin-01', targetUserIds: ['usr-sara-01', 'usr-omar-01'], createdAt: new Date().toISOString() },
    { id: 'camp-invoice', name: 'Invoice Safety Check', scenarioId: 'sc-invoice', channel: 'email', device: 'desktop', status: 'draft', createdBy: 'usr-admin-01', targetUserIds: ['usr-sara-01'], createdAt: new Date().toISOString() }
  ];
  campaigns.push({ id: 'camp-sms', name: 'SMS Impersonation Check', scenarioId: 'sc-sms-code', channel: 'sms', device: 'mobile', status: 'active', createdBy: 'usr-admin-01', targetUserIds: ['usr-sara-01'], createdAt: new Date().toISOString(), publishedAt: new Date().toISOString() });

  const courses = [
    {
      id: 'course-links', title: 'Identifying Suspicious Links', category: 'Phishing Detection', level: 'Beginner', duration: '15 min',
      description: 'Learn how to pause, inspect links and verify where a message is really taking you.',
      lessons: [
        { id:'links-1', title:'The phishing hook', type:'lesson', content:'Phishing messages often create urgency, make unexpected requests, or imitate trusted organizations. Slow down before clicking.', sourceTitle:'CISA — Recognize and Report Phishing', sourceUrl:'https://www.cisa.gov/secure-our-world/recognize-and-report-phishing' },
        { id:'links-2', title:'Check the destination', type:'lesson', content:'Compare the visible text with the actual destination. Be cautious with unfamiliar domains, shortened URLs and look-alike spellings.', sourceTitle:'Microsoft — Protect yourself from phishing', sourceUrl:'https://support.microsoft.com/en-us/security/protect-yourself-from-phishing' },
        { id:'links-3', title:'Watch: Recognize and Report Phishing', type:'video', videoUrl:'https://www.youtube.com/watch?v=9pTW-F6V2N0', sourceTitle:'CISA — Recognize and Report Phishing', sourceUrl:'https://www.youtube.com/watch?v=9pTW-F6V2N0' }
      ]
    },
    {
      id: 'course-social', title: 'Social Engineering Awareness', category: 'Social Engineering', level: 'Intermediate', duration: '20 min',
      description: 'Recognize manipulation tactics across email, SMS and other communication channels.',
      lessons: [
        { id:'social-1', title:'Trust can be manipulated', type:'lesson', content:'Attackers may impersonate coworkers, friends, delivery services or trusted brands. A familiar name does not prove that the message is genuine.', sourceTitle:'CISA — Teach Employees to Avoid Phishing', sourceUrl:'https://www.cisa.gov/audiences/small-and-medium-businesses/secure-your-business/teach-employees-avoid-phishing' },
        { id:'social-2', title:'Urgency and unusual requests', type:'lesson', content:'Requests for secrecy, verification codes, money, personal information or immediate action are reasons to pause and verify through a known channel.', sourceTitle:'CISA — Secure Our World', sourceUrl:'https://www.cisa.gov/secure-our-world' },
        { id:'social-3', title:'Watch: Recognize and Report Phishing', type:'video', videoUrl:'https://www.youtube.com/watch?v=JlQovysQBn0', sourceTitle:'CISA — Recognize and Report Phishing', sourceUrl:'https://www.youtube.com/watch?v=JlQovysQBn0' }
      ]
    },
    {
      id: 'course-password', title: 'Password & Account Security', category: 'Account Security', level: 'Beginner', duration: '12 min',
      description: 'Build safer account habits and understand why phishing-resistant authentication matters.',
      lessons: [
        { id:'password-1', title:'Never share verification codes', type:'lesson', content:'A verification code is an authentication factor. Treat unexpected requests for codes as suspicious and verify the requester through a trusted channel.', sourceTitle:'CISA — Secure Our World', sourceUrl:'https://www.cisa.gov/secure-our-world' },
        { id:'password-2', title:'Use strong, unique credentials', type:'lesson', content:'Use long, unique passwords and a password manager where appropriate. Do not reuse credentials across important accounts.', sourceTitle:'CISA — Secure Our World', sourceUrl:'https://www.cisa.gov/secure-our-world' },
        { id:'password-3', title:'Phishing-resistant authentication', type:'video', videoUrl:'https://learn.microsoft.com/en-us/entra/identity/authentication/phishing-resistant-authentication-videos', sourceTitle:'Microsoft Learn — Phishing-resistant authentication', sourceUrl:'https://learn.microsoft.com/en-us/entra/identity/authentication/phishing-resistant-authentication-videos' }
      ]
    }
  ];

  S.write('users', users); S.write('campaigns', campaigns); S.write('scenarios', scenarios); S.write('events', []); S.write('courses', courses); S.write('trainingProgress', []); S.write('resetTokens', []); localStorage.setItem(S.key('initialized'), 'true');
})();
