import TasksService from "@/services/TasksService";
import {setBodyFixed} from "@/tools";

const SET_ERROR = "todo-list/tasks-reducer/SET_ERROR";
const SET_SUB_PENDING = "todo-list/tasks-reducer/SET_SUB_PENDING";
const SET_INIT_TASKS = "todo-list/tasks-reducer/SET_INIT_TASKS";
const ON_TASKS_LOGOUT = "todo-list/tasks-reducer/ON_TASKS_LOGOUT";
const SET_EDITMODE = "todo-list/tasks-reducer/SET_EDITMODE";
const SET_CREATEMODE = "todo-list/tasks-reducer/SET_CREATEMODE";
const SET_DELMODE = "todo-list/tasks-reducer/SET_DELMODE";
const SET_TASKS = "todo-list/tasks-reducer/SET_TASKS";
const SET_CURRENT = "todo-list/tasks-reducer/SET_CURRENT";
const SET_CURRENT_TAGS = "todo-list/tasks-reducer/SET_CURRENT_TAGS";
const SET_CURRENT_SORT = "todo-list/tasks-reducer/SET_CURRENT_SORT";
const ADD_TASK = "todo-list/tasks-reducer/ADD_TASK";
const EDIT_TASK = "todo-list/tasks-reducer/EDIT_TASK";
const DELETE_TASK = "todo-list/tasks-reducer/DELETE_TASK";


export const setError = (body) => ({ type: SET_ERROR, body });
export const setInitTasks = (isInit) => ({ type: SET_INIT_TASKS, isInit });
export const setCurrent = (currentElement) => ({ type: SET_CURRENT, currentElement });
export const setCurrentTags = (currentTags) => ({ type: SET_CURRENT_TAGS, currentTags });
export const setCurrentSort = (currentTag) => ({ type: SET_CURRENT_SORT, currentTag });
export const setAllTasks = (payload) => ({ type: SET_TASKS, payload });
export const onTaskLogout = () => ({ type: ON_TASKS_LOGOUT });
export const onSubmitPending = (isPending) => ({ type: SET_SUB_PENDING, isPending });

const init = {
 isInit: true,
 isSubmitPending: false,
 isEditMode: false,
 isCreateMode: false,
 isDeleteMode: false,
 currentElement: null,
 currentTags: null,
 currentError: undefined,
 currentTag: undefined,
 sortedTasks: null,
 tasks: [],
};

const tasksReducer = (state = init, action) => {
 switch (action.type) {
  case SET_INIT_TASKS:
   return {
    ...state,
    isInit: action.isInit,
   };
  case SET_SUB_PENDING: 
    return {
      ...state, 
      isSubmitPending: action.isPending
    }
  case SET_EDITMODE:
   return {
    ...state,
    isPending: false,
    isEditMode: action.isEditMode,
    currentElement: action.id ? state.tasks.find((e) => e.id === action.id) : null,
   };
  case SET_CREATEMODE:
   return {
    ...state,
    isCreateMode: action.isCreateMode,
   };
  case SET_DELMODE:
    return {
      ...state,
      isDeleteMode: action.isDeleteMode,
      pendingDeleteID: action.id ? action.id : null
    }
  case SET_CURRENT:
   return {
    ...state,
    currentElement: action.currentElement,
   };
  case ADD_TASK:
   return {
    ...state,
    tasks: [action.taskObj, ...state.tasks],
    isCreateMode: false,
   };
  case SET_TASKS:
   return {
    ...state,
    isInit: true,
    tasks: action.payload.reverse(),
   };
  case SET_CURRENT_TAGS:
   return {
    ...state,
    currentTags: action.currentTags,
   };
  case SET_CURRENT_SORT:
  let sortedTasks = action.currentTag ? state.tasks.filter((e) => e.tags.indexOf(action.currentTag) !== -1) : state.tasks;
  return {
    ...state,
    currentTag: action.currentTag,
    sortedTasks: sortedTasks
  };
  case SET_ERROR:
   return {
    ...state,
    currentError: action.body,
   };
  case ON_TASKS_LOGOUT:
    return {
      ...state,
      isInit: false,
      isEditMode: false,
      isCreateMode: false,
      currentTags: null,
      currentError: null,
      tasks: []
     };
  case EDIT_TASK:
    return {
      ...state,
      tasks: [...[...state.tasks].filter(e => e.id !== action.payload.id), action.payload]
    }
  case DELETE_TASK:
    return {
      ...state,
      tasks: [...state.tasks].filter(e => e.id !== action.payload)
    }
  default:
   return state;
 }
};

//server

export const setTaskTC = (obj) => {
 return async (dispatch) => {
  await dispatch(onSubmitPending(true));
  await TasksService.createTask({ ...obj, dateCreated: Date.now() })
   .then(({ data }) => {
    dispatch({ type: ADD_TASK, data });
   })
   .catch((error) => {
    dispatch(setError(error.message));
   });
  await dispatch(onSubmitPending(false));
 };
};

export const editTaskTC = (newObj) => {
 return async (dispatch) => {
  dispatch(onSubmitPending(true));
  await TasksService.updateTask(newObj).then((data) => {
   dispatch(getTasksTC());
  });

  await dispatch(onSubmitPending(false));
  await dispatch(setEditmode(false));
 };
};

export const getTasksTC = () => {
 return (dispatch) => {
  TasksService.getTasks()
   .then(({ data }) => {
    let arr = [...data].sort((a, b) => a.id - b.id);
    dispatch(setAllTasks(arr));
   })
   .catch((error) => {
    dispatch(setInitTasks(true));
    dispatch(setError(error.message));
   });
 };
};

export const deleteTaskTC = (id) => {
 return (dispatch) => {
  TasksService.deleteTask(id)
   .then(async (_) => {
    await dispatch(getTasksTC());
    await dispatch(setDeletemode(false, null));
   })
   .catch((error) => {
    dispatch(setError(error.message));
   });
 };
};

// locally (current)
const PENDING_TIMEOUT = 400;

export const locallySetTaskTC = (obj) => {
  return async (dispatch) => {
   await dispatch(onSubmitPending(true));
   //imit. fetching delay
   setTimeout(async () => {
    await dispatch({ type: ADD_TASK, taskObj: { ...obj, id: Date.now() } });
    await dispatch(onSubmitPending(false));
  }, PENDING_TIMEOUT)
  };
 };

 export const locallyEditTaskTC = (newObj) => {
  return async (dispatch) => {
   dispatch(onSubmitPending(true));
   //imit. fetching delay
   setTimeout(async () => {
    await dispatch({ type: EDIT_TASK, payload: newObj });
    await dispatch(onSubmitPending(false));
    await dispatch(setEditmode(false));
   }, PENDING_TIMEOUT);
  };
 };

 export const locallyDeleteTaskTC = (id) => {
  return (dispatch) => {
    setTimeout(async () => {
    await dispatch({type: DELETE_TASK, payload: id});
    await dispatch(setDeletemode(false, null));
    }, PENDING_TIMEOUT);
 };
};

//other 

export const setCreatemode =(isCreateMode) => {
  return (dispatch) => {
    setBodyFixed(isCreateMode);
    dispatch({ type: SET_CREATEMODE, isCreateMode });
  } 
}

export const setEditmode =(isEditMode, id) => {
  return (dispatch) => {
    setBodyFixed(isEditMode);
    dispatch({ type: SET_EDITMODE, isEditMode, id });
  } 
}

export const setDeletemode =(isDeleteMode, id) => {
  return (dispatch) => {
    setBodyFixed(isDeleteMode);
    dispatch({ type: SET_DELMODE, isDeleteMode, id });
  } 
}


 

export default tasksReducer;
