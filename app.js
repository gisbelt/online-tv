import { init } from "./player";
import { V, on, useLS } from "./helpers.js";
const main = V('#app');
const btnNext = V('#next-channel');
const btnPrev = V('#prev-channel');
const btnDarkMode = V('#darkmode');
const channelName = V('#channel');
const messageContainer = V('#message-channel');
const light_mode = "<i class='bx bx-moon'></i>",
      dark_mode = "<i class='bx bx-sun'></i>";

const channels = [
    {
        name: 'azteca7',
        url: 'https://live4-ott.izzigo.tv/out/u/dash/AZTECA-7-HD/default.mpd?&ck=eyJjZThmODZkMmYwZDE2Mzg1NzQyMzdhZGE4YWMyZTgyYSIgOiAiNjQyNzcyZWJmMTgzMmYxZjJmYTU4Y2I3ZThmY2ZkMDUifQ=='
    },
    {
        name: 'Las_Estrellas',
        url:'https://channel-estrellas-cdn.blim.com/manifest.mpd?&ck=eyI1X1ItSzVTT2tpTFBUU1MxR0lIc0JBIiA6ICJTdUVNSTFmaVVPQ0l1NHBhc0VUZFVBIn0='
    },
    {
        name: 'Star_Series',
        url:'https://dtvott-abc.akamaized.net/dash_live_1196/manifest.mpd?&ck=eyI5RE05LXc1d2pzbUdXNXB2OHFqZ2FBIiA6ICJmRGpaTVEwOFcwYWplam03N0czV2lnIn0='
    },
    {
        name: 'dSports',
        url: 'https://dtvott-abc.akamaized.net/dash_live_1061/manifest.mpd?&ck=eyI3MTE5MDY5Yjk5MDE1YjRlYjllZTQzMDA1NzczOTllMiIgOiAiYjg5ODI3Y2M5NzBjZDc4ZGE4ODJmZmNhMzUwNGM3NzQifQ=='
    },
    {
        name: 'TNT_SPORTS_AR',
        url: 'https://dtvott-abc.akamaized.net/dash_live_1233/manifest.mpd?&ck=eyJwTjduZGhVbm5JV0xHZVc3YWF0blZRIiA6ICJ4R2w3OUZqYVV2aTVhemJNNTJIVmNRIn0='
    },
    {
        name: 'tycSports',
        url: 'https://1240-vos.dtvott.com/DASH/manifest.mpd?&ck=eyI0ZDQ1Yjc5ZDQ0ODczNDM1ODkwNThhYjQ5ZGRmOGNmMCI6ImFhN2Y5NWY3MWEzY2ZlNDBhYTU5OTA0ZjkyODVhZjcyIn0='
    },
    {
        name: 'tvPublica',
        url: 'https://edge-live17-sl.cvattv.com.ar/live/c6eds/Canal7/SA_Live_dash_enc_2A/Canal7.mpd?&ck=eyJjYzhjODJhYzJlYzdlOTc5OTUyN2MyOWRiNzM1NGU4MSIgOiAiY2M0YWFlMTczZGQyZWYxN2FlMjZiZTNmN2FlODc2NjIifQ=='
    },
    {
        name: 'deporTv',
        url: 'https://dtvott-abc.akamaized.net/dash_live_1056/manifest.mpd?&ck=eyJPbGJmQUVmZGNKT0l4Z2I1X3ktNjNRIiA6ICJBS2QxMGJscldWR3p3NnRYbWZtR2pnIn0='
    }
]
let count = 0;

// functions =============================================
const detectIndex = (hash) => {
    let nameChannel = hash.slice(1);
    return channels.findIndex(el => el.name === nameChannel);
}

const setLoading = () => {
    messageContainer.innerHTML = `
        <p>Cargando...</p>
    `;
    messageContainer.style.display = 'block';
    messageContainer.classList.add('loader');
}

const addName = (name) => channelName.innerHTML = `${name}`;

const changeChannel = (arr, i = 0) => {
    const channel = arr[i].name;
    location.hash = channel;
    addName(channel.toUpperCase());
    setLoading();
}

const validHash = (hash) => {
    // saque esté canal del if hash === '#directvSports'
    if( hash === '#tycSports' || hash === '#tvPublica' || hash === '#dSports' || hash === '#deporTv' || hash === '#azteca7'){
        count = detectIndex(hash);
        let {url} = channels[count];
        return url;
    }
    if(hash === '') return {error: 'No pasaste ningun hash'}

    return {error: 'error esté hash NO ES VALIDO'}
}

// add shaka-player ===========================================
on(document,'shaka-ui-loaded', async e => {
    const channel = channels[count].name
    location.hash = channel
    addName(channel.toUpperCase())
    setLoading();
    let {hash} = location;

    let val = validHash(hash);
    typeof val === 'string'
        ?  init(val)
        : main.insertAdjacentHTML('afterbegin', `<h1>${val.error}</h1>`);
});

// detect hash in load DOM =========================================
on(document,'DOMContentLoaded', () => {
    let {hash} = location;

    let val = validHash(hash);
    typeof val === 'string'
        ? init(val)
        : console.error(val.error);
    const appConfig = useLS.get('app:config');
    typeof appConfig != 'undefined' && appConfig.theme == dark_mode && darkMode(); 
    
});

// detect change hash ===============================================
on(window,'hashchange', () => {
    let {hash} = location;
    let index = detectIndex(hash);
    let {url} = channels[index];
    init(url)
});

const nextChannel = () => {
    count++;
    if(count >= channels.length) count = 0;
    changeChannel(channels, count);
    messageContainer.innerHTML='';
}

const prevChannel = () => {
    count--;
    if(count < 0) count = channels.length - 1;
    changeChannel(channels, count);
    messageContainer.innerHTML='';
}

const darkMode = () => {
	const span = btnDarkMode.getElementsByTagName('span')[0];
	document.body.classList.toggle('dark');
	btnDarkMode.classList.toggle('on');

	if (document.body.classList.contains("dark")) {
    useLS.set("app:config", { theme: light_mode });
    span.innerHTML = dark_mode;
    messageContainer.style.color='#000';	
  } else {
    span.innerHTML = light_mode;
    messageContainer.style.color='#fff';
    useLS.set("app:config", { theme: dark_mode });
  }
}

const handleKeyboard = (e) => {
    (e.key === 'ArrowRight') && nextChannel();
    (e.key === 'ArrowLeft') && prevChannel();
}

// change channel =================================================
const elEvFn = [
  { el: document, ev: "keydown", fn: handleKeyboard },
  { el: btnNext, ev: "click", fn: nextChannel },
  { el: btnPrev, ev: "click", fn: prevChannel },
  { el: btnDarkMode, ev: "click", fn: darkMode },
];
elEvFn.forEach(({ el, ev, fn }) => {
  on(el, ev, fn);
});

