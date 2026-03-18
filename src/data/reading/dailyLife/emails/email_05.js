export const email_05 = {
  id: "email_05",
  docType: "email",
  to: "Ordering Team <orders@rivertonprint.com>",
  from: "Leah Grant <leah.grant@brightline.co>",
  date: "November 3",
  subject: "Invoice Correction Request",
body:
`Hello,

Thank you for sending Invoice #8041. After reviewing the document this morning, we noticed that the quantity listed for item BL-22 appears to be incorrect. The invoice reflects 400 units; however, our original purchase order specifies 40 units. It seems that an extra zero may have been added during processing.

To ensure our accounting records remain accurate, could you please issue a revised invoice reflecting the correct quantity and confirm the updated total amount? Once we receive the corrected version, we will be able to proceed with payment.

As our finance department is preparing to close this week’s accounts, we would appreciate receiving the updated invoice as soon as possible so that payment can be finalized by Friday.

Best,
Leah Grant`,

  questions: [
    // (1) Main topic / purpose (paraphrase)
    {
      id:"email_05_q01",
      qNo:1,
      question:"What is the main purpose of Leah Grant’s email?",
      options:{
        A:"To ask the company to fix a billing document because an order detail appears inaccurate",
        B:"To complain that the shipment arrived later than expected",
        C:"To request a change to the product specifications before printing begins",
        D:"To confirm that payment has already been processed in full"
      },
      answer:"A",
      explanation:"She points out an incorrect quantity on the invoice and requests a corrected invoice and updated total."
    },

    // (2) Detail (paraphrase, no copy)
    {
      id:"email_05_q02",
      qNo:2,
      question:"Which item information does Leah indicate is incorrect on the invoice?",
      options:{
        A:"The unit count shown for item BL-22",
        B:"The billing address listed for Brightline",
        C:"The invoice reference number",
        D:"The delivery date for the order"
      },
      answer:"A",
      explanation:"She says the invoice shows a different quantity for BL-22 than the purchase order does."
    },
    // (3) Fact / Negative fact (본문 확장 반영)
{
  id:"email_05_q03",
  qNo:3,
  question:"According to the email, all of the following are mentioned as reasons for requesting a revised invoice EXCEPT:",
  options:{
    A:"A discrepancy between the invoice and the original purchase order",
    B:"The need to maintain accurate internal accounting records",
    C:"Preparation for the weekly financial closing process",
    D:"A delay in the shipment of item BL-22"
  },
  answer:"D",
  explanation:"The email discusses a quantity discrepancy, accounting accuracy, and the upcoming financial closing. It does not mention any shipment delay."
},

// (4) Intention (더 간접적으로)
{
  id:"email_05_q04",
  qNo:4,
  question:"Why does Leah refer to her company’s finance department in the final paragraph?",
  options:{
    A:"To emphasize the urgency of resolving the issue promptly",
    B:"To suggest that the finance team made the original billing mistake",
    C:"To request direct communication with the finance department",
    D:"To explain that payment has already been authorized"
  },
  answer:"A",
  explanation:"Mentioning the finance department’s timeline signals that the correction is time-sensitive and needed before accounts are closed."
}
  ]
};