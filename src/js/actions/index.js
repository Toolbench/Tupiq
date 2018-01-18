import { createAction } from 'redux-actions';

/**
 * Action Constants
 */
export const SHUFFLE_BACKGROUND = 'SHUFFLE_BACKGROUND';
export const SHUFFLE_BACKGROUND_SUCCESS = 'SHUFFLE_BACKGROUND_SUCCESS';
export const SHUFFLE_BACKGROUND_FAIL = 'SHUFFLE_BACKGROUND_FAIL';

/**
 * Action Creators
 */
export const shuffleBackground = createAction(SHUFFLE_BACKGROUND);
