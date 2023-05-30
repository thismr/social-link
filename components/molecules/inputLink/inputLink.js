import axios from "axios";

const { LinkIcon, PencilIcon } = require("@heroicons/react/24/solid");
const { useState } = require("react");

export const InputLink = (props) => {
  const [edited, setEdited] = useState(false);
  const [value, setValue] = useState(null);
  return (
    <div className="flex-row justify-start items-center hover:cursor-pointer text-gray-800">
      <div className="-mb-1">
        <span className="pl-2 text-xs font-thin">{props.name}</span>
      </div>
      {!edited && (
        <div className="flex justify-start items-center space-x-2  pl-2">
          <div
            onClick={() => setEdited(true)}
            className="flex space-x-2  justify-start items-center "
          >
            <span className={`${props.bold && "font-semibold"} `}>
              {value ?? props.title}
            </span>
            <PencilIcon className="w-[18px] h-[18px] opacity-50 hover:opacity-100" />
          </div>
          {props.id === "url" && (
            <a href={value ?? props.title} target="_blank">
              <LinkIcon className="w-[18px] h-[18px] opacity-50 hover:opacity-100" />
            </a>
          )}
        </div>
      )}
      {edited && (
        <input
          // ref={emailRef}
          onBlur={(e) => {
            setEdited(true);
            axios
              .put("/api/admin/link", {
                linkId: props.linkId,
                [props.id]: e.target.value,
              })
              .then((res) => {
                setValue(res.data.data[props.id]);

                setTimeout(() => setEdited(false), 500);
              });
          }}
          minLength="3"
          maxLength={props.maxLength}
          name={props.id}
          id={props.id}
          type="text"
          placeholder={props.name}
          defaultValue={value ?? props.title}
          className={`pl-2 bg-transparent placeholder:text-gray-500 focus:outline-none  ${
            props.bold && "font-semibold"
          }`}
          required
        />
      )}
    </div>
  );
};
