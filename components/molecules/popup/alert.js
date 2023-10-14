import { useState } from "react";

export function PopupAlert(props) {
  const type = {
    warning: {
      bg: "bg-yellow-500",
    },

    info: {
      bg: "bg-white",
    },
    error: {
      bg: "bg-red-500",
    },
  };
  const [show, setShow] = useState(true);
  return show ? (
    <div className="flex mb-10">
      <div className="fixed flex w-full z-10 justify-center mt-20">
        <div
          className={`flex ${
            type[props.type]?.bg
          } mt-4 w-full mx-2 max-w-6xl rounded-full
  shadow-lg bg-opacity-50 backdrop-blur-lg `}
        >
          <div className="flex-row w-full justify-center items-center">
            <div className="flex w-full justify-between items-center px-5 h-8 text-black text-sm opacity-50">
              <div className="flex justify-center items-center space-x-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  class="w-6 h-6"
                >
                  <path
                    fill-rule="evenodd"
                    d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 01.67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 11-.671-1.34l.041-.022zM12 9a.75.75 0 100-1.5.75.75 0 000 1.5z"
                    clip-rule="evenodd"
                  />
                </svg>
                <span>{props.msg}</span>
              </div>

              <button
                onClick={() => {
                  setShow(false);
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="w-4 h-4"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div></div>
  );
}
