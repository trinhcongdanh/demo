const tabButtons = document.querySelectorAll('.tab-btn');
const tabPanels = document.querySelectorAll('.tab-panel');

const liveStatus = document.getElementById('liveStatus');
const liveSub = document.getElementById('liveSub');
const scanBtn = document.getElementById('scanBtn');
const confirmEmptyBtn = document.getElementById('confirmEmptyBtn');
const backhaulBtn = document.getElementById('backhaulBtn');
const historyBtn = document.getElementById('historyBtn');
const confirmRouteBtn = document.getElementById('confirmRouteBtn');
const scanResult = document.getElementById('scanResult');
const routeNote = document.getElementById('routeNote');
const routeDetail = document.getElementById('routeDetail');
const suggestPill = document.getElementById('suggestPill');
const routeCards = document.querySelectorAll('.route-card');
const qrMount = document.getElementById('qrMount');
const roleButtons = document.querySelectorAll('.role-btn');
const stepDots = document.querySelectorAll('.step-dot');
const stepLines = document.querySelectorAll('.step-line');
const routeContext = document.getElementById('routeContext');
const waitingList = document.getElementById('waitingList');
const vehicleTitle = document.getElementById('vehicleTitle');
const vehicleStatus = document.getElementById('vehicleStatus');
const vehicleLocation = document.getElementById('vehicleLocation');
const vehicleTrip = document.getElementById('vehicleTrip');
const vehicleCrates = document.getElementById('vehicleCrates');
const vehicleNext = document.getElementById('vehicleNext');
const vehicleEta = document.getElementById('vehicleEta');
const overviewActiveVehicle = document.getElementById('overviewActiveVehicle');
const overviewInTransit = document.getElementById('overviewInTransit');
const overviewWaiting = document.getElementById('overviewWaiting');
const overviewRecovered = document.getElementById('overviewRecovered');
const saveKm = document.getElementById('saveKm');
const saveCo2 = document.getElementById('saveCo2');
const saveCrate = document.getElementById('saveCrate');
const historyModal = document.getElementById('historyModal');
const routeModal = document.getElementById('routeModal');
const historyTimeline = document.getElementById('historyTimeline');
const closeHistoryBtn = document.getElementById('closeHistoryBtn');
const closeRouteBtn = document.getElementById('closeRouteBtn');
const proposalTitle = document.getElementById('proposalTitle');
const proposalDesc = document.getElementById('proposalDesc');
const proposalKm = document.getElementById('proposalKm');
const proposalStops = document.getElementById('proposalStops');
const proposalCrates = document.getElementById('proposalCrates');
const proposalCo2 = document.getElementById('proposalCo2');
const proposalEta = document.getElementById('proposalEta');
const proposalVehicle = document.getElementById('proposalVehicle');

let animated = false;
let qrBuilt = false;
let stepIndex = 0;
let optimizing = false;
let activeRoute = '05';
let routeOptimized = false;

// KPIs state
let currentSavedKm = 1240;
let currentSavedCo2 = 1.8;
let currentRecoveredCrates = 315;
let currentWaitingCrates = 105;

const vehicleState = {
  '05': {
    delivery: {
      status: 'Đang giao hàng',
      location: 'DC Bình Dương',
      next: 'BHX A Thủ Đức',
      eta: '42 phút',
      crates: '0/120',
      routeLine: 'DC Bình Dương → BHX A Quận 3 → BHX B Quận 10',
      routeNote: 'DC Bình Dương → BHX A Quận 3 → BHX B Quận 10',
      routeDetail: 'Xe đang chạy chiều đi để giao hàng.',
      mapTitle: 'DC Bình Dương → BHX A Quận 3 → BHX B Quận 10',
      statusTag: 'Đang giao',
      waitingLabel: 'Chờ thu hồi',
    },
    optimize: {
      status: 'Đang thu hồi',
      location: 'BHX A Thủ Đức',
      next: 'DC Bình Dương',
      eta: '35 phút',
      crates: '82/120',
      routeLine: 'BHX B Quận 10 → BHX A Thủ Đức → DC Bình Dương',
      routeNote: 'BHX B Quận 10 → BHX A Thủ Đức → DC Bình Dương',
      routeDetail: 'Xe đã ghép khay rỗng và đang quay về DC.',
      mapTitle: 'BHX B Quận 10 → BHX A Thủ Đức → DC Bình Dương',
      statusTag: 'Đang thu hồi khay',
      waitingLabel: 'Đã ghép tuyến',
    },
  },
  '12': {
    delivery: {
      status: 'Đang giao hàng',
      location: 'DC Bình Dương',
      next: 'BHX C Tân Bình',
      eta: '48 phút',
      crates: '0/80',
      routeLine: 'DC Bình Dương → BHX C Tân Bình → BHX D Phú Nhuận',
      routeNote: 'DC Bình Dương → BHX C Tân Bình → BHX D Phú Nhuận',
      routeDetail: 'Tuyến giao hàng bình thường.',
      mapTitle: 'DC Bình Dương → BHX C Tân Bình → BHX D Phú Nhuận',
      statusTag: 'Chờ thu hồi',
      waitingLabel: 'Chờ dữ liệu',
    },
    optimize: {
      status: 'Chờ thu hồi',
      location: 'BHX D Phú Nhuận',
      next: 'DC Bình Dương',
      eta: '51 phút',
      crates: '0/80',
      routeLine: 'BHX D Phú Nhuận → BHX C Tân Bình → DC Bình Dương',
      routeNote: 'BHX D Phú Nhuận → BHX C Tân Bình → DC Bình Dương',
      routeDetail: 'Sẽ chỉ quay về khi có dữ liệu thu hồi.',
      mapTitle: 'BHX D Phú Nhuận → BHX C Tân Bình → DC Bình Dương',
      statusTag: 'Chờ thu hồi',
      waitingLabel: 'Chờ thu hồi',
    },
  },
  '21': {
    delivery: {
      status: 'Hoàn tất',
      location: 'DC Bình Dương',
      next: 'Đã xong',
      eta: '0 phút',
      crates: '0/60',
      routeLine: 'DC Bình Dương → BHX E Quận 7 → BHX F Nhà Bè',
      routeNote: 'DC Bình Dương → BHX E Quận 7 → BHX F Nhà Bè',
      routeDetail: 'Chuyến xe đã hoàn tất.',
      mapTitle: 'DC Bình Dương → BHX E Quận 7 → BHX F Nhà Bè',
      statusTag: 'Hoàn tất',
      waitingLabel: 'Hoàn tất',
    },
    optimize: {
      status: 'Hoàn tất',
      location: 'DC Bình Dương',
      next: 'Đã xong',
      eta: '0 phút',
      crates: '0/60',
      routeLine: 'BHX F Nhà Bè → BHX E Quận 7 → DC Bình Dương',
      routeNote: 'BHX F Nhà Bè → BHX E Quận 7 → DC Bình Dương',
      routeDetail: 'Chuyến xe đã hoàn tất.',
      mapTitle: 'BHX F Nhà Bè → BHX E Quận 7 → DC Bình Dương',
      statusTag: 'Hoàn tất',
      waitingLabel: 'Hoàn tất',
    },
  },
};

const routeInfo = {
  '05': {
    deliveryTitle: 'DC Bình Dương → BHX A Quận 3 → BHX B Quận 10',
    optimizeTitle: 'BHX B Quận 10 → BHX A Thủ Đức → DC Bình Dương',
    deliveryDetail: 'Chiều đi: giao hàng từ DC đến các siêu thị.',
    optimizeDetail: 'Chiều về: ghé thu hồi khay rỗng theo tuyến ngược lại.',
  },
  '12': {
    deliveryTitle: 'DC Bình Dương → BHX C Tân Bình → BHX D Phú Nhuận',
    optimizeTitle: 'BHX D Phú Nhuận → BHX C Tân Bình → DC Bình Dương',
    deliveryDetail: 'Chiều đi: giao hàng từ DC đến các siêu thị.',
    optimizeDetail: 'Chiều về: thu hồi khay rỗng theo tuyến ngược lại.',
  },
  '21': {
    deliveryTitle: 'DC Bình Dương → BHX E Quận 7 → BHX F Nhà Bè',
    optimizeTitle: 'BHX F Nhà Bè → BHX E Quận 7 → DC Bình Dương',
    deliveryDetail: 'Chiều đi: giao hàng từ DC đến các siêu thị.',
    optimizeDetail: 'Chiều về: thu hồi khay rỗng theo tuyến ngược lại.',
  },
};

const stepOrder = ['dc_send', 'driver_send', 'store', 'store_empty', 'driver_return', 'dc_receive'];

const roleState = {
  dc_send: {
    label: 'Tại DC',
    title: 'Khay #001',
    desc: 'Đã chuẩn bị giao.',
    live: 'Tại DC - đã chuẩn bị giao',
    sub: 'DC Bình Dương',
    qrText: 'BHX|crate=001|role=dc_send|status=ready|location=dc',
    history: 'Đã chuẩn bị giao',
    place: 'DC Bình Dương',
    actor: 'Nhân viên kho',
    historyTime: '08:00'
  },
  driver_send: {
    label: 'Tài xế',
    title: 'Khay #001',
    desc: 'Đang giao.',
    live: 'Đang giao',
    sub: 'Xe 05',
    qrText: 'BHX|crate=001|role=driver_send|status=in_transit|location=truck_05',
    history: 'Đã nhận khay',
    place: 'Xe 05',
    actor: 'Tài xế xe 05',
    historyTime: '08:15'
  },
  store: {
    label: 'Siêu thị',
    title: 'Khay #001',
    desc: 'Đã giao đến BHX.',
    live: 'Đã giao đến BHX',
    sub: 'BHX A Thủ Đức',
    qrText: 'BHX|crate=001|role=store|status=delivered|location=bhx_a',
    history: 'Đã giao hàng',
    place: 'BHX A Thủ Đức',
    actor: 'Nhân viên BHX',
    historyTime: '09:05'
  },
  store_empty: {
    label: 'Siêu thị',
    title: 'Khay #001',
    desc: 'Sẵn sàng thu hồi.',
    live: 'Sẵn sàng thu hồi',
    sub: 'BHX A Thủ Đức',
    qrText: 'BHX|crate=001|role=store_empty|status=empty_return|location=bhx_a',
    history: 'Khay rỗng',
    place: 'BHX A Thủ Đức',
    actor: 'Nhân viên BHX',
    historyTime: '10:20'
  },
  driver_return: {
    label: 'Thu hồi',
    title: 'Khay #001',
    desc: 'Đang thu hồi.',
    live: 'Đang thu hồi',
    sub: 'Xe 05',
    qrText: 'BHX|crate=001|role=driver_return|status=returning|location=truck_05',
    history: 'Đang thu hồi',
    place: 'Xe 05',
    actor: 'Tài xế xe 05',
    historyTime: '10:35'
  },
  dc_receive: {
    label: 'Tại DC',
    title: 'Khay #001',
    desc: 'Đã hoàn tất vòng đời.',
    live: 'Đã về DC',
    sub: 'DC Bình Dương',
    qrText: 'BHX|crate=001|role=dc_receive|status=returned|location=dc',
    history: 'Đã về kho',
    place: 'DC Bình Dương',
    actor: 'Nhân viên kho',
    historyTime: '11:15'
  },
};

let waitingData = [
  { bhx: 'BHX B Quận 10', crates: 50, status: 'Chờ thu hồi' },
  { bhx: 'BHX A Thủ Đức', crates: 0, status: 'Chờ thu hồi' },
  { bhx: 'BHX C Tân Bình', crates: 20, status: 'Chờ thu hồi' },
];

function switchTab(target) {
  tabButtons.forEach((btn) => btn.classList.toggle('active', btn.dataset.tab === target));
  tabPanels.forEach((panel) => panel.classList.toggle('active', panel.id === target));
}

tabButtons.forEach((btn) => btn.addEventListener('click', () => switchTab(btn.dataset.tab)));

function animateNumber(el, end, duration = 900, decimals = 0) {
  if (!el) return;
  const start = parseFloat(el.textContent.replace(/,/g, '')) || 0;
  const startTime = performance.now();
  function tick(now) {
    const progress = Math.min((now - startTime) / duration, 1);
    const value = start + (end - start) * (1 - Math.pow(1 - progress, 3));
    if (decimals === 0) {
        el.textContent = Math.round(value).toLocaleString('en-US');
    } else {
        el.textContent = value.toFixed(decimals);
    }
    if (progress < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

function runBaseMetrics() {
  if (animated) return;
  animated = true;
  animateNumber(document.getElementById('statKm'), currentSavedKm, 1200, 0);
  animateNumber(document.getElementById('statCo2'), currentSavedCo2, 1200, 1);
}

window.addEventListener('load', runBaseMetrics);
window.addEventListener('load', () => document.body.classList.add('is-ready'));

function buildQrCode() {
  if (qrBuilt || typeof QRCode === 'undefined' || !qrMount) return;
  qrMount.innerHTML = '';
  new QRCode(qrMount, {
    text: roleState[stepOrder[stepIndex]].qrText,
    width: 112,
    height: 112,
    colorDark: '#0a1830',
    colorLight: '#eef6ff',
    correctLevel: QRCode.CorrectLevel.M,
  });
  qrBuilt = true;
}

window.addEventListener('load', buildQrCode);

function refreshQrCode() {
  if (!qrMount || typeof QRCode === 'undefined') return;
  qrMount.innerHTML = '';
  new QRCode(qrMount, {
    text: roleState[stepOrder[stepIndex]].qrText,
    width: 112,
    height: 112,
    colorDark: '#0a1830',
    colorLight: '#eef6ff',
    correctLevel: QRCode.CorrectLevel.M,
  });
}

function syncRoleButtons() {
  roleButtons.forEach((btn, index) => {
    let roleIndex = index;
    if (index === 3) roleIndex = 4;
    if (index === 4) roleIndex = 5;
    
    let isActive = false;
    if (stepIndex === roleIndex) isActive = true;
    if (stepIndex === 3 && index === 2) isActive = true; // both store and store_empty map to "Siêu thị"
    
    btn.classList.toggle('active', isActive);
    btn.disabled = roleIndex > stepIndex && (roleIndex !== 4 || stepIndex < 3);
  });
  
  stepDots.forEach((dot, index) => {
    dot.classList.toggle('active', index === stepIndex);
    dot.classList.toggle('done', index < stepIndex);
  });
  stepLines.forEach((line, index) => line.classList.toggle('done', index < stepIndex));
}

function renderHistory() {
  if (!historyTimeline) return;
  const currentHistory = [];
  for (let i = 0; i <= stepIndex; i++) {
     const state = roleState[stepOrder[i]];
     currentHistory.push({ time: state.historyTime, place: state.place, status: state.history, actor: state.actor });
  }
  historyTimeline.innerHTML = currentHistory.reverse().map((item, idx) => `
    <div class="timeline-item">
      <div class="timeline-badge">${currentHistory.length - idx}</div>
      <div>
        <strong>${item.place}</strong>
        <p>${item.status}</p>
        <small>${item.time} • ${item.actor}</small>
      </div>
    </div>
  `).join('');
}

function openModal(modal) {
  if (!modal) return;
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
}

function closeModal(modal) {
  if (!modal) return;
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
}

function updateWaitingList() {
  if (!waitingList) return;
  waitingList.innerHTML = waitingData.map((row) => `
    <div class="waiting-row">
      <span>${row.bhx}</span>
      <strong>${row.crates}</strong>
      <span>${row.status}</span>
    </div>
  `).join('');
}

function applyVehicleState(routeId, phase) {
  const state = vehicleState[routeId][phase];
  const info = routeInfo[routeId];
  liveStatus.textContent = state.status;
  liveSub.textContent = `Khay #001 • ${state.location}`;
  vehicleTitle.textContent = `Xe ${routeId}`;
  vehicleStatus.textContent = state.status;
  vehicleLocation.textContent = state.location;
  vehicleTrip.textContent = `#${routeId}`;
  vehicleCrates.textContent = state.crates;
  vehicleNext.textContent = state.next;
  vehicleEta.textContent = state.eta;
  overviewActiveVehicle.textContent = routeId;
  overviewInTransit.textContent = phase === 'optimize' ? '388' : '420';
  overviewWaiting.textContent = currentWaitingCrates;
  overviewRecovered.textContent = currentRecoveredCrates;
  routeNote.textContent = state.routeNote;
  routeDetail.textContent = state.routeDetail;
  if (info) {
    routeDetail.textContent = phase === 'optimize' ? info.optimizeDetail : info.deliveryDetail;
  }
  routeContext.textContent = `Ngữ cảnh: Xe ${routeId}`;
  suggestPill.textContent = phase === 'optimize' ? 'Đã ghép tuyến' : 'Sẵn sàng';
  proposalTitle.textContent = state.mapTitle;
  proposalDesc.textContent = phase === 'optimize'
    ? 'Xe đã ghép dữ liệu khay rỗng từ QR và tối ưu chiều về.'
    : 'Tuyến hiện tại đang chạy chiều đi.';
  proposalKm.textContent = '8.4 km';
  proposalStops.textContent = '2';
  proposalCrates.textContent = '120';
  proposalCo2.textContent = '1.8 kg';
  proposalEta.textContent = state.eta;
  proposalVehicle.textContent = `Xe ${routeId}`;
}

function setActiveRoute(routeId, phase = 'delivery') {
  activeRoute = routeId;
  routeOptimized = phase === 'optimize';
  routeCards.forEach((card) => {
    const isActive = card.dataset.route === routeId;
    card.classList.toggle('active', isActive);
    card.classList.toggle('dimmed', !isActive);
    card.classList.toggle('selected-flash', isActive);
    const statusEl = card.querySelector('.route-status');
    const routeLabel = card.querySelector('p');
    if (!statusEl || !routeLabel) return;
    if (card.dataset.route === routeId) {
      if (routeId === '05' && phase === 'optimize') {
        statusEl.textContent = 'Đang thu hồi khay';
        routeLabel.textContent = vehicleState[routeId].optimize.routeLine;
      } else if (routeId === '05') {
        statusEl.textContent = 'Đang giao';
        routeLabel.textContent = vehicleState[routeId].delivery.routeLine;
      } else {
        statusEl.textContent = vehicleState[routeId][phase].statusTag;
        routeLabel.textContent = vehicleState[routeId][phase].routeLine;
      }
    }
  });
  applyVehicleState(routeId, phase);
  setTimeout(() => routeCards.forEach((card) => card.classList.remove('selected-flash')), 900);
}

function syncScanResult(role) {
  const current = roleState[role];
  scanResult.innerHTML = `
    <span class="result-chip">${current.label}</span>
    <strong>${current.title}</strong>
    <p>${current.desc}</p>
  `;
  liveStatus.textContent = current.live;
  liveSub.textContent = current.sub;
  
  if (confirmEmptyBtn) {
    confirmEmptyBtn.style.display = role === 'store' ? 'inline-flex' : 'none';
  }
  
  if (scanBtn) {
    scanBtn.style.display = role === 'store' || role === 'dc_receive' ? 'none' : 'inline-flex';
    if (role === 'store_empty') scanBtn.style.display = 'inline-flex';
  }
}

function advanceStep() {
  if (stepIndex < stepOrder.length - 1) {
    stepIndex++;
    
    if (stepOrder[stepIndex] === 'dc_receive') {
      currentRecoveredCrates += 1;
      currentSavedKm += 8.4;
      currentSavedCo2 += 1.8;
      animateNumber(document.getElementById('statKm'), currentSavedKm, 900, 0);
      animateNumber(document.getElementById('statCo2'), currentSavedCo2, 900, 1);
      overviewRecovered.textContent = currentRecoveredCrates;
      
      vehicleState['05'].optimize.crates = '83/120';
      applyVehicleState('05', 'optimize');
    }
    
    refreshQrCode();
    syncRoleButtons();
    syncScanResult(stepOrder[stepIndex]);
  }
}

scanBtn.addEventListener('click', () => {
  const current = roleState[stepOrder[stepIndex]];
  syncScanResult(stepOrder[stepIndex]);
  scanResult.classList.remove('pulse');
  void scanResult.offsetWidth;
  scanResult.classList.add('pulse');
  setTimeout(() => scanResult.classList.remove('pulse'), 450);

  advanceStep();
});

confirmEmptyBtn?.addEventListener('click', () => {
  const waiting = waitingData.find((item) => item.bhx === 'BHX A Thủ Đức');
  if (waiting) waiting.crates = 1;
  currentWaitingCrates += 1;
  overviewWaiting.textContent = currentWaitingCrates;
  
  advanceStep();
  
  updateWaitingList();
  routeDetail.textContent = 'BHX A có 1 khay rỗng cần thu hồi. Dữ liệu đã truyền sang TMS.';
});

historyBtn?.addEventListener('click', () => {
  renderHistory();
  openModal(historyModal);
});

closeHistoryBtn?.addEventListener('click', () => closeModal(historyModal));
closeRouteBtn?.addEventListener('click', () => closeModal(routeModal));
historyModal?.addEventListener('click', (event) => {
  if (event.target === historyModal) closeModal(historyModal);
});
routeModal?.addEventListener('click', (event) => {
  if (event.target === routeModal) closeModal(routeModal);
});

confirmRouteBtn?.addEventListener('click', () => {
  closeModal(routeModal);
  routeDetail.textContent = 'Tuyến chiều về đã được xác nhận. Xe sẽ thực hiện thu hồi khay.';
});

backhaulBtn.addEventListener('click', () => {
  if (optimizing) return;
  optimizing = true;
  backhaulBtn.disabled = true;
  backhaulBtn.classList.add('loading');
  backhaulBtn.querySelector('.btn-label').textContent = 'Đang tối ưu...';
  suggestPill.textContent = 'Loading';

  setTimeout(() => {
    setActiveRoute(activeRoute || '05', 'optimize');
    updateWaitingList();
    openModal(routeModal);
    animateNumber(saveKm, 8.4, 900, 1);
    animateNumber(saveCo2, 1.8, 900, 1);
    animateNumber(saveCrate, 120, 900, 0);
    backhaulBtn.disabled = false;
    backhaulBtn.classList.remove('loading');
    backhaulBtn.querySelector('.btn-label').textContent = 'Tối ưu chiều về';
    optimizing = false;
  }, 1600);
});

setActiveRoute('05', 'delivery');
syncRoleButtons();
updateWaitingList();
syncScanResult('dc_send');
