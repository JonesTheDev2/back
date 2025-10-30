import express from "express";
import fetch from "node-fetch";

const app = express();
const DISCORD_TOKEN = process.env.DISCORD_TOKEN; // we’ll set this in Render
const GUILD_ID = process.env.GUILD_ID; // your server ID

const RoleMap = {
  "1423479554025979934": "Civilian",
  "234567890123456789": "Police Officer",
  "345678901234567890": "Firefighter"
};

app.get("/roles/:discordId", async (req, res) => {
  const { discordId } = req.params;
  try {
    const response = await fetch(
      `https://discord.com/api/v10/guilds/${GUILD_ID}/members/${discordId}`,
      { headers: { Authorization: `Bot ${DISCORD_TOKEN}` } }
    );
    if (!response.ok) return res.status(404).json({ error: "User not found" });
    const data = await response.json();
    const roles = data.roles.map(r => RoleMap[r]).filter(Boolean);
    res.json({ roles });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`API running on port ${port}`));
