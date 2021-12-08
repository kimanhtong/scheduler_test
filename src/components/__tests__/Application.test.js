import React from "react";

import { act, render, cleanup, waitForElement, fireEvent, prettyDOM, getByText, getAllByTestId, getByAltText, getByPlaceholderText} from "@testing-library/react";
import Application from "components/Application";
import axios from "../../__mocks__/axios";

afterEach(cleanup);

describe("Application", ()=>{

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

  it("loads data, books an interview and reduces the spots remaining for Monday by 1", async () => {
    const { container } = render(<Application />);
    await waitForElement(() => getByText(container, "Archie Cohen"));
    const appointments = getAllByTestId(container, "appointment");
    const appointment = appointments[0];
    act(()=>{
      fireEvent.click(getByAltText(appointment, "Add"));
    })  
    act(()=>{
      fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
        target: { value: "Lydia Miller-Jones" }
      });
      fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));
    })
    act(()=>{
      fireEvent.click(getByText(appointment, "Save"));
    })
    console.log(prettyDOM(appointment));    
  });
})