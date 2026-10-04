import {ServerRouter} from 'react-router';
import {isbot} from 'isbot';
import {renderToReadableStream} from 'react-dom/server';
import {createContentSecurityPolicy} from '@shopify/hydrogen';

/**
 * @param {Request} request
 * @param {number} responseStatusCode
 * @param {Headers} responseHeaders
 * @param {EntryContext} reactRouterContext
 * @param {HydrogenRouterContextProvider} context
 */
export default async function handleRequest(
  request,
  responseStatusCode,
  responseHeaders,
  reactRouterContext,
  context,
) {
  const {nonce, header, NonceProvider} = createContentSecurityPolicy({
    shop: {
      checkoutDomain: context.env.PUBLIC_CHECKOUT_DOMAIN,
      storeDomain: context.env.PUBLIC_STORE_DOMAIN,
    },
    imgSrc: [
      "'self'",
      'data:',
      'https://cdn.shopify.com',
      'https://picsum.photos',
      'https://fastly.picsum.photos',
      'https://cdn.sanity.io',
      'blob:',
    ],
    mediaSrc: ["'self'", 'https://cdn.sanity.io'],
    // Sanity Studio (/studio) needs the Sanity APIs, fonts and workers
    connectSrc: ['https://*.sanity.io', 'wss://*.sanity.io', 'https://*.apicdn.sanity.io'],
    fontSrc: ['https://studio-static.sanity.io'],
    styleSrc: ['https://studio-static.sanity.io'],
    frameSrc: ['https://*.sanity.io'],
    workerSrc: ["'self'", 'blob:'],
    frameAncestors: ["'self'"],
  });

  const body = await renderToReadableStream(
    <NonceProvider>
      <ServerRouter
        context={reactRouterContext}
        url={request.url}
        nonce={nonce}
      />
    </NonceProvider>,
    {
      nonce,
      signal: request.signal,
      onError(error) {
        console.error(error);
        responseStatusCode = 500;
      },
    },
  );

  if (isbot(request.headers.get('user-agent'))) {
    await body.allReady;
  }

  responseHeaders.set('Content-Type', 'text/html');
  responseHeaders.set('Content-Security-Policy', header);

  return new Response(body, {
    headers: responseHeaders,
    status: responseStatusCode,
  });
}

/** @typedef {import('@shopify/hydrogen').HydrogenRouterContextProvider} HydrogenRouterContextProvider */
/** @typedef {import('react-router').EntryContext} EntryContext */