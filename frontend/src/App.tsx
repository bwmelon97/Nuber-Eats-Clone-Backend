import React from 'react';
import { useReactiveVar } from '@apollo/client';
import { isLoggedInVar } from '@apollo-client';
import { LoggedInRouter, LoggedOutRouter } from '@routers';

function App() {
  const isLoggedIn = useReactiveVar(isLoggedInVar);
  return isLoggedIn ? <LoggedInRouter /> : <LoggedOutRouter />
}

export default App;
