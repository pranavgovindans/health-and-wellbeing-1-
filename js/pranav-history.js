(() => {
  const byId = id => document.getElementById(id);
  const read = (key, fallback) => { try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch (_) { return fallback; } };
  const number = key => Number(localStorage.getItem(key) || 0);
  const setText = (id, value) => { const node = byId(id); if (node) node.textContent = value; };
  const setBar = (id, value) => { const node = byId(id); if (node) node.style.width = `${Math.max(0, Math.min(100, value))}%`; };
  const profile = read('vitawellProfile', read('vwProfile', {})), settings = read('vwSettings', { goal: 6000 });
  const steps = number('vwSteps'), water = number('vwWater'), survey = read('vwSurvey', {}), goal = Number(settings.goal || 6000);
  const movement = Math.round(Math.min(100, steps / goal * 100)), hydration = Math.round(Math.min(100, water / 8 * 100)), checkin = survey.mood ? 100 : 0;
  const score = Math.round(movement * .45 + hydration * .35 + checkin * .20);
  const name = (profile.fullName || profile.name || 'Pranav').trim().split(' ')[0] || 'Pranav';
  setText('historyName', name); setText('historyScore', score); setText('historySteps', steps.toLocaleString()); setText('historyGoal', `Goal: ${goal.toLocaleString()} steps`);
  setText('historyWater', water); setText('historyMood', survey.mood || '—'); setText('historyEnergy', survey.energy ? `Energy: ${survey.energy}` : 'No check-in saved');
  setText('movementValue', `${movement}%`); setBar('movementBar', movement); setText('hydrationValue', `${hydration}%`); setBar('hydrationBar', hydration); setText('checkinValue', `${checkin}%`); setBar('checkinBar', checkin);
  const activities = [
    { label: 'Movement', value: `${steps.toLocaleString()} steps logged`, done: steps > 0 },
    { label: 'Hydration', value: `${water} of 8 glasses`, done: water > 0 },
    { label: 'Wellness check-in', value: survey.mood ? `${survey.mood} mood recorded` : 'Not completed yet', done: Boolean(survey.mood) },
    { label: 'Health profile', value: profile.fullName || profile.name ? 'Profile details saved' : 'Add details in Profile', done: Boolean(profile.fullName || profile.name) }
  ];
  byId('historyList').innerHTML = activities.map(item => `<div><span>${item.label}</span><b class="${item.done ? 'complete' : ''}">${item.done ? 'Recorded' : 'To do'}</b><small>${item.value}</small></div>`).join('');
  if (score >= 80) { setText('historyMessage', 'You are building a well-balanced day. Keep up the steady habits.'); setText('historyTipTitle', 'Keep your momentum'); setText('historyTip', 'A short stretch or calm breathing break can help you finish the day well.'); }
  else if (water < 8) { setText('historyMessage', 'Your record is growing. Hydration is the easiest next improvement.'); setText('historyTipTitle', 'Have a glass of water'); setText('historyTip', `You are ${Math.max(0, 8 - water)} glasses from today’s hydration goal.`); }
  else if (steps < goal) { setText('historyMessage', 'You have started well. A little more movement will raise today’s score.'); setText('historyTipTitle', 'Add a short walk'); setText('historyTip', `${Math.max(0, goal - steps).toLocaleString()} more steps will complete your movement goal.`); }
})();
