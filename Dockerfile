FROM tiangolo/uvicorn-gunicorn-fastapi:python3.9-slim
RUN apt update && apt install -y ffmpeg
RUN pip install yt_dlp
COPY ./api /app