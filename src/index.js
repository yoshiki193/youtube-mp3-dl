const elform = document.getElementById('mainform');
const elinput = document.getElementById('url');
const elquality = document.getElementById('quality');
const elbutton = document.getElementById('dlbutton');

elform.addEventListener('submit', (event) => {
    event.preventDefault();

    let youtubeid = '';

    if(elinput.value.match(/watch/)) {
        const [_, query] = elinput.value.split('=');
        youtubeid = query
    } else if(elinput.value.match(/si/)){
        let [_, query] = elinput.value.split('youtu.be/');
        [query, _] = query.split('?si=');
        youtubeid = query
    } else {
        const [_, query] = elinput.value.split('youtu.be/');
        youtubeid = query
    }

    const quality = elquality.value;

    elbutton.disabled = 'true';
    elbutton.innerText = 'Downloading';

    fetch(`/api/ytdl/${youtubeid}?q=${quality}`)
        .then((result) => {
            if(result.status == 200) {
                return result.blob()
            }
        })
        .then((blob) => {
            const objurl = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = objurl
            a.download = `${youtubeid}.mp3`;
            document.body.appendChild(a);
            a.click();
            a.remove;
        })
        .finally(() => {
            elbutton.disabled = '';
            elbutton.innerText = 'Download';
            elinput.value = '';
        })
});