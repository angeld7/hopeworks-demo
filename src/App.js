import "./styles.css";
import { database } from "./firebaseConfig";
import { collection, addDoc, onSnapshot } from "firebase/firestore";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from "firebase/auth";
import { useState } from "react";

export default function App() {
  let auth = getAuth();
  const [data, setData] = useState({
    email: "",
    password: "",
    chatLog: [],
    chatMessage: "",
    message: "Please log in",
    user: null
  });
  const setValue = (name, value) => {
    data[name] = value;
    setData({ ...data });
  };
  const collectionRef = collection(database, "chat");
  const handleInputs = (event) => {
    setValue(event.target.name, event.target.value);
  };

  const handleSubmit = () => {
    console.log("Email: " + data.email + " Password: " + data.password);
    signInWithEmailAndPassword(auth, data.email, data.password)
      .then((response) => {
        console.log(response.user);
        setValue("user", response.user);
        setValue("message", "User signed in! Welcome back!");
        getData();
      })
      .catch((err) => {
        console.log(err);
        if (err.message === "Firebase: Error (auth/user-not-found).") {
          createUserWithEmailAndPassword(auth, data.email, data.password)
            .then((response) => {
              console.log(response.user);
              setValue("user", response.user);
              setValue("message", "User created! Thanks for joining!");
              getData();
            })
            .catch((err) => setValue("message", err.message));
        } else {
          setValue("message", err.message);
        }
      });
  };
  const logout = () => {
    setValue("message", "Please log in");
    setValue("user", null);
  };
  const addMessage = (event) => {
    addDoc(collectionRef, {
      email: data.email,
      message: data.chatMessage
    });
    event.target.setValue = "";
    setValue("chatMessage", "");
  };
  const getData = () => {
    onSnapshot(collectionRef, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        data.chatLog.push(change.doc.data());
        data.chatMessage = "";
        setData({ ...data });
        console.log(change.doc.data());
      });
    });
  };
  return (
    <div className="App">
      <h1>Hello Hopeworks!</h1>
      <div>
        <h3>{data.message}</h3>
        {!data.user && (
          <>
            <input name="email" placeholder="Email" onChange={handleInputs} />
            <input
              name="password"
              placeholder="Password"
              type="password"
              onChange={handleInputs}
            />
            <input type="submit" onClick={handleSubmit} />
          </>
        )}
        {data.user && (
          <>
            <button onClick={logout}>Logout</button>
            <br /> <br />
            <div style={{ textAlign: "left" }}>
              {data.chatLog.map((message) => (
                <div>
                  <b>{message.email}:</b> {message.message}
                </div>
              ))}
            </div>
            <input
              name="chatMessage"
              value={data.chatMessage}
              placeholder="Enter message"
              onChange={handleInputs}
            />
            <input type="submit" onClick={addMessage} />
          </>
        )}
      </div>
    </div>
  );
}
