import Cookies from "js-cookie";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { getPointConnectedUrl } from "../config/apiPath";

export default function EditNetworkNode({ setReloadNetworkNode, setEditNetworkNode,selectNetworkNode,currentName }) {
  const [name, setName] = useState();
  const token = Cookies.get("jwt");
  useEffect(() => {
    setName(currentName[0].attributes.name);
    console.log(currentName)
    console.log(selectNetworkNode)
  },[]);
  const handlerSubmit = (event) => {
    event.preventDefault();
    axios
      .put(
        getPointConnectedUrl + `/${selectNetworkNode}`,
        {
          data: {
            name: name,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        //console.log(response);
        setEditNetworkNode(false);
        setReloadNetworkNode(true);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <div className="modal">
      <form className="address-form" onSubmit={handlerSubmit}>
        <h2>Переименуйте узел подключения:</h2>
        <div className="address-form__row">
          <input
            className="address-form__input"
            type="text"
            value={name}
            onChange={(event) => {
              setName(event.target.value);
            }}
          />
        </div>

        <div className="address-form__row">
          <button type="submit" className="address-form__submit">
            Изменить
          </button>
          <button
            type="button"
            className="address-form__submit"
            onClick={(event) => {
              setEditNetworkNode(false);
            }}
          >
            Отмена
          </button>
        </div>
      </form>
    </div>
  );
}
