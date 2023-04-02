import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "./firebase";
import {
  collection,
  query,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import Discover from "./pages/Discover";
import Destination from "./pages/Destination";

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const date = new Date().toLocaleDateString("en-US");
  const id = Math.floor(Math.random() * 1000000) + 1;

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
  }, []);
  useEffect(() => {
    const q = query(collection(db, "posts"));
    const unsub = onSnapshot(q, (querySnapshot) => {
      let postsArray = [];
      querySnapshot.forEach((doc) => {
        postsArray.push({ ...doc.data(), id: doc.id });
      });
      setPosts(postsArray);
    });
    return () => unsub();
  }, []);

  return (
    <>
      <Router>
        <Switch>
          <Route path="/signup">
            <SignUp />
          </Route>
          <Route path="/login">
            <Login />
          </Route>
          <Route path="/discover">
            <Discover
              currentUser={currentUser}
              title={title}
              setTitle={setTitle}
              description={description}
              setDescription={setDescription}
              image={image}
              setImage={setImage}
              date={date}
              id={id}
              posts={posts}
              setPosts={setPosts}
            />
          </Route>

          <Route path="/destination">
            <Destination currentUser={currentUser} />
          </Route>
          <Route path="/">
            <Home currentUser={currentUser} />
          </Route>
        </Switch>
      </Router>
    </>
  );
}

export default App;
