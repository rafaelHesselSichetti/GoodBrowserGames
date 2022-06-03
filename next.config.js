/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    loader: 'akamai',
    path: '',
    domains: ['andrewhawkes.github.io', 'cdn2.steamgriddb.com'],
  },
}

module.exports = nextConfig
