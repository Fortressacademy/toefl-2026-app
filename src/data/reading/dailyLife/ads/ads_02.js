export const ads_02 = {
  id: "ads2",
  type: "ads",
  title: "Ads/Posts 2",
  passage: {
    title: "Downtown Apartment for Rent",
    body: `
A one-bedroom apartment will be available starting May 1 in downtown, within walking distance of Central Station, making it convenient for commuters. The unit includes high-speed internet service, one parking space, and access to a shared rooftop garden. Monthly rent is $1,200, and a refundable security deposit equal to one month’s rent is required at signing. A minimum six-month lease applies. Interested individuals should contact the property manager by email to arrange a viewing.
    `,
  },
  questions: [
    {
      id: 1,
      question: "What is implied about the apartment’s location?",
      options: {
        A: "It is designed primarily for office workers.",
        B: "It provides convenient access to public transportation.",
        C: "It is located outside the downtown area.",
        D: "It is part of a residential complex near a university.",
      },
      answer: "B",
      explanation:
        "The apartment is described as being within walking distance of Central Station, which implies easy access to public transportation."
    },
    {
      id: 2,
      question: "Which of the following is included in the rental cost?",
      options: {
        A: "Internet access and designated parking",
        B: "All utility expenses",
        C: "Interior furnishings",
        D: "Daily cleaning services",
      },
      answer: "A",
      explanation:
        "The advertisement states that high-speed internet and one parking space are included."
    },
    {
      id: 3,
      question: "What must a tenant provide when signing the lease?",
      options: {
        A: "Payment covering six months of rent in advance",
        B: "A refundable amount equal to one month’s rent",
        C: "Proof of employment verification",
        D: "An additional maintenance fee",
      },
      answer: "B",
      explanation:
        "The advertisement specifies that a refundable security deposit equal to one month’s rent is required at signing."
    }
  ]
};