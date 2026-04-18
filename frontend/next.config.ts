import type { NextConfig } from "next";
import os from "os";

// Dynamically fetch all local IP addresses (so it always works even if your router changes your IP)
const interfaces = os.networkInterfaces();
const localIps = Object.values(interfaces)
  .flat()
  .filter((i: any) => i && i.family === 'IPv4' && !i.internal)
  .map((i: any) => i.address);

const dynamicOrigins = localIps.flatMap(ip => [
  ip,
  `${ip}:3000`,
  `http://${ip}`,
  `http://${ip}:3000`
]);

const nextConfig: any = {
  // Prevent OOM on Render Free Tier
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  experimental: {
    memoryBasedWorkersCount: true,
  },
  allowedDevOrigins: [
    "localhost:3000",
    "http://localhost:3000",
    "unfancy-yetta-semipopularly.ngrok-free.dev",
    ...dynamicOrigins
  ],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "source.unsplash.com",
      },
    ],
  },
  async rewrites() {
    // On Vercel, NEXT_PUBLIC_API_URL should be the full URL of the Render backend
    // e.g., https://my-backend.onrender.com/api/:path*
    // Locally, it defaults to the proxy
    const backendUrl = process.env.BACKEND_URL || "http://127.0.0.1:8080";
    return [
      {
        source: "/api/:path*",
        destination: `${backendUrl}/:path*`,
      },
    ];
  },
};

export default nextConfig;