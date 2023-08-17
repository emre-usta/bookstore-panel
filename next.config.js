/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    AUTH_API_URL: process.env.AUTH_API_URL,
    MEMBERSHIP_ID: process.env.MEMBERSHIP_ID,
    BOOKSTORE_API_URL: process.env.BOOKSTORE_API_URL
  }
}

module.exports = nextConfig
