import {
  fa1,
  fa2,
  fa3,
  fa4,
  fa5,
  fa6,
  fa7,
  fa8,
  fa9,
} from "@fortawesome/free-solid-svg-icons";

export function getFontAwesomeIconForBadge(number: number) {
  switch (number) {
    case 1:
      return fa1;
    case 2:
      return fa2;
    case 3:
      return fa3;
    case 4:
      return fa4;
    case 5:
      return fa5;
    case 6:
      return fa6;
    case 7:
      return fa7;
    case 8:
      return fa8;
    case 9:
      return fa9;
    default:
      return fa9;
  }
}
