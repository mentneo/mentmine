import { analytics } from '../firebase/config';
import { logEvent, setUserId, setUserProperties } from 'firebase/analytics';

/**
 * Track page view events
 * @param {string} pageName - The name of the page being viewed
 * @param {Object} pageParams - Additional parameters to track
 */
export const trackPageView = (pageName, pageParams = {}) => {
  if (!analytics) return;
  
  logEvent(analytics, 'page_view', {
    page_name: pageName,
    page_path: window.location.pathname,
    page_location: window.location.href,
    ...pageParams
  });
};

/**
 * Track user actions/events
 * @param {string} eventName - Name of the event
 * @param {Object} eventParams - Parameters associated with the event
 */
export const trackEvent = (eventName, eventParams = {}) => {
  if (!analytics) return;
  
  logEvent(analytics, eventName, {
    timestamp: new Date().toISOString(),
    ...eventParams
  });
};

/**
 * Set user ID for analytics
 * @param {string} userId - User's unique identifier
 */
export const setAnalyticsUserId = (userId) => {
  if (!analytics || !userId) return;
  
  setUserId(analytics, userId);
};

/**
 * Set user properties for better segmentation
 * @param {Object} properties - User properties to set
 */
export const setAnalyticsUserProperties = (properties) => {
  if (!analytics || !properties) return;
  
  setUserProperties(analytics, properties);
};

/**
 * Track conversion events (sign-ups, course enrollments, etc.)
 * @param {string} conversionType - Type of conversion
 * @param {Object} conversionData - Data associated with the conversion
 */
export const trackConversion = (conversionType, conversionData = {}) => {
  if (!analytics) return;
  
  const eventData = {
    conversion_type: conversionType,
    value: conversionData.value || 0,
    currency: conversionData.currency || 'INR',
    ...conversionData
  };
  
  logEvent(analytics, 'conversion_event', eventData);
  
  // Also track specific conversion types
  switch (conversionType) {
    case 'course_enrollment':
      logEvent(analytics, 'course_enrollment', eventData);
      break;
    case 'form_submission':
      logEvent(analytics, 'form_submission', eventData);
      break;
    case 'subscription':
      logEvent(analytics, 'subscription', eventData);
      break;
    default:
      // No additional event needed
  }
};

/**
 * Initialize analytics for a page with the user context
 * @param {string} pageName - Name of the current page
 * @param {Object} user - User data if available
 * @param {Object} additionalParams - Any additional parameters to track
 */
export const initPageAnalytics = (pageName, user = null, additionalParams = {}) => {
  if (!analytics) return;
  
  // Track page view
  trackPageView(pageName, additionalParams);
  
  // Set user ID and properties if available
  if (user?.uid) {
    setAnalyticsUserId(user.uid);
    
    const userProperties = {
      user_role: user.role || 'student',
      account_level: user.accountLevel || 'free',
      signup_method: user.signupMethod || 'email',
      course_enrolled: user.enrolledCourse || 'none'
    };
    
    setAnalyticsUserProperties(userProperties);
  }
};

/**
 * Track user engagement metrics
 * @param {string} engagementType - Type of engagement activity
 * @param {Object} engagementData - Data about the engagement
 */
export const trackEngagement = (engagementType, engagementData = {}) => {
  if (!analytics) return;
  
  const eventName = `engagement_${engagementType}`;
  
  logEvent(analytics, eventName, {
    engagement_type: engagementType,
    engagement_time_msec: engagementData.timeSpent || 0,
    ...engagementData
  });
};
