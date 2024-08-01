from fastapi import FastAPI, HTTPException
from fastapi.responses import FileResponse
from starlette.middleware.cors import CORSMiddleware
import yt_dlp
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

@app.get('/api/ytdl/{youtube_id}', status_code=200)
async def read_youtube_id(youtube_id, q):
    URLS = [f'https://www.youtube.com/watch?v={youtube_id}']

    ydl_opts = {
        'outtmpl': f'./tmp/{youtube_id}',
        'format': 'bestaudio/best',
        'postprocessors': [
            {'key': 'FFmpegExtractAudio',
            'preferredcodec': 'mp3',
            'preferredquality': f'{q}'},
            {'key': 'FFmpegMetadata'},
        ]
    }

    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        error_code = ydl.download(URLS)
    
    if error_code != 0:
        raise HTTPException(status_code=400, detail='server error')
    else:
        flist = os.listdir('./tmp')

        for i in flist:
            if(youtube_id in i):
                destfn = i
        
        response = FileResponse(path=f'./tmp/{destfn}')
        return response