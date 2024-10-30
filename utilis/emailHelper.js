/**
 * Updates email-related fields in the site data configuration with custom email settings
 *
 * @param {Object} siteData - The original site data configuration object containing form field definitions
 * @param {Object} config - Configuration object containing email customization settings
 * @param {string} [config.userPrefix] - Custom prefix for the email address
 * @param {string} [config.emailDomain] - Custom domain for the email address
 * @returns {Object} Updated site data configuration with modified email fields
 *
 * @example
 * const config = { userPrefix: 'test', emailDomain: 'example.com' };
 * const updatedData = updateEmailFields(siteData, config);
 * // Will update email fields to format: test{timestamp}@example.com
 */
export function updateEmailFields(siteData, config) {
  if (!config.userPrefix || !config.emailDomain) {
    return siteData
  }

  const updatedData = {...siteData}
  const emailFields = ['email', 'clientEmail']

  emailFields.forEach(field => {
    if (updatedData[field]) {
      updatedData[field] = {
        ...updatedData[field],
        data: `${config.userPrefix}${Date.now()}@${config.emailDomain}`
      }
    }
  })

  return updatedData
}
