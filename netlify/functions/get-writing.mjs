import { getStore } from "@netlify/blobs";

export async function handler() {
  try {
    const store = getStore("writing-submissions");

    const { blobs } = await store.list();

    const results = [];

    for (const blob of blobs) {
      const data = await store.get(blob.key, { type: "json" });
      results.push({ id: blob.key, ...data });
    }

    return {
      statusCode: 200,
      body: JSON.stringify(results),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
}