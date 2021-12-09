import React from "react";

import { render, cleanup, waitForElement, fireEvent,
  getByText, getAllByTestId, getByAltText, getByPlaceholderText,
  act, queryByText, queryByAltText} 
from "@testing-library/react";
import Application from "components/Application";
import axios from "axios";

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
    // 1. Render the Application.
    const { container, debug } = render(<Application />);

    // 2. Wait until the text "Archie Cohen" is displayed.
    await waitForElement(() => getByText(container, "Archie Cohen"));

    // 3. Click the "Add" button on the empty appointment.
    const appointments = getAllByTestId(container, "appointment");
    const appointment = appointments[0];
    act(()=>{
      fireEvent.click(getByAltText(appointment, "Add"));
    });

    // 4. Fill data in the blank
    act(()=>{
      fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
        target: { value: "Lydia Miller-Jones" }
      });
      fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));
    })

    // 5. Click Save button
    act(()=>{
      fireEvent.click(getByText(appointment, "Save"));
    })

    // 6. Check that the text "Saving..." is displayed
    expect(getByText(appointment, "Saving...")).toBeInTheDocument();

    // 7. Wait for the newly added appointment to be displayed
    await waitForElement(() => getByText(appointment, "Lydia Miller-Jones"));
    //console.log(prettyDOM(appointment));

    // 8. Check data of the newly added appointment
    expect(getByText(appointment, "Lydia Miller-Jones")).toBeInTheDocument();
    expect(queryByText(appointment, "Saving...")).not.toBeInTheDocument();
    //debug();

    // 9. Check that the DayListItem with the text "Monday" also has the text "no spots remaining".
    const day = getAllByTestId(container, "day").find(day =>
      queryByText(day, "Monday")
    );
    //console.log(prettyDOM(day));
    expect(queryByText(day, "Monday")).toBeInTheDocument();
    expect(queryByText(day, "no spots remaining")).toBeInTheDocument();
  });

  it("Loads data, cancels an interview and increases the spots remaining for Monday by 1", async () => {
      // 1. Render the Application.
    const { container} = render(<Application />);

    // 2. Wait until the text "Archie Cohen" is displayed.
    await waitForElement(() => getByText(container, "Archie Cohen"));

     // 3. Click the "Delete" button on the booked appointment.
    const appointment = getAllByTestId(container, "appointment").find(
      appointment => queryByText(appointment, "Archie Cohen")
    );

    act(()=>{
      fireEvent.click(getByAltText(appointment, "Delete"));
    });

      // 4. Check that the confirmation message is shown.
    expect(
      getByText(appointment, "Confirm")
    ).toBeInTheDocument();

      // 5. Click the "Confirm" button on the confirmation.
    act(()=>{
      fireEvent.click(getByText(appointment, "Confirm"));
    });

      // 6. Check that the element with the text "Deleting..." is displayed.
    expect(queryByText(appointment, "Deleting...")).toBeInTheDocument();

      // 7. Wait until the element with the "Add" button is displayed.
    await waitForElement(() => getByAltText(appointment, "Add"));

      // 8. Check that the DayListItem with the text "Monday" also has the text "1 spot remaining".
    const day = getAllByTestId(container, "day").find(day =>
      queryByText(day, "Monday")
    );
    expect(queryByText(day, "1 spot remaining")).toBeInTheDocument();
  });

  it("loads data, edits an interview and keeps the spots remaining for Monday the same", async () => {
    // 1. Render the Application.
    const { container, debug } = render(<Application />);

    // 2. Wait until the text "Lydia Miller-Jones" is displayed.
    await waitForElement(() => getByText(container, "Lydia Miller-Jones"));

    // 3. Click the "Edit" button on the appointment with Lydia Miller-Jones.
    const appointment = getAllByTestId(container, "appointment").find(
      appointment => queryByText(appointment,"Lydia Miller-Jones"));
    act(()=>{
      fireEvent.click(getByAltText(appointment, "Edit"));
    });
    // 4. Fill data in the blank
    act(()=>{
      fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
        target: { value: "Black Smith" }
      });
      fireEvent.click(getByAltText(appointment, "Tori Malcolm"));
    })

    // 5. Click Save button
    act(()=>{
      fireEvent.click(getByText(appointment, "Save"));
    })

    // 6. Check that the text "Saving..." is displayed
    expect(getByText(appointment, "Saving...")).toBeInTheDocument();

    // 7. Wait for the updated appointment to be displayed
    await waitForElement(() => getByText(appointment, "Black Smith"));
    // 8. Check data of the newly added appointment
    expect(getByText(appointment, "Black Smith")).toBeInTheDocument();
    expect(queryByText(appointment, "Saving...")).not.toBeInTheDocument();

    // 9. Check that the DayListItem with the text "Monday" still has the text "1 spot remaining".
    const day = getAllByTestId(container, "day").find(day =>
      queryByText(day, "Monday")
    );
    expect(queryByText(day, "Monday")).toBeInTheDocument();
    expect(queryByText(day, "1 spot remaining")).toBeInTheDocument();
  });

  it("shows error when failing to save an appointment", async () => {
    // Use mockRejectedValueOnce to fake an error with axios
    axios.put.mockRejectedValueOnce();

    // 1. Render the Application.
    const { container, debug } = render(<Application />);

    // 2. Wait until the text "Black Smith" is displayed.
    await waitForElement(() => getByText(container, "Black Smith"));

    // 3. Click the "Add" button on the empty appointment.
    const appointments = getAllByTestId(container, "appointment");
    const appointment = appointments[0];
    act(()=>{
      fireEvent.click(getByAltText(appointment, "Edit"));
    });

    // 4. Fill data in the blank
    act(()=>{
      fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
        target: { value: "Lydia Miller-Jones" }
      });
      fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));
    })

    // 5. Click Save button
    act(()=>{
      fireEvent.click(getByText(appointment, "Save"));
    })

    // 6. Check that the text "Saving..." is NOT displayed, and "Error saving" is displayed
    expect(queryByText(appointment, "Saving...")).toBeInTheDocument();
    setTimeout(()=>{
      expect(queryByText(appointment, "Error saving encountered. Sorry!")).toBeInTheDocument();
      // 7. Click Close button
      act(()=>{
        fireEvent.click(getByAltText(appointment, "Close"));
      })
    }, 1000);

    // 8. Wait for the existing appointment to be displayed
    await waitForElement(() => getByText(appointment, "Black Smith"));
    //console.log(prettyDOM(appointment));

    // 9. Check data of the existing appointment
    expect(getByText(appointment, "Black Smith")).toBeInTheDocument();
    expect(getByText(appointment, "Tori Malcolm")).toBeInTheDocument();
    expect(queryByText(appointment, "Lydia Miller-Jones")).not.toBeInTheDocument();
    expect(queryByText(appointment, "Sylvia Palmer")).not.toBeInTheDocument();

    // 10. Check that the DayListItem with the text "Monday" still has the text "1 spot remaining".
    const day = getAllByTestId(container, "day").find(day =>
      queryByText(day, "Monday")
    );
    expect(queryByText(day, "Monday")).toBeInTheDocument();
    expect(queryByText(day, "1 spot remaining")).toBeInTheDocument();
  });

  it("shows error when failing to delete an existing appointment", async () => {
    // Use mockRejectedValueOnce to fake an error with axios
    axios.delete.mockRejectedValueOnce();

    // 1. Render the Application.
  const { container} = render(<Application />);

  // 2. Wait until the text "Black Smith" is displayed.
  await waitForElement(() => getByText(container, "Black Smith"));

   // 3. Click the "Delete" button on the booked appointment.
  const appointment = getAllByTestId(container, "appointment").find(
    appointment => queryByText(appointment, "Black Smith")
  );
  act(()=>{
    fireEvent.click(getByAltText(appointment, "Delete"));
  });

    // 4. Check that the confirmation message is shown.
  expect(getByText(appointment, "Confirm")).toBeInTheDocument();

    // 5. Click the "Confirm" button on the confirmation.
  act(()=>{
    fireEvent.click(getByText(appointment, "Confirm"));
  });

    // 6. Check that the element with the text "Deleting..." is displayed.
  expect(queryByText(appointment, "Deleting...")).toBeInTheDocument();
  setTimeout(()=>{
    expect(queryByText(appointment, "Error deleting encountered. Sorry!")).toBeInTheDocument();
    // 7. Click Close button
    act(()=>{
      fireEvent.click(getByAltText(appointment, "Close"));
    })
  }, 1000);

    // 8. Wait for the existing element to be displayed.
  await waitForElement(() => getByText(appointment, "Black Smith"));

  // 9. Check data of the existing appointment
  expect(getByText(appointment, "Black Smith")).toBeInTheDocument();
  expect(getByText(appointment, "Tori Malcolm")).toBeInTheDocument();
  expect(queryByAltText(appointment, "Add")).not.toBeInTheDocument();

    // 10. Check that the DayListItem with the text "Monday" also has the text "1 spot remaining".
  const day = getAllByTestId(container, "day").find(day =>
    queryByText(day, "Monday")
  );
  expect(queryByText(day, "1 spot remaining")).toBeInTheDocument();
});

})