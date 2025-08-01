export const apiVersion = '2025-07-15'
export const dataset = 'production'
export const projectId = 'yvqe54iq'

function assertValue<T>(v: T | undefined, errorMessage: string): T {
  if (v === undefined) {
    throw new Error(errorMessage)
  }

  return v
}
