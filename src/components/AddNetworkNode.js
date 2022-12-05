import React, { useState, useEffect } from "react";
import axios from "axios";
import { getCityUrl, getPointConnectedUrl } from "../config/apiPath";
import { DelayInput } from "react-delay-input";
import Cookies from "js-cookie";



export default function AddNetworkNode({ setReloadNetworkNode, setAddNetworkNode, cityId }) {
    const token = Cookies.get("jwt");
  const [nameNetworkNode, setNameNetworkNode] = useState();

  const pushNetworkNode = () => {
    if (nameNetworkNode) {
      axios
        .post(
          getPointConnectedUrl,
          {
            data: {
              name: nameNetworkNode,
              gorod: cityId,
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
        })
        .catch((error) => {
          console.log("An error occurred:", error);
        });
    }
  };
  const handlerSubmit = (event) => {
    event.preventDefault();
    pushNetworkNode();
    setReloadNetworkNode(true);
    setAddNetworkNode(false);
  };
  return (
    <div className="modal">
      <form className="address-form" onSubmit={handlerSubmit}>
        <h2>Добавить диспетчерское наименование узла электросети</h2>
        <div className="address-form__row">
          <input
          className="address-form__input"
            type="text"
            value={nameNetworkNode}
            onChange={(event) => {
              setNameNetworkNode(event.target.value);
            }}
          />
          <button type="submit" className="address-form__submit" disabled={!nameNetworkNode}>
            Добавить
          </button>
          <button
            type="button"
            className="address-form__submit"
            onClick={(event) => {
                setAddNetworkNode(false);
            }}
          >
            Отмена
          </button>
        </div>
      </form>
    </div>
  );
}
