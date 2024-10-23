import EventEmitter from "./EventEmitter";

// Create an event emitter for db changes
export const addChangeListener = (listener) => {
  EventEmitter.on("db-change", listener);
};

export const removeChangeListener = (db, listener) => {
  EventEmitter.off("db-change", listener);
};
