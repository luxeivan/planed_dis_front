import "./App.css";
import Cookies from "js-cookie";
import Auth from "./components/Auth";
import { useEffect, useState } from "react";
import Header from "./components/Header";
import ListDisconected from "./components/ListDisconected";
import AddDisconnect from "./components/AddDisconnect";

function App() {
  const [logon, setLogon] = useState(false);
  const [user, setUser] = useState();
  useEffect(() => {
    if (Cookies.get("id")) {
      setLogon(true);
    }
  }, []);
  useEffect(() => {
    if (Cookies.get("id")) {
      setUser({ id: Cookies.get("id"), username: Cookies.get("username"), firstname: Cookies.get("firstname"), lastname: Cookies.get("lastname") });
    } else {
      setUser();
    }
  }, [logon]);
  const setCurrentUser = ({ id, username, jwt, firstname, lastname }) => {
    Cookies.set("id", id, { expires: 0.041 });
    Cookies.set("username", username, { expires: 0.041 });
    Cookies.set("firstname", firstname, { expires: 0.041 });
    Cookies.set("lastname", lastname, { expires: 0.041 });
    Cookies.set("jwt", jwt, { expires: 0.041 });
    setLogon(true);
  };
  const handlerLogoff = () => {
    Cookies.remove("id");
    Cookies.remove("username");
    Cookies.remove("jwt");
    Cookies.remove("firstname");
    Cookies.remove("lastname");
    setLogon(false);
  };
  return (
    <div className="App">
      <Header user={user} handlerLogoff={handlerLogoff} />
      {!logon && <Auth setCurrentUser={setCurrentUser} />}
      {logon && <div className="disconnect">
        <ListDisconected/>
        <AddDisconnect/>
        </div>}
    </div>
  );
}

export default App;
