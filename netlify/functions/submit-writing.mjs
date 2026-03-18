import { getStore } from "@netlify/blobs";

const SITE_ID = "6f0f75e9-0113-4270-9345-69d9d3be5601";

export async function handler(event) {
  try {
    const token = process.env.NETLIFY_AUTH_TOKEN;
    if (!token) throw new Error("NETLIFY_AUTH_TOKEN is missing");

    const body = JSON.parse(event.body || "{}");
    const { studentName, studentCode, mockId, report } = body;

    if (!studentName || !studentCode || !report) {
      throw new Error("필수 데이터 누락");
    }

    const store = getStore("writing-submissions", {
      siteID: SITE_ID,
      token,
    });

    const id = Date.now().toString();

    const payload = {
      id,
      studentName,
      studentCode,
      mockId: mockId || "w_mock_1",
      submittedAt: new Date().toISOString(),
      report,
    };

    await store.set(id, JSON.stringify(payload));

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, id }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
}