const nextConfig = {
  output: "standalone",

  images: {
    unoptimized: true, // Bypass /_next/image proxy entirely – images load direct from source
    remotePatterns: [
      {
        protocol: "https",
        hostname: "immindia.edu.in",
        pathname: "/**",
      },
    ],
  },

  serverExternalPackages: ["sharp"],
};

export default nextConfig;
