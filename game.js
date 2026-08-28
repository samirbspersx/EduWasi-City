/* ============================================
   EduWasi City - Game Engine (Optimizado Final para GitHub Pages)
   ============================================ */

// ─── Game State ───
const state = {
    soles: 0,
    habilidades: 0,
    bienestar: 50,
    riesgoCrediticio: 50,
    ahorroEmergencia: false,
    seguroSalud: false,
    currentStage: 0,      // 0=start, 1=colegio, 2=uni, 3=adulta
    currentStep: 0,
    choices: {
        estudio: '',
        extracurricular: '',
        ahorro: '',
        carrera: '',
        tiempo: '',
        tarjeta: '',
        trabajo: '',
        seguro: '',
        excedentes: '',
        checkpoint1: '',
        checkpoint2: '',
        checkpoint3: '',
        finalChoice: ''
    },
    careerName: ''
};

// ─── DOM References ───
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

const DOM = {
    startScreen: $('#start-screen'),
    statsBar: $('#stats-bar'),
    gameContainer: $('#game-container'),
    modalOverlay: $('#modal-overlay'),
    modalContent: $('#modal-content'),
    modalBackdrop: $('#modal-backdrop'),
    stageTransition: $('#stage-transition'),
    transitionIcon: $('#transition-icon'),
    transitionText: $('#transition-text'),
    resultsScreen: $('#results-screen'),
    resultsWrapper: $('#results-wrapper'),
    confettiContainer: $('#confetti-container'),
    statSoles: $('#stat-soles'),
    statSkillText: $('#stat-skill-text'),
    statSkillBar: $('#stat-skill-bar'),
    statHealthText: $('#stat-health-text'),
    statHealthBar: $('#stat-health-bar'),
    statCreditText: $('#stat-credit-text'),
    statCreditBar: $('#stat-credit-bar'),
    badgeSavings: $('#badge-savings'),
    badgeInsurance: $('#badge-insurance')
};

// ─── Clamp helper ───
function clamp(val, min, max) {
    return Math.max(min, Math.min(max, val));
}

// ─── Update UI from state ───
function updateStats(animate = true) {
    DOM.statSoles.textContent = `S/ ${state.soles.toLocaleString()}`;
    DOM.statSkillText.textContent = state.habilidades;
    DOM.statHealthText.textContent = state.bienestar;
    DOM.statCreditText.textContent = state.riesgoCrediticio;

    DOM.statSkillBar.style.width = `${state.habilidades}%`;
    DOM.statHealthBar.style.width = `${state.bienestar}%`;
    DOM.statCreditBar.style.width = `${state.riesgoCrediticio}%`;

    // Badges
    if (state.ahorroEmergencia) {
        DOM.badgeSavings.className = 'badge active';
    } else {
        DOM.badgeSavings.className = 'badge inactive';
    }

    if (state.seguroSalud) {
        DOM.badgeInsurance.className = 'badge active';
    } else {
        DOM.badgeInsurance.className = 'badge inactive';
    }
}

// ─── Apply stat changes & show floating popups ───
function applyStats(changes) {
    const entries = Object.entries(changes);
    entries.forEach(([key, val], i) => {
        if (val === 0) return;

        setTimeout(() => {
            switch (key) {
                case 'soles': 
                    state.soles += val; 
                    break;
                case 'habilidades': 
                    state.habilidades = clamp(state.habilidades + val, 0, 100); 
                    break;
                case 'bienestar': 
                    state.bienestar = clamp(state.bienestar + val, 0, 100); 
                    break;
                case 'riesgoCrediticio': 
                    state.riesgoCrediticio = clamp(state.riesgoCrediticio + val, 0, 100); 
                    break;
                case 'ahorroEmergencia': 
                    state.ahorroEmergencia = val; 
                    break;
                case 'seguroSalud': 
                    state.seguroSalud = val; 
                    break;
            }
            updateStats();
            if (typeof val === 'number' && val !== 0) {
                showStatPopup(key, val);
            }
        }, i * 300);
    });
}

function showStatPopup(key, val) {
    const names = {
        soles: '💰 Soles',
        habilidades: '🎓 Habilidades',
        bienestar: '❤️ Bienestar',
        riesgoCrediticio: '💳 Reputación'
    };
    const label = names[key] || key;
    const sign = val > 0 ? '+' : '';
    const popup = document.createElement('div');
    popup.className = `stat-popup ${val > 0 ? 'positive' : 'negative'}`;
    
    if(key === 'soles') {
        popup.textContent = `${sign}S/ ${Math.abs(val).toLocaleString()}`;
    } else {
        popup.textContent = `${sign}${val} ${label}`;
    }

    popup.style.left = `${50 + (Math.random() * 20 - 10)}%`;
    popup.style.top = '80px';
    document.body.appendChild(popup);
    setTimeout(() => popup.remove(), 1800);
}

// ─── Modal System ───
function showModal(content, type = '') {
    DOM.modalContent.className = `modal-content ${type}`;
    DOM.modalContent.innerHTML = content;
    DOM.modalOverlay.classList.add('visible');
}

function hideModal() {
    DOM.modalOverlay.classList.remove('visible');
}

// ─── Confetti ───
function spawnConfetti(count = 40) {
    const colors = ['#FFD700', '#FF6B6B', '#5DADE2', '#2ECC71', '#BB8FCE', '#F39C12', '#FF85A2'];
    for (let i = 0; i < count; i++) {
        setTimeout(() => {
            const piece = document.createElement('div');
            piece.className = 'confetti-piece';
            piece.style.left = `${Math.random() * 100}%`;
            piece.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            piece.style.width = `${6 + Math.random() * 8}px`;
            piece.style.height = `${6 + Math.random() * 8}px`;
            piece.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
            piece.style.animationDuration = `${2 + Math.random() * 2}s`;
            piece.style.animationDelay = `${Math.random() * 0.5}s`;
            DOM.confettiContainer.appendChild(piece);
            setTimeout(() => piece.remove(), 4000);
        }, i * 50);
    }
}

// ─── Stage Transition ───
function showStageTransition(icon, text, callback) {
    DOM.transitionIcon.textContent = icon;
    DOM.transitionText.textContent = text;
    DOM.stageTransition.classList.add('visible');
    setTimeout(() => {
        DOM.stageTransition.classList.remove('visible');
        if (callback) callback();
    }, 2000);
}

// ─── Typewriter Effect ───
function typewriterEffect(element, text, speed = 20) {
    return new Promise(resolve => {
        let i = 0;
        element.textContent = '';
        const timer = setInterval(() => {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
            } else {
                clearInterval(timer);
                resolve();
            }
        }, speed);
    });
}

// ═══════════════════════════════════════════
// GAME CONTENT DEFINITIONS (Lógica Matemática Auditada)
// ═══════════════════════════════════════════

const STAGES = {
    // ── STAGE 1: COLEGIO ──
    1: {
        title: '🏫 ETAPA 1: COLEGIO',
        icon: '🏫',
        context: 'Estás en el colegio en Chiclayo y comienzas a tomar tus primeras decisiones con dinero.',
        headerClass: 'stage-1-header',
        decisions: [
            {
                id: 'estudio',
                emoji: '📚',
                title: 'Puedes elegir entre destacarte en tus estudios, tener un rendimiento normal, o priorizar tus pasatiempos y diversión.',
                options: [
                    {
                        label: '⭐ Destacarte',
                        desc: 'Te preparas mejor para el futuro y puedes conseguir becas.',
                        effect: { habilidades: 20, bienestar: 10 },
                        choiceValue: 'Destacado'
                    },
                    {
                        label: '📖 Rendimiento Normal',
                        desc: 'Cumples con tus clases sin mayores dificultades ni sobreesfuerzo.',
                        effect: { habilidades: 5 },
                        choiceValue: 'Normal'
                    },
                    {
                        label: '🎮 Priorizar pasatiempos y diversión',
                        desc: 'Disfrutas al máximo tus juegos y amigos en Chiclayo, dejando los estudios de lado.',
                        effect: { habilidades: -10, bienestar: 15 },
                        choiceValue: 'Pasatiempos'
                    }
                ]
            },
            {
                id: 'extracurricular',
                emoji: '🛠️',
                title: 'Puedes elegir llevar actividades extracurriculares o no (Ej. Taller de Gastronomía, Oratoria, etc.).',
                options: [
                    {
                        label: '✅ Llevarlas',
                        desc: 'Desarrollas habilidades útiles como trabajo en equipo y comunicación.',
                        effect: { habilidades: 15 },
                        choiceValue: 'Sí'
                    },
                    {
                        label: '❌ No llevarlas',
                        desc: 'Pierdes esta ventaja.',
                        effect: {},
                        choiceValue: 'No'
                    }
                ]
            },
            {
                id: 'ahorro',
                emoji: '🐖',
                title: 'Imagina que juntaste S/ 150 ayudando en el Mercado Modelo o guardando lo que recibiste. ¿Qué haces con ese dinero?',
                options: [
                    {
                        label: '💰 Pensar y ahorrar',
                        desc: 'Gastas S/ 50 y guardas el resto como colchón para emergencias.',
                        effect: { soles: 100, ahorroEmergencia: true }, 
                        choiceValue: 'Ahorrar'
                    },
                    {
                        label: '🛍️ Gastar todo',
                        desc: 'Te dejas llevar por las compras y te quedas sin nada al instante.',
                        effect: { soles: 0, ahorroEmergencia: false },
                        choiceValue: 'Gastar'
                    }
                ]
            }
        ],
        events: [
            {
                type: 'red',
                icon: '🚨',
                title: 'EVENTUALIDAD ROJA: Accidente Tecnológico',
                description: '¡Se te cayó el celular! La reparación en un técnico del centro cuesta S/ 100.',
                conditional: true,
                conditionKey: 'ahorroEmergencia',
                trueOption: {
                    label: '💳 Pagar con ahorros',
                    desc: 'Tienes tu colchón de ahorros. Pagas de inmediato.',
                    effect: { soles: -100 }
                },
                falseOption: {
                    label: '😰 No puedes pagar',
                    desc: 'Te quedas incomunicado y sin poder hacer tareas.',
                    effect: { bienestar: -10, habilidades: -5 }
                }
            },
            {
                type: 'green',
                icon: '🌟',
                title: 'EVENTUALIDAD VERDE: Cachuelo en el barrio',
                description: 'Un vecino en tu barrio necesita ayuda con unas cajas y te ofrece S/ 50 por echarle una mano.',
                options: [
                    {
                        label: '🔧 Aceptar',
                        desc: 'Ganas dinero propio y valoras el esfuerzo.',
                        effect: { soles: 50, habilidades: 5 }
                    },
                    {
                        label: '😴 Rechazar',
                        desc: 'Decides descansar, pero no recibes dinero.',
                        effect: {}
                    }
                ]
            }
        ],
        checkpoint: {
            title: 'CHECK-POINT REFLEXIVO 1',
            topic: '¿Lo necesito o lo quiero?: Necesidades vs. deseos',
            situation: 'Vas por el Real Plaza y ves unas zapatillas de marca carísimas que están de moda, pero las que usas están en perfecto estado. ¿Qué haces con tu dinero?',
            choiceKey: 'checkpoint1',
            options: [
                {
                    label: 'A',
                    title: 'Me las compro',
                    desc: 'Son un "Deseo", pero las quiero ya. Despilfarras tu dinero tontamente.',
                    effect: { soles: -150 }, 
                    choiceValue: 'Compra impulsiva'
                },
                {
                    label: 'B',
                    title: 'Guardo el dinero',
                    desc: 'Me doy cuenta de que es solo un "Deseo" y no una "Necesidad" vital. El saldo en tu bolsillo no disminuye.',
                    effect: { habilidades: 10, bienestar: 5 },
                    choiceValue: 'Ahorro inteligente'
                }
            ],
            learning: {
                title: '💡 Consejo de Maestro',
                text: '¡Atención, jugador! Conseguir dinero cuesta mucho esfuerzo y tiempo, pero gastarlo toma solo un segundo, sobre todo si te dejas llevar por caprichos o por la presión de estar "a la moda". Aprender a separar lo que deseas de lo que realmente necesitas es tu primer superpoder. Si evitas las compras innecesarias hoy, en unos años tendrás un colchón financiero que te dará tranquilidad cuando la vida se ponga difícil.'
            }
        }
    },

    // ── STAGE 2: UNIVERSIDAD ──
    2: {
        title: '🎓 ETAPA 2: EDUCACIÓN SUPERIOR',
        icon: '🎓',
        context: 'Ingresas a la universidad o instituto y debes tomar decisiones que marcarán el inicio de tus ingresos reales.',
        headerClass: 'stage-2-header',
        decisions: [
            {
                id: 'carrera',
                emoji: '🎓',
                title: 'Elige tu camino profesional (¡Tu elección determinará tus primeros ingresos futuros!):',
                options: [
                    {
                        label: '💼 Administración / Negocios',
                        desc: 'Gestión y dirección de empresas corporativas y negocios comerciales.',
                        effect: { soles: 2500 },
                        choiceValue: 'Administración'
                    },
                    {
                        label: '💻 Ingeniería de Sistemas / TI',
                        desc: 'Desarrollo de software, mantenimiento, tecnología e innovación digital.',
                        effect: { soles: 3500 },
                        choiceValue: 'Ing. Sistemas'
                    },
                    {
                        label: '🩺 Ciencias de la Salud / Medicina',
                        desc: 'Atención clínica y hospitalaria priorizando el bienestar sanitario.',
                        effect: { soles: 4500 },
                        choiceValue: 'Medicina'
                    }
                ]
            },
            {
                id: 'tiempo',
                emoji: '⏰',
                title: '¿Cómo vas a distribuir tu tiempo durante tus estudios superiores?',
                options: [
                    {
                        label: '💼 Emprender/Trabajar',
                        desc: 'Generas ingresos trabajando a medio tiempo pero te desgastas físicamente.',
                        effect: { soles: 800, habilidades: 10, bienestar: -10 },
                        choiceValue: 'Trabajar'
                    },
                    {
                        label: '📚 100% Estudios',
                        desc: 'Te especializas al máximo y dominas tu carrera técnica/profesional.',
                        effect: { habilidades: 20 },
                        choiceValue: '100% Estudios'
                    },
                    {
                        label: '🎉 Fiestas y vida social',
                        desc: 'La pasas genial cada fin de semana, pero a un costo financiero altísimo.',
                        effect: { bienestar: 15, habilidades: -10, soles: -300 },
                        choiceValue: 'Fiestas'
                    }
                ]
            },
            {
                id: 'tarjeta',
                emoji: '💳',
                title: 'Al cumplir 18, te ofrecen una tarjeta de crédito. Es como un "préstamo rápido" del banco para comprar cosas. ¿Cómo la usarías?',
                options: [
                    {
                        label: '✅ Pago total a tiempo',
                        desc: 'Devuelves todo lo que gastaste a tiempo. El banco confía más en ti y construyes un historial sano.',
                        effect: { riesgoCrediticio: 20 },
                        choiceValue: 'Responsable'
                    },
                    {
                        label: '🛍️ Compras impulsivas / Pago mínimo',
                        desc: 'Compras sin pensar y pagas el mínimo. La deuda crece brutalmente por los intereses.',
                        effect: { riesgoCrediticio: -20, soles: -500 },
                        choiceValue: 'Irresponsable'
                    }
                ]
            }
        ],
        events: [
            {
                type: 'red',
                icon: '⚠️',
                title: 'EVENTUALIDAD ROJA: Estafa Piramidal',
                description: 'Un "amigo" te contacta con una oportunidad de "inversión" que promete retornos del 200%. ¿Qué haces?',
                options: [
                    {
                        label: '🔍 Investigar primero',
                        desc: 'Te das cuenta del fraude a tiempo y proteges tu capital intacto.',
                        effect: { habilidades: 10 }
                    },
                    {
                        label: '🤑 Meterte a ciegas',
                        desc: 'Es un fraude... ¡Pierdes absolutamente todo tu dinero ahorrado!',
                        effect: {},
                        losesAll: true
                    }
                ]
            },
            {
                type: 'green',
                icon: '💼',
                title: 'EVENTUALIDAD VERDE: Proyecto Freelance',
                description: 'Te ofrecen un "cachuelo" profesional remoto por S/ 600. Para cobrar, necesitas las habilidades necesarias.',
                conditional: true,
                conditionKey: 'habilidades',
                conditionThreshold: 30,
                trueOption: {
                    label: '📄 Hacer el trabajo',
                    desc: 'Tus habilidades son suficientes (≥30). ¡Logras el proyecto y te pagan!',
                    effect: { soles: 600, habilidades: 10 }
                },
                falseOption: {
                    label: '😞 No estás listo',
                    desc: 'Tus habilidades son insuficientes (<30). Pierdes el contrato por no prepararte.',
                    effect: {}
                }
            }
        ],
        checkpoint: {
            title: 'CHECK-POINT REFLEXIVO 2',
            topic: '¿A dónde se va mi dinero?: Presupuesto sencillo',
            situation: 'En la universidad ya generas tus propios Soles, pero llega fin de mes y misteriosamente tu billetera está vacía sin saber en qué gastaste. ¿Cuál es la mejor herramienta para evitar esto?',
            choiceKey: 'checkpoint2',
            options: [
                {
                    label: 'A',
                    title: 'Recordar de memoria',
                    desc: 'Tratar de recordar los gastos y prometer gastar menos. Pierdes dinero sin darte cuenta por el desorden.',
                    effect: { soles: -150 },
                    choiceValue: 'Sin presupuesto'
                },
                {
                    label: 'B',
                    title: 'Armar un Presupuesto',
                    desc: 'Anotar mis ingresos y planificar en qué gastaré antes de que el dinero desaparezca. Encuentras excedentes y ahorras.',
                    effect: { habilidades: 15, soles: 100 },
                    choiceValue: 'Con presupuesto'
                }
            ],
            learning: {
                title: '💡 Consejo de Maestro',
                text: '¡Nivel completado! El dinero es como el agua: si no le pones un cauce (tu presupuesto), se escurre entre tus dedos en gastos "hormiga" sin que te des cuenta. Anotar lo que ganas y lo que gastas te da el control real de tu vida. Recuerda: ahorrar no es un castigo, es pagarte a ti mismo primero para proteger tu futuro. La mayoría de personas vive al día porque nadie les enseñó esto.'
            }
        }
    },

    // ── STAGE 3: VIDA ADULTA ──
    3: {
        title: '👔 ETAPA 3: VIDA ADULTA',
        icon: '👔',
        context: 'Ya eres adulto, generas ingresos estables y te enfrentas a los verdaderos gastos de la vida real.',
        headerClass: 'stage-3-header',
        decisions: [
            {
                id: 'trabajo',
                emoji: '💼',
                title: 'Puedes elegir tu estructura laboral definitiva:',
                options: [
                    {
                        label: '🚀 Emprender (Negocio Propio)',
                        desc: 'Alto riesgo, gran potencial, y tú pones las reglas. Eres tu propio jefe.',
                        effect: { soles: 1500, habilidades: 10, bienestar: -5 },
                        choiceValue: 'Emprendedor'
                    },
                    {
                        label: '🏢 Trabajo en planilla (Empresa)',
                        desc: 'Estabilidad y sueldo fijo. Te aseguran tus derechos laborales mes a mes.',
                        effect: { soles: 2000, riesgoCrediticio: 10, bienestar: 5 },
                        choiceValue: 'Planilla'
                    }
                ]
            },
            {
                id: 'seguro',
                emoji: '🛡️',
                title: 'Puedes elegir si pagar un Seguro Médico Privado mensual (EPS / Oncológico) o arriesgarte sin él.',
                options: [
                    {
                        label: '🏥 Contratar seguro',
                        desc: 'Pagas S/ 100 mensuales, pero si algo malo pasa de gravedad, estás blindado financieramente.',
                        effect: { soles: -100, seguroSalud: true },
                        choiceValue: 'Con seguro'
                    },
                    {
                        label: '🎲 No contratar',
                        desc: 'Te ahorras el pago hoy asumiendo un riesgo catastrófico a futuro.',
                        effect: { seguroSalud: false },
                        choiceValue: 'Sin seguro'
                    }
                ]
            },
            {
                id: 'excedentes',
                emoji: '🚀',
                title: 'Te llega un dinero extra inesperado (un bono en tu trabajo de S/ 1,000 libres). ¿Qué haces con este capital?',
                options: [
                    {
                        label: '📈 Ahorrar e invertir',
                        desc: 'Guardas el bono completo y lo pones a ganar intereses.',
                        effect: { soles: 1000, habilidades: 10 },
                        choiceValue: 'Ahorrar e invertir'
                    },
                    {
                        label: '🛍️ Elevar estilo de vida al máximo',
                        desc: 'Vives lleno de lujos, salidas y te gastas la totalidad del bono al instante.',
                        effect: { bienestar: 15, soles: 0 },
                        choiceValue: 'Lujos'
                    }
                ]
            }
        ],
        events: [
            {
                type: 'red',
                icon: '🌧️',
                title: 'EVENTUALIDAD ROJA: Fenómeno del Niño',
                description: 'Las intensas lluvias en Lambayeque dañan el techo de tu vivienda. La reparación de urgencia cuesta S/ 2,500.',
                options: [
                    {
                        label: '💰 Asumirlo al contado',
                        desc: 'Pagas con el dinero que tienes en tus fondos (-S/ 2,500).',
                        effect: { soles: -2500 }
                    },
                    {
                        label: '🏦 Pedir préstamo bancario',
                        desc: 'Pides prestado, el banco te cobra S/ 500 extras en intereses por la urgencia.',
                        effect: { riesgoCrediticio: -15, soles: -3000 }
                    }
                ]
            },
            {
                type: 'red',
                icon: '🏥',
                title: 'EVENTUALIDAD ROJA: Emergencia Médica',
                description: 'Sufres un accidente severo y necesitas atención hospitalaria de urgencia y medicamentos costosos.',
                conditional: true,
                conditionKey: 'seguroSalud',
                trueOption: {
                    label: '🛡️ El seguro lo cubre todo',
                    desc: 'Tu seguro de salud absorbe la cuenta completa. ¡Tus ahorros y fondos están a salvo!',
                    effect: {}
                },
                falseOption: {
                    label: '😰 Asumir deuda hospitalaria impagable',
                    desc: 'Al no tener seguro, la clínica y los médicos consumen todo tu dinero. Te quedas en ceros.',
                    effect: {},
                    losesAll: true // Quita todo el dinero
                }
            }
        ],
        checkpoint: {
            title: 'CHECK-POINT REFLEXIVO 3',
            topic: 'Ahorro hoy, una meta mañana: modalidades de ahorro',
            situation: 'Lograste acumular un excelente capital en EduWasi City gracias a tus decisiones. ¿Cuál es la mejor modalidad para que ese ahorro esté seguro y crezca para el mañana?',
            choiceKey: 'checkpoint3',
            options: [
                {
                    label: 'A',
                    title: 'Debajo del colchón',
                    desc: 'Guardarlo en efectivo en tu casa. Tu dinero pierde valor adquisitivo mes a mes por la inflación.',
                    effect: { habilidades: -10, soles: -100 },
                    choiceValue: 'Colchón'
                },
                {
                    label: 'B',
                    title: 'Guardarlo en el banco',
                    desc: 'Ponerlo en una cuenta a plazo formal donde esté 100% seguro y gane intereses a favor.',
                    effect: { riesgoCrediticio: 15, habilidades: 10, soles: 100 },
                    choiceValue: 'Sistema formal'
                }
            ],
            learning: {
                title: '💡 Consejo de Maestro',
                text: '¡Casi eres un maestro financiero! Guardar tu dinero bajo el colchón o en alcancías estáticas hace que pierda valor mes a mes (todo sube de precio, a eso se le llama inflación). En el banco o cajas reguladas, tu dinero está protegido y gana intereses que lo hacen crecer. La vida real siempre tiene sorpresas inesperadas. Tener fondos líquidos te permitirá enfrentar esos golpes duros sin que se destruya todo tu futuro.'
            }
        }
    }
};

// ═══════════════════════════════════════════
// MINIJUEGO: DESEO VS. NECESIDAD (ETAPA 1: COLEGIO)
// ═══════════════════════════════════════════

const MINIGAME_CARDS_STAGE1 = [
    {
        id: 'pasajes', category: 'Transporte', emoji: '🚌',
        title: 'Pasajes para movilizarte',
        desc: 'Dinero necesario para trasladarte todos los días.',
        type: 'necesidad',
        feedbackCorrect: '¡Exacto! Los pasajes para movilizarte son un gasto indispensable para tu rutina diaria.',
        feedbackIncorrect: '¡Ojo! Los pasajes para trasladarte son una Necesidad básica para tu transporte diario.'
    },
    {
        id: 'almuerzo', category: 'Alimentación', emoji: '🍲',
        title: 'Almuerzo diario / Nutrición',
        desc: 'Alimentación diaria o compras para cocinar en casa.',
        type: 'necesidad',
        feedbackCorrect: '¡Muy bien! Nutrirte adecuadamente todos los días es una necesidad biológica.',
        feedbackIncorrect: '¡Atención! La alimentación diaria es una Necesidad vital de supervivencia.'
    },
    {
        id: 'utiles', category: 'Educación', emoji: '📚',
        title: 'Cuadernos, lapiceros y copias',
        desc: 'Materiales esenciales para tus clases, tareas y aprendizaje.',
        type: 'necesidad',
        feedbackCorrect: '¡Bien pensado! Los útiles escolares son herramientas fundamentales para estudiar.',
        feedbackIncorrect: '¡Cuidado! Los materiales de estudio son una Necesidad obligatoria en tu educación.'
    },
    {
        id: 'aseo', category: 'Salud e Higiene', emoji: '🪥',
        title: 'Pasta dental, jabón de uso',
        desc: 'Artículos indispensables para la higiene y cuidado personal.',
        type: 'necesidad',
        feedbackCorrect: '¡Excelente! La higiene personal protege tu salud y previene enfermedades.',
        feedbackIncorrect: '¡Recuerda! Los artículos de aseo personal son una Necesidad básica indispensable.'
    },
    {
        id: 'calzado_roto', category: 'Ropa esencial', emoji: '👞',
        title: 'Reponer calzado roto funcional',
        desc: 'Reemplazar zapatos dañados para poder caminar seguro y sin dolor.',
        type: 'necesidad',
        feedbackCorrect: '¡Correcto! Proteger tus pies con calzado en buen estado es una necesidad básica.',
        feedbackIncorrect: '¡Ojo! Reponer calzado roto no es vanidad, es una Necesidad física y de salud.'
    },
    {
        id: 'medicina', category: 'Salud', emoji: '💊',
        title: 'Comprar medicina ante dolor',
        desc: 'Medicamentos indispensables recetados para aliviar una enfermedad.',
        type: 'necesidad',
        feedbackCorrect: '¡Muy bien! La salud y los medicamentos son una necesidad prioritaria de urgencia.',
        feedbackIncorrect: '¡Ojo! Comprar medicina cuando estás enfermo es una Necesidad urgente de salud.'
    },
    {
        id: 'videojuegos', category: 'Entretenimiento', emoji: '🎮',
        title: 'Compras de skins en juegos',
        desc: 'Skins, monedas o pases de batalla dentro de tus videojuegos favoritos.',
        type: 'deseo',
        feedbackCorrect: '¡Muy bien! El ocio y cosméticos de juegos son divertidos, pero no indispensables.',
        feedbackIncorrect: '¡Cuidado! Las compras dentro de videojuegos son un Deseo. Puedes jugar sin gastar dinero.'
    },
    {
        id: 'comida_rapida', category: 'Comida fuera', emoji: '🍔',
        title: 'Comida rápida con amigos',
        desc: 'Hamburguesas, pizzas compradas en salidas del fin de semana.',
        type: 'deseo',
        feedbackCorrect: '¡Así es! Comer comida rápida fuera de casa es recreación y un gusto prescindible.',
        feedbackIncorrect: '¡Ojo! Salir a comer comida rápida en la calle es un Deseo. (En casa es mucho más barato).'
    },
    {
        id: 'zapatillas_marca', category: 'Moda y Status', emoji: '👟',
        title: 'Zapatillas de marca carísimas',
        desc: 'Calzado de diseñador o edición limitada solo por estar a la moda social.',
        type: 'deseo',
        feedbackCorrect: '¡Brillante! La moda costosa es un gusto. Para caminar solo necesitas calzado cómodo.',
        feedbackIncorrect: '¡Ojo! Las zapatillas de marca cara son un Deseo de estatus, no una necesidad funcional.'
    },
    {
        id: 'celular_nuevo', category: 'Tecnología', emoji: '📱',
        title: 'Cambiar de celular al nuevo modelo',
        desc: 'Comprar el teléfono más moderno aunque el que tienes funciona perfecto.',
        type: 'deseo',
        feedbackCorrect: '¡Muy bien! Si tu equipo actual funciona, renovarlo a capricho es un lujo.',
        feedbackIncorrect: '¡Cuidado! Cambiar de teléfono solo por tener el último modelo es un Deseo tecnológico.'
    },
    {
        id: 'cine', category: 'Entretenimiento', emoji: '🍿',
        title: 'Ir al cine en el Real Plaza',
        desc: 'Comprar entradas y golosinas para ver los estrenos de la semana.',
        type: 'deseo',
        feedbackCorrect: '¡Exacto! Ir al cine es una salida recreativa y un gusto muy divertido, pero posponible.',
        feedbackIncorrect: '¡Atención! Ir al cine es una actividad de ocio o Deseo recreativo, no una necesidad vital.'
    },
    {
        id: 'golosinas', category: 'Snacks', emoji: '🥤',
        title: 'Gaseosas y golosinas diarias',
        desc: 'Dulces, galletas y bebidas azucaradas todos los días en el recreo.',
        type: 'deseo',
        feedbackCorrect: '¡Genial! Los snacks son antojitos ricos, pero el agua y almuerzo cubren la necesidad.',
        feedbackIncorrect: '¡Piénsalo! Los antojos diarios de dulces y gaseosas son Deseos de placer instantáneo.'
    }
];

let minigameState = {
    active: false,
    cards: [],
    currentIndex: 0,
    score: 0,
    correctCount: 0,
    streak: 0,
    isProcessing: false
};

function startMinigameStage1(container, onComplete) {
    const shuffledCards = [...MINIGAME_CARDS_STAGE1].sort(() => Math.random() - 0.5);

    minigameState = {
        active: true,
        cards: shuffledCards,
        currentIndex: 0,
        score: 0,
        correctCount: 0,
        streak: 0,
        isProcessing: false,
        onComplete: onComplete
    };

    renderMinigameContainer(container);
}

function renderMinigameContainer(container) {
    const totalCards = minigameState.cards.length;

    container.innerHTML = `
    <div class="minigame-wrapper" id="minigame-wrapper">
      <div class="minigame-header">
        <div class="minigame-badge">🎮 Actividad Previa • Desafío de Clasificación</div>
        <h2 class="minigame-title">¿Deseo o Necesidad? 🤔</h2>
        <p class="minigame-subtitle">
          Antes de tomar tus decisiones en la historia, clasifica cada situación: 
          <strong>Izquierda = Necesidad</strong> (indispensable) | <strong>Derecha = Deseo</strong> (gusto o lujo).
        </p>
      </div>

      <div class="minigame-hud">
        <div class="hud-item">
          <span>🗂️ Progreso:</span>
          <span class="hud-val" id="minigame-progress-text">1 / ${totalCards}</span>
        </div>
        <div class="hud-item score">
          <span>⭐ Aciertos:</span>
          <span class="hud-val" id="minigame-score">0</span>
        </div>
      </div>

      <div class="minigame-progress-bar">
        <div class="minigame-progress-fill" id="minigame-progress-bar" style="width: 0%"></div>
      </div>

      <div class="minigame-arena" id="minigame-arena">
        <div class="arena-zone left" id="zone-left">
          <span class="arena-zone-icon">🛡️</span>
          <span class="arena-zone-text">NECESIDAD</span>
        </div>

        <div class="card-stack" id="card-stack"></div>

        <div class="arena-zone right" id="zone-right">
          <span class="arena-zone-icon">💎</span>
          <span class="arena-zone-text">DESEO</span>
        </div>
      </div>

      <div class="minigame-controls">
        <button class="btn-classify need" id="btn-swipe-need">
          <span>👈</span> NECESIDAD
        </button>
        <button class="btn-classify want" id="btn-swipe-want">
          DESEO <span>👉</span>
        </button>
      </div>
    </div>
  `;

    $('#btn-swipe-need').addEventListener('click', () => handleMinigameChoice('necesidad', 'left'));
    $('#btn-swipe-want').addEventListener('click', () => handleMinigameChoice('deseo', 'right'));

    const handleKeydown = (e) => {
        if (!minigameState.active || minigameState.isProcessing) return;
        if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
            handleMinigameChoice('necesidad', 'left');
        } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
            handleMinigameChoice('deseo', 'right');
        }
    };
    window._minigameKeyHandler = handleKeydown;
    window.addEventListener('keydown', handleKeydown);

    renderCurrentMinigameCard();
}

function renderCurrentMinigameCard() {
    const cardStack = $('#card-stack');
    if (!cardStack) return;
    cardStack.innerHTML = '';

    if (minigameState.currentIndex >= minigameState.cards.length) {
        finishMinigame();
        return;
    }

    const cardData = minigameState.cards[minigameState.currentIndex];
    const totalCards = minigameState.cards.length;

    const progressText = $('#minigame-progress-text');
    const progressBar = $('#minigame-progress-bar');
    if (progressText) progressText.textContent = `${minigameState.currentIndex + 1} / ${totalCards}`;
    if (progressBar) progressBar.style.width = `${(minigameState.currentIndex / totalCards) * 100}%`;

    const cardEl = document.createElement('div');
    cardEl.className = 'swipe-card';
    cardEl.id = 'active-swipe-card';
    cardEl.innerHTML = `
    <div class="card-stamp stamp-need" id="stamp-need">NECESIDAD</div>
    <div class="card-stamp stamp-want" id="stamp-want">DESEO</div>
    <div class="swipe-card-category">${cardData.category}</div>
    <div class="swipe-card-emoji">${cardData.emoji}</div>
    <h3 class="swipe-card-title">${cardData.title}</h3>
    <p class="swipe-card-desc">${cardData.desc}</p>
    <div class="swipe-card-hint">
      <span>👈 Arrastra para clasificar 👉</span>
    </div>
  `;

    cardStack.appendChild(cardEl);
    setupCardGestures(cardEl);
}

function setupCardGestures(cardEl) {
    let startX = 0; let startY = 0;
    let currentX = 0; let currentY = 0;
    let isDragging = false;

    const zoneLeft = $('#zone-left');
    const zoneRight = $('#zone-right');
    const stampNeed = cardEl.querySelector('#stamp-need');
    const stampWant = cardEl.querySelector('#stamp-want');

    const onPointerDown = (e) => {
        if (minigameState.isProcessing) return;
        isDragging = true;
        startX = e.clientX; startY = e.clientY;
        currentX = 0; currentY = 0;
        cardEl.classList.remove('is-animating');
        cardEl.setPointerCapture(e.pointerId);
    };

    const onPointerMove = (e) => {
        if (!isDragging) return;
        currentX = e.clientX - startX;
        currentY = e.clientY - startY;

        const rotateDeg = currentX * 0.08;
        cardEl.style.transform = `translate(${currentX}px, ${currentY * 0.3}px) rotate(${rotateDeg}deg)`;

        const threshold = 60;
        if (currentX < -15) {
            const opacity = Math.min(1, Math.abs(currentX) / threshold);
            if (stampNeed) {
                stampNeed.style.opacity = opacity;
                stampNeed.style.transform = `rotate(-12deg) scale(${0.8 + opacity * 0.2})`;
            }
            if (stampWant) stampWant.style.opacity = 0;
            if (zoneLeft) zoneLeft.classList.add('active-left');
            if (zoneRight) zoneRight.classList.remove('active-right');
        } else if (currentX > 15) {
            const opacity = Math.min(1, currentX / threshold);
            if (stampWant) {
                stampWant.style.opacity = opacity;
                stampWant.style.transform = `rotate(12deg) scale(${0.8 + opacity * 0.2})`;
            }
            if (stampNeed) stampNeed.style.opacity = 0;
            if (zoneRight) zoneRight.classList.add('active-right');
            if (zoneLeft) zoneLeft.classList.remove('active-left');
        } else {
            if (stampNeed) stampNeed.style.opacity = 0;
            if (stampWant) stampWant.style.opacity = 0;
            if (zoneLeft) zoneLeft.classList.remove('active-left');
            if (zoneRight) zoneRight.classList.remove('active-right');
        }
    };

    const onPointerUp = (e) => {
        if (!isDragging) return;
        isDragging = false;
        if (zoneLeft) zoneLeft.classList.remove('active-left');
        if (zoneRight) zoneRight.classList.remove('active-right');

        const swipeThreshold = 80;
        if (currentX < -swipeThreshold) {
            handleMinigameChoice('necesidad', 'left');
        } else if (currentX > swipeThreshold) {
            handleMinigameChoice('deseo', 'right');
        } else {
            cardEl.classList.add('is-animating');
            cardEl.style.transform = 'translate(0, 0) rotate(0deg)';
            if (stampNeed) stampNeed.style.opacity = 0;
            if (stampWant) stampWant.style.opacity = 0;
        }
    };

    cardEl.addEventListener('pointerdown', onPointerDown);
    cardEl.addEventListener('pointermove', onPointerMove);
    cardEl.addEventListener('pointerup', onPointerUp);
    cardEl.addEventListener('pointercancel', onPointerUp);
}

function handleMinigameChoice(chosenType, direction) {
    if (!minigameState.active || minigameState.isProcessing) return;

    minigameState.isProcessing = true;
    const currentCard = minigameState.cards[minigameState.currentIndex];
    const isCorrect = chosenType === currentCard.type;
    const cardEl = $('#active-swipe-card');

    if (cardEl) {
        cardEl.classList.add('is-animating');
        const flyX = direction === 'left' ? -500 : 500;
        const rotate = direction === 'left' ? -25 : 25;
        cardEl.style.transform = `translate(${flyX}px, 50px) rotate(${rotate}deg)`;
        cardEl.style.opacity = '0';
    }

    if (isCorrect) {
        minigameState.score += 100;
        minigameState.correctCount++;
        minigameState.streak++;

        const scoreEl = $('#minigame-score');
        if (scoreEl) scoreEl.textContent = minigameState.correctCount;

        showFloatingMinigameFeedback('¡Correcto! ✨', 'positive');

        setTimeout(() => {
            minigameState.currentIndex++;
            minigameState.isProcessing = false;
            renderCurrentMinigameCard();
        }, 320);
    } else {
        minigameState.streak = 0;
        if (navigator.vibrate) { try { navigator.vibrate(150); } catch (e) {} }

        showMinigameFeedbackModal(currentCard, () => {
            minigameState.currentIndex++;
            minigameState.isProcessing = false;
            renderCurrentMinigameCard();
        });
    }
}

function showFloatingMinigameFeedback(text, type) {
    const popup = document.createElement('div');
    popup.className = `stat-popup ${type}`;
    popup.textContent = text;
    popup.style.left = '50%';
    popup.style.top = '140px';
    document.body.appendChild(popup);
    setTimeout(() => popup.remove(), 1200);
}

function showMinigameFeedbackModal(cardData, onContinue) {
    const isNeed = cardData.type === 'necesidad';
    const correctCategory = isNeed ? 'NECESIDAD' : 'DESEO';
    const badgeColor = isNeed ? 'var(--green-money)' : 'var(--purple-credit)';

    showModal(`
    <div class="minigame-feedback-modal">
      <span class="feedback-icon">💡</span>
      <div class="feedback-title incorrect">¡Ojo con este concepto!</div>
      <p style="margin-bottom:0.5rem; color:var(--text-primary); font-weight:600;">
        ${cardData.emoji} ${cardData.title} es en realidad una:
        <span style="color:${badgeColor}; font-weight:800; text-transform:uppercase;">[${correctCategory}]</span>
      </p>
      <div class="feedback-explanation">
        ${cardData.feedbackIncorrect}
      </div>
      <button class="feedback-btn" id="btn-feedback-continue">
        ▶ ENTENDIDO, ¡SIGAMOS!
      </button>
    </div>
  `, 'learning');

    $('#btn-feedback-continue').addEventListener('click', () => {
        hideModal();
        if (onContinue) onContinue();
    });
}

function finishMinigame() {
    minigameState.active = false;
    if (window._minigameKeyHandler) {
        window.removeEventListener('keydown', window._minigameKeyHandler);
    }

    const container = $('#minigame-wrapper') || DOM.gameContainer;
    const totalCards = minigameState.cards.length;
    const correct = minigameState.correctCount;
    const percent = Math.round((correct / totalCards) * 100);

    if (percent >= 70) {
        applyStats({ habilidades: 15, bienestar: 5 });
    } else {
        applyStats({ habilidades: 5 });
    }

    spawnConfetti(35);

    container.innerHTML = `
    <div class="minigame-results">
      <div class="minigame-results-header">
        <span class="results-trophy">🏆</span>
        <h2 class="minigame-results-title">¡Desafío Completado!</h2>
        <p style="color:var(--text-secondary); font-size:0.95rem;">Has finalizado la clasificación de las ${totalCards} situaciones.</p>
      </div>

      <div class="minigame-score-card">
        <div class="score-metric">
          <span class="num green">${correct} / ${totalCards}</span>
          <span class="lbl">Aciertos</span>
        </div>
        <div class="score-metric">
          <span class="num">${percent}%</span>
          <span class="lbl">Precisión</span>
        </div>
        <div class="score-metric">
          <span class="num" style="color:var(--gold)">${percent >= 80 ? '⭐⭐⭐' : percent >= 50 ? '⭐⭐' : '⭐'}</span>
          <span class="lbl">Calificación</span>
        </div>
      </div>

      <div class="debrief-box">
        <p>
          💬 <em>"¡Excelente! Recuerda que no está mal tener deseos ni gastar en ellos, pero siempre debes cubrir tus necesidades primero para no quebrar. ¡Ahora estás listo para tus propias decisiones financieras!"</em>
        </p>
      </div>

      <button class="btn-start-questions" id="btn-start-stage-questions">
        SIGUIENTE: INICIAR LA HISTORIA ➔
      </button>
    </div>
  `;

    $('#btn-start-stage-questions').addEventListener('click', () => {
        if (minigameState.onComplete) {
            minigameState.onComplete();
        }
    });
}

// ═══════════════════════════════════════════
// MINIJUEGOS DE PRESUPUESTO INTERACTIVO (DRAG & DROP)
// OPTIMIZADO: Fugas de memoria reparadas (Asignación limpia de eventos) y Fallback Táctil.
// ═══════════════════════════════════════════

const BUDGET_MINIGAMES_DATA = {
    // ── BLOQUE 1: COLEGIO ──
    1: {
        title: '📊 Minijuego: Tu Primer Presupuesto Personal',
        badge: '🏫 Etapa 1: Colegio • Desafío de Cierre',
        subtitle: 'Recibiste S/ 100. Arrastra cada tarjeta a su categoría correcta para lograr un presupuesto equilibrado (S/ 0 de saldo restante).',
        income: 100,
        incomeLabel: 'Ingreso',
        categories: [
            {
                id: 'necesidades',
                title: '🛡️ Necesidades / Fijos',
                desc: 'Pasajes y alimentación indispensable',
                color: 'var(--blue-skill)'
            },
            {
                id: 'ocio',
                title: '🎈 Gustos / Flexibles',
                desc: 'Salidas, juegos y ocio personal',
                color: 'var(--purple-credit)'
            },
            {
                id: 'ahorro',
                title: '🐖 Ahorro / Colchón',
                desc: 'Reserva para metas e imprevistos',
                color: 'var(--green-money)'
            }
        ],
        cards: [
            { id: 'c1_pasajes', name: 'Pasajes / Transporte', amount: 30, emoji: '🚌', validCategory: 'necesidades' },
            { id: 'c1_colacion', name: 'Almuerzo / Colación', amount: 25, emoji: '🥪', validCategory: 'necesidades' },
            { id: 'c1_salida', name: 'Salida con amigos', amount: 20, emoji: '🎟️', validCategory: 'ocio' },
            { id: 'c1_juegos', name: 'Videojuegos / Ocio', amount: 15, emoji: '🎮', validCategory: 'ocio' },
            { id: 'c1_ahorro', name: 'Ahorro para metas', amount: 10, emoji: '🐖', validCategory: 'ahorro' }
        ],
        hasSurprise: true,
        surpriseEvent: {
            title: '🚨 ¡IMPREVISTO! Se rompió la pantalla',
            desc: '¡Emergencia cotidiana! La reparación de la pantalla de tu celular cuesta S/ 20 urgente. Agrégala a Necesidades y recorta gastos de ocio regresándolos a la caja de arriba para no quedar en saldo negativo.',
            newCard: { id: 'c1_reparacion', name: 'Reparación de Celular', amount: 20, emoji: '🔧', validCategory: 'necesidades' }
        },
        debrief: {
            icon: '🏆',
            title: '¡Presupuesto Personal Dominado!',
            lessonTitle: '💡 Lección: La Regla de los Ajustes',
            lessonText: 'Cuando surgen imprevistos de vida obligatorios, los primeros gastos a recortar siempre son el ocio o los deseos, ¡nunca descuidar tus necesidades básicas!'
        }
    },

    // ── BLOQUE 2: UNIVERSIDAD ──
    2: {
        title: '💻 Minijuego: Presupuesto por Objetivo (Laptop)',
        badge: '🎓 Etapa 2: Universidad • Desafío de Cierre',
        subtitle: 'Tienes S/ 900 al mes. Asegura la Cuota de la Laptop (S/ 300), tus Gastos Inevitables de estudio (S/ 350) y elige gustos moderados (S/ 250) colocándolos en su lugar correcto.',
        income: 900,
        incomeLabel: 'Presupuesto Mensual',
        categories: [
            {
                id: 'laptop',
                title: '💻 Fondo Laptop (Objetivo)',
                desc: 'Meta requerida innegociable: S/ 300/mes',
                requiredAmount: 300,
                color: 'var(--gold)'
            },
            {
                id: 'inevitables',
                title: '🎒 Gastos Inevitables / Estudio',
                desc: 'Obligatorios: Transporte, copias, internet (S/ 350)',
                requiredAmount: 350,
                color: 'var(--blue-skill)'
            },
            {
                id: 'hormiga',
                title: '☕ Tentaciones / Gustos Moderados',
                desc: 'Máximo permitido de ocio: S/ 250',
                maxAllowed: 250,
                color: 'var(--purple-credit)'
            }
        ],
        cards: [
            { id: 'c2_cuota', name: 'Cuota Fondo Laptop', amount: 300, emoji: '💻', validCategory: 'laptop', isRequired: true },
            { id: 'c2_pasajes', name: 'Pasajes a la Universidad', amount: 180, emoji: '🚌', validCategory: 'inevitables', isRequired: true },
            { id: 'c2_copias', name: 'Fotocopias y Materiales', amount: 120, emoji: '📄', validCategory: 'inevitables', isRequired: true },
            { id: 'c2_datos', name: 'Recarga de datos / Internet', amount: 50, emoji: '📶', validCategory: 'inevitables', isRequired: true },
            { id: 'c2_salida_moderada', name: 'Salida moderada con amigos', amount: 150, emoji: '🍿', validCategory: 'hormiga' },
            { id: 'c2_cafes', name: 'Cafés y snacks diarios', amount: 60, emoji: '☕', validCategory: 'hormiga' },
            { id: 'c2_suscripcion', name: 'Suscripciones prescindibles', amount: 40, emoji: '🎧', validCategory: 'hormiga' },
            { id: 'c2_comida_calle', name: 'Comida rápida en la calle', amount: 120, emoji: '🍔', validCategory: 'hormiga' },
            { id: 'c2_salida_cara', name: 'Salidas caras de fin de semana', amount: 150, emoji: '🍻', validCategory: 'hormiga' }
        ],
        hasSurprise: false,
        debrief: {
            icon: '🎯',
            title: '¡Meta de la Laptop Asegurada!',
            lessonTitle: '💡 Lección: Págate a Ti Mismo Primero',
            lessonText: '¡Gran trabajo! Cumpliste con tu cuota mensual inamovible de S/ 300 antes de gastar en otra cosa. Lograste cubrir estudios y elegir tus lujos limitados de S/ 250 de tope de seguridad.'
        }
    },

    // ── BLOQUE 3: VIDA ADULTA ──
    3: {
        title: '💡 Minijuego: Mi Primer Negocio',
        badge: '👔 Etapa 3: Vida Adulta • Desafío de Cierre',
        subtitle: '¡Es hora de emprender! Vendes S/ 3,500 en total. Organiza bien cada gasto en su categoría correspondiente para que tu negocio funcione y te quede ganancia.',
        income: 3500,
        incomeLabel: 'Ventas Brutas',
        categories: [
            {
                id: 'variables',
                title: '📦 Gastos Variables (Costo de venta)',
                desc: 'Aumentan o bajan al preparar más mercancía',
                color: 'var(--orange-accent)'
            },
            {
                id: 'fijos',
                title: '💡 Gastos Fijos (Operación)',
                desc: 'Servicios necesarios mes a mes obligatorios',
                color: 'var(--blue-skill)'
            },
            {
                id: 'ganancia',
                title: '💰 Utilidad y Futuro',
                desc: 'Tu pago personal y el fondo del negocio',
                color: 'var(--green-money)'
            }
        ],
        cards: [
            { id: 'c3_insumos', name: 'Materiales e ingredientes', amount: 1200, emoji: '📦', validCategory: 'variables' },
            { id: 'c3_empaques', name: 'Empaques de productos', amount: 300, emoji: '🏷️', validCategory: 'variables' },
            { id: 'c3_delivery', name: 'Tarifas logísticas envíos', amount: 400, emoji: '🚚', validCategory: 'variables' },
            { id: 'c3_ads', name: 'Publicidad pagada (Ads)', amount: 300, emoji: '📢', validCategory: 'fijos' },
            { id: 'c3_herramientas', name: 'Energía, agua, internet', amount: 200, emoji: '💡', validCategory: 'fijos' },
            { id: 'c3_sueldo', name: 'Sueldo de Dueño personal', amount: 600, emoji: '🙋', validCategory: 'ganancia' },
            { id: 'c3_reinversion', name: 'Re-inversión ahorrada', amount: 500, emoji: '🏦', validCategory: 'ganancia' }
        ],
        hasSurprise: true,
        surpriseEvent: {
            title: '⚡ ¡Crisis Mundial Logística! 😱',
            desc: 'La importación falló y tus Materiales ahora cuestan <strong>+S/ 300 extras</strong> (Subió a S/ 1,500). Para proteger la vida del negocio sin tocar las ganancias, reemplaza la "Publicidad pagada" (S/300) y el "Empaque" (S/300) enviándolos a la caja de arriba, e ingresa las 2 nuevas alternativas económicas (S/150 c/u) para cuadrar la balanza a cero.',
            cardUpdates: { c3_insumos: 1500 },
            newCards: [
                { id: 'c3_empaque_eco', name: 'Empaque de cartón ecológico', amount: 150, emoji: '🌿', validCategory: 'variables' },
                { id: 'c3_marketing_org', name: 'Crear videos orgánicos', amount: 150, emoji: '📱', validCategory: 'fijos' }
            ]
        },
        debrief: {
            icon: '🏆',
            title: '¡Ingresos y Costos bajo control Total!',
            lessonTitle: '💡 Lección: Finanzas Maestras',
            lessonText: 'El buen manejo gerencial exige rebotar golpes externos. En lugar de reducir tu utilidad personal o el fondo de contingencia, innovaste abaratando los gastos fijos para neutralizar el impacto. ¡Felicidades futuro millonario!'
        }
    }
};

let currentBudgetState = null;

function renderBudgetMinigame(stageNum, onComplete) {
    const data = BUDGET_MINIGAMES_DATA[stageNum];
    if (!data) {
        if (onComplete) onComplete();
        return;
    }

    currentBudgetState = {
        stageNum: stageNum,
        data: data,
        income: data.income,
        poolCards: JSON.parse(JSON.stringify(data.cards)),
        dropzones: {},
        surpriseTriggered: false,
        onComplete: onComplete
    };

    data.categories.forEach(cat => {
        currentBudgetState.dropzones[cat.id] = [];
    });

    renderBudgetMinigameUI();
}

function renderBudgetMinigameUI() {
    const stateObj = currentBudgetState;
    const data = stateObj.data;

    let dropzonesHtml = data.categories.map(cat => `
    <div class="budget-dropzone" data-category-id="${cat.id}">
      <div class="dropzone-header">
        <div class="dropzone-title">${cat.title}</div>
        <div class="dropzone-desc">${cat.desc}</div>
        <div class="dropzone-total" id="zone-total-${cat.id}">S/ 0</div>
      </div>
      <div class="dropzone-items-list" id="zone-list-${cat.id}"></div>
    </div>
  `).join('');

    const html = `
    <div class="budget-game-wrapper" id="budget-game-wrapper">
      <div class="budget-game-header">
        <div class="budget-game-badge">${data.badge}</div>
        <h2 class="budget-game-title">${data.title}</h2>
        <p class="budget-game-subtitle">${data.subtitle}</p>
      </div>

      <div class="budget-hud">
        <div class="budget-hud-item">
          <span class="budget-hud-label">${data.incomeLabel}</span>
          <span class="budget-hud-value income">S/ ${data.income.toLocaleString()}</span>
        </div>
        <div class="budget-hud-item">
          <span class="budget-hud-label">Total Asignado</span>
          <span class="budget-hud-value" id="budget-hud-allocated">S/ 0</span>
        </div>
        <div class="budget-hud-item">
          <span class="budget-hud-label">Saldo Restante</span>
          <span class="budget-hud-value" id="budget-hud-remaining">S/ ${data.income.toLocaleString()}</span>
          <span class="budget-status-pill surplus" id="budget-status-pill">Distribuye los gastos</span>
        </div>
      </div>

      <div class="budget-hint-banner" id="budget-hint-banner">
        💡 <strong>Objetivo de Balanza:</strong> Arrastra cada tarjeta (o hazle clic) hacia su categoría lógica hasta que el Saldo Restante sea exactamente <strong>S/ 0</strong>.
      </div>

      <div class="budget-board">
        <div class="budget-pool-container">
          <div class="budget-pool-header">
            <span>📦 Tarjetas Disponibles</span>
            <small style="font-weight:500; font-size:0.8rem; color:var(--text-muted); margin-left:auto;">
              (Cada tarjeta tiene una única categoría correcta)
            </small>
          </div>
          <div class="budget-pool-list" id="budget-pool-list"></div>
        </div>

        <div class="budget-dropzones-grid">
          ${dropzonesHtml}
        </div>
      </div>

      <div class="budget-actions-bar">
        <button class="btn-budget-reset" id="btn-budget-reset">↺ Reiniciar Tarjetas al Banco</button>
        <button class="btn-budget-validate" id="btn-budget-validate">
          ✨ VALIDAR MI PRESUPUEర్ణ
        </button>
      </div>
    </div>
  `;

    DOM.gameContainer.innerHTML = html.replace('PRESUPUEర్ణ', 'PRESUPUESTO');
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // OPTIMIZACIÓN GC: Asignar listeners de las zonas de caída UNA SOLA VEZ al renderizar el DOM principal.
    setupBudgetBoardListeners();

    updateBudgetBoard();

    $('#btn-budget-reset').addEventListener('click', resetBudgetCards);
    $('#btn-budget-validate').addEventListener('click', handleBudgetValidation);
}

// OPTIMIZACIÓN DE MEMORIA: Previene la acumulación (fuga) de Event Listeners asignándolos de forma estática 
function setupBudgetBoardListeners() {
    const dropzones = $$('.budget-dropzone');
    const poolContainer = $('.budget-pool-container');

    dropzones.forEach(zoneEl => {
        zoneEl.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
            zoneEl.classList.add('drag-over');
        });

        zoneEl.addEventListener('dragleave', () => {
            zoneEl.classList.remove('drag-over');
        });

        zoneEl.addEventListener('drop', (e) => {
            e.preventDefault();
            zoneEl.classList.remove('drag-over');
            const cardId = e.dataTransfer.getData('text/plain');
            const catId = zoneEl.dataset.categoryId;
            if (cardId && catId) {
                moveCardTo(cardId, catId);
            }
        });
    });

    if (poolContainer) {
        poolContainer.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
        });

        poolContainer.addEventListener('drop', (e) => {
            e.preventDefault();
            const cardId = e.dataTransfer.getData('text/plain');
            if (cardId) {
                moveCardTo(cardId, 'pool');
            }
        });
    }
}

function updateBudgetBoard() {
    const stateObj = currentBudgetState;
    if (!stateObj) return;

    const data = stateObj.data;
    const poolList = $('#budget-pool-list');

    if (poolList) {
        poolList.innerHTML = '';
        if (stateObj.poolCards.length === 0) {
            poolList.innerHTML = '<div class="budget-pool-empty">Mesa de tarjetas vacía. Verifica saldos superiores.</div>';
        } else {
            stateObj.poolCards.forEach(card => {
                const cardEl = createBudgetCardElement(card, 'pool');
                poolList.appendChild(cardEl);
            });
        }
    }

    let totalAllocated = 0;
    data.categories.forEach(cat => {
        const zoneList = $(`#zone-list-${cat.id}`);
        const zoneTotal = $(`#zone-total-${cat.id}`);
        const items = stateObj.dropzones[cat.id] || [];

        let catSum = 0;
        if (zoneList) {
            zoneList.innerHTML = '';
            items.forEach(card => {
                catSum += card.amount;
                const cardEl = createBudgetCardElement(card, cat.id);
                zoneList.appendChild(cardEl);
            });
        }

        if (zoneTotal) {
            let statusSuffix = '';
            if (cat.requiredAmount !== undefined) {
                if (catSum === cat.requiredAmount) statusSuffix = ' ✅ (Meta)';
                else if (catSum < cat.requiredAmount) statusSuffix = ` (Falta S/ ${cat.requiredAmount - catSum})`;
                else statusSuffix = ` (Exceso de S/ ${catSum - cat.requiredAmount})`;
            } else if (cat.maxAllowed !== undefined) {
                if (catSum <= cat.maxAllowed) statusSuffix = ` (Tope Máx: S/ ${cat.maxAllowed})`;
                else statusSuffix = ` ⚠️ (Rompiste tope por S/ ${catSum - cat.maxAllowed})`;
            }
            zoneTotal.textContent = `S/ ${catSum.toLocaleString()}${statusSuffix}`;
        }
        totalAllocated += catSum;
    });

    const remaining = stateObj.income - totalAllocated;
    const allocatedEl = $('#budget-hud-allocated');
    const remainingEl = $('#budget-hud-remaining');
    const pillEl = $('#budget-status-pill');
    const hintBanner = $('#budget-hint-banner');
    const validateBtn = $('#btn-budget-validate');

    if (allocatedEl) allocatedEl.textContent = `S/ ${totalAllocated.toLocaleString()}`;
    if (remainingEl) remainingEl.textContent = `S/ ${remaining.toLocaleString()}`;

    if (remainingEl && pillEl && hintBanner) {
        remainingEl.className = 'budget-hud-value';
        pillEl.className = 'budget-status-pill';
        hintBanner.className = 'budget-hint-banner';

        if (remaining === 0) {
            remainingEl.classList.add('balance-perfect');
            pillEl.classList.add('perfect');
            pillEl.textContent = '✨ Balance Cero (S/ 0) Perfecto';
            hintBanner.classList.add('perfect');
            hintBanner.innerHTML = '🎉 <strong>¡Balanza Cuadrada!</strong> Tu presupuesto está perfecto. Haz clic en <strong>VALIDAR PRESUPUESTO</strong>.';
            if (validateBtn) validateBtn.classList.add('ready');
        } else if (remaining > 0) {
            remainingEl.classList.add('balance-surplus');
            pillEl.classList.add('surplus');
            pillEl.textContent = `Pendiente por gastar S/ ${remaining}`;
            hintBanner.classList.add('surplus');
            hintBanner.innerHTML = `💡 <strong>Aún te sobran S/ ${remaining}:</strong> Asigna tarjetas restantes a sus categorías correctas para completar los S/ ${stateObj.income.toLocaleString()}.`;
            if (validateBtn) validateBtn.classList.remove('ready');
        } else {
            const deficit = Math.abs(remaining);
            remainingEl.classList.add('balance-deficit');
            pillEl.classList.add('deficit');
            pillEl.textContent = `Sobregirado: -S/ ${deficit}`;
            hintBanner.classList.add('deficit');
            hintBanner.innerHTML = `⚠️ <strong>Peligro de Sobregiro (-S/ ${deficit}):</strong> Estás asumiendo deudas. Retira tarjetas usando <strong>✕</strong> o devuélvelas a la caja haciendo clic en ellas.`;
            if (validateBtn) validateBtn.classList.remove('ready');
        }
    }
}

function createBudgetCardElement(card, location) {
    const cardEl = document.createElement('div');
    cardEl.className = 'budget-card';
    cardEl.draggable = true;
    cardEl.dataset.cardId = card.id;

    let removeBtnHtml = '';
    if (location !== 'pool') {
        removeBtnHtml = `<button class="budget-card-remove-btn" title="Deshacer tarjeta">✕</button>`;
    }

    cardEl.innerHTML = `
    <div class="budget-card-info">
      <span class="budget-card-emoji">${card.emoji}</span>
      <span class="budget-card-name">${card.name}</span>
    </div>
    <span class="budget-card-amount">S/ ${card.amount}</span>
    ${removeBtnHtml}
  `;

    // OPTIMIZACIÓN: Los listeners de cada tarjeta se asignan al momento de su creación.
    cardEl.addEventListener('dragstart', (e) => {
        cardEl.classList.add('dragging');
        e.dataTransfer.setData('text/plain', cardEl.dataset.cardId);
        e.dataTransfer.effectAllowed = 'move';
    });

    cardEl.addEventListener('dragend', () => {
        cardEl.classList.remove('dragging');
        $$('.budget-dropzone').forEach(z => z.classList.remove('drag-over'));
    });

    const removeBtn = cardEl.querySelector('.budget-card-remove-btn');
    if (removeBtn) {
        removeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            moveCardTo(card.id, 'pool');
        });
    }

    // CLIC-TO-MOVE (SOPORTE VITAL PARA MOVILES y TOUCH SCREENS)
    cardEl.addEventListener('click', (e) => {
        if (e.target.classList.contains('budget-card-remove-btn')) return;
        showCardCategorySelector(card, location);
    });

    return cardEl;
}

function showCardCategorySelector(card, currentLocation) {
    const stateObj = currentBudgetState;
    if (!stateObj) return;

    const data = stateObj.data;
    let buttonsHtml = '';

    if (currentLocation !== 'pool') {
        buttonsHtml += `
      <button class="card-select-btn" data-target-cat="pool">
        📦 Deshacer y regresar a disponibles
      </button>
    `;
    }

    data.categories.forEach(cat => {
        if (cat.id !== currentLocation) {
            buttonsHtml += `
        <button class="card-select-btn" data-target-cat="${cat.id}">
          Destinar a ${cat.title}
        </button>
      `;
        }
    });

    showModal(`
    <div class="card-select-modal">
      <div class="card-select-modal-title">
        ${card.emoji} ${card.name} (S/ ${card.amount})
      </div>
      <p style="color:var(--text-secondary); margin-bottom:1.25rem; font-size:0.9rem;">
        ¿A qué bolsa contable destinarás este concepto financiero?
      </p>
      <div class="card-select-options">${buttonsHtml}</div>
    </div>
  `, 'category-select');

    DOM.modalContent.querySelectorAll('[data-target-cat]').forEach(btn => {
        btn.addEventListener('click', () => {
            const targetCat = btn.dataset.targetCat;
            hideModal();
            moveCardTo(card.id, targetCat);
        });
    });
}

function moveCardTo(cardId, targetLocation) {
    const stateObj = currentBudgetState;
    if (!stateObj) return;

    let foundCard = null;

    const poolIdx = stateObj.poolCards.findIndex(c => c.id === cardId);
    if (poolIdx !== -1) {
        foundCard = stateObj.poolCards.splice(poolIdx, 1)[0];
    } else {
        for (const catId of Object.keys(stateObj.dropzones)) {
            const zIdx = stateObj.dropzones[catId].findIndex(c => c.id === cardId);
            if (zIdx !== -1) {
                foundCard = stateObj.dropzones[catId].splice(zIdx, 1)[0];
                break;
            }
        }
    }

    if (!foundCard) return;

    // VALIDACIÓN ESTRICTA DE CATEGORÍA CORRECTA (Cumplimiento de coherencia del usuario)
    if (targetLocation !== 'pool' && foundCard.validCategory && targetLocation !== foundCard.validCategory) {
        stateObj.poolCards.push(foundCard);
        updateBudgetBoard();
        showModal(`
        <div class="minigame-feedback-modal">
          <span class="feedback-icon">⚠️</span>
          <div class="feedback-title incorrect">Categoría Financiera Equivocada</div>
          <div class="feedback-explanation">
            El concepto de gasto <strong>"${foundCard.name}"</strong> no tiene coherencia en esta bolsa contable.<br><br>
            💡 <strong>Orientación:</strong> Analiza si es un gasto indispensable de operación (Fijo/Inevitables) o un gusto de estatus/Ocio para meterlo en la sección que corresponda lógicamente. ¡Repite la acción!
          </div>
          <button class="feedback-btn" id="btn-cat-err-close">
            De acuerdo, lo analizaré bien
          </button>
        </div>
      `, 'learning');
        $('#btn-cat-err-close').addEventListener('click', hideModal);
        return;
    }

    if (targetLocation === 'pool') {
        stateObj.poolCards.push(foundCard);
    } else if (stateObj.dropzones[targetLocation]) {
        stateObj.dropzones[targetLocation].push(foundCard);
    }

    updateBudgetBoard();
}

function resetBudgetCards() {
    const stateObj = currentBudgetState;
    if (!stateObj) return;

    const data = stateObj.data;
    stateObj.poolCards = JSON.parse(JSON.stringify(data.cards));
    stateObj.dropzones = {};
    data.categories.forEach(cat => {
        stateObj.dropzones[cat.id] = [];
    });

    updateBudgetBoard();
}

function handleBudgetValidation() {
    const stateObj = currentBudgetState;
    if (!stateObj) return;

    const data = stateObj.data;
    let totalAllocated = 0;
    Object.values(stateObj.dropzones).forEach(cardsList => {
        cardsList.forEach(c => totalAllocated += c.amount);
    });
    const remaining = stateObj.income - totalAllocated;

    if (remaining < 0) {
        showModal(`
        <div class="minigame-feedback-modal">
          <span class="feedback-icon">⚠️</span>
          <div class="feedback-title incorrect">Alerta: Sobregiro Financiero de (-S/ ${Math.abs(remaining).toLocaleString()})</div>
          <div class="feedback-explanation">
            Tus intenciones gastan <strong>S/ ${totalAllocated.toLocaleString()}</strong> de un límite rígido de S/ ${stateObj.income.toLocaleString()}. El dinero no cae del cielo.<br><br>
            💡 <strong>Reparar el error:</strong> Usa la "✕" para mandar las tarjetas de caprichos o excesos a la caja superior. Cuadra la balanza.
          </div>
          <button class="feedback-btn" id="btn-val-err-close">
            Entendido
          </button>
        </div>
      `, 'learning');
        $('#btn-val-err-close').addEventListener('click', hideModal);
        return;
    }

    if (remaining > 0) {
        showModal(`
        <div class="minigame-feedback-modal">
          <span class="feedback-icon">💡</span>
          <div class="feedback-title incorrect">Saldo Restante Vacante (+S/ ${remaining.toLocaleString()})</div>
          <div class="feedback-explanation">
            Quedan <strong>S/ ${remaining.toLocaleString()}</strong> huerfanos. En un presupuesto todo sol tiene un nombre.<br><br>
            🎯 <strong>Reparar el error:</strong> Finaliza el arrastre y ubica todo el disponible hasta que logres 0 absoluto.
          </div>
          <button class="feedback-btn" id="btn-val-err-close">
            A seguir trabajando
          </button>
        </div>
      `, 'learning');
        $('#btn-val-err-close').addEventListener('click', hideModal);
        return;
    }

    if (stateObj.stageNum === 2) {
        const laptopCards = stateObj.dropzones['laptop'] || [];
        const laptopSum = laptopCards.reduce((acc, c) => acc + c.amount, 0);
        if (laptopSum < 300) {
            showModal(`
            <div class="minigame-feedback-modal">
              <span class="feedback-icon">💻</span>
              <div class="feedback-title incorrect">¡Fracasaste el Fondo de la Laptop!</div>
              <div class="feedback-explanation">
                Tu objetivo estelar inamovible es la Computadora para estudiar de S/ 300. Jamás se gasta sin pagarse a uno mismo primero.<br><br>
                💡 Ingresa la tarjeta obligatoria a la primera bolsa.
              </div>
              <button class="feedback-btn" id="btn-val-err-close">Corregir error</button>
            </div>
          `, 'learning');
            $('#btn-val-err-close').addEventListener('click', hideModal);
            return;
        }

        const studyCards = stateObj.dropzones['inevitables'] || [];
        const studySum = studyCards.reduce((acc, c) => acc + c.amount, 0);
        if (studySum < 350) {
            showModal(`
            <div class="minigame-feedback-modal">
              <span class="feedback-icon">🎒</span>
              <div class="feedback-title incorrect">¡Cuidado! Gastos Universitarios Peligrando</div>
              <div class="feedback-explanation">
                Estás sacrificando cosas obligatorias como los pasajes (Total Mínimo: S/ 350) para ponerlas en otra cosa u omitirlas. Esto te hará fracasar en clases.
              </div>
              <button class="feedback-btn" id="btn-val-err-close">Corregir error</button>
            </div>
          `, 'learning');
            $('#btn-val-err-close').addEventListener('click', hideModal);
            return;
        }
    }

    if (data.hasSurprise && !stateObj.surpriseTriggered) {
        stateObj.surpriseTriggered = true;
        triggerBudgetSurpriseEvent(data.surpriseEvent);
        return;
    }

    finishBudgetMinigame();
}

function triggerBudgetSurpriseEvent(eventData) {
    const stateObj = currentBudgetState;

    showModal(`
    <div class="minigame-feedback-modal">
      <span class="feedback-icon">🚨</span>
      <div class="feedback-title incorrect">${eventData.title}</div>
      <div class="feedback-explanation">
        ${eventData.desc}
      </div>
      <button class="feedback-btn" id="btn-surprise-continue">
        ⚙️ ASUMIR CRISIS Y REAJUSTAR
      </button>
    </div>
  `, 'learning');

    $('#btn-surprise-continue').addEventListener('click', () => {
        hideModal();

        if (eventData.newCard) {
            stateObj.poolCards.push(eventData.newCard);
        }

        if (eventData.cardUpdates) {
            Object.entries(eventData.cardUpdates).forEach(([cId, newAmt]) => {
                for (const catId of Object.keys(stateObj.dropzones)) {
                    const card = stateObj.dropzones[catId].find(c => c.id === cId);
                    if (card) card.amount = newAmt;
                }
                const pCard = stateObj.poolCards.find(c => c.id === cId);
                if (pCard) pCard.amount = newAmt;
            });
        }

        if (eventData.newCards) {
            eventData.newCards.forEach(nCard => {
                stateObj.poolCards.push(nCard);
            });
        }

        updateBudgetBoard();
        showFloatingMinigameFeedback('Crisis Aplicada en números. Elimina lujos.', 'negative');
    });
}

function finishBudgetMinigame() {
    const stateObj = currentBudgetState;
    if (!stateObj) return;

    const data = stateObj.data;
    spawnConfetti(50);
    applyStats({ habilidades: 15, bienestar: 10 });

    const wrapper = $('#budget-game-wrapper');
    if (wrapper) {
        wrapper.innerHTML = `
      <div class="budget-debrief-container">
        <span class="budget-debrief-icon">${data.debrief.icon}</span>
        <h2 class="budget-debrief-title">${data.debrief.title}</h2>
        <p style="color:var(--text-secondary); font-size:1rem;">Superaste este nivel financiero sin quedar con deudas tóxicas.</p>

        <div class="budget-debrief-lesson">
          <h4>${data.debrief.lessonTitle}</h4>
          <p>${data.debrief.lessonText}</p>
        </div>

        <button class="btn-advance-stage" id="btn-advance-after-budget">
          ▶ CONTINUAR A LA SIGUIENTE ETAPA ➔
        </button>
      </div>
    `;

        $('#btn-advance-after-budget').addEventListener('click', () => {
            if (stateObj.onComplete) {
                stateObj.onComplete();
            }
        });
    }
}

// ═══════════════════════════════════════════
// RENDER FUNCTIONS (HISTORIA)
// ═══════════════════════════════════════════

function renderStage(stageNum) {
    const stage = STAGES[stageNum];
    if (!stage) return;

    state.currentStage = stageNum;
    state.currentStep = 0;

    let html = `
    <div class="stage-header ${stage.headerClass}" style="animation: fadeInUp 0.6s ease">
      <span class="stage-icon">${stage.icon}</span>
      <h2>${stage.title}</h2>
      <p class="stage-context">${stage.context}</p>
    </div>
    <div class="stage-minigame-container" id="stage-minigame-${stageNum}"></div>
    <div class="decisions-container" id="decisions-stage-${stageNum}">
    </div>
  `;

    DOM.gameContainer.innerHTML = html;
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (stageNum === 1) {
        const minigameContainer = $(`#stage-minigame-${stageNum}`);
        startMinigameStage1(minigameContainer, () => {
            minigameContainer.style.display = 'none';
            renderNextDecision(stageNum);
        });
    } else {
        renderNextDecision(stageNum);
    }
}

function renderNextDecision(stageNum) {
    const stage = STAGES[stageNum];
    const container = $(`#decisions-stage-${stageNum}`);
    const stepIdx = state.currentStep;

    if (stepIdx < stage.decisions.length) {
        const decision = stage.decisions[stepIdx];
        renderDecisionCard(container, decision, stageNum);
    } else if (stepIdx === stage.decisions.length) {
        renderEvents(stageNum);
    }
}

function renderDecisionCard(container, decision, stageNum) {
    const card = document.createElement('div');
    card.className = 'decision-card';
    card.style.animation = 'fadeInUp 0.5s ease';
    card.id = `card-${decision.id}`;

    let optionsHtml = decision.options.map((opt, i) => {
        return `
      <button class="option-btn" data-decision-id="${decision.id}" data-option-index="${i}">
        <div>
          <div class="option-label">${opt.label}</div>
          <div class="option-effect">${opt.desc}</div>
        </div>
      </button>
    `;
    }).join('');

    card.innerHTML = `
    <div class="card-header">
      <span class="card-emoji">${decision.emoji}</span>
      <p class="card-title">${decision.title}</p>
    </div>
    <div class="decision-options">
      ${optionsHtml}
    </div>
  `;

    container.appendChild(card);

    setTimeout(() => {
        card.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);

    card.querySelectorAll('.option-btn').forEach(btn => {
        btn.addEventListener('click', () => handleDecisionClick(btn, decision, stageNum));
    });
}

function handleDecisionClick(btn, decision, stageNum) {
    const optionIdx = parseInt(btn.dataset.optionIndex);
    const option = decision.options[optionIdx];

    state.choices[decision.id] = option.choiceValue;
    if (decision.id === 'carrera') {
        state.careerName = option.choiceValue;
    }

    let effectToApply = { ...option.effect };
    if (option.losesAll) {
        effectToApply.soles = state.soles > 0 ? -state.soles : 0; 
    }

    applyStats(effectToApply);

    const card = $(`#card-${decision.id}`);
    card.classList.add('completed');

    card.querySelectorAll('.option-btn').forEach(b => {
        b.style.opacity = '0.4';
        b.style.pointerEvents = 'none';
    });
    btn.style.opacity = '1';
    btn.style.borderColor = 'var(--gold)';
    btn.style.background = 'rgba(255,215,0,0.08)';

    state.currentStep++;
    setTimeout(() => renderNextDecision(stageNum), 800);
}

function renderEvents(stageNum) {
    const stage = STAGES[stageNum];
    const container = $(`#decisions-stage-${stageNum}`);

    const divider = document.createElement('div');
    divider.className = 'section-divider';
    divider.innerHTML = '<span>⚡ EVENTUALIDADES REALES ⚡</span>';
    divider.style.animation = 'fadeInUp 0.5s ease';
    container.appendChild(divider);

    let eventIdx = 0;
    function showNextEvent() {
        if (eventIdx >= stage.events.length) {
            setTimeout(() => showCheckpoint(stageNum), 1000);
            return;
        }

        const event = stage.events[eventIdx];
        eventIdx++;

        setTimeout(() => {
            showEventModal(event, stageNum, () => {
                setTimeout(showNextEvent, 600);
            });
        }, 800);
    }

    showNextEvent();
}

function showEventModal(event, stageNum, onDone) {
    const type = event.type === 'red' ? 'event-red' : 'event-green';

    if (event.type === 'green') {
        spawnConfetti(25);
    }

    let buttonsHtml = '';

    if (event.conditional) {
        let conditionMet;
        if (event.conditionThreshold !== undefined) {
            conditionMet = state[event.conditionKey] >= event.conditionThreshold;
        } else {
            conditionMet = state[event.conditionKey] === true;
        }

        const option = conditionMet ? event.trueOption : event.falseOption;
        buttonsHtml = `
      <div class="event-buttons">
        <button class="event-btn ${conditionMet ? 'primary' : 'danger'}" id="event-auto-btn">
          ${option.label}<br><small>${option.desc}</small>
        </button>
      </div>
    `;

        showModal(`
      <span class="event-icon">${event.icon}</span>
      <h3 class="event-title">${event.title}</h3>
      <p class="event-description">${event.description}</p>
      ${buttonsHtml}
    `, type);

        const btn = $('#event-auto-btn');
        btn.addEventListener('click', () => {
            let effectToApply = { ...option.effect };
            if (option.losesAll) {
                effectToApply.soles = state.soles > 0 ? -state.soles : 0;
            }
            applyStats(effectToApply);
            hideModal();
            if (onDone) onDone();
        });

    } else if (event.options) {
        buttonsHtml = event.options.map((opt, i) => {
            const btnClass = i === 0 ? 'primary' : 'secondary';
            return `<button class="event-btn ${btnClass}" data-event-opt="${i}">
        ${opt.label}<br><small>${opt.desc}</small>
      </button>`;
        }).join('');

        showModal(`
      <span class="event-icon">${event.icon}</span>
      <h3 class="event-title">${event.title}</h3>
      <p class="event-description">${event.description}</p>
      <div class="event-buttons">${buttonsHtml}</div>
    `, type);

        DOM.modalContent.querySelectorAll('[data-event-opt]').forEach(btn => {
            btn.addEventListener('click', () => {
                const idx = parseInt(btn.dataset.eventOpt);
                const opt = event.options[idx];
                let effectToApply = { ...opt.effect };
                if (opt.losesAll) {
                    effectToApply.soles = state.soles > 0 ? -state.soles : 0;
                }
                applyStats(effectToApply);
                hideModal();
                if (onDone) onDone();
            });
        });
    }
}

function showCheckpoint(stageNum) {
    const stage = STAGES[stageNum];
    const cp = stage.checkpoint;

    let optionsHtml = cp.options.map((opt, i) => `
    <button class="checkpoint-btn" data-cp-opt="${i}">
      <span class="btn-label">Opción ${opt.label}: ${opt.title}</span>
      <span class="btn-desc">${opt.desc}</span>
    </button>
  `).join('');

    showModal(`
    <div class="checkpoint-badge">
      <div class="badge-icon">🛑</div>
    </div>
    <div class="checkpoint-title">${cp.title}</div>
    <div class="checkpoint-topic">${cp.topic}</div>
    <div class="checkpoint-situation">${cp.situation}</div>
    <div class="checkpoint-buttons">${optionsHtml}</div>
  `, 'checkpoint');

    DOM.modalContent.querySelectorAll('[data-cp-opt]').forEach(btn => {
        btn.addEventListener('click', () => {
            const idx = parseInt(btn.dataset.cpOpt);
            const opt = cp.options[idx];
            state.choices[cp.choiceKey] = opt.choiceValue;
            
            applyStats(opt.effect);
            hideModal();

            setTimeout(() => showLearningWindow(cp.learning, () => {
                renderBudgetMinigame(stageNum, () => {
                    advanceToNextStage(stageNum);
                });
            }), 500);
        });
    });
}

function showLearningWindow(learning, onDone) {
    showModal(`
    <div class="learning-header">
      <span class="bulb-icon">💡</span>
      <h3>${learning.title}</h3>
    </div>
    <div class="learning-text">${learning.text}</div>
    <button class="learning-continue-btn" id="learning-continue">
      ▶ COMPRENDIDO Y CONTINUAR
    </button>
  `, 'learning');

    $('#learning-continue').addEventListener('click', () => {
        hideModal();
        if (onDone) onDone();
    });
}

function advanceToNextStage(currentStageNum) {
    if (currentStageNum === 3) {
        showFinalReflection();
        return;
    }

    const nextStage = currentStageNum + 1;
    const icons = { 2: '🎓', 3: '👔' };
    const texts = {
        2: '¡Inicias la Universidad!',
        3: '¡Inicias la Vida Adulta Real!'
    };

    showStageTransition(icons[nextStage], texts[nextStage], () => {
        renderStage(nextStage);
    });
}

// ═══════════════════════════════════════════
// FINAL REFLECTION
// ═══════════════════════════════════════════

function showFinalReflection() {
    const finalReflection = {
        title: 'GRAN REFLEXIÓN FINAL',
        topic: '¿Para qué quiero ahorrar y sufrir financieramente?: Proyecto de vida',
        situation: 'Has sobrevivido a la universidad, a las deudas y hasta a fenómenos naturales que azotan el país. Pero el dinero sin brújula y propósito se acaba gastando de todos modos. ¿Cuál será el gran objetivo vital por el que peleaste en el juego?',
        options: [
            {
                label: 'A',
                title: '🏠 La Tranquilidad de la vida',
                desc: 'Ahorré y fui disciplinado para tener mi propio hogar seguro y la paz mental de que nunca me faltará ni dinero, salud o comida si me ocurre algo trágico a mí o a los míos.',
                effect: { bienestar: 50 },
                choiceValue: 'Paz y Tranquilidad'
            },
            {
                label: 'B',
                title: '🚀 La Libertad Financiera absoluta',
                desc: 'Me privé de lujos tontos, me aguanté caprichos y controlé mi impulsividad para tener dinero que invertiré para generar más rentas, lograr que mis billetes trabajen por mí en el futuro y liberarme de mi horario laboral para siempre.',
                effect: { bienestar: 50 },
                choiceValue: 'Inversión y Libertad'
            }
        ],
        learning: {
            title: '🏆 El Mensaje que Cambia Vidas',
            text: 'Todos los caprichos reprimidos hoy, los lujos vacíos a los que dijiste "NO", y la disciplina contable que mostraste tienen una enorme recompensa. El dinero por sí solo es papel y metal, pero administrado correctamente sirve para comprar el lujo humano supremo: TIEMPO y LIBERTAD de las deudas y el miedo. Estar blindado financieramente no tiene precio. ¡Veamos las consecuencias históricas de tus decisiones a lo largo de este juego!'
        }
    };

    let optionsHtml = finalReflection.options.map((opt, i) => `
    <button class="checkpoint-btn" data-final-opt="${i}">
      <span class="btn-label">Vía ${opt.label}: ${opt.title}</span>
      <span class="btn-desc">${opt.desc}</span>
    </button>
  `).join('');

    showModal(`
    <div class="checkpoint-badge">
      <div class="badge-icon">🏆</div>
    </div>
    <div class="checkpoint-title">${finalReflection.title}</div>
    <div class="checkpoint-topic">${finalReflection.topic}</div>
    <div class="checkpoint-situation">${finalReflection.situation}</div>
    <div class="checkpoint-buttons">${optionsHtml}</div>
    <p style="text-align:center; font-size:0.75rem; color:var(--text-muted); margin-top:1rem; font-style:italic;">
      (No hay opción falsa aquí ✨)
    </p>
  `, 'checkpoint');

    DOM.modalContent.querySelectorAll('[data-final-opt]').forEach(btn => {
        btn.addEventListener('click', () => {
            const idx = parseInt(btn.dataset.finalOpt);
            const opt = finalReflection.options[idx];
            state.choices.finalChoice = opt.choiceValue;
            applyStats(opt.effect);
            hideModal();

            setTimeout(() => showLearningWindow(finalReflection.learning, () => {
                setTimeout(showResults, 1000);
            }), 500);
        });
    });
}

// ═══════════════════════════════════════════
// RESULTS SCREEN
// ═══════════════════════════════════════════

function calculateRank() {
    if (state.ahorroEmergencia && state.seguroSalud && state.soles > 0 && state.riesgoCrediticio > 50) {
        return 'S';
    }
    if (state.soles <= 0 || (state.riesgoCrediticio < 20 && !state.ahorroEmergencia)) {
        return 'C';
    }
    return 'B';
}

function showResults() {
    const rank = calculateRank();

    DOM.gameContainer.classList.remove('visible');
    DOM.statsBar.classList.remove('visible');
    DOM.resultsScreen.className = `rank-${rank.toLowerCase()}`;
    DOM.resultsScreen.classList.add('visible');

    spawnConfetti(rank === 'S' ? 80 : rank === 'B' ? 40 : 10);

    const rankData = {
        S: {
            icon: '🌟',
            letter: 'S',
            title: 'El Gran Maestro Financiero',
            msgTitle: '¡Te graduaste en abundancia! La tranquilidad es tuya para siempre.',
            msgText: 'Tu mente está configurada para el éxito y el progreso. Demostraste que entiendes a la perfección lo costoso y difícil que es ganar dinero real y lo extremadamente valioso que es resguardarlo de manera inteligente. No cediste a la brutal presión del marketing o los falsos caprichos inmediatos que quiebran a la gente común. Armaste tu Mochila de Protección de vida de manera intacta, te sobrepusiste a golpes duros de la vida como crisis y catástrofes sin llorar, porque tenías cómo rebotar gracias a tu prudencia y tu disciplina matemática en los presupuestos. ¡Construiste un auténtico muro de seguridad irrompible. Felicitaciones enormes por ganar en el juego y, seguramente pronto, en la vida real!'
        },
        B: {
            icon: '⚖️',
            letter: 'B',
            title: 'Rescatado del Límite del Abismo',
            msgTitle: '¡Has sobrevivido... pero cruzaste valles de estrés espantosos!',
            msgText: 'Respiras, y has logrado un final estable, pero tu transcurso estuvo lleno de sudor frío en el banco. Entregaste partes de tu tranquilidad a compras impulsivas perdiendo poder adquisitivo valioso o evitaste pagar las cuotas preventivas seguras a cambio de apostarlo todo, arriesgándote a quedar quebrado. Recuerda que la vida te pone catástrofes gigantes de las cuales jamás te podrás escapar, tu única vía real era y siempre será un presupuesto hermético planificado. Sigue construyendo tu disciplina monetaria para dejar atrás los abismos financieros. ¡Tienes salvación por delante!'
        },
        C: {
            icon: '🚨',
            letter: 'C',
            title: 'Hundido en la Alerta Roja Financiera',
            msgTitle: '¡Auch! La improvisación y la falta de prudencia arruinaron la balanza.',
            msgText: 'El juego en la ciudad te ha entregado una paliza pedagógica que jamás olvidarás en el mundo real. Tus impulsos inmediatos y deseos vacíos te convencieron de vaciar tu patrimonio o adquirir deudas espantosas. No contaste con herramientas defensivas sólidas, por lo que una estafa o la inflación arrastraron el valor de tu futuro. Sin el blindaje de la EPS (seguro) o un pozo, el peso financiero te quebró. Aprende a fondo la lección que este juego virtual te dio para que no pases esa desesperación y terror al desastre en un día futuro. ¡Repite el desafío y vuélvete fuerte e indestructible financieramente!'
        }
    };

    const rd = rankData[rank];

    let eduSummary = state.choices.estudio || 'Sin definir';
    let cardSummary = state.choices.tarjeta || 'Sin definir';
    let mochilaSummary = (state.ahorroEmergencia ? '🛡️ SÍ' : '❌ NO') + ' / ' + (state.seguroSalud ? '🏥 SÍ' : '❌ NO');

    DOM.resultsWrapper.innerHTML = `
    <div class="results-rank-badge">
      <span class="rank-icon">${rd.icon}</span>
      <div class="rank-letter">${rd.letter}</div>
      <div class="rank-title">${rd.title}</div>
    </div>

    <div class="results-stats">
      <div class="result-stat-card">
        <span class="stat-emoji">💰</span>
        <div class="stat-name">Soles y Capital</div>
        <div class="stat-value money" id="result-soles">S/ 0</div>
      </div>
      <div class="result-stat-card">
        <span class="stat-emoji">🎓</span>
        <div class="stat-name">Poder de Habilidades</div>
        <div class="stat-value skill" id="result-skill">0/100</div>
      </div>
      <div class="result-stat-card">
        <span class="stat-emoji">❤️</span>
        <div class="stat-name">Salud y Bienestar</div>
        <div class="stat-value health-val" id="result-health">0/100</div>
      </div>
      <div class="result-stat-card">
        <span class="stat-emoji">💳</span>
        <div class="stat-name">Reputación Crédito</div>
        <div class="stat-value credit-val" id="result-credit">0/100</div>
      </div>
    </div>

    <div class="results-summary">
      <h3>📋 Registro del Historial del Jugador</h3>
      <div class="summary-item">
        <span class="label">Prioridad en etapa escolar</span>
        <span class="value">${eduSummary}</span>
      </div>
      <div class="summary-item">
        <span class="label">Carrera Superior Generadora</span>
        <span class="value">${state.careerName || 'Sin definir'}</span>
      </div>
      <div class="summary-item">
        <span class="label">Disciplina de Tarjetas Crediticias</span>
        <span class="value">${cardSummary}</span>
      </div>
      <div class="summary-item">
        <span class="label">Escudos Activos (Fondo/Seguro)</span>
        <span class="value">${mochilaSummary}</span>
      </div>
      <div class="summary-item">
        <span class="label">Meta Suprema de Vida Final</span>
        <span class="value">${state.choices.finalChoice || 'Sin definir'}</span>
      </div>
    </div>

    <div class="results-message">
      <div class="message-title">${rd.msgTitle}</div>
      <div class="message-text" id="result-message-text"></div>
    </div>

    <button class="play-again-btn" id="btn-play-again">🔄 JUGAR E IMPONER DISCIPLINA</button>
  `;

    animateTallyUp('result-soles', 0, state.soles, 'S/ ', '');
    animateTallyUp('result-skill', 0, state.habilidades, '', '/100');
    animateTallyUp('result-health', 0, state.bienestar, '', '/100');
    animateTallyUp('result-credit', 0, state.riesgoCrediticio, '', '/100');

    setTimeout(() => {
        const msgEl = $('#result-message-text');
        typewriterEffect(msgEl, rd.msgText, 25);
    }, 2000);

    $('#btn-play-again').addEventListener('click', () => {
        location.reload();
    });
}

function animateTallyUp(elementId, from, to, prefix, suffix) {
    const el = $(`#${elementId}`);
    if (!el) return;

    const duration = 1500;
    const startTime = performance.now();

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 4);
        const current = Math.round(from + (to - from) * eased);
        el.textContent = `${prefix}${current.toLocaleString()}${suffix}`;

        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }

    requestAnimationFrame(update);
}

// ═══════════════════════════════════════════
// INIT Y CÓDIGO BOOTSTRAP
// ═══════════════════════════════════════════

document.addEventListener('DOMContentLoaded', () => {
    $('#btn-start').addEventListener('click', () => {
        DOM.startScreen.style.opacity = '0';
        DOM.startScreen.style.transition = 'opacity 0.6s ease';

        setTimeout(() => {
            DOM.startScreen.style.display = 'none';
            DOM.statsBar.classList.add('visible');
            DOM.gameContainer.classList.add('visible');
            updateStats();
            renderStage(1);
        }, 600);
    });
});