module.exports = {
    "cors": {
        "whitelist": ["http://www.example.com"]
    },
    "awsSDK": {
        "region": "us-east-1",
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
    ]
}