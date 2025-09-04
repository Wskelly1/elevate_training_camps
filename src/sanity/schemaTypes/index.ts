import { type SchemaTypeDefinition } from 'sanity'
import siteSettings from './siteSettings'
import homePage from './homePage'
import teamMember from './teamMember'
import faq from './faq'
import aboutSection from './aboutSection'
import coachingProgram from './coachingProgram'
import coachingBenefit from './coachingBenefit'
import coachingTestimonial from './coachingTestimonial'
import trainingPackage from './trainingPackage'
import upcomingCamp from './upcomingCamp'
import paymentOption from './paymentOption'
import whatsIncluded from './whatsIncluded'


export const schema: { types: SchemaTypeDefinition[] } = {
  types: [siteSettings, homePage, teamMember, faq, aboutSection, coachingProgram, coachingBenefit, coachingTestimonial, trainingPackage, upcomingCamp, paymentOption, whatsIncluded],
}
