import { getStore } from "@netlify/blobs";

const SITE_ID = "6f0f75e9-0113-4270-9345-69d9d3be5601";

export async function handler(event) {
  try {
    const token = process.env.NETLIFY_AUTH_TOKEN;
    if (!token) throw new Error("NETLIFY_AUTH_TOKEN is missing");

    const id = event.queryStringParameters?.id;
    if (!id) throw new Error("id is required");

    const store = getStore("writing-submissions", {
      siteID: SITE_ID,
      token,
    });

    const raw = await store.get(id, { type: "text" });
    if (!raw) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "Not found" }),
      };
    }

    return {
      statusCode: 200,
      body: raw,
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
}