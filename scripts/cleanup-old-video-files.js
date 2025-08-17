// Script to clean up old video files from Sanity
// Run this in your Sanity Studio's Vision tool

// First, let's find all the old video files
const findOldVideoFiles = `
  *[_type == "sanity.fileAsset" && (originalFilename match "*.mp4" || originalFilename match "*low*" || originalFilename match "*high*" || originalFilename match "*medium*")] {
    _id,
    _rev,
    originalFilename,
    url,
    "referencedIn": *[references(^._id)] {
      _id,
      _type
    }
  }
`;

// Then, let's find documents that still reference these old video fields
const findDocumentsWithOldVideoFields = `
  *[_type == "homePage" && (expandMediaSrc != null || expandMediaSrcLow != null || expandPosterSrc != null || expandBgImageSrc != null)] {
    _id,
    _rev,
    expandMediaSrc,
    expandMediaSrcLow,
    expandPosterSrc,
    expandBgImageSrc
  }
`;

// Mutation to remove old video fields from homePage documents
const removeOldVideoFields = `
  *[_type == "homePage" && (expandMediaSrc != null || expandMediaSrcLow != null || expandPosterSrc != null || expandBgImageSrc != null)] {
    "operations": [
      {
        "patch": {
          "id": _id,
          "unset": ["expandMediaSrc", "expandMediaSrcLow", "expandPosterSrc", "expandBgImageSrc"]
        }
      }
    ]
  }
`;

// Mutation to delete old video files (BE CAREFUL - this permanently deletes files)
const deleteOldVideoFiles = `
  *[_type == "sanity.fileAsset" && (originalFilename match "*.mp4" || originalFilename match "*low*" || originalFilename match "*high*" || originalFilename match "*medium*")] {
    "operations": [
      {
        "delete": {
          "id": _id
        }
      }
    ]
  }
`;

console.log('=== SANITY VIDEO CLEANUP SCRIPT ===\n');

console.log('STEP 1: Find old video files');
console.log('Run this query in Sanity Vision to see what old video files exist:');
console.log(findOldVideoFiles);
console.log('\n');

console.log('STEP 2: Find documents with old video fields');
console.log('Run this query to see which documents still reference old video fields:');
console.log(findDocumentsWithOldVideoFields);
console.log('\n');

console.log('STEP 3: Remove old video fields from documents');
console.log('Run this mutation to remove old video field references:');
console.log(removeOldVideoFields);
console.log('\n');

console.log('STEP 4: Delete old video files (OPTIONAL - BE CAREFUL!)');
console.log('⚠️  WARNING: This will permanently delete the video files!');
console.log('Only run this if you\'re sure you don\'t need these files:');
console.log(deleteOldVideoFiles);
console.log('\n');

console.log('=== RECOMMENDED APPROACH ===');
console.log('1. Run STEP 1 to see what files exist');
console.log('2. Run STEP 2 to see which documents reference them');
console.log('3. Run STEP 3 to clean up document references');
console.log('4. Only run STEP 4 if you\'re absolutely sure you want to delete the files');
console.log('\n');

console.log('=== ALTERNATIVE: Manual Cleanup ===');
console.log('1. Go to Sanity Studio Media tab');
console.log('2. Search for "mp4" files');
console.log('3. Delete files named: low.mp4, high.mp4, medium.mp4');
console.log('4. Go back to Home Page document and remove any remaining field references');
