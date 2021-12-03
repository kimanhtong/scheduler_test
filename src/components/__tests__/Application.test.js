import React from "react";

import { render, cleanup, waitForElement, fireEvent } from "@testing-library/react";
import Application from "components/Application";
import axios from "../../__mocks__/axios";

afterEach(cleanup);

it("defaults to Monday and changes the schedule when a new day is selected", () => {
  const { getByText } = render(<Application />);

  return (
    waitForElement(() => getByText("Monday"))
      .then (()=>{
        fireEvent.click(getByText("Tuesday"))
      })
      .then (()=>{
        expect(getByText(/Leopold Silvers/i)).toBeInTheDocument();
      })
  );
});
