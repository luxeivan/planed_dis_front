import "./App.css";
import Cookies from "js-cookie";
import Auth from "./components/Auth";
import { useEffect, useState } from "react";
import Header from "./components/Header";
import ListDisconected from "./components/ListDisconected";
import AddDisconnect from "./components/AddDisconnect";
import { Context } from "./Context";



function App() {
  const [reloadList,setReloadList] = useState(false)
  const [logon, setLogon] = useState(false);
  const [nameZone, setNameZone] = useState(false);
  const [user, setUser] = useState();
  useEffect(() => {
    if (Cookies.get("id")) {
      setLogon(true);
    }
  }, []);
  useEffect(() => {
    if (Cookies.get("id")) {
      setUser({ id: Cookies.get("id"), nameZone: Cookies.get("nameZone"), username: Cookies.get("username"), firstname: Cookies.get("firstname"), lastname: Cookies.get("lastname") });
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
  const setCurrentZone = ({ zone,nameZone }) => {
    Cookies.set("zone", zone, { expires: 0.041 });
    Cookies.set("nameZone", nameZone, { expires: 0.041 });
    setNameZone(nameZone);
  };
  const handlerLogoff = () => {
    Cookies.remove("id");
    Cookies.remove("username");
    Cookies.remove("jwt");
    Cookies.remove("firstname");
    Cookies.remove("lastname");
    Cookies.remove("zone");
    Cookies.remove("nameZone");
    setLogon(false);
  };
  return (
    <Context.Provider value={{setReloadList,reloadList}}>
    <div className="App">
      <Header user={user} nameZone={nameZone} handlerLogoff={handlerLogoff}/>
      {!logon && <Auth setCurrentUser={setCurrentUser} />}
      {logon && <div className="disconnect">
        <ListDisconected setCurrentZone={setCurrentZone}/>
        <AddDisconnect/>
        </div>}
    </div>
    </Context.Provider>
  );
}

export default App;
