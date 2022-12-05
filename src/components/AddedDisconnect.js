import React, { useContext } from "react";
import { Context } from "../Context";

export default function AddedDisconnect({ setShowAddedDisconnect }) {
const {setReloadList} = useContext(Context)
  return (
    <div className="modal">
      <div className="addedDisconnect address-form">
        <h3>Отключение добавлено</h3>
        <button
          type="button"
          className="address-form__submit"
          onClick={() => {
            setShowAddedDisconnect(false);
            setReloadList(true);
          }}
        >
          ОК
        </button>
      </div>
    </div>
  );
}
