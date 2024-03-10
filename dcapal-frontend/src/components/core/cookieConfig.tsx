/**
 * @type {UserConfig}
 */
const pluginConfig = {
  page_scripts: false,
  current_lang: "it",
  hide_from_bots: true,
  cookie_name: "cc_cookie",
  languages: {
    en: {
      consent_modal: {
        title: "We use cookies!",
        description:
          'Hi, this website uses essential cookies to ensure its proper operation and tracking cookies to understand how you interact with it. The latter will be set only after consent. <button type="button" data-cc="c-settings" class="cc-link">Let me choose</button>',
        primary_btn: {
          text: "Accept all",
          role: "accept_all", // 'accept_selected' or 'accept_all'
        },
        secondary_btn: {
          text: "Reject all",
          role: "accept_necessary", // 'settings' or 'accept_necessary'
        },
      },
      settings_modal: {
        title: "Cookie preferences",
        save_settings_btn: "Save settings",
        accept_all_btn: "Accept all",
        reject_all_btn: "Reject all",
        close_btn_label: "Close",
        // cookie_table_caption: 'Cookie list',
        cookie_table_headers: [
          { col1: "Name" },
          { col2: "Domain" },
          { col3: "Expiration" },
          { col4: "Description" },
        ],
        blocks: [
          {
            title: "Cookie usage 📢",
            description:
              'I use cookies to ensure the basic functionalities of the website and to enhance your online experience. You can choose for each category to opt-in/out whenever you want. For more details relative to cookies and other sensitive data, please read the full <a href="#" class="cc-link">privacy policy</a>.',
          },
          {
            title: "Strictly necessary cookies",
            description:
              "These cookies are essential for the proper functioning of my website. Without these cookies, the website would not work properly",
            toggle: {
              value: "necessary",
              enabled: true,
              readonly: true, // cookie categories with readonly=true are all treated as "necessary cookies"
            },
          },
          {
            title: "Performance and Analytics cookies",
            description:
              "These cookies allow the website to remember the choices you have made in the past",
            toggle: {
              value: "analytics", // your cookie category
              enabled: false,
              readonly: false,
            },
            cookie_table: [
              // list of all expected cookies
              {
                col1: "^_ga", // match all cookies starting with "_ga"
                col2: "google.com",
                col3: "2 years",
                col4: "description ...",
                is_regex: true,
              },
              {
                col1: "_gid",
                col2: "google.com",
                col3: "1 day",
                col4: "description ...",
              },
            ],
          },
          {
            title: "More information",
            description:
              'For any queries in relation to our policy on cookies and your choices, please <a class="cc-link" href="/about#social-profiles">contact us</a>.',
          },
        ],
      },
    },
    it: {
      consent_modal: {
        title: "Utilizziamo i cookie!",
        description:
          'Ciao, questo sito web utilizza cookie essenziali per garantire il suo corretto funzionamento e cookie di tracciamento per comprendere come interagisci con esso. Questi ultimi verranno impostati solo dopo il consenso. <button type="button" data-cc="c-settings" class="cc-link">Lascia che scelga</button>',
        primary_btn: {
          text: "Accetta tutto",
          role: "accetta_tutto", // 'accetta_selezionati' o 'accetta_tutto'
        },
        secondary_btn: {
          text: "Rifiuta tutto",
          role: "accetta_necessari", // 'impostazioni' o 'accetta_necessari'
        },
      },
      settings_modal: {
        title: "Preferenze dei cookie",
        save_settings_btn: "Salva impostazioni",
        accept_all_btn: "Accetta tutto",
        reject_all_btn: "Rifiuta tutto",
        close_btn_label: "Chiudi",
        // cookie_table_caption: 'Elenco dei cookie',
        cookie_table_headers: [
          { col1: "Nome" },
          { col2: "Dominio" },
          { col3: "Scadenza" },
          { col4: "Descrizione" },
        ],
        blocks: [
          {
            title: "Utilizzo dei cookie 📢",
            description:
              'Utilizzo i cookie per garantire le funzionalità di base del sito web e per migliorare la tua esperienza online. Puoi scegliere di dare o revocare il consenso per ciascuna categoria quando desideri. Per ulteriori dettagli sui cookie e altri dati sensibili, leggi l\'intera <a href="#" class="cc-link">informativa sulla privacy</a>.',
          },
          {
            title: "Cookie strettamente necessari",
            description:
              "Questi cookie sono essenziali per il corretto funzionamento del mio sito web. Senza questi cookie, il sito web non funzionerebbe correttamente",
            toggle: {
              value: "necessari",
              enabled: true,
              readonly: true, // le categorie di cookie con readonly=true sono trattate come "cookie necessari"
            },
          },
          {
            title: "Cookie di prestazioni e analisi",
            description:
              "Questi cookie consentono al sito web di ricordare le scelte che hai fatto in passato",
            toggle: {
              value: "analisi", // la tua categoria di cookie
              enabled: false,
              readonly: false,
            },
            cookie_table: [
              // elenco di tutti i cookie previsti
              {
                col1: "^_ga", // corrisponde a tutti i cookie che iniziano con "_ga"
                col2: "google.com",
                col3: "2 anni",
                col4: "descrizione ...",
                is_regex: true,
              },
              {
                col1: "_gid",
                col2: "google.com",
                col3: "1 giorno",
                col4: "descrizione ...",
              },
            ],
          },
          {
            title: "Maggiori informazioni",
            description:
              'Per qualsiasi domanda relativa alla nostra politica sui cookie e alle tue scelte, per favore <a class="cc-link" href="/about#social-profiles">contattaci</a>.',
          },
        ],
      },
    },
  },
};

export default pluginConfig;
