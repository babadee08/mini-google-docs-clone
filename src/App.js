import React from 'react';
// import SyncingEditor from './SyncingEditor';
import { BrowserRouter, Route, Redirect } from 'react-router-dom';
import GroupEditor from './GroupEditor';

function App() {
  return (
    <BrowserRouter>
      <Route path="/" exact component={() => {
        return <Redirect to={`/group/${Date.now()}`} />
      }} />
      <Route path="/group/:id" component={GroupEditor}></Route>
    </BrowserRouter>
  );
}

export default App;
