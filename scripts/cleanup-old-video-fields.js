// Script to clean up old video fields from Sanity documents
// Run this in your Sanity Studio's Vision tool or via the Sanity CLI

// This query will find all homePage documents with old video fields
const findDocumentsWithOldFields = `
  *[_type == "homePage" && (expandBgImageSrc != null || expandMediaSrc != null || expandPosterSrc != null)] {
    _id,
    _rev,
    expandBgImageSrc,
    expandMediaSrc,
    expandPosterSrc
  }
`;

// This mutation will remove the old fields
const removeOldFields = `
  *[_type == "homePage" && (expandBgImageSrc != null || expandMediaSrc != null || expandPosterSrc != null)] {
    "operations": [
      {
        "patch": {
          "id": _id,
          "unset": ["expandBgImageSrc", "expandMediaSrc", "expandPosterSrc"]
        }
      }
    ]
  }
`;

console.log('To clean up old video fields:');
console.log('1. Go to Sanity Studio Vision tool');
console.log('2. Run this query to see affected documents:');
console.log(findDocumentsWithOldFields);
console.log('\n3. Then run this mutation to remove the fields:');
console.log(removeOldFields);
