import React from 'react';
import { useReactiveVar } from '@apollo/client';
import { isLoggedInVar } from './apollo';
import { LoggedIn, LoggedOut } from './routers';

function App() {
  const isLoggedIn = useReactiveVar(isLoggedInVar);
  return isLoggedIn ? <LoggedIn /> : <LoggedOut />
}

export default App;
