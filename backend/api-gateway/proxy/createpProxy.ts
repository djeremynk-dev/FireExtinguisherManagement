import type { RequestHandler } from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';

type ProxyOptions = {
  target: string;
  /** Service route prefix on the target (e.g. /auth, /extinguishers) */
  basePath: string;
};

export const createServiceProxy = ({ target, basePath }: ProxyOptions): RequestHandler =>
  createProxyMiddleware({
    target,
    changeOrigin: true,
    xfwd: true,
    pathRewrite: (path) => {
      const suffix = path === '/' ? '' : path;
      return `${basePath}${suffix}`;
    }
  });
