import React from "react";
import toast from "react-hot-toast";
// import { MdOutlineClose } from "react-icons/md";
// import { HiLightningBolt } from "react-icons/hi";
import { XCircleIcon } from "@heroicons/react/solid";

import styles from "./toasts.module.css";
import { LightningBoltIcon } from "@heroicons/react/outline";

// {
//     "type": "error", "success", "normal"
//      header: "sldkfjsd"
//     "body": "sldfkjsdlfk"
// }
export const notify = ({ type, header, body }) =>
  toast.custom(
    (t) => (
      <div
        className={`${styles.notificationWrapper} ${
          t.visible ? "top-0" : "-top-96"
        } 
        ${type === "error" ? "bg-red-900" : ""}
        ${type === "success" ? "bg-green-900" : ""} 
        ${type === "normal" ? "bg-gray-900" : ""}
       `}
      >
        <div className={`${styles.iconWrapper}`}>
          <LightningBoltIcon width={20} height={20} />
        </div>
        <div className={`${styles.contentWrapper}`}>
          <h1>{header}</h1>
          <p>{body}</p>
        </div>
        <div
          className={`${styles.closeIcon}`}
          onClick={() => toast.dismiss(t.id)}
        >
          <XCircleIcon width={20} height={20} />
        </div>
      </div>
    ),
    { id: "unique-notification", position: "bottom-right" }
  );
