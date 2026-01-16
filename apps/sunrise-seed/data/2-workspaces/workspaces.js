import { getObjectId } from "../../helpers/index";
const workspaces = [
  {
    _id: getObjectId("Workspace Demo"),
    name: "Workspace Demo",
    description: "This is a demo workspace for Stageholder.",
    logo_full: "",
    logo_square: "",
    currency: {
      symbol: "$",
      name: "US Dollar",
      symbol_native: "$",
      decimal_digits: 2,
      rounding: 0,
      code: "USD",
      name_plural: "US dollars",
    },
    time_zone: {
      value: "SE Asia Standard Time",
      abbr: "SAST",
      offset: 7,
      isdst: false,
      text: "(UTC+07:00) Bangkok, Hanoi, Jakarta",
      utc: [
        "Antarctica/Davis",
        "Asia/Bangkok",
        "Asia/Hovd",
        "Asia/Jakarta",
        "Asia/Phnom_Penh",
        "Asia/Pontianak",
        "Asia/Saigon",
        "Asia/Vientiane",
        "Etc/GMT-7",
        "Indian/Christmas",
      ],
    },
    created_by: getObjectId("Stageholder Admin"),
    created_at: new Date(),
    updated_at: new Date(),
    deleted_at: null,
  },
];

export default workspaces;
