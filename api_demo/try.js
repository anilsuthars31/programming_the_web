/*
  try.js - BMTC timetable demo (mock GTFS-like data)
  - Embedded sample data for stops and departures
  - Search/select stops, show upcoming departures relative to local time
  - Loading indicator + friendly error messages
  - Small map display using mock coordinates
  - No frameworks required, plain JS
*/

// ---- Mock GTFS-like data ----
// A small set of stops (id, name, code, coords)
const STOPS = [
  {stop_id: 'S100', stop_name: 'Majestic', stop_code: '100', lat: 12.9759, lon: 77.6056},
  {stop_id: 'S101', stop_name: 'Kempegowda Bus Station', stop_code: '101', lat: 12.9760, lon: 77.6058},
  {stop_id: 'S200', stop_name: 'Jayanagar 4th T Block', stop_code: '200', lat: 12.9250, lon: 77.5938},
  {stop_id: 'S300', stop_name: 'Silk Board', stop_code: '300', lat: 12.9081, lon: 77.6410},
];

// A small schedule table: stop_id -> array of departure times (HH:MM) with route/destination
const SCHEDULE = {
  S100: [
    {route: '200A', dest: 'Whitefield', time: '06:45'},
    {route: '201B', dest: 'Majestic - KR Puram', time: '07:10'},
    {route: '202', dest: 'Yelahanka', time: '07:35'},
    {route: '203', dest: 'Electronic City', time: '08:00'},
    {route: '204', dest: 'Hebbal', time: '08:20'},
  ],
  S101: [
    {route: '150', dest: 'Yeshwanthpur', time: '07:00'},
    {route: '151', dest: 'Magadi Road', time: '07:30'},
    {route: '152', dest: 'Mysore Road', time: '07:55'},
  ],
  S200: [
    {route: '47A', dest: 'Jayanagar 7th', time: '06:50'},
    {route: '48', dest: 'Banashankari', time: '07:25'},
    {route: '49', dest: 'R V Road', time: '08:05'},
  ],
  S300: [
    {route: '500', dest: 'Electronic City', time: '06:40'},
    {route: '501', dest: 'Sarjapur', time: '07:20'},
    {route: '502', dest: 'Koramangala', time: '07:50'},
  ]
};

// ---- Utility helpers ----
// parse HH:MM into Date object for today (or tomorrow if time already passed)
function parseTimeToday(hhmm) {
  const [hh, mm] = hhmm.split(':').map(Number);
  const now = new Date();
  const d = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hh, mm, 0, 0);
  if (d < now) {
    // schedule next day
    d.setDate(d.getDate() + 1);
  }
  return d;
}

function formatTime(date) {
  return date.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});
}

// simulate data fetch with a tiny delay to show loading indicator
function fetchMockData() {
  return new Promise((resolve) => {
    setTimeout(() => resolve({stops: STOPS, schedule: SCHEDULE}), 350);
  });
}

// ---- App code ----
document.addEventListener('DOMContentLoaded', ()=>{
  const stopInput = document.getElementById('stopInput');
  const datalist = document.getElementById('stops-list');
  const searchBtn = document.getElementById('searchBtn');
  const status = document.getElementById('status');
  const departuresEl = document.getElementById('departures');
  const mapCoords = document.getElementById('map-coords');
  const colorDisplay = document.getElementById('colorDisplay');

  let data = {stops: [], schedule: {}};

  // show/hide loading
  function setLoading(loading, text=''){
    status.innerHTML = loading ? '<span class="spinner" aria-hidden="true"></span> Loading...' : text;
  }

  // show friendly error
  function showError(msg){
    status.textContent = 'Error: ' + msg;
    status.style.color = '#b00020';
  }

  // populate datalist with stops
  function populateStopsList(stops){
    datalist.innerHTML = '';
    stops.forEach(s => {
      const opt = document.createElement('option');
      opt.value = s.stop_name + ' (' + s.stop_code + ')';
      // store stop_id on option for convenience
      opt.dataset.stopId = s.stop_id;
      datalist.appendChild(opt);
    });
  }

  // find stop by name/code or by the stop text from input
  function findStopByInput(text){
    if(!text) return null;
    text = text.trim().toLowerCase();
    // match exact code
    let byCode = data.stops.find(s => s.stop_code.toLowerCase() === text.replace(/[()]/g, ''));
    if(byCode) return byCode;
    // match by "Name (code)" pattern
    const m = text.match(/\((\d+)\)$/);
    if(m){
      const code = m[1];
      const s = data.stops.find(x => x.stop_code === code);
      if(s) return s;
    }
    // fuzzy match by name
    return data.stops.find(s => s.stop_name.toLowerCase().includes(text));
  }

  // get upcoming departures for a stop id (limit N)
  function getUpcoming(stop_id, limit=6){
    const list = data.schedule[stop_id] || [];
    const now = new Date();
    const upcoming = list.map(item => ({
      ...item,
      when: parseTimeToday(item.time)
    })).sort((a,b)=>a.when - b.when).slice(0, limit);
    return upcoming;
  }

  // render departures list
  function renderDepartures(stop){
    departuresEl.innerHTML = '';
    if(!stop){
      departuresEl.innerHTML = '<li class="empty">Select a stop to see departures.</li>';
      return;
    }
    const upcoming = getUpcoming(stop.stop_id);
    if(upcoming.length === 0){
      departuresEl.innerHTML = '<li class="empty">No scheduled departures found for this stop.</li>';
      return;
    }

    upcoming.forEach(dep => {
      const li = document.createElement('li');
      const meta = document.createElement('div');
      meta.className = 'meta';
      const route = document.createElement('div');
      route.className = 'route';
      route.textContent = dep.route + ' → ' + dep.dest;
      const when = document.createElement('div');
      when.className = 'when';
      when.textContent = formatTime(dep.when);

      meta.appendChild(route);
      meta.appendChild(when);

      const btn = document.createElement('button');
      btn.textContent = 'Use stop';
      btn.title = 'Fill this stop into search input';
      btn.addEventListener('click', ()=>{
        // clicking a result should fill the stop text automatically
        stopInput.value = stop.stop_name + ' (' + stop.stop_code + ')';
        stopInput.focus();
        // also update the small map and display
        showMap(stop);
        colorDisplay.textContent = 'Selected stop: ' + stop.stop_name;
      });

      li.appendChild(meta);
      li.appendChild(btn);
      departuresEl.appendChild(li);
    });
  }

  function showMap(stop){
    if(!stop){ mapCoords.textContent = '(no stop)'; return; }
    mapCoords.textContent = stop.lat.toFixed(4) + ', ' + stop.lon.toFixed(4);
  }

  // initial load
  async function init(){
    setLoading(true);
    try{
      data = await fetchMockData();
      populateStopsList(data.stops);
      setLoading(false, 'Ready');
      renderDepartures(null);
    }catch(err){
      setLoading(false);
      showError('Failed to load schedule data.');
      console.error(err);
    }
  }

  // wire search button
  searchBtn.addEventListener('click', ()=>{
    const text = stopInput.value;
    const stop = findStopByInput(text);
    if(!stop){
      showError('Stop not found. Try selecting from the dropdown or type a partial name (e.g. "Majestic").');
      return;
    }
    // clear status styling
    status.style.color = '';
    status.textContent = 'Showing departures for ' + stop.stop_name + ' (' + stop.stop_code + ')';
    showMap(stop);
    renderDepartures(stop);
  });

  // Optional: allow Enter in input to trigger search
  stopInput.addEventListener('keydown', e => { if(e.key === 'Enter') searchBtn.click(); });

  // start
  init();
});
