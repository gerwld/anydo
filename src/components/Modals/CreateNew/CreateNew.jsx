import React from "react";
import { useDispatch } from "react-redux";
import { locallySetTaskTC } from "@/redux/reducers/tasks-reducer";
import { TaskForm } from "@/components/";
import {setBodyFixed} from "@/tools";

const CreateNew = ({ isCreateMode, toggleNew }) => {
 const disp = useDispatch();

 const onSubmitCB = (obj) => {
  disp(locallySetTaskTC(obj));
  setBodyFixed();
 };

 return (
  <div className={`modal ${isCreateMode ? "modal_open" : "modal_close"}`}>
   <div className="modal_content">
    <h1 className="modal_title">Create new task</h1>
    <TaskForm onSubmitCB={onSubmitCB} close={toggleNew} />
    <button onClick={toggleNew} className="btn_close">
     close
    </button>
   </div>
  </div>
 );
};

export default CreateNew;
