export function replaceHistoryState(data = {}, unused, url) {
  window.history.replaceState({data}, unused, url);
}