/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false, //prevent react dafault for console.log twice
  transpilePackages: ["@mui/x-charts"],
};

module.exports = nextConfig;

module.exports = {
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
};
