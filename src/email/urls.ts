import { getAppURL, getWebsiteURL } from '@/lib/env'

export const getEmailURLs = () => {
  const appURL = getAppURL()
  return {
    appURL,
    websiteURL: getWebsiteURL(),
    // A pre-sized PNG keeps emails light. Email clients require an absolute,
    // publicly reachable URL, so APP_URL must be public in production.
    logoURL: `${appURL}/brand/arthanova-logo-email.png`,
    loginURL: `${appURL}/admin/login`,
    forgotPasswordURL: `${appURL}/admin/forgot`,
    resetPasswordURL: (token: string) => `${appURL}/admin/reset/${encodeURIComponent(token)}`,
    activationURL: (token: string) => `${appURL}/account/activate/${encodeURIComponent(token)}`,
  }
}
