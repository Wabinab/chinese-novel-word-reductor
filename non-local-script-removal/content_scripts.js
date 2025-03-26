// const observer = new MutationObserver(mutations => {
//   mutations.forEach(({ addedNodes }) => {
//       addedNodes.forEach(node => {
//           // For each added script tag
//           console.log(node.src)
//           if(node.nodeType === 1 && node.tagName === 'SCRIPT') {
//               const src = node.src || ''
//               const type = node.type
//               // If the src is inside your blacklist
//           }
//       })
//   })
// })

// // Starts the monitoring
// observer.observe(document.documentElement, {
//   childList: true,
//   subtree: true
// })

console.log("Run for 2wxss")
const scripts = document.querySelectorAll("script");
scripts.forEach(s => {
	if (!s.src.includes('2wxss.com')) {
		s.remove();
	}
});

// chrome.webRequest.onBeforeRequest.addLIstener((details) => {
//   if (!details.url.includes('2wxss.com')) {
//     console.log(`Blocked request to ${details.url}`);
//     return { cancel: true };
//   }
//   return { cancel: false };
// }, { urls: ["<all_urls>"] }, ["blocking"])