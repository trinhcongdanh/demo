const tabButtons = document.querySelectorAll('.tab-btn');
const tabPanels = document.querySelectorAll('.tab-panel');

const liveStatus = document.getElementById('liveStatus');
const liveSub = document.getElementById('liveSub');
const scanBtn = document.getElementById('scanBtn');
const backhaulBtn = document.getElementById('backhaulBtn');
const scanResult = document.getElementById('scanResult');
const routeNote = document.getElementById('routeNote');
const routeDetail = document.getElementById('routeDetail');
const suggestPill = document.getElementById('suggestPill');
const routeCards = document.querySelectorAll('.route-card');
const qrMount = document.getElementById('qrMount');
const roleButtons = document.querySelectorAll('.role-btn');
const stepDots = document.querySelectorAll('.step-dot');
const stepLines = document.querySelectorAll('.step-line');

const saveKm = document.getElementById('saveKm');
const saveCo2 = document.getElementById('saveCo2');
const saveCrate = document.getElementById('saveCrate');
const statKm = document.getElementById('statKm');
const statCo2 = document.getElementById('statCo2');
const routeContext = document.getElementById('routeContext');

let animated = false;
let qrBuilt = false;
let activeRole = 'dc';
let stepIndex = 0;
let optimizing = false;
let activeRoute = '05';

const routeInfo = {
  '05': {
    deliveryTitle: 'DC Bình Dương → BHX A Quận 3 → BHX B Quận 10',
    deliveryDetail: 'Chiều đi: giao hàng từ DC đến các siêu thị.',
    optimizeTitle: 'BHX B Quận 10 → BHX A Thủ Đức → DC Bình Dương',
    optimizeDetail: 'Chiều về: thu hồi khay rỗng theo tuyến ngược lại.',
  },
  '12': {
    deliveryTitle: 'DC Bình Dương → BHX C Tân Bình → BHX D Phú Nhuận',
    deliveryDetail: 'Chiều đi: giao hàng từ DC đến các siêu thị.',
    optimizeTitle: 'BHX D Phú Nhuận → BHX C Tân Bình → DC Bình Dương',
    optimizeDetail: 'Chiều về: thu hồi khay rỗng theo tuyến ngược lại.',
  },
  '21': {
    deliveryTitle: 'DC Bình Dương → BHX E Quận 7 → BHX F Nhà Bè',
    deliveryDetail: 'Chiều đi: giao hàng từ DC đến các siêu thị.',
    optimizeTitle: 'BHX F Nhà Bè → BHX E Quận 7 → DC Bình Dương',
    optimizeDetail: 'Chiều về: thu hồi khay rỗng theo tuyến ngược lại.',
  },
};

const stepOrder = ['dc', 'driver', 'store', 'return'];

const roleState = {
  dc: {
    label: 'Tại DC',
    title: 'Khay #001',
    desc: 'Đang chứa hàng.',
    live: 'Tại DC - đang chứa hàng',
    sub: 'DC',
    qrText: 'BHX|crate=001|role=dc|status=loaded|location=dc',
  },
  driver: {
    label: 'Trên xe',
    title: 'Khay #001',
    desc: 'Đang vận chuyển đến BHX A.',
    live: 'Đang vận chuyển đến BHX A',
    sub: 'Xe 05',
    qrText: 'BHX|crate=001|role=driver|status=in_transit|location=truck_05',
  },
  store: {
    label: 'Đã giao',
    title: 'Khay #001',
    desc: 'Đã giao - BHX A.',
    live: 'Đã giao - BHX A',
    sub: 'BHX A',
    qrText: 'BHX|crate=001|role=store|status=delivered|location=bhx_a',
  },
  return: {
    label: 'Vỏ rỗng',
    title: 'Khay #001',
    desc: 'Vỏ rỗng - chờ thu hồi.',
    live: 'Vỏ rỗng - chờ thu hồi',
    sub: 'Chờ lấy lại',
    qrText: 'BHX|crate=001|role=return|status=empty_return|location=bhx_a',
  },
};

function switchTab(target) {
  tabButtons.forEach(btn => btn.classList.toggle('active', btn.dataset.tab === target));
  tabPanels.forEach(panel => panel.classList.toggle('active', panel.id === target));
}

tabButtons.forEach(btn => {
  btn.addEventListener('click', () => switchTab(btn.dataset.tab));
});

function animateNumber(el, end, duration = 900, decimals = 0) {
  const start = 0;
  const startTime = performance.now();
  function tick(now) {
    const progress = Math.min((now - startTime) / duration, 1);
    const value = start + (end - start) * (1 - Math.pow(1 - progress, 3));
    el.textContent = value.toFixed(decimals);
    if (progress < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

function runBaseMetrics() {
  if (animated) return;
  animated = true;
  animateNumber(statKm, 1240, 1200, 0);
  animateNumber(statCo2, 1.8, 1200, 1);
}

window.addEventListener('load', runBaseMetrics);
window.addEventListener('load', () => {
  document.body.classList.add('is-ready');
});

function buildQrCode() {
  if (qrBuilt || typeof QRCode === 'undefined' || !qrMount) return;
  qrMount.innerHTML = '';
  new QRCode(qrMount, {
    text: roleState[activeRole].qrText,
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
    text: roleState[activeRole].qrText,
    width: 112,
    height: 112,
    colorDark: '#0a1830',
    colorLight: '#eef6ff',
    correctLevel: QRCode.CorrectLevel.M,
  });
}

function syncRoleButtons() {
  roleButtons.forEach((btn) => {
    const role = btn.dataset.role;
    const index = stepOrder.indexOf(role);
    const isActive = role === activeRole;
    btn.classList.toggle('active', isActive);
    btn.disabled = index > stepIndex;
  });
  stepDots.forEach((dot, index) => {
    dot.classList.toggle('active', index === stepIndex);
    dot.classList.toggle('done', index < stepIndex);
  });
  stepLines.forEach((line, index) => {
    line.classList.toggle('done', index < stepIndex);
  });
}

function setActiveRoute(routeId, phase = 'delivery') {
  activeRoute = routeId;
  routeCards.forEach((card) => {
    const isActive = card.dataset.route === routeId;
    card.classList.toggle('active', isActive);
    card.classList.toggle('dimmed', !isActive);
    card.classList.toggle('selected-flash', isActive);
    const titleEl = card.querySelector('h3');
    const routeMetaEl = card.querySelector('.route-meta');
    const statusEl = card.querySelector('.route-status');
    if (statusEl) {
      if (card.dataset.route === '05') {
        if (isActive && phase === 'optimize') statusEl.textContent = 'Đang thu hồi khay';
        else statusEl.textContent = 'Đang giao';
        if (titleEl && routeMetaEl) {
          if (phase === 'optimize' && isActive) {
            card.querySelector('p').textContent = 'BHX B Quận 10 → BHX A Thủ Đức → DC Bình Dương';
            routeMetaEl.textContent = '8.4 km | 3 điểm dừng';
          } else if (isActive) {
            card.querySelector('p').textContent = 'DC Bình Dương → BHX A Quận 3 → BHX B Quận 10';
            routeMetaEl.textContent = '8.4 km | 3 điểm dừng';
          }
        }
      }
      if (card.dataset.route === '12') statusEl.textContent = isActive ? 'Đã chọn' : 'Chờ thu hồi';
      if (card.dataset.route === '21') statusEl.textContent = 'Hoàn tất';
    }
    if (isActive) {
      setTimeout(() => card.classList.remove('selected-flash'), 900);
    }
  });
  routeContext.textContent = `Ngữ cảnh: Xe ${routeId}`;
  const info = routeInfo[routeId];
  if (info) {
    routeNote.textContent = phase === 'optimize' ? info.optimizeTitle : info.deliveryTitle;
    routeDetail.textContent = phase === 'optimize'
      ? 'Thu hồi từ điểm cuối quay về DC.'
      : info.deliveryDetail;
  }
}

roleButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    if (btn.disabled) return;
    activeRole = btn.dataset.role;
    refreshQrCode();
    syncRoleButtons();
    const current = roleState[activeRole];
    document.querySelector('#scanResult .result-chip').textContent = current.label;
    document.querySelector('#scanResult strong').textContent = current.title;
    document.querySelector('#scanResult p').textContent = current.desc;
    liveStatus.textContent = current.live;
    liveSub.textContent = current.sub;
  });
});

scanBtn.addEventListener('click', () => {
  const current = roleState[activeRole];
  liveStatus.textContent = current.live;
  liveSub.textContent = current.sub;
  scanResult.innerHTML = `
    <span class="result-chip">${current.label}</span>
    <strong>${current.title}</strong>
    <p>${current.desc}</p>
  `;
  scanResult.classList.remove('pulse');
  void scanResult.offsetWidth;
  scanResult.classList.add('pulse');
  setTimeout(() => scanResult.classList.remove('pulse'), 450);
  suggestPill.textContent = 'Đã đồng bộ';

  const currentIndex = stepOrder.indexOf(activeRole);
  if (currentIndex < stepOrder.length - 1) {
    stepIndex = currentIndex + 1;
    activeRole = stepOrder[stepIndex];
    refreshQrCode();
    syncRoleButtons();
    const next = roleState[activeRole];
    document.querySelector('#scanResult .result-chip').textContent = next.label;
    document.querySelector('#scanResult strong').textContent = next.title;
    document.querySelector('#scanResult p').textContent = next.desc;
    liveStatus.textContent = next.live;
    liveSub.textContent = next.sub;
    refreshQrCode();
  } else {
    stepIndex = stepOrder.length - 1;
    syncRoleButtons();
  }
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
    liveStatus.textContent = 'Xe 05 đang thu hồi khay';
    liveSub.textContent = 'Đang ghép điểm thu hồi';
    suggestPill.textContent = 'Đã chọn chuyến';
    animateNumber(saveKm, 1240, 900, 0);
    animateNumber(saveCo2, 1.8, 900, 1);
    animateNumber(saveCrate, 14000, 900, 0);
    backhaulBtn.disabled = false;
    backhaulBtn.classList.remove('loading');
    backhaulBtn.querySelector('.btn-label').textContent = 'Tối ưu chiều về';
    optimizing = false;
  }, 1800);
});

setActiveRoute('05', 'delivery');
syncRoleButtons();
