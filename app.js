const apiKeyInput = document.getElementById("apiKey");
const askButton = document.getElementById("askBtn");
const result = document.getElementById("result");
const promptInput = document.getElementById("prompt");
const loading = document.getElementById("loading");

askButton.addEventListener("click", async function () {
    const apiKey = apiKeyInput.value.trim();
    const prompt = promptInput.value.trim();

    if (!apiKey) {
        result.textContent = "Please paste your Gemini API key first.";
        apiKeyInput.focus();
        return;
    }

    if (!prompt) {
        result.textContent = "Please enter a question first.";
        promptInput.focus();
        return;
    }

    askButton.disabled = true;
    loading.style.display = "block";
    result.textContent = "";

    try {
        const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-goog-api-key": apiKey
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: prompt }]
                }]
            })
        });
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error?.message || "The request failed. Check your API key and model name.");
        }

        result.textContent = data.candidates?.[0]?.content?.parts
            ?.map((part) => part.text || "")
            .join("") || "Gemini returned an empty response.";
    } catch (error) {
        result.textContent = `Error: ${error.message}`;
    } finally {
        loading.style.display = "none";
        askButton.disabled = false;
    }
});