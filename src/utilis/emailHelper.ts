type SiteDataField = {
  data: string
  [key: string]: any
}

type SiteData = {
  [key: string]: SiteDataField
}

type EmailConfig = {
  userPrefix?: string
  emailDomain?: string
}

/**
 * Updates email-related fields in the site data configuration with custom email settings
 *
 * @param siteData - The original site data configuration object containing form field definitions
 * @param config - Configuration object containing email customization settings
 * @returns Updated site data configuration with modified email fields
 *
 * @example
 * const config = { userPrefix: 'test', emailDomain: 'example.com' };
 * const updatedData = updateEmailFields(siteData, config);
 * // Will update email fields to format: test{timestamp}@example.com
 */
export function updateEmailFields(siteData: SiteData, config: EmailConfig): SiteData {
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
