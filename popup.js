document.addEventListener("DOMContentLoaded", () => {
  const analyzeBtn = document.getElementById("analyzeBtn");
  const fetchBtn = document.getElementById("fetchBtn");
  const reviewsInput = document.getElementById("reviewsInput");
  const resultDiv = document.getElementById("result");

  function setLoading(isLoading) {
    analyzeBtn.disabled = isLoading;
    fetchBtn.disabled = isLoading;
    resultDiv.innerText = isLoading ? "Analyzing..." : "";
  }

  analyzeBtn.addEventListener("click", () => {
    const reviews = reviewsInput.value.trim();
    if (!reviews) {
      alert("Please paste or fetch some reviews first.");
      return;
    }
    setLoading(true);
    chrome.runtime.sendMessage({ action: "analyzeReviews", reviews: reviews }, (response) => {
      setLoading(false);
      if (chrome.runtime.lastError) {
        resultDiv.innerText = "Extension error: " + chrome.runtime.lastError.message;
        return;
      }
      if (response && response.error) {
        resultDiv.innerText = "Error: " + response.error;
      } else {
        resultDiv.innerText = response && response.result ? response.result : "No result returned.";
      }
    });
  });

  fetchBtn.addEventListener("click", () => {
    setLoading(true);
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tab = tabs[0];
      if (!tab || !tab.id) {
        setLoading(false);
        alert("No active tab found.");
        return;
      }
      chrome.tabs.sendMessage(tab.id, { action: "getReviews" }, (response) => {
        setLoading(false);
        if (chrome.runtime.lastError) {
          alert("Couldn't fetch reviews from this page.");
          return;
        }
        if (response && response.reviews && response.reviews.length > 0) {
          reviewsInput.value = response.reviews.join("\n\n---\n\n");
        } else {
          alert("No reviews found on this page.");
        }
      });
    });
  });
});
