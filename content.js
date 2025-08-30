function scrapeReviews() {
  try {
    const reviews = [];
    document.querySelectorAll(".review-text-content span, .a-expander-content span").forEach(el => {
      if (el && el.innerText) reviews.push(el.innerText.trim());
    });
    document.querySelectorAll("div._6K-7Co, div.t-ZTKy").forEach(el => {
      if (el && el.innerText) reviews.push(el.innerText.trim());
    });
    document.querySelectorAll("p.UserReviewstyles__CommentText-sc-1o8s6m-4, div.UserReviewComment__commentText").forEach(el => {
      if (el && el.innerText) reviews.push(el.innerText.trim());
    });
    document.querySelectorAll("div.user-review, div.user-review-text, div.review-txt, div.user-review-txt").forEach(el => {
      if (el && el.innerText) reviews.push(el.innerText.trim());
    });
    const cleaned = reviews.map(r => r.replace(/\s+/g, " ").trim()).filter(r => r.length > 0);
    const unique = Array.from(new Set(cleaned));
    return unique.slice(0, 15);
  } catch {
    return [];
  }
}

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg && msg.action === "getReviews") {
    sendResponse({ reviews: scrapeReviews() });
  }
});
