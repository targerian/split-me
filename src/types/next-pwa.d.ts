declare module 'next-pwa' {
  import { NextConfig } from 'next';

  interface PWAConfig {
    dest?: string;
    disable?: boolean;
    register?: boolean;
    scope?: string;
    sw?: string;
    skipWaiting?: boolean;
    runtimeCaching?: Array<{
      urlPattern: RegExp | string;
      handler: string;
      options?: Record<string, unknown>;
    }>;
  }

  function withPWA(config: PWAConfig): (nextConfig: NextConfig) => NextConfig;
  export default withPWA;
} 