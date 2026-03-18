import { getStore } from "@netlify/blobs";

const SITE_ID = "6f0f75e9-0113-4270-9345-69d9d3be5601";

export async function handler() {
  try {
    const token = process.env.NETLIFY_AUTH_TOKEN;

    if (!token) {
      throw new Error("NETLIFY_AUTH_TOKEN is missing");
    }

    const store = getStore("writing-submissions", {
      siteID: SITE_ID,
      token,
    });

    const { blobs } = await store.list();

    const results = [];

    for (const blob of blobs) {
      const raw = await store.get(blob.key, { type: "text" });
      const data = JSON.parse(raw);
      results.push({ id: blob.key, ...data });
    }

    return {
      statusCode: 200,
      body: JSON.stringify(results),
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