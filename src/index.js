const elDownloadForm = document.getElementById('download-form');
const elInputUrl = document.getElementById('input-url');
const elquality = document.getElementById('select-quality');
const elSubmitButton = document.getElementById('download-button');

elDownloadForm.addEventListener('submit', (event) => {
    event.preventDefault();

    let youtubeId = '';

    if(elInputUrl.value.match(/watch/)) {
        const [_, queryString] = elInputUrl.value.split('=');
        youtubeId = queryString
    } else if(elInputUrl.value.match(/si/)){
        let [_, queryString] = elInputUrl.value.split('youtu.be/');
        [queryString, _] = queryString.split('?si=');
        youtubeId = queryString
    } else {
        const [_, queryString] = elInputUrl.value.split('youtu.be/');
        youtubeId = queryString
    }

    const quality = elquality.value;

    elSubmitButton.disabled = 'true';
    elSubmitButton.innerText = 'Downloading';

    fetch(`/api/ytdl/${youtubeId}?q=${quality}`)
        .then((result) => {
            if(result.status == 200) {
                return result.blob()
            }
        })
        .then((blob) => {
            const objurl = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = objurl
            a.download = `${youtubeId}.mp3`;
            document.body.appendChild(a);
            a.click();
            a.remove;
        })
        .finally(() => {
            elSubmitButton.disabled = '';
            elSubmitButton.innerText = 'Download';
            elInputUrl.value = '';
        })
});