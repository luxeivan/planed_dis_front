import React from "react";
import logo from '../img/logo.2f5542c777487560a5db0375fd18bd99.svg'

export default function Header({ user, handlerLogoff }) {
  return (
    <header className="header">
      <div className="header__item header__logo"><img src={logo} /></div>
      <div className="header__item header__center">
        {!user ? (
          <div></div>
        ) : (
          <div className="">
            Добро пожаловать, {user.firstname} {user.lastname}!
          </div>
        )}
      </div>
      <div className="header__item header__user">
        {!user ? (
          <div></div>
        ) : (
          <div className="logon-area">
            <span className="logon-area__username">{user.username}</span>
            <button className="logon-area__logout" onClick={handlerLogoff}>
              Выйти
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
