const express = require("express"); // Web server library
const axios = require("axios"); // HTTP request library

const app = express();

// Use environment variables for sensitive credentials
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;

// Route to handle Discord's response
app.get("/link-discord", async (req, res) => {
    const code = req.query.code;

    if (!code) {
        return res.status(400).send("No code provided by Discord");
    }

    try {
        // Exchange the code for an access token
        const tokenResponse = await axios.post(
            "https://discord.com/api/oauth2/token",
            new URLSearchParams({
                client_id: CLIENT_ID,
                client_secret: CLIENT_SECRET,
                grant_type: "authorization_code",
                code,
                redirect_uri: REDIRECT_URI,
            }),
            { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
        );

        const accessToken = tokenResponse.data.access_token;

        // Use the access token to get the user's Discord info
        const userResponse = await axios.get("https://discord.com/api/users/@me", {
            headers: { Authorization: `Bearer ${accessToken}` },
        });

        const discordUser = userResponse.data;

        console.log("Discord User:", discordUser);

        res.send(`Hello ${discordUser.username}, your Discord account has been linked!`);
    } catch (error) {
        console.error("Error linking Discord account:", error.response?.data || error.message);
        res.status(500).send("Failed to link Discord account");
    }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
