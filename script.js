const $ = (s, r=document) => r.querySelector(s);
const $$ = (s, r=document) => [...r.querySelectorAll(s)];

const heroRouteStages = [
  {
    name: 'Direction',
    question: 'What matters now?',
    action: 'Set priority',
    decision: 'Define the enterprise outcome and the boundary around it.'
  },
  {
    name: 'Commit',
    question: 'What exactly lands?',
    action: 'Name the contract',
    decision: 'Set the finish condition, DRI, value hypothesis, and decision date.'
  },
  {
    name: 'Capacity',
    question: 'Is the bet truly funded?',
    action: 'Expose tradeoffs',
    decision: 'Match scope to people, specialist capacity, dependencies, and sequence.'
  },
  {
    name: 'Signal',
    question: 'What changes early?',
    action: 'Make drift visible',
    decision: 'Choose leading evidence that arrives soon enough to change the route.'
  },
  {
    name: 'Intervene',
    question: 'What call is required?',
    action: 'Decide at pace',
    decision: 'Proceed, protect, reroute, pause, or stop—and record the decision.'
  }
];

function initHeroRoute(){
  const host = $('.route-stage');
  if(!host) return;

  host.classList.add('route-stage-v2');
  host.setAttribute('aria-label', 'Interactive five-stage commitment routing system');
  host.innerHTML = `
    <div class="route-map route-map-v2">
      <div class="route-head-v2">
        <div>
          <div class="route-title">Decision-to-delivery route</div>
          <div class="route-sub">One commitment. Five executive gates.</div>
        </div>
        <span class="route-status-v2" id="heroRouteStatus" aria-live="polite">Gate 1 of 5 · Direction</span>
      </div>
      <div class="route-system-v2">
        <svg class="route-spine-v2" viewBox="0 0 80 420" preserveAspectRatio="none" aria-hidden="true">
          <path class="route-track-v2" d="M40 10 V410"></path>
          <path class="route-progress-v2" d="M40 10 V410"></path>
          <circle class="route-traveler-v2" cx="40" cy="10" r="7"></circle>
        </svg>
        <ol class="route-steps-v2">
          ${heroRouteStages.map((stage, index) => `
            <li class="route-step-v2${index === 0 ? ' is-active' : ''}" data-route-index="${index}">
              <button class="route-step-button-v2" type="button" aria-current="${index === 0 ? 'step' : 'false'}">
                <span class="route-step-index-v2">${String(index + 1).padStart(2, '0')}</span>
                <span class="route-step-copy-v2">
                  <strong>${stage.name}</strong>
                  <small>${stage.question}</small>
                </span>
                <span class="route-step-action-v2">${stage.action}</span>
              </button>
            </li>
          `).join('')}
        </ol>
      </div>
      <div class="route-decision-v2">
        <span>Decision at this gate</span>
        <strong id="heroRouteDecision">${heroRouteStages[0].decision}</strong>
      </div>
    </div>`;

  const steps = $$('.route-step-v2', host);
  const buttons = $$('.route-step-button-v2', host);
  const progress = $('.route-progress-v2', host);
  const traveler = $('.route-traveler-v2', host);
  const status = $('#heroRouteStatus', host);
  const decision = $('#heroRouteDecision', host);
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let activeIndex = 0;
  let timer = null;

  function setStage(index){
    activeIndex = index;
    const stage = heroRouteStages[index];
    steps.forEach((step, stepIndex) => step.classList.toggle('is-active', stepIndex === index));
    buttons.forEach((button, buttonIndex) => button.setAttribute('aria-current', buttonIndex === index ? 'step' : 'false'));
    status.textContent = `Gate ${index + 1} of ${heroRouteStages.length} · ${stage.name}`;
    decision.textContent = stage.decision;

    const progressDistance = index * 100;
    progress.style.strokeDashoffset = String(400 - progressDistance);
    traveler.style.transform = `translateY(${progressDistance}px)`;
  }

  function stopAutoRoute(){
    if(timer){
      clearInterval(timer);
      timer = null;
    }
  }

  function startAutoRoute(){
    stopAutoRoute();
    if(reducedMotion.matches || document.hidden) return;
    timer = setInterval(() => setStage((activeIndex + 1) % heroRouteStages.length), 2400);
  }

  buttons.forEach((button, index) => {
    button.addEventListener('click', () => {
      setStage(index);
      startAutoRoute();
    });
    button.addEventListener('focus', stopAutoRoute);
    button.addEventListener('blur', startAutoRoute);
  });

  host.addEventListener('mouseenter', stopAutoRoute);
  host.addEventListener('mouseleave', startAutoRoute);
  host.addEventListener('focusin', stopAutoRoute);
  host.addEventListener('focusout', event => {
    if(!host.contains(event.relatedTarget)) startAutoRoute();
  });
  document.addEventListener('visibilitychange', () => document.hidden ? stopAutoRoute() : startAutoRoute());
  reducedMotion.addEventListener?.('change', startAutoRoute);

  setStage(0);
  startAutoRoute();
}

initHeroRoute();

const scenarios = {
  growth: {name:'Growth bet', evidence:62, capacity:58, health:66, context:'Illustrative demand-expansion initiative with cross-functional dependencies.'},
  platform: {name:'Platform bet', evidence:70, capacity:44, health:55, context:'Illustrative platform initiative with strong rationale and constrained specialist capacity.'},
  efficiency: {name:'Efficiency bet', evidence:54, capacity:72, health:71, context:'Illustrative operating-efficiency initiative with available capacity but a less certain value case.'}
};

function classify(e,c,h){
  const risk=(100-c)*.34+(100-h)*.38+(100-e)*.28;
  if(e<42) return {badge:'STOP / REFRAME', title:'Do not fund ambiguity.', copy:'The value case is not strong enough to justify protected capacity. Reframe the decision before execution creates sunk-cost pressure.', focus:'Evidence', action:'Rebuild the business case', forum:'Decision memo', trigger:'Evidence remains weak'};
  if(c<38 && e>65) return {badge:'PROTECT / SEQUENCE', title:'The bet is sound. The route is overloaded.', copy:'Protect the outcome by sequencing work, narrowing scope, or moving capacity. Do not pretend the plan is funded when the people are not.', focus:'Capacity', action:'Reallocate or sequence', forum:'Resource decision', trigger:'Critical role remains unfunded'};
  if(h<45) return {badge:'REROUTE', title:'The commitment is drifting.', copy:'Treat variance as a decision signal. Resolve ownership, dependencies, or scope before the next review becomes another status meeting.', focus:'Execution', action:'Intervene now', forum:'Big-bet review', trigger:'Leading signal degrades'};
  if(risk>44) return {badge:'WATCH / BOUND', title:'Proceed with explicit guardrails.', copy:'The initiative can continue, but it needs a tighter commitment contract, leading signals, and a dated pivot trigger.', focus:'Signal integrity', action:'Tighten the contract', forum:'MBR decision', trigger:'Variance crosses boundary'};
  return {badge:'KEEP COURSE', title:'The route is decision-ready.', copy:'The value case, capacity, and execution signals are sufficiently aligned. Keep the team moving and protect the decision forum from reporting drag.', focus:'Pace', action:'Maintain protected focus', forum:'Async pulse', trigger:'Material variance only'};
}

function updateRouter(){
  const e=+$('#evidence')?.value||0, c=+$('#capacity')?.value||0, h=+$('#health')?.value||0;
  if(!$('#decisionBadge')) return;
  $('#evidenceOut').textContent=e;
  $('#capacityOut').textContent=c;
  $('#healthOut').textContent=h;
  const d=classify(e,c,h);
  $('#decisionBadge').textContent=d.badge;
  $('#decisionTitle').textContent=d.title;
  $('#decisionCopy').textContent=d.copy;
  $('#decisionFocus').textContent=d.focus;
  $('#decisionAction').textContent=d.action;
  $('#decisionForum').textContent=d.forum;
  $('#decisionTrigger').textContent=d.trigger;
}

$$('.scenario-tab').forEach(btn=>btn.addEventListener('click',()=>{
  $$('.scenario-tab').forEach(b=>b.setAttribute('aria-selected','false'));
  btn.setAttribute('aria-selected','true');
  const s=scenarios[btn.dataset.scenario];
  $('#evidence').value=s.evidence; $('#capacity').value=s.capacity; $('#health').value=s.health;
  $('#scenarioContext').textContent=s.context;
  updateRouter();
}));
$$('input[type=range]').forEach(i=>i.addEventListener('input',updateRouter));
updateRouter();

const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
  if(entry.isIntersecting){entry.target.classList.add('in-view');observer.unobserve(entry.target)}
}),{threshold:.12});
$$('[data-reveal]').forEach(el=>observer.observe(el));
