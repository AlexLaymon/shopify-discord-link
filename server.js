const express = require("express"); // Web server library
const axios = require("axios"); // HTTP request library

const app = express();

// Discord app credentials (replace with your actual credentials)
const CLIENT_ID = "1321969077488713738";
const CLIENT_SECRET = "ce7PuhxR37dUzbgPYtMx9pvjwTKIN6iz";
const REDIRECT_URI = "http://localhost:3000/link-discord";

// Route to handle Discord's response
app.get("/link-discord", async (req, res) => {
    // Step 1: Get the "code" from Discord
    const code = req.query.code;

    if (!code) {
        return res.status(400).send("No code provided by Discord");
    }

    try {
        // Step 2: Exchange the code for an access token
        const tokenResponse = await axios.post(
            "https://discord.com/api/oauth2/token",
            new URLSearchParams({
                client_id: "1321969077488713738",
                client_secret: "ce7PuhxR37dUzbgPYtMx9pvjwTKIN6iz",
                grant_type: "authorization_code",
                code,
                redirect_uri: "http://localhost:3000/link-discord",
            }),
            { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
        );

        const accessToken = tokenResponse.data.access_token;

        // Step 3: Use the access token to get the user's Discord info
        const userResponse = await axios.get("https://discord.com/api/users/@me", {
            headers: { Authorization: `Bearer ${accessToken}` },
        });

        const discordUser = userResponse.data;

        // Log the user's Discord info (for now)
        console.log("Discord User:", discordUser);

        // Step 4: Send a success message (later, save this info to Shopify)
        res.send(`Hello ${discordUser.username}, your Discord account has been linked!`);
    } catch (error) {
        console.error("Error linking Discord account:", error.response?.data || error.message);
        res.status(500).send("Failed to link Discord account");
    }
});

// Start the server
app.listen(3000, () => console.log("Server running on http://localhost:3000"));
