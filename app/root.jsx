import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  Link,
  isRouteErrorResponse,
  useRouteError,
} from 'react-router';

import {useNonce} from '@shopify/hydrogen';

import '@fontsource-variable/inter';
import '@fontsource-variable/cormorant';

import '~/styles/tailwind.css';

import {getSiteNav} from '~/lib/navData';
import {SiteLayout} from '~/components/layout/SiteLayout';
import {StoreProvider} from '~/state/StoreProvider';

export const links = () => [];

export async function loader({context}) {
  return {
    nav: await getSiteNav(context),
  };
}

export const shouldRevalidate = ({formMethod}) =>
  !!formMethod && formMethod !== 'GET';

export function Layout({children}) {
  const nonce = useNonce();

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />

        <meta
          name="viewport"
          content="width=device-width,initial-scale=1"
        />

        <Meta />

        <Links />
      </head>

      <body>
        {children}

        <ScrollRestoration nonce={nonce} />

        <Scripts nonce={nonce} />
      </body>
    </html>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <SiteLayout>
        <Outlet />
      </SiteLayout>
    </StoreProvider>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();

  const status = isRouteErrorResponse(error)
    ? error.status
    : 500;

  return (
    <SiteLayout>
      <div className="mx-auto w-[min(100%_-_2*var(--gutter),var(--container))] [padding-block:var(--section-y)]">
        <h1>
          {status === 404
            ? 'Page not found'
            : 'Something went wrong'}
        </h1>

        <p>
          <Link
            className="
              inline-flex
              items-center
              justify-center
              [padding:.9rem_1.8rem]
              [border:1px_solid_var(--green-800)]
              [border-radius:var(--radius-btn)]
              [background:var(--green-800)]
              [color:#fff]
              [font:inherit]
              [font-size:.78rem]
              [letter-spacing:.12em]
              uppercase
              cursor-pointer
              [transition:var(--transition)]
              [&:hover]:[background:var(--green-700)]
              [&:hover]:[border-color:var(--green-700)]
              [&[disabled]]:[opacity:.4]
              [&[disabled]]:pointer-events-none
              [.hero__cta_&]:[padding:.9rem_2.2rem]
              [.sec--green_&:not(.btn--ghost)]:[background:#fff]
              [.sec--green_&:not(.btn--ghost)]:[color:var(--green-900)]
              [.sec--green_&:not(.btn--ghost)]:[border-color:#fff]
              [.sec--dark_&:not(.btn--ghost)]:[background:#fff]
              [.sec--dark_&:not(.btn--ghost)]:[color:var(--green-900)]
              [.sec--dark_&:not(.btn--ghost)]:[border-color:#fff]
              [.ibanner_&:not(.btn--ghost)]:[background:#fff]
              [.ibanner_&:not(.btn--ghost)]:[color:var(--green-900)]
              [.ibanner_&:not(.btn--ghost)]:[border-color:#fff]
            "
            to="/"
          >
            Back home
          </Link>
        </p>
      </div>
    </SiteLayout>
  );
}