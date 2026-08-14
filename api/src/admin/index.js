const { bucket, verifyToken } = require('../utils')

async function getStorageStats(req, res) {
  try {
    await verifyToken(req)
    
    let totalBytes = 0
    try {
      const [files] = await bucket.getFiles()
      files.forEach(file => {
        totalBytes += parseInt(file.metadata.size || 0, 10)
      })
    } catch (bucketErr) {
      console.error('Bucket not initialized or error fetching files:', bucketErr)
      // Return 0 if the bucket hasn't been set up yet
    }

    res.json({ totalBytes })
  } catch (err) {
    console.error('getStorageStats error:', err)
    res.status(500).json({ error: err.message })
  }
}

module.exports = { getStorageStats }
