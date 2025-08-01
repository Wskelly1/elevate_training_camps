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

/**
 * Sanity client instance for data fetching
 *
 * This client is configured to connect to the Sanity CMS project and handle
 * all data fetching operations. It uses CDN for better performance.
 *
 * @type {Object} Configured Sanity client instance
 */
export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true, // Set to false for real-time data
})

/**
 * Image URL builder for Sanity images
 *
 * This builder is used to generate optimized image URLs from Sanity image assets.
 * It provides methods for resizing, cropping, and optimizing images.
 *
 * @type {Object} Configured image URL builder instance
 */
const builder = imageUrlBuilder(client)

/**
 * Generates optimized image URLs from Sanity image assets
 *
 * This function takes a Sanity image source and returns a builder object
 * that can be used to generate optimized image URLs with various transformations.
 *
 * @param {any} source - Sanity image asset object
 * @returns {Object} Image URL builder with transformation methods
 */
export function urlFor(source: any) {
  return builder.image(source)
}
