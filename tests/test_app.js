const { chromium } = require('playwright');
const path = require('path');

const FILE = 'file://' + path.resolve('/home/user/M/index.html');

// Datos de prueba realistas: eventos pasados/cerrados, asistentes variados, productos
const seed = {
  events: [
    { id: 'e1', name: 'Análisis Capilar Enero', date: '2025-01-15', time: '10:00', description: 'Q1',
      closed: true, attendees: [
        { name: 'Ana Lopez', phone: '600111222', appointmentTime: '10:00', attended: true, purchased: true,
          products: [{ name: 'Champú Anticaída', qty: 2, discount: 10 }], notes: 'Cliente fiel' },
        { name: 'Beto Ruiz', phone: '600333444', appointmentTime: '10:30', attended: true, purchased: false, products: [], notes: '' },
        { name: 'Carla Diaz', phone: '600555666', appointmentTime: '11:00', attended: false, purchased: false, products: [], notes: '' }
      ]},
    { id: 'e2', name: 'Análisis Capilar Abril', date: '2025-04-15', time: '10:00', description: 'Q2',
      closed: true, attendees: [
        { name: 'Ana Lopez', phone: '600111222', appointmentTime: '10:00', attended: true, purchased: true,
          products: [{ name: 'Sérum Reparador', qty: 1, discount: 33 }], notes: '' },
        { name: 'Carla Diaz', phone: '600555666', appointmentTime: '10:30', attended: false, purchased: false, products: [], notes: '' }
      ]},
    { id: 'e3', name: 'Análisis Capilar Agosto', date: '2026-08-20', time: '09:30', description: 'Q3 activo',
      closed: false, attendees: [
        { name: 'Ana Lopez', phone: '600111222', appointmentTime: '09:30', attended: true, purchased: true,
          products: [{ name: 'Champú Anticaída', qty: 1, discount: 0 }], notes: '' },
        { name: 'Beto Ruiz', phone: '600333444', appointmentTime: '10:00', attended: true, purchased: false, products: [], notes: '' },
        { name: 'Diana Sanz', phone: '600777888', appointmentTime: '10:30', attended: null, purchased: false, products: [], notes: '' }
      ]}
  ],
  products: [
    { name: 'Champú Anticaída', cn: '123456', price: '19.90' },
    { name: 'Sérum Reparador', cn: '654321', price: '34.50' },
    { name: 'Mascarilla Hidratante', cn: '999888', price: '12.00' }
  ],
  contacts: []
};

const TABS = ['events', 'attendance', 'stats', 'products', 'phones', 'historial'];

(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage();
  const errors = [];
  page.on('console', m => { if (m.type() === 'error') errors.push('[console] ' + m.text()); });
  page.on('pageerror', e => errors.push('[pageerror] ' + e.message));

  // Sembrar datos ANTES de que cargue el script de la app.
  // Solo si no hay nada guardado, para que un reload NO pise los cambios y
  // podamos comprobar de verdad que los datos persisten.
  await page.addInitScript(data => {
    if (!localStorage.getItem('hairEventData')) {
      localStorage.setItem('hairEventData', JSON.stringify(data));
    }
  }, seed);

  await page.goto(FILE, { waitUntil: 'load' });
  await page.waitForTimeout(400);

  const results = [];
  const ok = (n, c, d = '') => results.push({ n, c, d });

  // --- 1. Persistencia de datos ---
  const stored = await page.evaluate(() => {
    const d = JSON.parse(localStorage.getItem('hairEventData') || '{}');
    return { ev: (d.events || []).length, pr: (d.products || []).length };
  });
  ok('Datos persisten en localStorage', stored.ev === 3 && stored.pr === 3,
     `${stored.ev} eventos, ${stored.pr} productos`);

  // --- 2. Recorrer TODAS las pestañas ---
  for (const tab of TABS) {
    await page.click(`.nav-item[data-section="${tab}"]`);
    await page.waitForTimeout(250);
    const st = await page.evaluate(t => {
      const sec = document.getElementById('section-' + t);
      return { visible: sec && sec.classList.contains('active'),
               title: document.getElementById('page-title').textContent,
               len: sec ? sec.innerText.trim().length : 0 };
    }, tab);
    ok(`Pestaña "${tab}" abre y renderiza`, st.visible && st.len > 40,
       `título="${st.title}" contenido=${st.len} chars`);
  }

  // --- 3. Eventos: activos fuera, cerrados en carpeta ---
  await page.click('.nav-item[data-section="events"]');
  await page.waitForTimeout(250);
  const evState = await page.evaluate(() => ({
    activos: document.querySelectorAll('#events-list .event-list-card').length,
    cerrados: document.querySelectorAll('#closed-events-list .event-list-card').length,
    carpetaVisible: document.getElementById('closed-events-folder').style.display !== 'none',
    contador: document.getElementById('closed-folder-count').textContent,
    listaPlegada: document.getElementById('closed-events-list').style.display === 'none'
  }));
  ok('Solo eventos activos en pantalla principal', evState.activos === 1, `${evState.activos} activo(s)`);
  ok('Eventos finalizados en carpeta', evState.cerrados === 2 && evState.carpetaVisible,
     `${evState.cerrados} en carpeta, contador="${evState.contador}"`);
  ok('Carpeta arranca plegada', evState.listaPlegada);

  await page.click('#closed-folder-toggle');
  await page.waitForTimeout(200);
  const desplegada = await page.evaluate(() =>
    document.getElementById('closed-events-list').style.display === 'block');
  ok('Carpeta se despliega al hacer clic', desplegada);

  // --- 4. Reabrir evento -> vuelve a la lista principal ---
  page.once('dialog', d => d.accept());
  await page.evaluate(() => reopenEvent('e1'));
  await page.waitForTimeout(300);
  const trasReabrir = await page.evaluate(() => ({
    activos: document.querySelectorAll('#events-list .event-list-card').length,
    cerrados: document.querySelectorAll('#closed-events-list .event-list-card').length
  }));
  ok('Reabrir devuelve el evento a la pantalla', trasReabrir.activos === 2 && trasReabrir.cerrados === 1,
     `${trasReabrir.activos} activos / ${trasReabrir.cerrados} cerrados`);
  // restaurar
  page.once('dialog', d => d.accept());
  await page.evaluate(() => closeEvent('e1'));
  await page.waitForTimeout(250);

  // --- 5. Productos: editar precio y propagación ---
  // Ingresos ANTES de tocar el precio (Champú a 19,90 €)
  const ingresosAntes = await page.evaluate(() => {
    document.querySelector('.nav-item[data-section="stats"]').click();
    const m = document.getElementById('global-stats').innerText.match(/€\s*([\d.,]+)/);
    return m ? parseFloat(m[1].replace(',', '.')) : null;
  });

  await page.click('.nav-item[data-section="products"]');
  await page.waitForTimeout(250);
  await page.click('#price-display-0');
  await page.waitForTimeout(150);
  const editorAbierto = await page.evaluate(() =>
    document.getElementById('price-edit-0').style.display === 'flex');
  ok('Editor de precio se abre al clicar', editorAbierto);

  await page.fill('#price-input-0', '25.00');
  await page.evaluate(() => saveProductPrice(0));
  await page.waitForTimeout(300);
  const precioGuardado = await page.evaluate(() => {
    const d = JSON.parse(localStorage.getItem('hairEventData'));
    return { enMemoria: appData.products[0].price,
             enDisco: d.products[0].price,
             enTabla: document.getElementById('price-display-0').innerText.trim() };
  });
  ok('Precio se guarda y persiste', Number(precioGuardado.enDisco) === 25 && Number(precioGuardado.enMemoria) === 25,
     `disco=${precioGuardado.enDisco} tabla="${precioGuardado.enTabla}"`);

  // Propagación: Ana compró 1 ud de Champú (dto 0%) en el evento activo e3 -> debe valer 25.00 €
  await page.evaluate(() => { document.getElementById('select-event-attendance').value = 'e3'; refreshAttendance(); });
  await page.waitForTimeout(300);
  const propagado = await page.evaluate(() => document.getElementById('section-attendance').innerText);
  ok('Precio nuevo se propaga a Asistencia', propagado.includes('25.00'),
     propagado.includes('25.00') ? 'aparece 25.00 €' : 'NO aparece 25.00 €');

  await page.click('.nav-item[data-section="stats"]');
  await page.waitForTimeout(350);
  // Champú vendido: 2 uds@10%dto (ev1) + 1 ud@0% (ev3) = 2.8 uds efectivas.
  // Subir 19,90 -> 25,00 (+5,10) debe subir los ingresos en 2.8*5.10 = 14,28 €
  const ingresosDespues = await page.evaluate(() => {
    const m = document.getElementById('global-stats').innerText.match(/€\s*([\d.,]+)/);
    return m ? parseFloat(m[1].replace(',', '.')) : null;
  });
  const delta = ingresosDespues - ingresosAntes;
  ok('Estadísticas recalculan con el precio nuevo', Math.abs(delta - 14.28) <= 1,
     `ingresos €${ingresosAntes} → €${ingresosDespues} (esperado +14,28; real +${delta.toFixed(2)})`);

  // --- 6. Descuento personalizado ---
  await page.evaluate(() => openProductsModal('e3', 0));
  await page.waitForTimeout(300);
  const modalAbierto = await page.evaluate(() =>
    document.getElementById('modal-products').classList.contains('active'));
  ok('Modal de productos abre', modalAbierto);

  await page.evaluate(() => setCustomDiscount(0, 37));
  await page.waitForTimeout(250);
  const dtoLibre = await page.evaluate(() => ({
    valor: modalProductLines[0].discount,
    input: document.getElementById('custom-disc-0')?.value,
    total: document.getElementById('modal-total-amount').textContent
  }));
  // 25.00 * 1 ud con 37% dto = 15.75
  ok('Descuento personalizado (37%) se aplica', dtoLibre.valor === 37 && dtoLibre.total.includes('15.75'),
     `dto=${dtoLibre.valor}% input="${dtoLibre.input}" total=${dtoLibre.total}`);

  await page.evaluate(() => setLineDiscount(0, 10));
  await page.waitForTimeout(200);
  const dtoPreset = await page.evaluate(() => ({
    valor: modalProductLines[0].discount,
    input: document.getElementById('custom-disc-0')?.value
  }));
  ok('Botones preset siguen funcionando', dtoPreset.valor === 10 && dtoPreset.input === '',
     `dto=${dtoPreset.valor}%, campo libre vacío=${dtoPreset.input === ''}`);
  await page.evaluate(() => document.getElementById('modal-products').classList.remove('active'));

  // --- 7. Historial: conteo, segmentos y prioridad ---
  await page.click('.nav-item[data-section="historial"]');
  await page.waitForTimeout(350);
  const hist = await page.evaluate(() => {
    const filas = [...document.querySelectorAll('#historial-table-body tr')].map(tr => {
      const c = [...tr.querySelectorAll('td')].map(td => td.innerText.trim());
      return { nombre: c[0], tel: c[1], segmento: c[2], prioridad: c[3], asistencias: c[4], compras: c[5], ultima: c[6] };
    });
    return { filas, tarjetas: document.querySelectorAll('#historial-segment-cards > div').length };
  });
  ok('Historial lista a cada persona una vez', hist.filas.length === 4,
     hist.filas.map(f => f.nombre).join(', '));
  ok('Tarjetas de segmento presentes', hist.tarjetas === 6, `${hist.tarjetas} tarjetas`);

  const ana = hist.filas.find(f => f.nombre.includes('Ana'));
  const carla = hist.filas.find(f => f.nombre.includes('Carla'));
  const beto = hist.filas.find(f => f.nombre.includes('Beto'));
  ok('Cuenta correcta de asistencias (Ana 3/3)', ana && ana.asistencias.startsWith('3'),
     ana ? `Ana: ${ana.asistencias.replace(/\n/g, ' ')} · ${ana.segmento}` : 'no encontrada');
  ok('Carla (0 de 2) marcada "No asiste" + Urgente',
     carla && carla.segmento.includes('No asiste') && carla.prioridad.includes('Urgente'),
     carla ? `${carla.segmento} / ${carla.prioridad}` : 'no encontrada');
  ok('Beto (asiste pero nunca compra) marcado "No compra"',
     beto && beto.segmento.includes('No compra'),
     beto ? `${beto.segmento} / ${beto.prioridad}` : 'no encontrado');
  ok('Orden por prioridad de llamada (urgentes primero)',
     hist.filas[0].prioridad.includes('Urgente'),
     'primera fila: ' + hist.filas[0].nombre + ' → ' + hist.filas[0].prioridad);

  // Filtro por chip
  await page.evaluate(() => setHistorialFilter('no_asiste'));
  await page.waitForTimeout(250);
  const filtrado = await page.evaluate(() =>
    document.querySelectorAll('#historial-table-body tr').length);
  ok('Filtro por segmento funciona', filtrado === 1, `${filtrado} fila(s) con filtro "No asiste"`);

  // Buscador
  await page.evaluate(() => setHistorialFilter('todos'));
  await page.fill('#historial-search', '600333');
  await page.waitForTimeout(250);
  const buscado = await page.evaluate(() => ({
    n: document.querySelectorAll('#historial-table-body tr').length,
    txt: document.querySelector('#historial-table-body tr')?.innerText || ''
  }));
  ok('Búsqueda por teléfono funciona', buscado.n === 1 && buscado.txt.includes('Beto'),
     `${buscado.n} resultado(s)`);
  await page.fill('#historial-search', '');

  // --- 8. Teléfonos y funciones heredadas ---
  await page.click('.nav-item[data-section="phones"]');
  await page.waitForTimeout(250);
  const tel = await page.evaluate(() => document.querySelectorAll('#phones-table-body tr').length);
  ok('Directorio de teléfonos funciona', tel === 4, `${tel} contactos`);

  await page.click('.nav-item[data-section="attendance"]');
  await page.waitForTimeout(250);
  const asist = await page.evaluate(() => {
    const sel = document.getElementById('select-event-attendance');
    return { sel: sel.value, f: document.querySelectorAll('#attendees-table-body tr').length };
  });
  ok('Asistencia lista inscritos del evento', asist.f === 3,
     `${asist.f} inscritos (evento seleccionado="${asist.sel}")`);
  ok('El selector conserva el evento al cambiar de pestaña', asist.sel === 'e3', `value="${asist.sel}"`);

  // --- 9. Recarga: nada se pierde ---
  await page.reload({ waitUntil: 'load' });
  await page.waitForTimeout(400);
  const trasRecarga = await page.evaluate(() => {
    const d = JSON.parse(localStorage.getItem('hairEventData'));
    // buscar por nombre: refreshEvents reordena los eventos por fecha
    const enero = d.events.find(e => e.name.includes('Enero'));
    const ana = enero.attendees.find(a => a.name === 'Ana Lopez');
    return { ev: d.events.length, precio: d.products[0].price, notas: ana.notes,
             dto: ana.products[0].discount,
             cerrados: d.events.filter(e => e.closed).length,
             activas: document.querySelectorAll('#events-list .event-list-card').length,
             enCarpeta: document.querySelectorAll('#closed-events-list .event-list-card').length };
  });
  ok('Tras recargar, los datos siguen intactos',
     trasRecarga.ev === 3 && Number(trasRecarga.precio) === 25 &&
     trasRecarga.notas === 'Cliente fiel' && trasRecarga.dto === 10,
     `${trasRecarga.ev} eventos · precio=${trasRecarga.precio} · notas="${trasRecarga.notas}" · dto=${trasRecarga.dto}%`);
  ok('Tras recargar, la carpeta de finalizados se mantiene',
     trasRecarga.activas === 1 && trasRecarga.enCarpeta === 2,
     `${trasRecarga.activas} activo(s) / ${trasRecarga.enCarpeta} en carpeta`);

  await browser.close();

  // --- Informe ---
  console.log('\n╔══════════════════════════════════════════════════════════════╗');
  console.log('║              VERIFICACIÓN FUNCIONAL DE LA APP                ║');
  console.log('╚══════════════════════════════════════════════════════════════╝\n');
  let pass = 0;
  results.forEach(r => {
    console.log(`${r.c ? '✅' : '❌'} ${r.n}${r.d ? '\n      → ' + r.d : ''}`);
    if (r.c) pass++;
  });
  console.log(`\n──────────────────────────────────────────────────────────────`);
  console.log(`RESULTADO: ${pass}/${results.length} comprobaciones superadas`);
  console.log(`ERRORES JS EN CONSOLA: ${errors.length}`);
  errors.slice(0, 10).forEach(e => console.log('   ' + e));
  process.exit(pass === results.length && errors.length === 0 ? 0 : 1);
})();
