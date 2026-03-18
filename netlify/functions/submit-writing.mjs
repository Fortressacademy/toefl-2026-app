import { getStore } from "@netlify/blobs";

const SITE_ID = "6f0f75e9-0113-4270-9345-69d9d3be5601";

export async function handler(event) {
  try {
    const token = process.env.NETLIFY_AUTH_TOKEN;

    if (!token) {
      throw new Error("NETLIFY_AUTH_TOKEN is missing");
    }

    const body = JSON.parse(event.body || "{}");

    const store = getStore("writing-submissions", {
      siteID: SITE_ID,
      token,
    });

    const id = Date.now().toString();

    await store.set(id, JSON.stringify(body));

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, id }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: err.message,
      }),
    };
  }
}