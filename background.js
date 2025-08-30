
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "analyzeReviews") {
    (async () => {
      try {
        const apiKey = "YOUR_API_KEY";
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
        const payload = {
          contents: [
            {
              parts: [
                {
                  text: `Analyze the following customer reviews. 
- Detect if reviews are fake or genuine (brief reasoning). 
- List PROS mentioned in short bullet points. 
- List CONS mentioned in short bullet points. 

Reviews:
${message.reviews}`
                }
              ]
            }
          ]
        };
        const response = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        if (!response.ok) {
          const text = await response.text();
          throw new Error(`API request failed: ${response.status} ${text}`);
        }
        const data = await response.json();
        const aiResponse =
          (data && data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts[0] && data.candidates[0].content.parts[0].text) ||
          "No response from AI.";
        sendResponse({ result: aiResponse });
      } catch (error) {
        sendResponse({ error: error.message || String(error) });
      }
    })();
    return true;
  }
});
