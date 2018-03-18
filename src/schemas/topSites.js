import { schema } from 'normalizr';
import hash from 'object-hash';

export const topSiteSchema = new schema.Entity('topSites', undefined, { idAttribute: value => hash(value) });
export const arrayOfTopSites = [topSiteSchema];
