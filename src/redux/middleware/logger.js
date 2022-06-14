const logger = (store) => (next) => (action) => {
  console.group(action.type);
  console.log('Action: ', action);
  console.log('Previous state: ', store.getState());
  const result = next(action);

  console.log('Next State: ', store.getState());
  console.groupEnd(action.type);

  return result;
};

export default logger;
