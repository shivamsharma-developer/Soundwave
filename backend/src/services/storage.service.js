const { ImageKit } = require("@imageKit/nodejs")

const ImageKitClient = new ImageKit({
    privateKey: process.env.IMAGE_PRIVATE_KEY,
})

async function uploadFile(file) {
    const result = await ImageKitClient.files.upload({
        file,
        fileName: "music_"+Date.now(),
        folder: "yt-complete-backend/music"
    })

    return result;
}

module.exports = { uploadFile }