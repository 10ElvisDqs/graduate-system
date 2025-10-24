// import { useQuery } from '@apollo/client/react';
// import { MENU_QUERY, type MainMenuType } from './apollo/queries/menu';
import { RouterProvider } from 'react-router';
import { appRouter } from './app.router';
import { ApolloProvider } from '@apollo/client/react';
import client from './apollo/apolloClient';

export const PostgraduateApp = () =>  {
  // const { data, error, loading } = useQuery<MainMenuType>(MENU_QUERY);

  // if (loading) return <p>Recuperando datos...</p>;
  // if (error) return <p>Error: {error.message}</p>;

  return (
    <ApolloProvider client={client}>
      <RouterProvider router={appRouter} />
    </ApolloProvider>
  );
  // return <RouterProvider router={appRouter} />;
  // return (
    // <>
      {/* <h2>
        Menú: {data?.rootMenuItems.map(item => item.title).join(', ')}
      </h2> */}
      // <RouterProvider router={appRouter} />
    // </>
  // );
};