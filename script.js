const $ = (s, r=document) => r.querySelector(s);
const $$ = (s, r=document) => [...r.querySelectorAll(s)];

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
