import {useState, useEffect} from "react";
import axios from 'axios';

export default function useApplicationData() {
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });
  const setDay = day => setState({ ...state, day });

  useEffect(()=>{Promise.all([
    axios.get('/api/days'),
    axios.get('/api/appointments'),
    axios.get('/api/interviewers')
    ]).then(all=>{
      setState(prev =>({...prev, days:all[0].data, appointments: all[1].data, interviewers: all[2].data}))
    })},[]);

  function bookInterview(id, interview) {
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };
    const freeSpotChanged = -1;

    const saveToServer = axios
      .put(`/api/appointments/${id}`, appointment)
      .then(res => console.log(`Received status code (adding): ${res.status}`))
      .then (() => {
        const days = updateSpots(id, freeSpotChanged);
        setState({
          ...state,
          appointments,
          days
        });
        return Promise.resolve('Saved!');
      })
      .catch(res => {
        console.log(res);
        setState({
          ...state
        });
        return Promise.reject('Error Saving!');
      })
    return saveToServer;
  }

  function cancelInterview(id) {
    const appointments = {...state.appointments};
    const freeSpotChanged = 1;
    appointments[id].interview = null;
    const deleteFromServer = axios
      .delete(`/api/appointments/${id}`)
      .then(res => console.log(`Received status code (removing): ${res.status}`))
      .then (() => {
        const days = updateSpots(id, freeSpotChanged);
        setState({
          ...state,
          appointments,
          days
        });
        return Promise.resolve('Deleted!');
      })
      .catch(res => {
        console.log(res);
        return Promise.reject('Error Deleting!');
      })
    return deleteFromServer;
  }

  const updateSpots = (id, dif) => {
    const newDays = [...state.days];
    newDays.forEach(item => {
      if (item.appointments.indexOf(id) > -1) {
        item.spots += dif;
      }
    });
    return newDays;
  }

  return {
    state,
    setDay,
    bookInterview,
    cancelInterview
  }
};