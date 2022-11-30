module.exports = {
    "winston": {
        "level": "debug"
    },
    "logging": {
        "firebaseAdmin": true,
        "mongoose": true,
        "jwt": true,
        "bcryptjs": false,
        "razorpay": false,
        "multerS3": true,
        "nodemailer": true
    },
    "bcryptjs": {
        "salt": 6
    },
    "cors": {
        "whitelist": ["http://www.example.com"]
    },
    "awsSDK": {
        "region": "",
        "bucketName": "",
        "directory": {
            "example": "example_directory"
        },
        "acl": "public-read"
    },
    "multer": {
        "validMimeType": [
            "image/png",
            "image/jpeg",
            "image/jpg",
            "application/pdf",
            "audio/mp3",
            "audio/x-wav",
            "audio/wav",
            "audio/mpeg",
            "audio/ogg",
            "audio/mp4"
        ]
    },
    healthCheckPaths: [
        "/",
        "/health",
        '/_ah/start',
    ],
    ignoreLogPaths: [
        '/favicon.ico',
        '/images/icons/gear.png'
    ]
}