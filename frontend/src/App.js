import "./App.css";
import Homepage from "./Pages/Homepage";
import { Route } from "react-router-dom";
import Chatpage from "./Pages/Chatpage";
import React from 'react';
import {Switch } from "react-router-dom";
import { ChatState } from "./Context/ChatProvider"; 


function App() {

  const { user } = ChatState();


  return (
    <div className="App">
      <Switch>
      <Route path="/" component={Homepage} exact />
      <Route path="/chats" component={Chatpage} />
      </Switch>
    </div>
  );
}

export default App;



