export function getSessionId(): string {
  if (typeof window === "undefined") return "";
  
  let sessionId = localStorage.getItem("mindspace_session_id");
  if (!sessionId) {
    sessionId = Math.random().toString(36).substring(2, 15);
    localStorage.setItem("mindspace_session_id", sessionId);
  }
  return sessionId;
}

export function clearSessionId(): void {
  localStorage.removeItem("mindspace_session_id");
}