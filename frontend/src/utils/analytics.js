// Generate session ID
const sessionId = sessionStorage.getItem('proprules_session_id') || (() => {
  const id = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  sessionStorage.setItem('proprules_session_id', id);
  return id;
})();

export const trackEvent = async (type, label = '', url = '', metadata = {}) => {
  try {
    const enrichedMetadata = {
      ...metadata,
      sessionId,
      userAgent: navigator.userAgent,
      referrer: document.referrer
    };

    // Fire-and-forget tracking call
    fetch('/api/analytics/track', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        type,
        label,
        url,
        metadata: enrichedMetadata
      })
    }).catch(err => console.warn('Analytics tracking error:', err));
  } catch (error) {
    // Fail silently in production
    console.error('Analytics tracking execution error:', error);
  }
};
