import { applyMiddleware, configureStore } from "@reduxjs/toolkit";
import authReducer from "./reducers/auth-reducer";
import tasksReducer from "./reducers/tasks-reducer";
import createSagaMiddleware from "redux-saga";
import { initialState } from "./inintialState/initialState";

const reducer = {
 init: authReducer,
 tasks: tasksReducer,
};

const sagaMiddleware = createSagaMiddleware();

const store = configureStore({ 
  reducer, 
  preloadedState: initialState,
}, applyMiddleware(sagaMiddleware));

export default store;
