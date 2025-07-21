import { type SchemaTypeDefinition } from 'sanity'
import siteSettings from './siteSettings'
import homePage from './homePage'
import teamMember from './teamMember'
import faq from './faq'


export const schema: { types: SchemaTypeDefinition[] } = {
  types: [siteSettings, homePage, teamMember, faq],
}
