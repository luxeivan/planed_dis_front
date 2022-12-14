import React, { useEffect, useState } from "react";
import axios from "axios";
import { authUrl } from "../config/apiPath";

export default function Auth({ setCurrentUser }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  const handlerSubmit = (event) => {
    event.preventDefault();
    axios
      .post(authUrl, {
        identifier: username,
        password: password,
      })
      .then((response) => {
        setCurrentUser({
          id: response.data.user.id,
          username: response.data.user.username,
          firstname: response.data.user.firstname,
          lastname: response.data.user.lastname,
          jwt: response.data.jwt,
        });
      })
      .catch((error) => {
        console.log("An error occurred:", error);
        if (error.response) {
          setError('Неправильный логин или пароль');
        } else {
          setError("Нет связи с сервером");
        }
      });
  };
  return (
    <div className="auth">
      <h2>Плановые отключения</h2>
      <form className="auth__form" onSubmit={handlerSubmit}>
        <div className="auth__row">
          <label className="auth__label" htmlFor="login">
            Логин:{" "}
          </label>
          <input
            name="login"
            className="auth__input"
            type="text"
            value={username}
            onChange={(event) => {
              setUsername(event.target.value);
            }}
          />
        </div>
        <div className="auth__row">
          <label className="auth__label" htmlFor="password">
            Пароль:{" "}
          </label>
          <input
            name="password"
            className="auth__input"
            type="password"
            value={password}
            placeholder=""
            onChange={(event) => {
              setPassword(event.target.value);
            }}
          />
        </div>
        <div className="auth__row">
          <button className="auth__button" type="submit">
            Войти
          </button>
        </div>
      </form>
      {error && <h3 style={{ color: "#f00" }}> {error}</h3>}
    </div>
  );
}
