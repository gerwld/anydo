
const tasks_local = JSON.parse(localStorage.getItem('tasks_local')) || [];

export const initialState = {
  tasks: {
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
    tasks: tasks_local,
  }
}