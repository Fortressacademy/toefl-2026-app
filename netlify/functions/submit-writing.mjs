import { getStore } from "@netlify/blobs";

export async function handler(event) {
  try {
    const body = JSON.parse(event.body);

    const store = getStore("writing-submissions");

    const id = Date.now().toString();

    await store.set(id, JSON.stringify(body));

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
}