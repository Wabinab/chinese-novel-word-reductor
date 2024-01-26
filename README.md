# chinese-novel-word-reductor
Some people don't know how to type paragraphs, instead, using either very short sentences or only partial sentences. These bad practices should be omitted from Chinese novels. This extension tries to remove all such text in a particular website. 

---
# Learnings
### Fetch tabs
Of course one can't fetch tabs with `window.location.href` as it'll get the tab for extension. Then, one use `chrome.tabs.query` instead; with one caveat: The original asked to pass in `lastFocusedWindow`, which always return `undefined`. Instead, we pass in `currentWindow` to deal with it correctly. 