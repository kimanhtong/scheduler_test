import React from 'react';
import '../Appointment/styles.scss';
import Header from './Header';
import Show from './Show';
import Empty from './Empty';
import Form from './Form';
import Status from './Status';
import Confirm from './Confirm';
import Error from './Error';
import useVisualMode from 'hooks/useVisualMode';

export default function Appointment(props) {
  const EMPTY = "EMPTY";
  const SHOW = "SHOW";
  const CREATE = "CREATE";
  const SAVING = "SAVING";
  const DELETING = "DELETING";
  const CONFIRM = "CONFIRM";
  const EDIT = "EDIT";
  const ERROR_SAVE = "ERROR_SAVE";
  const ERROR_DELETE = "ERROR_DELETE";
  const ERROR_SAVE_VALIDATION = "ERROR_SAVE_VALIDATION";
  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  );
  function save(name, interviewer) {
    const interview = {
      student: name,
      interviewer
    };
    if (name === '' || interviewer === null) {
      transition(ERROR_SAVE_VALIDATION);
    } else {
      transition(SAVING);
      props
      .bookInterview(props.id, interview)
      .then(() => transition(SHOW))
      .catch(error => {
        console.log(error);
        transition(ERROR_SAVE, true);
      })
    }
  }
  function destroy() {
    transition(DELETING, true);
    props
    .cancelInterview(props.id)
    .then (()=>transition(EMPTY))
    .catch(error => {
      console.log(error);
      transition(ERROR_DELETE);
    })
  }

  return (
    <article className="appointment">
      {props.time ? <Header time={props.time}/> : 'No Apppointments'}
      {mode === EMPTY && <Empty onAdd={()=>transition(CREATE)} />}
      {mode === SHOW && (
        <Show
          student={props.interview.student}
          interviewer={props.interview.interviewer}
          onDelete={()=>transition(CONFIRM)}
          onEdit={()=>{transition(EDIT)}}
        />
      )}
      {mode === CREATE && <Form interviewers={props.interviewers} onCancel={back} onSave={save} onDelete={destroy}/>}
      {mode === SAVING && <Status message = {'Saving...'} />}
      {mode === DELETING && <Status message = {'Deleting...'} />}
      {mode === CONFIRM && <Confirm message = {'Delete? ... Really?'} onCancel={back} onConfirm={destroy}/>}
      {mode === EDIT && <Form interviewers={props.interviewers} interviewer={props.interview.interviewer.id} value={props.interview.interviewer.id} student={props.interview.student} onCancel={back} onSave={save}/>}
      {mode === ERROR_SAVE && <Error message={'Error saving encountered. Sorry!'} onClose={back} />}
      {mode === ERROR_DELETE && <Error message={'Error deleting encountered. Sorry!'} onClose={back} />}
      {mode === ERROR_SAVE_VALIDATION && <Error message={'Both student and interviewer are required. Please fill them out'} onClose={back} />}
    </article>
  )
}