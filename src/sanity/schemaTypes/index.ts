import { type SchemaTypeDefinition } from 'sanity'
import teamMember from './teamMember'
import siteSettings from './siteSettings'
import homePage from './homePage'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [teamMember, siteSettings, homePage],
}
