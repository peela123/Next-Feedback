/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false, //prevent react dafault for console.log twice
  transpilePackages: ["@mui/x-charts"],
};

module.exports = nextConfig;
