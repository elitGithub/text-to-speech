// init speech synth api
const synth = window.speechSynthesis;

const textForm = document.querySelector('form');
const textInput = document.querySelector('#text-input');
const voiceSelect = document.querySelector('#voice-select');
const rate = document.querySelector('#rate');
const rateValue = document.querySelector('#rate-value');
const pitch = document.querySelector('#pitch');
const pitchValue = document.querySelector('#pitch-value');
const submitButton = document.querySelector('#submitButton');
const body = document.querySelector('body');
const bgColor = '#141414';
// init voices array
let voices = [];

const getVoices = () => {
    voices = synth.getVoices();
    voices.forEach(voice => {
        const option = document.createElement('option');
        option.textContent = voice.name + ` (${voice.lang})`;
        option.setAttribute('data-lang', voice.lang);
        option.setAttribute('data-name', voice.name);
        voiceSelect.appendChild(option);
    });
};

getVoices();
if (synth.onvoiceschanged !== undefined) {
    synth.onvoiceschanged = getVoices;
}

const speak = () => {
    if (synth.speaking) {
        console.error('Already speaking, can\'t speak.');
        return;
    }
    if (textInput.value !== '') {
        body.style.background = `${bgColor} url('./img/wave.gif')`;
        body.style.backgroundRepeat = 'repeat-x';
        body.style.backgroundSize = '100% 100%';
        const speakText = new SpeechSynthesisUtterance(textInput.value);
        submitButton.setAttribute('disabled', 'disabled');
        speakText.onend = e => {
            submitButton.removeAttribute('disabled');
            body.style.background = `${bgColor}`;
        };
        speakText.onerror = e => submitButton.removeAttribute('disabled');
        const selectedVoice = voiceSelect.selectedOptions[0].getAttribute('data-name');
        voices.forEach(voice => {
            if (voice.name === selectedVoice) {
                speakText.voice = voice;
            }
        });
        speakText.rate = rate.value;
        speakText.pitch = pitch.value;

        synth.speak(speakText);
    }
};

textForm.addEventListener('submit', e => {
    e.preventDefault();
    speak();
    textInput.blur();
});

rate.addEventListener('change', e => rateValue.textContent = rate.value);
pitch.addEventListener('change', e => pitchValue.textContent = pitch.value);
voiceSelect.addEventListener('change', speak)
