import { schema } from 'normalizr';

export const backgroundSchema = new schema.Entity('backgrounds', { idAttribute: 'id' });
export const arrayOfBackgrounds = [backgroundSchema];
