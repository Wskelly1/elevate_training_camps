import { createClient } from 'next-sanity'
import imageUrlBuilder from '@sanity/image-url'
import { apiVersion, dataset, projectId } from '../sanity/env'

// Log configuration
console.log('Sanity Configuration:', {
  projectId,
  dataset,
  apiVersion,
  useCdn: true
});

// Create a client for fetching data
export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true, // Set to false for real-time data
})

// Set up image URL builder
const builder = imageUrlBuilder(client)
export function urlFor(source: any) {
  return builder.image(source)
} 