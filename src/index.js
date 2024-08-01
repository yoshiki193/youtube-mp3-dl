function parseQuery(queryString) {
    return [...new URLSearchParams(queryString).entries()]
        .reduce((obj, e) => ({...obj, [e[0]]: e[1]}), {});
}

const elDownloadForm = document.getElementById('download-form');
const elInputUrl = document.getElementById('input-url');
const elquality = document.getElementById('select-quality');
const elSubmitButton = document.getElementById('download-button');

elDownloadForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const [_, queryString] = elInputUrl.value.split('?');
    const query = parseQuery(queryString);
    const youtubeId = query.v;

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