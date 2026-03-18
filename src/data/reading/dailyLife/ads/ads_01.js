export const ads_01 = {
  id: "ads_01",
  type: "ads",
  title: "Ads/Posts 1",
  passage: {
    title: "Spring Fitness Membership Special",
    body: `
Looking to get in shape before summer? Join ActiveCore Gym this April and receive 30% off your first three months.

New members will also receive a free personal training session and a complimentary fitness assessment.

Offer valid until April 30. Visit our website or stop by the front desk for details.
    `,
  },
  questions: [
    {
      id: 1,
      question: "What is the primary purpose of this advertisement?",
      options: {
        A: "To introduce a seasonal exercise class",
        B: "To promote a limited-time reduction in membership fees",
        C: "To announce a health education workshop",
        D: "To recruit staff for a training facility",
      },
      answer: "B",
      explanation:
        "The advertisement highlights a temporary 30% discount on membership costs, which corresponds to a limited-time reduction in fees."
    },
    {
      id: 2,
      question: "According to the advertisement, what is included for individuals who sign up?",
      options: {
        A: "Access to premium fitness equipment at no cost",
        B: "A personalized meal planning consultation",
        C: "A no-charge introductory coaching session",
        D: "Exclusive entry to members-only events",
      },
      answer: "C",
      explanation:
        "The advertisement states that new members receive a free personal training session, which is paraphrased as a no-charge introductory coaching session."
    }
  ]
};