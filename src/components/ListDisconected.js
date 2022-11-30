import React, { useEffect, useState } from "react";
import axios from "axios";
import { getDisconnectedUrl, getZoneUrl } from "../config/apiPath";
import Cookies from "js-cookie";
import DatePicker from "react-date-picker";
import { DateTime } from "luxon";
const start = new Date();
const finish = new Date();
finish.setDate(finish.getDate() + 1);
export default function ListDisconected() {
  const [begin, setBegin] = useState(new Date());
  const [end, setEnd] = useState(finish);
  const [listDisconnect, setListDisconnect] = useState();
  const token = Cookies.get("jwt");
  useEffect(() => {
    if (begin.getTime() && end.getTime()) {
      //   console.log(begin.getTime());
      //   console.log(end.getTime());
      axios
        .get(getZoneUrl + `?begin=${begin.getTime()}&end=${end.getTime()}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          console.log(response.data[0].id);
          //setListDisconnect(response.data[0].otklyuchenies);
          return response.data[0].otklyuchenies;
        })
        .then( (otklyuchenies) => {
          //console.log(otklyuchenies)
          let newotklyuchenies = [...otklyuchenies];
          otklyuchenies.forEach(async (item, index) => {
            await axios.get(getDisconnectedUrl + `/${item.id}?populate[0]=uzel_podklyucheniya`).then((response) => {
              //console.log(response.data.data.attributes.uzel_podklyucheniya.data)
              newotklyuchenies[index].uzelName = response.data.data.attributes.uzel_podklyucheniya.data?response.data.data.attributes.uzel_podklyucheniya.data.attributes.name:"-";
            });
          });
          console.log(newotklyuchenies)
          return newotklyuchenies
        })
        .then(newotklyuchenies=>setListDisconnect(newotklyuchenies))
        .catch((error) => {
          // Handle error.
          console.log("An error occurred:", error);
        });
    }
  }, [begin, end]);
  const handlerEdit = (event) => {
    console.log(event.target.dataset.id);
  };
  //console.log(listDisconnect)
  return (
    <div className="disconnect__item disconnected">
      <h2 className="disconnected__title"> Отключения между датами: </h2>
      <div className="date-block">
        <div className="date-block__item">
          <span>С: </span>
          <DatePicker onChange={setBegin} value={begin} />
        </div>
        <div className="date-block__item">
          <span>До: </span>
          <DatePicker onChange={setEnd} value={end} />
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th>ID</th>
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
                  <td>{item.uzelName}</td>
                  <td>{item.comment}</td>
                  <td>
                    {begin.day < 10 ? "0" + begin.day : begin.day}-{begin.month < 10 ? "0" + begin.month : begin.month}-{begin.year} {begin.hour < 10 ? "0" + begin.hour : begin.hour}:{begin.minute < 10 ? "0" + begin.minute : begin.minute}
                  </td>
                  <td>
                    {end.day < 10 ? "0" + end.day : end.day}-{end.month < 10 ? "0" + end.month : end.month}-{end.year} {end.hour < 10 ? "0" + end.hour : end.hour}:{end.minute < 10 ? "0" + end.minute : end.minute}
                  </td>
                  <td>
                    <a className="disconnected__edit" data-id={item.id} onClick={handlerEdit}>
                      ✎
                    </a>
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  );
}
