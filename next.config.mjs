/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactCompiler: true,
  experimental: {
    outputFileTracingIncludes: {
      '/api/*': ['./node_modules/.prisma/client/*.wasm', './node_modules/.prisma/client/*.so.node'],
    },
  },
};

export default nextConfig;
