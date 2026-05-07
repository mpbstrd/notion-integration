const axios = require("axios");

const API_URL = process.env.BASE_API_URL + "member";

async function member_sync(notion) {
  try {
    const { data } = await axios.get(API_URL);

    const members = Array.isArray(data) ? data : data?.data;

    for (const m of members || []) {
      await notion.pages.create({
        parent: {
          database_id: process.env.NOTION_DATABASE_ID,
        },
        properties: {
          PublicId: {
            title: [
              {
                text: {
                  content: String(m.public_id),
                },
              },
            ],
          },

          Name: {
            rich_text: [
              {
                text: {
                  content: m.name ?? "No Name",
                },
              },
            ],
          },

          Status: {
            rich_text: [
              {
                text: {
                  content: m.status ?? "Unknown",
                },
              },
            ],
          },

          DateCreated: {
            date: {
              start: new Date(m.created_at).toISOString(),
            },
          },
        },
      });

      console.log(`Synced member ${m.name} to notion.`);
    }

    console.log(`Finished syncing ${members.length} members.`);
  } catch (err) {
    console.error(err);
  }
}

module.exports = member_sync;