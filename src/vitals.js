const vitalsUrl = 'https://vitals.vercel-analytics.com/v1/vitals';

function getConnectionSpeed() {
  return 'connection' in navigator &&
    navigator['connection'] &&
    'effectiveType' in navigator['connection']
    ? navigator['connection']['effectiveType']
    : '';
}

export function sendToVercelAnalytics(metric) {
  // This is a placeholder - in a real app, you would send the data to Vercel Analytics
  console.log('Web Vitals:', metric);
}
