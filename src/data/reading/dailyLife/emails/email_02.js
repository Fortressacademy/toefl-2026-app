export const email_02 = {
  id: "email_02",
  docType: "email",
  to: "Jordan Kim <jkim@northbridge.edu>",
  from: "Campus IT <ithelp@northbridge.edu>",
  date: "August 18",
  subject: "Password Reset Confirmation",
  body:
`Hello Jordan,

This message confirms that your account password was successfully reset at 8:42 A.M. today through the university's secure authentication system. If you initiated this request, no additional steps are required at this time.

However, if you did not authorize this change, your account may have been accessed by an unauthorized individual. In that case, we strongly recommend that you contact the IT Help Desk immediately so that further security measures can be implemented. You should also enable two-step verification through your account settings to enhance protection against future unauthorized access.

For your security, please do not share your login credentials with anyone.

Thank you,
Campus IT`,

  questions: [

    {
      id:"email_02_q01",
      qNo:1,
      question:"What is the primary purpose of this email?",
      options:{
        A:"To notify the recipient of a completed security-related action and outline possible next steps",
        B:"To warn students about a campus-wide cybersecurity breach",
        C:"To request verification of Jordan's identity before restoring access",
        D:"To promote a newly implemented authentication platform"
      },
      answer:"A",
      explanation:"The email confirms a password reset (security-related action) and explains what to do if it was unauthorized."
    },

    {
      id:"email_02_q02",
      qNo:2,
      question:"What can be inferred about the university's security protocol?",
      options:{
        A:"Password resets require in-person verification.",
        B:"Additional protective measures are available but not automatically activated.",
        C:"Accounts are permanently locked after each reset.",
        D:"Two-step verification is mandatory for all users."
      },
      answer:"B",
      explanation:"The email recommends enabling two-step verification, implying it exists but is not automatically enabled."
    },

    {
      id:"email_02_q03",
      qNo:3,
      question:"The phrase 'further security measures can be implemented' most likely suggests that:",
      options:{
        A:"The account will be permanently deleted.",
        B:"IT staff can take additional steps to prevent misuse.",
        C:"The university will monitor all student emails indefinitely.",
        D:"A new password will automatically be assigned."
      },
      answer:"B",
      explanation:"It implies that IT can apply additional protections if unauthorized access is suspected."
    },

 {
  id:"email_02_q04",
  qNo:4,
  question:"The word 'implemented' in the email is closest in meaning to:",
  options:{
    A:"Investigated",
    B:"Delayed",
    C:"Put into effect",
    D:"Publicly announced"
  },
  answer:"C",
  explanation:"In the context of security measures, 'implemented' means carried out or put into effect, not merely announced or investigated.",
  highlight: { query: "implemented", mode: "word" } // ✅ 추가
}

  ]
};