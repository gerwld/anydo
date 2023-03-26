import React, { useEffect } from "react";
import { useSelector } from "react-redux";

const withLocalStorage = (Children) => {
 return (props) => {
  const { tasks } = useSelector(({ tasks }) => ({
   tasks: tasks.tasks,
  }));
  
  useEffect(() => {
   if (tasks.length) {
    if (JSON.stringify(tasks) !== localStorage.getItem("tasks_local")) {
     localStorage.setItem("tasks_local", JSON.stringify(tasks));
     console.log("[ Setted tasks to localStorage ]");
    }
   } 
   else localStorage.removeItem("tasks_local");
  }, [tasks]);
  
  return <Children {...props} />;
 };
};

export default withLocalStorage;
