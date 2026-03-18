// src/data/reading/dailyLife/textmessages/textmessage_03.js
export const textmessage_03 = {
  id: "textmessage_03",
  docType: "textmessage",
  title: "Messages",
  subtitle: "Noah Choi · IT Support",
  meta: "Monday · 7:18 PM",

  participants: [
    { id: "you", name: "You" },
    { id: "noah", name: "Noah Choi" },
  ],
  meId: "you",

  messages: [
    {
      from: "you",
      time: "7:18 PM",
      text:
        "Hi Noah—sorry to message late. I’m locked out of my account and I can’t access the shared drive. Is there any way to regain access tonight?",
    },
    {
      from: "noah",
      time: "7:20 PM",
      text:
        "No worries. Quick check: are you getting a password error, or is it asking for a verification code you can’t receive?",
    },
    {
      from: "you",
      time: "7:21 PM",
      text:
        "It’s the verification code. It keeps going to my old phone number, and I don’t have that number anymore.",
    },
    {
      from: "noah",
      time: "7:23 PM",
      text:
        "Got it. I can’t change the phone number directly without HR confirming the update, but I can issue a temporary bypass so you can sign in once.",
    },
    {
      from: "noah",
      time: "7:24 PM",
      text:
        "You’ll need to be on the company network (VPN is fine). Also, the bypass expires in 20 minutes and works for a single login only.",
    },
    {
      from: "you",
      time: "7:26 PM",
      text:
        "I’m off-site. I can connect to the VPN now. If I log in, will I still be prompted for the code later tonight?",
    },
    {
      from: "noah",
      time: "7:28 PM",
      text:
        "After you’re in, update your authentication method in the security portal. Otherwise, you’ll be blocked again the next time you sign in.",
    },
    {
      from: "you",
      time: "7:29 PM",
      text:
        "Understood. Please send the bypass when you’re ready—I’ll stay on VPN and go straight to the portal.",
    },
    {
      from: "noah",
      time: "7:30 PM",
      text:
        "Okay. When you open the login page, use reference code IT-9017 so I can confirm I’m unlocking the right account.",
    },
  ],

  questions: [
    {
      id: "textmessage_03_q1",
      type: "purpose",
      question: "What is the main reason for the conversation?",
      options: {
        A: "To report that the shared drive has been permanently deleted",
        B: "To request an exception so an account can be accessed temporarily",
        C: "To schedule a meeting with HR about updating employee records",
        D: "To complain about a recent company network outage",
      },
      answer: "B",
      explanation:
        "The user cannot receive the verification code and asks for access tonight. Noah offers a temporary bypass for a single login.",
    },
    {
      id: "textmessage_03_q2",
      type: "detail_inference",
      question:
        "Why is Noah unable to update the phone number directly?",
      options: {
        A: "Because the security portal is down for maintenance",
        B: "Because only HR can confirm changes to personal contact details",
        C: "Because the user must be physically in the office to update it",
        D: "Because phone-number changes require approval from the CEO",
      },
      answer: "B",
      explanation:
        "Noah says he cannot change the number without HR confirming the update, implying HR controls verification of contact detail changes.",
    },
    {
      id: "textmessage_03_q3",
      type: "inference",
      question:
        "Which step is most likely necessary to avoid being locked out again later?",
      options: {
        A: "Disconnect from the VPN immediately after logging in",
        B: "Reset the password twice in the same session",
        C: "Update the authentication method in the security portal after signing in",
        D: "Wait 20 minutes so the temporary bypass expires",
      },
      answer: "C",
      explanation:
        "Noah explains that unless the authentication method is updated in the security portal, the user will be blocked again at the next sign-in.",
    },
  ],
};