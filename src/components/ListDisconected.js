import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { getDisconnectedUrl, getZoneUrl } from "../config/apiPath";
import Cookies from "js-cookie";
import DatePicker from "react-date-picker";
import { DateTime } from "luxon";
import EditDisconnect from "./EditDisconnect";
import { Context } from "../Context";
const start = new Date();
const finish = new Date();
finish.setDate(finish.getDate() + 1);
export default function ListDisconected({ setCurrentZone }) {
  const { setReloadList, reloadList } = useContext(Context);
  const [editDisconnect, setEditDisconnect] = useState(false);
  const [reload, setReload] = useState(false);
  const [begin, setBegin] = useState(new Date());
  const [end, setEnd] = useState(finish);
  const [listDisconnect, setListDisconnect] = useState();
  const token = Cookies.get("jwt");
  useEffect(() => {
    if (begin.getTime() && end.getTime()) {
      //   console.log(begin.getTime());
      //   console.log(end.getTime());
      axios
        .get(getZoneUrl + `?begin=${begin.getTime()}&end=${end.getTime()}&pagination[pageSize]=100000`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          // console.log(response.data);
          setCurrentZone({ zone: response.data[0].id, nameZone: response.data[0].name });
          setListDisconnect(response.data[0].otklyuchenies);
          //return response.data[0].otklyuchenies;
        })
        .catch((error) => {
          // Handle error.
          console.log("An error occurred:", error);
        });
    }
    if (reload || reloadList) {
      setReload(false);
      setReloadList(false);
    }
  }, [begin, end, reload, reloadList]);

  const handlerEdit = (event) => {
    setEditDisconnect(
      listDisconnect.find((item) => {
        //console.log(item)
        return item.id == event.target.dataset.id;
      })
    );
    //console.log(event.target.dataset.id);
  };
  const handlerDel = (event) => {
    axios
      .delete(getDisconnectedUrl + `/${event.target.dataset.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        //console.log(response)
        setReloadList(true);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  //console.log(listDisconnect)
  return (
    <div className="disconnect__item disconnected">
      <h2 className="disconnected__title"> Период отключений: </h2>

      <div className="date-block">
        <div className="date-block__item">
          <span>С: </span>
          <DatePicker onChange={setBegin} value={begin} showLeadingZeros={true} clearIcon={null} />
        </div>
        <div className="date-block__item">
          <span>По: </span>
          <DatePicker onChange={setEnd} value={end} showLeadingZeros={true} clearIcon={null} />
        </div>
        <button
          className="button-main"
          onClick={() => {
            setReload(true);
          }}
        >
          Обновить
        </button>
      </div>

      <table>
        <thead>
          <tr>
            <th>№</th>
            <th>Узел</th>
            <th>Комментарий</th>
            <th>Начало</th>
            <th>Конец</th>
            <th> - </th>
          </tr>
        </thead>
        <tbody className="disconnected__list">
          {listDisconnect &&
            listDisconnect.map((item, index) => {
              const begin = DateTime.fromISO(item.begin).c;
              const end = DateTime.fromISO(item.end).c;
              return (
                <tr className="disconnected__item" key={index}>
                  <td>{item.id}</td>
                  <td>{item.uzel_podklyucheniya && item.uzel_podklyucheniya.name ? item.uzel_podklyucheniya.name : "-"}</td>
                  <td>{item.comment}</td>
                  <td>
                    {begin.day < 10 ? "0" + begin.day : begin.day}.{begin.month < 10 ? "0" + begin.month : begin.month}.{begin.year} {begin.hour < 10 ? "0" + begin.hour : begin.hour}:{begin.minute < 10 ? "0" + begin.minute : begin.minute}
                  </td>
                  <td>
                    {end.day < 10 ? "0" + end.day : end.day}.{end.month < 10 ? "0" + end.month : end.month}.{end.year} {end.hour < 10 ? "0" + end.hour : end.hour}:{end.minute < 10 ? "0" + end.minute : end.minute}
                  </td>
                  <td>
                    <div className="disconnected__flex">
                      <a className="disconnected__edit" data-id={item.id} onClick={handlerEdit}>
                        ✎
                      </a>
                      <a className="disconnected__del" data-id={item.id} onClick={handlerDel}>
                        ✖
                      </a>
                    </div>
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
      <div className="to-site">
        <a href="https://mosoblenergo.ru/plannedOutages" target="_blank" className="to-site__link button-main">На сайт Mosoblenergo.ru</a>
      </div>
      {listDisconnect && listDisconnect.length === 0 && <h3 style={{ textAlign: "center" }}>Отключений в данном периоде нет</h3>}
      {editDisconnect && <EditDisconnect editDisconnect={editDisconnect} setEditDisconnect={setEditDisconnect} setReload={setReload} />}
    </div>
  );
}
