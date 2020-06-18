// import App from 'next/app'
import { GraphQLClient, ClientContext } from "graphql-hooks";
import { ZeitProvider, CssBaseline } from "@zeit-ui/react";
import NavBar from "../components/NavBar";
import memCache from "graphql-hooks-memcache";

function MyApp({ Component, pageProps }) {
  const client = new GraphQLClient({
    url: process.env.NEXT_PUBLIC_GRAPHQL_URL,
    cache: memCache(),
    logErrors: false,
  });
  return (
    <ClientContext.Provider value={client}>
      <ZeitProvider>
        <CssBaseline />
        <NavBar />
        <Component {...pageProps} />
      </ZeitProvider>
    </ClientContext.Provider>
  );
}

// Only uncomment this method if you have blocking data requirements for
// every single page in your application. This disables the ability to
// perform automatic static optimization, causing every page in your app to
// be server-side rendered.
//
// MyApp.getInitialProps = async (appContext) => {
//   // calls page's `getInitialProps` and fills `appProps.pageProps`
//   const appProps = await App.getInitialProps(appContext);
//
//   return { ...appProps }
// }

export default MyApp;
