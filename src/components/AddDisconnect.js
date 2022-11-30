import React, { useEffect, useState } from "react";
import axios from "axios";
import { getCityUrl, getPointConnectedUrl, getStreetUrl,getDisconnectedUrl } from "../config/apiPath";
import Cookies from "js-cookie";
import AddCity from "./AddCity";
import AddNetworkNode from "./AddNetworkNode";
import AddStreet from "./AddStreet";
import DateTimePicker from "react-datetime-picker";

export default function AddDisconnect() {
  const [addCity, setAddCity] = useState(false);
  const [addNetworkNode, setAddNetworkNode] = useState(false);
  const [addStreet, setAddStreet] = useState(false);

  const [reloadCity, setReloadCity] = useState(false);
  const [reloadNetworkNode, setReloadNetworkNode] = useState(false);
  const [reloadStreet, setReloadStreet] = useState(false);

  const [listCity, setListCity] = useState();
  const [selectCity, setSelectCity] = useState();

  const [listNetworkNode, setListNetworkNode] = useState();
  const [selectNetworkNode, setSelectNetworkNode] = useState();

  const [listStreet, setListStreet] = useState();

  const [begin, setBegin] = useState(new Date());
  const [end, setEnd] = useState(new Date());

  const [comment, setComment] = useState();
  const token = Cookies.get("jwt");
  useEffect(() => {
    console.log(begin, end);
  }, [begin, end]);
  //------------Загрузка городов НАЧАЛО
  useEffect(() => {
    axios
      .get(getCityUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setListCity(response.data.data);
      })
      .catch((error) => {
        console.log("An error occurred:", error);
      });
    if (reloadCity) {
      setReloadCity(false);
    }
  }, [reloadCity]);
  //------------Загрузка городов КОНЕЦ
  //------------Загрузка точек подключения НАЧАЛО
  useEffect(() => {
    if (selectCity) {
      axios
        .get(getPointConnectedUrl + `?filters[gorod][id][$eq]=${selectCity}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setListNetworkNode(response.data.data);
        })
        .catch((error) => {
          console.log("An error occurred:", error);
        });
    } else {
      setListNetworkNode(null);
      setListStreet(null);
    }
    if (reloadNetworkNode) {
      setReloadNetworkNode(false);
    }
  }, [selectCity, reloadNetworkNode]);
  //------------Загрузка точек подключения КОНЕЦ

  //------------Загрузка улиц НАЧАЛО
  useEffect(() => {
    if (selectCity && selectNetworkNode) {
      axios
        .get(getStreetUrl + `?filters[uzel_podklyucheniya][id][$eq]=${selectNetworkNode}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setListStreet(response.data.data);
        })
        .catch((error) => {
          console.log("An error occurred:", error);
        });
    } else {
      setListStreet(null);
    }
    if (reloadStreet) {
      setReloadStreet(false);
    }
  }, [selectCity, selectNetworkNode, reloadStreet]);
  //------------Загрузка улиц КОНЕЦ
  const handlerSubmit = (event) => {
    event.preventDefault();
    if (selectCity,selectNetworkNode,begin,end) {
      axios
        .post(
          getDisconnectedUrl,
          {
            data: {
              begin: begin,
              end: end,
              comment:comment,
              uzel_podklyucheniya: selectNetworkNode,
              zona_otvetstvennosti: ""
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
    console.log("addDisconnect");
  };
  return (
    <div className="disconnect__item disconnect-add">
      <h2>Добавить новое отключение: </h2>
      <form className="disconnect-add__form" onSubmit={handlerSubmit}>
        <div className="disconnect-add__row">
          <label htmlFor="city" className="disconnect-add__label">
            Выберите город:
          </label>
          <select
            name="city"
            id="city"
            className="disconnect-add__select"
            onChange={(event) => {
              if (event.target.value) {
                setSelectCity(event.target.value);
                setListNetworkNode(null);
                setSelectNetworkNode(null);
                setListStreet(null);
              } else {
                setSelectCity(null);
                setListNetworkNode(null);
                setSelectNetworkNode(null);
                setListStreet(null);
              }
            }}
          >
            <option value="">----</option>
            {listCity &&
              listCity.map((item, index) => {
                return (
                  <option key={index} value={item.id}>
                    {item.attributes.name}
                  </option>
                );
              })}
          </select>
          <button
            onClick={(event) => {
              event.preventDefault();
              setAddCity(true);
            }}
            className="button-main"
          >
            Добавить город
          </button>
        </div>
        {/* ------------------------------------------------------------------------------------ */}
        {/* ------------------------------------------------------------------------------------ */}
        {/* ------------------------------------------------------------------------------------ */}
        {listNetworkNode && (
          <div className="disconnect-add__row">
            <label htmlFor="network-node" className="disconnect-add__label">
              Выберите узел:
            </label>
            <select
              name="network-node"
              id="network-node"
              className="disconnect-add__select"
              onChange={(event) => {
                if (event.target.value) {
                  setSelectNetworkNode(event.target.value);
                } else {
                  setSelectNetworkNode(null);
                  setListStreet(null);
                }
              }}
            >
              <option value="">----</option>
              {listCity &&
                listNetworkNode.map((item, index) => {
                  return (
                    <option key={index} value={item.id}>
                      {item.attributes.name}
                    </option>
                  );
                })}
            </select>
            <button
              onClick={(event) => {
                event.preventDefault();
                setAddNetworkNode(true);
              }}
              className="button-main"
            >
              Добавить узел
            </button>
          </div>
        )}
        {listStreet && (
          <>
            <div className="disconnect-add__row street">
              <label htmlFor="street" className="disconnect-add__label">
                Добавьте недостающие улицы:
              </label>
              <ul className="street__list">
                <li className="street__item street-row">
                  <div className="street-table__th">Адрес</div>
                  <div className="street-table__th">Уточнение</div>
                  <div className="street-table__th">Удаление</div>
                </li>
                {listStreet &&
                  listStreet.map((item, index) => (
                    <li key={index} className="street__item street-row">
                      <div className="street-table__td">{item.attributes.name}</div>
                      <div className="street-table__td">{item.attributes.comment}</div>
                      <div className="street-table__td">
                        <a className="disconnected__edit" data-id={item.id} onClick={() => {}}>
                          ✖
                        </a>
                      </div>
                    </li>
                  ))}
              </ul>
              <div className="text-right">
                <button
                  onClick={(event) => {
                    event.preventDefault();
                    setAddStreet(true);
                  }}
                  className="button-main flex__item"
                >
                  Добавить улицу
                </button>
              </div>
            </div>
            <div className="disconnect-add__row period">
              <label htmlFor="time" className="disconnect-add__label">
                Укажите период:
              </label>
              <div className="period__row">
                <span className="period__title">Начало:</span>
                <DateTimePicker onChange={setBegin} value={begin} />
                <br />
              </div>
              <div className="period__row">
                <span className="period__title">Конец:</span>
                <DateTimePicker onChange={setEnd} value={end} />
              </div>
            </div>
            <div className="disconnect-add__row comment">
              <label htmlFor="comment" className="disconnect-add__label">
                Укажите комментарий:
              </label>
              <input type="text" name="comment" value={comment} onChange={setComment} className="comment__input" />
            </div>
            <div className="disconnect-add__row period">
              <button type="submit" className="button-main">
                Добавить отключение
              </button>
            </div>
          </>
        )}
      </form>
      {addCity && <AddCity setAddCity={setAddCity} setReloadCity={setReloadCity} />}
      {addNetworkNode && <AddNetworkNode setAddNetworkNode={setAddNetworkNode} setReloadNetworkNode={setReloadNetworkNode} cityId={selectCity} />}
      {addStreet && <AddStreet setAddStreet={setAddStreet} setReloadStreet={setReloadStreet} networkNodeId={selectNetworkNode} selectCity={selectCity} />}
    </div>
  );
}
