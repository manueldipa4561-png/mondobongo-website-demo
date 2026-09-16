document.documentElement.classList.add('js');

const header=document.querySelector('.site-header');
const toggle=document.querySelector('.menu-toggle');
const nav=document.querySelector('.nav');

function syncHeader(){
  if(!header)return;
  header.classList.toggle('scrolled',window.scrollY>28);
}

if(header){
  syncHeader();
  window.addEventListener('scroll',syncHeader,{passive:true});
}

function closeMenu(){
  if(!toggle||!nav)return;
  nav.classList.remove('open');
  toggle.setAttribute('aria-expanded','false');
  toggle.setAttribute('aria-label','Apri menu');
  document.body.style.overflow='';
}

if(toggle&&nav){
  toggle.addEventListener('click',()=>{
    const open=nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded',String(open));
    toggle.setAttribute('aria-label',open?'Chiudi menu':'Apri menu');
    document.body.style.overflow=open?'hidden':'';
    if(open){const first=nav.querySelector('a');if(first)first.focus()}
  });
  nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&nav.classList.contains('open')){closeMenu();toggle.focus()}});
  window.addEventListener('resize',()=>{if(innerWidth>820)closeMenu()});
}

const tabs=[...document.querySelectorAll('.menu-tab')];
const panels=[...document.querySelectorAll('.menu-panel')];

function selectTab(tab,moveFocus=false){
  tabs.forEach(t=>{
    const on=t===tab;
    t.classList.toggle('active',on);
    t.setAttribute('aria-selected',String(on));
    t.tabIndex=on?0:-1;
  });
  panels.forEach(panel=>{
    const on=panel.dataset.panel===tab.dataset.menu;
    panel.classList.toggle('active',on);
    panel.hidden=!on;
    panel.setAttribute('aria-hidden',String(!on));
  });
  if(moveFocus){
    tab.focus();
    tab.scrollIntoView({block:'nearest',inline:'nearest'});
  }
}

if(tabs.length&&panels.length){
  tabs.forEach((tab,i)=>{
    tab.addEventListener('click',()=>selectTab(tab));
    tab.addEventListener('keydown',e=>{
      let target;
      if(e.key==='ArrowRight')target=(i+1)%tabs.length;
      if(e.key==='ArrowLeft')target=(i-1+tabs.length)%tabs.length;
      if(e.key==='Home')target=0;
      if(e.key==='End')target=tabs.length-1;
      if(target!==undefined){e.preventDefault();selectTab(tabs[target],true)}
    });
  });
  selectTab(tabs.find(t=>t.classList.contains('active'))||tabs[0]);
}

const form=document.querySelector('#request-form');
let calendarUrl;
const pad=value=>String(value).padStart(2,'0');

function calendarStamp(dateValue,timeValue,offsetMinutes=0){
  const [y,m,d]=dateValue.split('-').map(Number);
  const [h,min]=timeValue.split(':').map(Number);
  const value=new Date(Date.UTC(y,m-1,d,h,min)+offsetMinutes*60000);
  return `${value.getUTCFullYear()}${pad(value.getUTCMonth()+1)}${pad(value.getUTCDate())}T${pad(value.getUTCHours())}${pad(value.getUTCMinutes())}00`;
}

function icsEscape(value){
  return String(value).replace(/\\/g,'\\\\').replace(/;/g,'\\;').replace(/,/g,'\\,').replace(/\n/g,'\\n');
}

if(form){
  const date=document.querySelector('#visit-date');
  const time=document.querySelector('#visit-time');
  const people=document.querySelector('#party-size');
  const result=document.querySelector('#request-result');
  const error=document.querySelector('#request-error');
  const requestLink=document.querySelector('#request-link');
  const googleLink=document.querySelector('#google-calendar-link');
  const calendarLink=document.querySelector('#calendar-link');
  const now=new Date();
  date.min=`${now.getFullYear()}-${pad(now.getMonth()+1)}-${pad(now.getDate())}`;

  function resetGenerated(clearError=true){
    result.hidden=true;
    requestLink.removeAttribute('href');
    googleLink.removeAttribute('href');
    calendarLink.removeAttribute('href');
    if(calendarUrl){URL.revokeObjectURL(calendarUrl);calendarUrl=undefined}
    if(clearError)error.textContent='';
  }

  form.addEventListener('input',()=>resetGenerated(true));

  form.addEventListener('submit',e=>{
    e.preventDefault();
    resetGenerated(true);
    if(!date.value||!time.value){error.textContent='Inserisci giorno e orario.';return}
    const when=new Date(`${date.value}T${time.value}`);
    if(!Number.isFinite(when.getTime())||when<=new Date()){
      error.textContent='Scegli un giorno e un orario futuri.';
      return;
    }

    const displayDate=date.value.split('-').reverse().join('/');
    const text=`Ciao Mondo Bongo, vorrei chiedere disponibilità per ${people.value} persone il ${displayDate} alle ${time.value}. Potete confermare? Grazie!`;
    document.querySelector('#request-preview').textContent=text;
    requestLink.href=`https://wa.me/393289499016?text=${encodeURIComponent(text)}`;

    const startStamp=calendarStamp(date.value,time.value);
    const endStamp=calendarStamp(date.value,time.value,120);
    const calendarDetails='Promemoria personale per una richiesta da confermare direttamente con Mondo Bongo. Questo evento non costituisce una prenotazione.';
    const calendarLocation='Via Nazionale Adriatica Sud, 107, 66023 Francavilla al Mare (CH)';
    const googleParams=new URLSearchParams({
      action:'TEMPLATE',
      text:'Mondo Bongo - richiesta DA CONFERMARE',
      dates:`${startStamp}/${endStamp}`,
      ctz:'Europe/Rome',
      details:calendarDetails,
      location:calendarLocation
    });
    googleLink.href=`https://calendar.google.com/calendar/render?${googleParams.toString()}`;

    const ics=[
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Punto Due Studio//Richiesta demo//IT',
      'METHOD:PUBLISH',
      'BEGIN:VEVENT',
      `UID:${Date.now()}@mondobongo-demo`,
      `DTSTAMP:${new Date().toISOString().replace(/[-:]/g,'').replace(/\.\d{3}/,'')}`,
      `DTSTART;TZID=Europe/Rome:${startStamp}`,
      `DTEND;TZID=Europe/Rome:${endStamp}`,
      `SUMMARY:${icsEscape('Mondo Bongo - richiesta DA CONFERMARE')}`,
      `DESCRIPTION:${icsEscape(calendarDetails)}`,
      `LOCATION:${icsEscape(calendarLocation)}`,
      'STATUS:TENTATIVE',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    calendarUrl=URL.createObjectURL(new Blob([ics],{type:'text/calendar;charset=utf-8'}));
    calendarLink.href=calendarUrl;
    result.hidden=false;
    requestLink.focus();
  });
}
