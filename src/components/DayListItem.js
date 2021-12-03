import React from "react";
import "components/DayListItem.scss";
import classNames from "classnames";


export default function DayListItem(props) {
  let dayClass = classNames("day-list__item", {
    "day-list__item--selected": props.selected,
    "day-list__item--full": props.spots === 0
  });

  const formatSpots = (noSpots) => {
    return (
      noSpots > 1
      ? `${noSpots} spots remaining`
      : noSpots === 1
      ? `1 spot remaining`
      : `no spots remaining`
    )
  }

  return (
    <li onClick={props.setDay} className = {dayClass}>
      <h2 className="text--regular">{props.name}</h2> 
      <h3 className="text--light">{formatSpots(props.spots)}</h3>
    </li>
  );
}