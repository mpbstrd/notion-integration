require("dotenv").config();

console.log("🚀 Script started");

const axios = require("axios");
const { Client } = require("@notionhq/client");

console.log("Env check:");
console.log("TOKEN exists:", !!process.env.NOTION_TOKEN);
console.log("DB exists:", !!process.env.NOTION_DATABASE_ID);

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

const API_URL = "https://fbgc-api.azurewebsites.net/api/member";

async function sync() {
  try {
    console.log("📡 Fetching API...");

    const res = await axios.get(API_URL);

    console.log("✅ API responded");
    console.log("Raw data:", res.data);

    const members = Array.isArray(res.data)
      ? res.data
      : res.data.data;

    console.log("👥 Members count:", members?.length);

    if (!members) {
      console.log("❌ No members found. Check API structure.");
      return;
    }

    for (const m of members) {
      console.log("➡️ Sending:", m);

      await notion.pages.create({
        parent: { database_id: process.env.NOTION_DATABASE_ID },
        properties: {
          PublicId: {
            title: [
              {
                text: {
                  content: m.public_id,
                },
              },
            ],
          },
          Name: {
            rich_text: [
              {
                text: {
                  content: m.name || "No Name",
                },
              },
            ],
          },
          Status: {
            rich_text: [
              {
                text: {
                  content: m.status,
                },
              },
            ],
          },
        },
      });
    }

    console.log("🎉 DONE");
  } catch (err) {
    console.error("❌ ERROR:");
    console.error(err.message);
  }
}

sync();