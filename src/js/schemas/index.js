import { schema } from 'normalizr';

const backgroundSchema = new schema.Entity('backgrounds', { idAttribute: 'id' });

const arrayOfBackgrounds = [backgroundSchema];

export default arrayOfBackgrounds;
