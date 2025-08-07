const functions = require("firebase-functions");
const fetch = require("node-fetch");

exports.generateAIContent = functions.https.onCall(async (data, context) => {
  const prompt = data.prompt;
  const apiKey = functions.config().gemini.key;
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({contents: [{parts: [{text: prompt}]}]}),
    });

    if (!response.ok) {
      throw new functions.https.HttpsError("internal", "API request failed");
    }

    const result = await response.json();
    return {result};
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    // This is the new, corrected version
    throw new functions.https.HttpsError(
        "internal",
        "Failed to generate AI content.",
    );
  }
});
