import React, { useState, useEffect } from "react";
import axios from "axios";
import { getCityUrl, getStreetUrl } from "../config/apiPath";
import { DelayInput } from "react-delay-input";
import Cookies from "js-cookie";



const url = "https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address";
const tokenDadata = "1c83925236f06abf69fca2921b74ce4cc8a835ed";

export default function AddStreet({ setReloadStreet, setAddStreet, networkNodeId, selectCity }) {
    const token = Cookies.get("jwt");
  const [address, setAddress] = useState("");
  const [comment, setComment] = useState("");
  const [listFias, setListFias] = useState();
  const [selectFias, setSelectFias] = useState();
  const [showHelp, setShowHelp] = useState(false);
  useEffect(() => {
    // setSelectFias(selectFias);
  }, []);
  useEffect(() => {}, [address]);
  const handlerAddress = (event) => {
    setAddress(event.target.value);
    let options = null;

    axios
      .get(getCityUrl + `?filters[id][$eq]=${selectCity}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        fetch(url, {
          method: "POST",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: "Token " + tokenDadata,
          },
          body: JSON.stringify({
            query: event.target.value,
            locations_boost: [
              {
                kladr_id: (response.data && response.data.data[0]&&response.data.data[0].attributes.fias && response.data.data[0].attributes.fias.data.kladr_id) || null,
              },
            ],
            locations: [
              {
                city_type_full: "",
                region: "московская",
              },
            ],
            from_bound: {
              value: "settlement",
            },
            to_bound: {
              value: "street",
            },
            restrict_value: true,
          }),
        })
          .then((response) => response.text())
          .then((result) => {
            console.log(JSON.parse(result).suggestions)
            setListFias(JSON.parse(result).suggestions);
            setShowHelp(true);
          })
          .catch((error) => console.log("error", error));
      })
      .catch((error) => {
        console.log("An error occurred:", error);
      });
  };
  const pushStreet = () => {
    if (selectFias) {
      axios
        .post(
          getStreetUrl,
          {
            data: {
              name: selectFias.value,
              fias: selectFias,
              uzel_podklyucheniya: networkNodeId,
              comment: comment,
            },
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((response) => {
         // console.log(response);
        })
        .catch((error) => {
          console.log("An error occurred:", error);
        });
    }
  };
  const handlerSubmit = (event) => {
    event.preventDefault();
    pushStreet();
    setReloadStreet(true);
    setAddStreet(false);
  };

  return (
    <div className="modal">
      <form className="address-form" onSubmit={handlerSubmit}>
        <h2>Добавить улицу</h2>
        <div className="address-form__row">
          <label>Улица: </label>
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
        </div>
        <div className="address-form__row">
          <label>Уточнение: </label>
          <input
            className="address-form__input"
            type="text"
            value={comment}
            onChange={(event) => {
              setComment(event.target.value);
            }}
          />
        </div>
        <div className="address-form__row">
          <button type="submit" className="address-form__submit" disabled={!selectFias}>
            Добавить
          </button>
          <button
            type="button"
            className="address-form__submit"
            onClick={(event) => {
              setAddStreet(false);
            }}
          >
            Отмена
          </button>
        </div>
      </form>
    </div>
  );
}
