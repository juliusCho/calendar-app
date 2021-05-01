export default {
  platform: process.env.NEXT_PUBLIC_PLATFORM ?? 'dev',
  systemLocale: process.env.NEXT_PUBLIC_LOCALE ?? 'ko',
  uriApiApp: process.env.NEXT_PUBLIC_URI_API_APP ?? 'https://app.api.rocket.is',
}
