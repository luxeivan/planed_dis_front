import React, { useEffect, useState } from "react";
import DateTimePicker from "react-datetime-picker";
import axios from "axios";
import Cookies from "js-cookie";
import { getDisconnectedUrl } from "../config/apiPath";

export default function EditDisconnect({ editDisconnect, setEditDisconnect, setReload }) {
  const token = Cookies.get("jwt");
  const [begin, setBegin] = useState();
  const [end, setEnd] = useState();
  const [comment, setComment] = useState();
  useEffect(() => {
    //console.log(editDisconnect);
    setBegin(new Date(editDisconnect.begin));
    setEnd(new Date(editDisconnect.end));
    setComment(editDisconnect.comment);
  }, []);
  const handlerSubmit = (event) => {
    event.preventDefault();

    //console.log(event.target.dataset.id);
    axios
      .put(
        getDisconnectedUrl + `/${editDisconnect.id}`,
        {
          data: {
            comment: comment,
            begin: begin,
            end: end,
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
        setEditDisconnect(false);
        setReload(true);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="modal">
      <form className="address-form" onSubmit={handlerSubmit}>
        <h2>Редактировать отключение №{editDisconnect.id}</h2>
        <div className="address-form__row">
          <label htmlFor="comment" className="disconnect-add__label">
            Отредактируйте комментарий:
          </label>
          <input
            className="address-form__input"
            type="text"
            value={comment}
            onChange={(event) => {
              setComment(event.target.value);
            }}
          />
        </div>
        <div className="period__row">
          <span className="period__title">Начало:</span>
          <DateTimePicker onChange={setBegin} value={begin} showLeadingZeros={true} clearIcon={null}/>
          <br />
        </div>
        <div className="period__row">
          <span className="period__title">Конец:</span>
          <DateTimePicker onChange={setEnd} value={end} showLeadingZeros={true} clearIcon={null}/>
        </div>

        <div className="address-form__row">
          <button type="submit" className="address-form__submit">
            Изменить
          </button>
          <button
            type="button"
            className="address-form__submit"
            onClick={(event) => {
              setEditDisconnect(false);
            }}
          >
            Отмена
          </button>
        </div>
      </form>
    </div>
  );
}
