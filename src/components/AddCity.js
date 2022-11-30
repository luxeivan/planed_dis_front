import React, { useState, useEffect } from "react";
import axios from "axios";
import { getCityUrl } from "../config/apiPath";
import { DelayInput } from "react-delay-input";
import Cookies from "js-cookie";    



const url = "https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address";
const tokenDadata = "1c83925236f06abf69fca2921b74ce4cc8a835ed";

export default function AddCity({ setReloadCity, setAddCity }) {
    const token = Cookies.get("jwt");
  const [address, setAddress] = useState("");
  const [listFias, setListFias] = useState();
  const [selectFias, setSelectFias] = useState();
  const [showHelp, setShowHelp] = useState(false);
  useEffect(() => {
    //setSelectFias(selectFias);
  }, [selectFias]);
  useEffect(() => {}, [address]);
  const handlerAddress = (event) => {
    setAddress(event.target.value);
    const options = {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: "Token " + tokenDadata,
      },
      body: JSON.stringify({
        query: event.target.value,
        locations: [
          {
            city_type_full: "",
            region: "московская",
          },
        ],
        from_bound: {
          value: "city",
        },
        to_bound: {
          value: "settlement",
        },
        restrict_value: true,
      }),
    };
    fetch(url, options)
      .then((response) => response.text())
      .then((result) => {
        setListFias(JSON.parse(result).suggestions);
        setShowHelp(true);
      })
      .catch((error) => console.log("error", error));
  };
  const pushCity = () => {
    if (selectFias) {
      axios
        .post(
          getCityUrl,
          {
            data: {
              name: selectFias.value,
              fias: selectFias,
            },
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((response) => {
            console.log(response);
        })
        .catch((error) => {
          console.log("An error occurred:", error);
        });
    }
  };
  const handlerSubmit = (event) => {
    event.preventDefault();
    pushCity();
    setReloadCity(true);
    setAddCity(false);
    
  };

  return (
    <div className="modal">
      <form className="address-form" onSubmit={handlerSubmit}>
        <h2>Добавить город</h2>
        <div className="address-form__row">
          {selectFias && <span style={{ color: "green" }}>+ </span>}
          <DelayInput
            minLength={2}
            delayTimeout={1000}
            className="address-form__input"
            type="text"
            value={address}
            onChange={handlerAddress}
            name="address"
            onBlur={() => {
              setTimeout(() => {
                setShowHelp(false);
              }, 2000);
            }}
            onFocus={() => {
              setShowHelp(true);
              setSelectFias();
            }}
          />

          {listFias && showHelp ? (
            <ul className="fias-list">
              {listFias.map((item, index) => {
                if (item.value === address) {
                  return false;
                }
                return (
                  <li
                    className="fias-list__item"
                    key={index}
                    onClick={() => {
                      setAddress(item.value);
                      setSelectFias(item);
                      setListFias();
                      setShowHelp(false);
                    }}
                  >
                    {item.value}
                  </li>
                );
              })}
            </ul>
          ) : (
            false
          )}
          <button type="submit" className="address-form__submit" disabled={!selectFias}>
            Добавить
          </button>
          <button
            type="button"
            className="address-form__submit"
            onClick={(event) => {
              setAddCity(false);
            }}
          >
            Отмена
          </button>
        </div>
      </form>
    </div>
  );
}
