import { type SchemaTypeDefinition } from 'sanity'
import siteSettings from './siteSettings'
import homePage from './homePage'
import teamMember from './teamMember'
import faq from './faq'
import aboutSection from './aboutSection'
import teamBlock from './teamBlock'
import registrationPage from './registrationPage'
import recruitingPage from './recruitingPage'
import aboutPage from './aboutPage'
import contactPage from './contactPage'
import faqPage from './faqPage'
import mediaPage from './mediaPage'
import mediaItem from './mediaItem'


export const schema: { types: SchemaTypeDefinition[] } = {
  types: [siteSettings, homePage, teamMember, faq, aboutSection, teamBlock, registrationPage, recruitingPage, aboutPage, contactPage, faqPage, mediaPage, mediaItem],
}
