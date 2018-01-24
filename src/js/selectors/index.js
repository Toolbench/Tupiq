/* eslint-disable */
export const getUsedBackgroundIDs = state => state.backgrounds.used;

export const getAllBackgroundIDs = state => state.backgrounds.ids;

export const getUnusedBackgroundIDs = (state) => {
  const usedIDs = new Set(state.backgrounds.used);
  const allIDs = new Set(state.backgrounds.ids);
  return Array.from(new Set([...allIDs].filter(id => !usedIDs.has(id))));
};

export const getRandomBackground = (state) => {
  // id 1012 too large for localStorage
  const unusedBackgroundIDs = getUnusedBackgroundIDs(state);
  const randomID = unusedBackgroundIDs[Math.floor(Math.random() * unusedBackgroundIDs.length)];
  
  return state.backgrounds.entities[randomID];
};

export const getCurrentBackground = (state) => state.backgrounds.current;
