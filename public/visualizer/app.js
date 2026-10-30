/**
 * Tatwa Product Visualizer - Decoupled Client Logic
 * Subscribes to Tool Backend (Cloudflare Worker or Local Node Server) via SSE / HTTP.
 * Fully decoupled: Can be run locally via file:// or static server, or deployed anywhere.
 */

(() => {
  const pageStartTime = Date.now();
  let userInteractedRecently = false;

  // 1. Backend URL Management
  function getInitialBackendUrl() {
    if (typeof window !== 'undefined' && window.location) {
      const urlParams = new URLSearchParams(window.location.search);
      const qBackend = urlParams.get('backend');
      if (qBackend && qBackend.trim()) return qBackend.trim();
    }

    const saved = localStorage.getItem('tatwa_backend_url');
    if (saved && saved.trim() && !saved.includes('case-3-video-agent')) return saved.trim();

    if (window.TATWA_BACKEND_URL && window.TATWA_BACKEND_URL.trim()) {
      return window.TATWA_BACKEND_URL.trim();
    }

    if (typeof window !== 'undefined' && window.location) {
      if (window.location.hostname.includes('workers.dev') || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        return window.location.origin;
      }
    }

    // Default to the live Tatwa Cloudflare Worker backend
    return 'https://tatwa-electronics.sameer-kar.workers.dev';
  }

  let backendUrl = getInitialBackendUrl();
  if (backendUrl.endsWith('/')) {
    backendUrl = backendUrl.slice(0, -1);
  }

  // 2. Session ID Management: Always default to 'default' matching Oration AI Webhooks
  function getSessionId() {
    if (typeof window !== 'undefined' && window.location) {
      const urlParams = new URLSearchParams(window.location.search);
      const qSess = urlParams.get('sessionId') || urlParams.get('session');
      if (qSess && qSess.trim()) return qSess.trim();
    }
    return 'default';
  }

  const sessionId = getSessionId();

  // DOM Elements
  const displaySessionEl = document.getElementById('display-session-id');
  const btnCopySession = document.getElementById('btn-copy-session');
  const serverStatusPill = document.getElementById('server-status-pill');
  const serverStatusText = document.getElementById('server-status-text');
  const backendUrlDisplay = document.getElementById('backend-url-display');
  const btnEditBackend = document.getElementById('btn-edit-backend');
  const productGrid = document.getElementById('product-grid');
  const displayModeBadge = document.getElementById('display-mode-badge');
  const displaySubtitle = document.getElementById('display-subtitle');
  const toastMsg = document.getElementById('toast-msg');
  const widgetMountPoint = document.getElementById('widget-mount-point');
  const agentStatusLabel = document.getElementById('agent-status-label');
  const btnToggleMenu = document.getElementById('btn-toggle-menu');
  const triggersDropdown = document.getElementById('triggers-dropdown');
  const triggersMenuDropdown = document.querySelector('.triggers-menu-dropdown');

  if (displaySessionEl) {
    displaySessionEl.textContent = sessionId;
  }

  // Micro-interaction: Animated display badge update
  function updateDisplayBadge(text) {
    if (!displayModeBadge) return;
    displayModeBadge.textContent = text;
    displayModeBadge.classList.remove('badge-updated');
    void displayModeBadge.offsetWidth;
    displayModeBadge.classList.add('badge-updated');
  }

  // Subtle Tatwa Green Morph Transition for Tool Calls & Screen Switches
  const morphGlowEl = document.getElementById('morph-glow-fx');
  const splashLoaderEl = document.getElementById('tatwa-splash-loader');

  // Full-Screen Tatwa × OmniAgent Accent Green Splash Loader Lifecycle
  function dismissSplashLoader() {
    if (!splashLoaderEl || splashLoaderEl.classList.contains('morph-out')) return;
    splashLoaderEl.classList.add('morph-out');

    // Smoothly morph into main application screen
    playCyanMorphTransition();

    setTimeout(() => {
      splashLoaderEl.classList.add('hidden');
    }, 700);
  }

  function showSplashLoaderAndMorph(onComplete) {
    if (!splashLoaderEl) {
      if (onComplete) onComplete();
      return;
    }
    splashLoaderEl.classList.remove('hidden', 'morph-out');
    void splashLoaderEl.offsetWidth; // Force reflow

    setTimeout(() => {
      dismissSplashLoader();
      if (onComplete) onComplete();
    }, 1300);
  }

  // Auto-dismiss splash loader on page load after pleasant brand presentation
  window.addEventListener('load', () => {
    setTimeout(dismissSplashLoader, 1400);
  });
  if (document.readyState === 'complete') {
    setTimeout(dismissSplashLoader, 1400);
  }

  let lastMorphTimestamp = 0;
  function playCyanMorphTransition() {
    if (!morphGlowEl) return;
    const now = Date.now();
    // Guard against rapid duplicate firing within 380ms (eliminates double-render & clicky snap)
    if (now - lastMorphTimestamp < 380) return;
    lastMorphTimestamp = now;

    morphGlowEl.classList.remove('active');
    void morphGlowEl.offsetWidth; // Force reflow
    morphGlowEl.classList.add('active');
  }

  if (morphGlowEl) {
    morphGlowEl.addEventListener('animationend', () => {
      morphGlowEl.classList.remove('active');
    });
  }

  // Enhanced screen switching transition helper with subtle green morph and double-render guard
  let lastViewTransitionTimestamp = 0;
  function prepareViewTransition(container) {
    const target = container || document.getElementById('component-viewport') || productGrid;
    if (!target) return target;

    const now = Date.now();
    // Strict guard against duplicate calls within 380ms (eliminates double reflow and clicky stutter)
    if (now - lastViewTransitionTimestamp < 380) {
      return target;
    }
    lastViewTransitionTimestamp = now;

    target.scrollTop = 0;
    target.classList.remove('view-enter-active');
    void target.offsetWidth;
    target.classList.add('view-enter-active');

    // Trigger subtle green morph sheen
    playCyanMorphTransition();

    return target;
  }

  function updateBackendUrlDisplay() {
    if (backendUrlDisplay) {
      backendUrlDisplay.textContent = backendUrl || window.location.origin;
    }
    const btnCf = document.getElementById('btn-switch-cf');
    const btnLocal = document.getElementById('btn-switch-local');
    if (btnCf && btnLocal) {
      const isCf = backendUrl.includes('workers.dev');
      btnCf.classList.toggle('active', isCf);
      btnLocal.classList.toggle('active', !isCf);
    }
  }
  updateBackendUrlDisplay();

  // One-click backend switchers
  const btnSwitchCf = document.getElementById('btn-switch-cf');
  const btnSwitchLocal = document.getElementById('btn-switch-local');

  if (btnSwitchCf) {
    btnSwitchCf.addEventListener('click', () => {
      backendUrl = btnSwitchCf.getAttribute('data-url') || 'https://case-3-video-agent.talktous-056.workers.dev';
      localStorage.setItem('tatwa_backend_url', backendUrl);
      updateBackendUrlDisplay();
      showToast('Switched to Cloudflare Worker backend!');
      if (activeEventSource) activeEventSource.close();
      connectSSE();
      loadInitialImages();
    });
  }

  if (btnSwitchLocal) {
    btnSwitchLocal.addEventListener('click', () => {
      backendUrl = btnSwitchLocal.getAttribute('data-url') || 'http://localhost:3000';
      localStorage.setItem('tatwa_backend_url', backendUrl);
      updateBackendUrlDisplay();
      showToast('Switched to Local Node server (:3000)!');
      if (activeEventSource) activeEventSource.close();
      connectSSE();
      loadInitialImages();
    });
  }

  // Toast feedback helper
  function showToast(text) {
    if (!toastMsg) return;
    toastMsg.textContent = text;
    toastMsg.classList.add('visible');
    setTimeout(() => toastMsg.classList.remove('visible'), 2400);
  }

  if (btnCopySession) {
    btnCopySession.addEventListener('click', () => {
      navigator.clipboard.writeText(sessionId).then(() => showToast('Session ID copied!'));
    });
  }

  // Start New Session Button
  const btnNewSession = document.getElementById('btn-new-session');
  if (btnNewSession) {
    btnNewSession.addEventListener('click', () => {
      const newSess = 'sess_' + Math.random().toString(36).substring(2, 9);
      sessionStorage.setItem('tatwa_visualizer_session', newSess);
      if (displaySessionEl) {
        displaySessionEl.textContent = newSess;
      }
      showToast('New session started: ' + newSess);

      // Trigger full accent green splash morph into fresh welcome screen
      showSplashLoaderAndMorph(() => {
        renderTatwaWelcomeScreen();
        initOrationWidget();
      });
    });
  }

  // Edit Backend URL prompt
  if (btnEditBackend) {
    btnEditBackend.addEventListener('click', () => {
      const current = backendUrl || window.location.origin;
      const input = prompt(
        'Enter Backend Tool API URL:\n(e.g., http://localhost:3000 or https://case-3-video-agent.talktous-056.workers.dev)',
        current
      );
      if (input !== null) {
        let cleaned = input.trim();
        if (cleaned.endsWith('/')) cleaned = cleaned.slice(0, -1);
        backendUrl = cleaned;
        localStorage.setItem('tatwa_backend_url', cleaned);
        updateBackendUrlDisplay();
        showToast('Backend URL updated! Reconnecting...');

        // Reconnect SSE and reload
        if (activeEventSource) {
          activeEventSource.close();
        }
        initOrationWidget();
        connectSSE();
        loadInitialImages();
      }
    });
  }

  // Quick Triggers Dropdown Menu Toggle (Moved to Right Pane)
  if (btnToggleMenu && triggersDropdown) {
    btnToggleMenu.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = triggersDropdown.classList.contains('open');
      if (isOpen) {
        triggersDropdown.classList.remove('open');
        triggersMenuDropdown?.classList.remove('open');
      } else {
        triggersDropdown.classList.add('open');
        triggersMenuDropdown?.classList.add('open');
      }
    });

    // Close when clicking anywhere outside
    document.addEventListener('click', (e) => {
      if (!triggersDropdown.contains(e.target) && !btnToggleMenu.contains(e.target)) {
        triggersDropdown.classList.remove('open');
        triggersMenuDropdown?.classList.remove('open');
      }
    });
  }

  // 3. Fetch Oration Keys from Backend and Mount <oration-widget>
  async function initOrationWidget() {
    let pk = '70588826-0a19-4c4f-abdf-6de6c720d793';
    let ag = '128f59b2-7f37-4e1f-badd-f18c7a2a2287';

    try {
      const targetUrl = backendUrl ? `${backendUrl}/api/config` : '/api/config';
      const res = await fetch(targetUrl);
      if (res.ok) {
        const config = await res.json();
        if (config.publicKey && !config.publicKey.startsWith('pk_your_')) pk = config.publicKey;
        if (config.agentId && !config.agentId.startsWith('ag_your_')) ag = config.agentId;
      }
    } catch (e) {
      console.warn('Could not fetch /api/config from backend; using default Tatwa agent keys', e);
    }

    if (widgetMountPoint) {
      widgetMountPoint.innerHTML = `
        <div class="tatwa-voice-card" id="tatwa-voice-hero">
          <div class="voice-hero-orb-wrap">
            <div class="voice-hero-ripple r1"></div>
            <div class="voice-hero-ripple r2"></div>
            <button class="voice-hero-orb-btn" id="btn-hero-start-voice" title="Tap to Start Voice Assistant">
              <span class="orb-mic-icon">🎙️</span>
            </button>
          </div>
          <h3 class="voice-hero-title">Tatwa AI Voice Assistant</h3>
          <p class="voice-hero-subtitle">Tap below to talk naturally in English, Hindi, Tamil, Kannada, or Telugu.</p>

          <div class="voice-hero-actions">
            <button class="btn-hero-voice-mode" id="btn-hero-voice-action">
              <span class="btn-act-icon">🎙️</span>
              <span>Tap to Speak (Voice Mode)</span>
            </button>
            <button class="btn-hero-chat-mode" id="btn-hero-chat-action">
              <span class="btn-act-icon">💬</span>
              <span>Open Text Chat</span>
            </button>
          </div>

          <div class="voice-hero-prompts-box">
            <div class="prompts-box-header">💡 Try Asking:</div>
            <div class="hero-prompt-item" data-prompt="30,000 के अंदर डिशवॉशर और चिमनी">"30,000 के अंदर डिशवॉशर और चिमनी"</div>
            <div class="hero-prompt-item" data-prompt="Compare 55 inch QLED vs 65 inch OLED TV">"Compare 55\" QLED vs 65\" OLED TV"</div>
            <div class="hero-prompt-item" data-prompt="Chimney heat auto-clean step-by-step procedure">"Chimney heat auto-clean procedure"</div>
            <div class="hero-prompt-item" data-prompt="Dishwasher salt refill and maintenance">"Dishwasher salt refill and maintenance"</div>
          </div>
        </div>

        <div class="oration-widget-dock" id="oration-widget-dock">
          <oration-widget
            public-key="${pk}"
            default-agent-id="${ag}"
            conversation-type="both"
            dynamic-variables='${JSON.stringify({ sessionId })}'>
          </oration-widget>
        </div>
      `;

      if (agentStatusLabel) agentStatusLabel.textContent = `Active (${ag.slice(0, 8)}...)`;

      const btnResetVoice = document.getElementById('btn-reset-voice-pane');
      if (btnResetVoice) {
        btnResetVoice.onclick = () => {
          const heroCard = document.getElementById('tatwa-voice-hero');
          const dock = document.getElementById('oration-widget-dock');
          if (heroCard) heroCard.style.display = 'flex';
          if (dock) {
            dock.classList.remove('dock-active');
            dock.style.display = 'none';
          }
          btnResetVoice.style.display = 'none';
          if (agentStatusLabel) agentStatusLabel.textContent = `Active (${ag.slice(0, 8)}...)`;
          showToast('Returned to Voice Assistant Launcher');
        };
      }

      function triggerOration(mode = 'voice') {
        const heroCard = document.getElementById('tatwa-voice-hero');
        const dock = document.getElementById('oration-widget-dock');
        const widget = widgetMountPoint.querySelector('oration-widget');

        if (heroCard) heroCard.style.display = 'none';
        if (dock) {
          dock.classList.add('dock-active');
          dock.style.display = 'flex';
        }
        if (btnResetVoice) btnResetVoice.style.display = 'inline-flex';
        if (agentStatusLabel) agentStatusLabel.textContent = `Connecting (${mode.toUpperCase()})...`;

        function tryClick() {
          if (!widget || !widget.shadowRoot) return false;
          const buttons = Array.from(widget.shadowRoot.querySelectorAll('button'));
          const vBtn = buttons.find(b => b.textContent && b.textContent.includes('Voice'));
          const cBtn = buttons.find(b => b.textContent && b.textContent.includes('Chat'));

          if (mode === 'voice' && vBtn) {
            vBtn.click();
            if (agentStatusLabel) agentStatusLabel.textContent = 'Voice Active';
            return true;
          }
          if (mode === 'chat' && cBtn) {
            cBtn.click();
            if (agentStatusLabel) agentStatusLabel.textContent = 'Chat Active';
            return true;
          }

          const startTarget = widget.shadowRoot.querySelector('.cursor-pointer') ||
                              widget.shadowRoot.querySelector('span');
          if (startTarget) {
            startTarget.click();
            setTimeout(() => {
              const updatedBtns = Array.from(widget.shadowRoot.querySelectorAll('button'));
              const v = updatedBtns.find(b => b.textContent && b.textContent.includes('Voice'));
              const c = updatedBtns.find(b => b.textContent && b.textContent.includes('Chat'));
              if (mode === 'voice' && v) {
                v.click();
                if (agentStatusLabel) agentStatusLabel.textContent = 'Voice Active';
              } else if (mode === 'chat' && c) {
                c.click();
                if (agentStatusLabel) agentStatusLabel.textContent = 'Chat Active';
              }
            }, 350);
            return true;
          }
          return false;
        }

        if (!tryClick()) {
          let tries = 0;
          const poll = setInterval(() => {
            tries++;
            if (tryClick() || tries > 25) clearInterval(poll);
          }, 200);
        }
      }

      // Wire Hero Launcher Buttons
      const btnHeroOrb = document.getElementById('btn-hero-start-voice');
      const btnHeroVoice = document.getElementById('btn-hero-voice-action');
      const btnHeroChat = document.getElementById('btn-hero-chat-action');

      if (btnHeroOrb) btnHeroOrb.onclick = () => triggerOration('voice');
      if (btnHeroVoice) btnHeroVoice.onclick = () => triggerOration('voice');
      if (btnHeroChat) btnHeroChat.onclick = () => triggerOration('chat');

      // Wire sample prompts
      widgetMountPoint.querySelectorAll('.hero-prompt-item').forEach(item => {
        item.onclick = () => {
          const promptText = item.getAttribute('data-prompt');
          if (promptText) {
            hitTool({ query: promptText });
            showToast(`Simulated: "${promptText}"`);
          }
        };
      });

      const widget = widgetMountPoint.querySelector('oration-widget');
      if (widget) {
        embedWidgetInLeftPane(widget);

        // Auto-monitor widget state if user clicks directly on widget
        const checkWidgetObserver = setInterval(() => {
          if (widget.shadowRoot) {
            clearInterval(checkWidgetObserver);
            const obs = new MutationObserver(() => {
              const html = widget.shadowRoot.innerHTML;
              if (html.includes('Choose conversation') || html.includes('Connecting') || html.includes('End Call') || html.includes('Type a message')) {
                const hero = document.getElementById('tatwa-voice-hero');
                const dock = document.getElementById('oration-widget-dock');
                if (hero && hero.style.display !== 'none') hero.style.display = 'none';
                if (dock && !dock.classList.contains('dock-active')) {
                  dock.classList.add('dock-active');
                  dock.style.display = 'flex';
                }
                if (btnResetVoice) btnResetVoice.style.display = 'inline-flex';
              }
            });
            obs.observe(widget.shadowRoot, { childList: true, subtree: true, characterData: true });
          }
        }, 150);
        setTimeout(() => clearInterval(checkWidgetObserver), 10000);
      }
    }
  }

  // Embeds <oration-widget> to completely cover the Left Pane vertically
  function embedWidgetInLeftPane(widgetEl) {
    if (!widgetEl) return;

    function applyLeftPaneStyles() {
      try {
        const root = widgetEl.shadowRoot;
        if (!root) return;

        let styleTag = root.getElementById('embedded-left-pane-override');
        if (!styleTag) {
          styleTag = document.createElement('style');
          styleTag.id = 'embedded-left-pane-override';
          styleTag.textContent = `
            /* Fill 100% of the dock */
            div[class*="fixed"] {
              position: relative !important;
              bottom: auto !important;
              right: auto !important;
              top: auto !important;
              left: auto !important;
              z-index: 10 !important;
              width: 100% !important;
              height: 100% !important;
              max-width: 100% !important;
              min-width: 0 !important;
              display: flex !important;
              flex-direction: column !important;
              align-items: stretch !important;
              margin: 0 !important;
              padding: 0 !important;
            }

            /* Container card edge-to-edge inside Left Pane */
            .bg-card {
              width: 100% !important;
              height: 100% !important;
              max-width: 100% !important;
              min-height: 0 !important;
              flex: 1 1 auto !important;
              display: flex !important;
              flex-direction: column !important;
              border-radius: 0 !important;
              border: none !important;
              background: #ffffff !important;
              color: #0f172a !important;
              box-shadow: none !important;
              margin: 0 !important;
              overflow: hidden !important;
            }

            /* Flex layout covering full vertical space */
            .bg-card > div,
            .bg-card div.w-full.h-full {
              height: 100% !important;
              display: flex !important;
              flex-direction: column !important;
              justify-content: space-between !important;
              overflow: hidden !important;
            }

            div[class*="space-y-4"] {
              display: flex !important;
              flex-direction: column !important;
              height: 100% !important;
              padding: 1rem 1.25rem !important;
              gap: 0.75rem !important;
              overflow: hidden !important;
            }

            div[class*="space-y-4"] > :not([hidden]) ~ :not([hidden]) {
              margin-top: 0 !important;
            }

            /* Fixed Header at Top */
            div[class*="space-y-4"] > div:first-child {
              flex-shrink: 0 !important;
              padding-bottom: 0.65rem !important;
              border-bottom: 1px solid #f1f5f9 !important;
            }

            /* Middle Scrollable Transcript */
            div.flex-1.w-full {
              flex: 1 1 auto !important;
              min-height: 0 !important;
              height: 100% !important;
              overflow: hidden !important;
              display: flex !important;
              flex-direction: column !important;
            }

            .transcript-scrollbar {
              flex: 1 1 auto !important;
              max-height: 100% !important;
              height: 100% !important;
              overflow-y: auto !important;
              padding: 0.5rem 0.25rem !important;
            }

            /* Fixed Bottom Controls */
            div[class*="space-y-4"] > div:last-child {
              flex-shrink: 0 !important;
              margin-top: auto !important;
              padding-top: 0.75rem !important;
              background: #ffffff !important;
              border-top: 1px solid #e2e8f0 !important;
            }

            /* Buttons inside widget */
            button[type="button"], button {
              border-radius: 12px !important;
              font-weight: 600 !important;
              transition: all 0.2s ease !important;
            }
          `;
          root.appendChild(styleTag);
        }
      } catch (err) {
        console.warn('Could not inject left-pane style override into shadowRoot', err);
      }
    }

    applyLeftPaneStyles();
    const interval = setInterval(applyLeftPaneStyles, 200);
    setTimeout(() => clearInterval(interval), 6000);
  }

  // 4. Live Multi-Protocol Synchronization Manager (WebSocket + SSE + Smart Polling)
  let activeEventSource = null;
  let activeWebSocket = null;
  let pollingInterval = null;
  let lastPayloadFingerprint = null;

  // 5. Dynamic Component Viewport Renderer
  function handleIncomingImages(payload) {
    if (!payload) return;

    // Discard replayed or stale payloads generated before this page load/reload
    // Guarantees that upon reload, the Home screen appears on the right visual, not the last made visual
    if (payload.isReplay) {
      console.log('[Visualizer] Ignored replayed payload on page reload:', payload.title || payload.componentType);
      return;
    }
    if (payload.timestamp) {
      const payloadTime = new Date(payload.timestamp).getTime();
      if (!isNaN(payloadTime) && payloadTime < pageStartTime - 200) {
        console.log('[Visualizer] Ignored stale payload from before page reload:', payload.title || payload.componentType);
        return;
      }
    } else {
      // If payload has NO timestamp and arrives during startup window (stale replay from older server),
      // discard it unless the user explicitly triggered an interaction on this page
      if (Date.now() - pageStartTime < 3500 && !userInteractedRecently) {
        console.log('[Visualizer] Ignored unversioned stale payload during startup window:', payload.title || payload.componentType);
        return;
      }
    }

    console.log('[Visualizer] Incoming event received:', payload.title || payload.componentType, payload);

    // Deduplicate identical payloads if unchanged
    const currentFingerprint = `${payload.timestamp || ''}_${payload.title || ''}_${payload.componentType || ''}_${(payload.products || []).length}`;
    if (currentFingerprint && currentFingerprint === lastPayloadFingerprint) {
      return;
    }
    lastPayloadFingerprint = currentFingerprint;

    const compType = payload.componentType || (payload.images && payload.images.length > 0 ? 'products' : 'products');
    const products = payload.products || payload.images || [];

    if (displaySubtitle) {
      const time = new Date().toLocaleTimeString();
      displaySubtitle.textContent = payload.subtitle || `Synchronized live with agent at ${time}`;
    }

    const container = document.getElementById('component-viewport') || productGrid;
    if (!container) return;
    prepareViewTransition(container);

    if (
      compType === 'welcome' ||
      payload.action === 'welcome' ||
      payload.componentType === 'welcome'
    ) {
      renderTatwaWelcomeScreen(container);
      return;
    }

    if (compType === 'bundle' || payload.action === 'show_bundle' || payload.action === 'bundle') {
      updateDisplayBadge('Smart Appliance Bundles');
      renderBundleScreen(container, payload.bundles);
      return;
    }

    if (compType === 'serviceability' || compType === 'pincode' || payload.action === 'check_pincode' || payload.action === 'serviceability') {
      updateDisplayBadge('Pincode & Installation');
      renderServiceabilityScreen(container, payload.serviceData);
      return;
    }

    if (
      compType === 'wm-family-guide' ||
      compType === 'washing-machine-family-guide' ||
      payload.action === 'wm_family_guide' ||
      payload.action === 'washing_machine_family_guide' ||
      (payload.title && payload.title.toLowerCase().includes('family & capacity'))
    ) {
      updateDisplayBadge('Family & Capacity Guide');
      renderWMFamilyGuide(container, payload);
      return;
    }

    if (
      compType === 'dishwasher-place-settings-guide' ||
      compType === 'place-settings-guide' ||
      payload.action === 'dishwasher_place_settings' ||
      payload.action === 'place_settings_guide' ||
      (payload.title && payload.title.toLowerCase().includes('place settings'))
    ) {
      updateDisplayBadge('Place Settings Guide');
      renderDishwasherPlaceSettingsGuide(container, payload);
      return;
    }

    if (
      compType === 'washing-machine-guide' ||
      payload.action === 'washing_machine_guide' ||
      (payload.title && payload.title.toLowerCase().includes('fabric'))
    ) {
      updateDisplayBadge('Washing Machine Guide');
      renderWashingMachineGuide(container, payload.guideData);
      return;
    } else if (
      compType === 'tv-display-guide' ||
      payload.action === 'tv_display_guide' ||
      (payload.title && payload.title.toLowerCase().includes('cinema display'))
    ) {
      updateDisplayBadge('Smart TV Guide');
      renderTVDisplayGuide(container, payload.guideData);
      return;
    } else if (
      compType === 'installation' ||
      compType === 'chimney-installation' ||
      compType === 'chimney_installation' ||
      payload.action === 'installation' ||
      payload.action === 'chimney_installation' ||
      (payload.title && payload.title.toLowerCase().includes('chimney installation'))
    ) {
      updateDisplayBadge('Installation Guide');
      renderChimneyInstallation(container);
    } else if (
      compType === 'chimney-cleaning' ||
      compType === 'chimney_cleaning' ||
      payload.action === 'chimney_cleaning' ||
      (payload.title && payload.title.toLowerCase().includes('chimney cleaning'))
    ) {
      updateDisplayBadge('Chimney Cleaning Guide');
      renderChimneyCleaning(container);
    } else if (
      compType === 'dishwasher-cleaning' ||
      compType === 'dishwasher_cleaning' ||
      compType === 'dishwasher_maintenance' ||
      payload.action === 'dishwasher_cleaning' ||
      payload.action === 'dishwasher_maintenance' ||
      (payload.title && payload.title.toLowerCase().includes('dishwasher maintenance')) ||
      (payload.title && payload.title.toLowerCase().includes('care of the dishwasher')) ||
      (payload.title && payload.title.toLowerCase().includes('salt softener'))
    ) {
      updateDisplayBadge('Dishwasher Care Guide');
      renderDishwasherCleaning(container);
    } else if (
      compType === 'dishwasher-loading' ||
      compType === 'dishwasher_loading' ||
      payload.action === 'dishwasher_loading' ||
      payload.action === 'loading_guide' ||
      (payload.title && payload.title.toLowerCase().includes('load a tatwa dishwasher')) ||
      (payload.title && payload.title.toLowerCase().includes('how to load'))
    ) {
      updateDisplayBadge('Dishwasher Loading Guide');
      renderDishwasherLoading(container);
    } else if (
      compType === 'dishwasher-usp' ||
      compType === 'dishwasher_usp' ||
      compType === 'dishwasher_features' ||
      payload.action === 'dishwasher_usp' ||
      payload.action === 'dishwasher_features' ||
      (payload.title && payload.title.toLowerCase().includes('features & usps'))
    ) {
      updateDisplayBadge('Dishwasher USPs');
      renderDishwasherUSP(container);
    } else if (
      compType === 'bldc-motor' ||
      compType === 'bldc_motor' ||
      payload.action === 'bldc_motor' ||
      payload.action === 'suction_capacity' ||
      payload.action === 'suction' ||
      (payload.title && (payload.title.toLowerCase().includes('bldc motor') || payload.title.toLowerCase().includes('suction')))
    ) {
      updateDisplayBadge('1500 m³/hr Suction & BLDC Motor');
      renderBLDCMotor(container, payload);
    } else if (
      compType === 'chimney-controls' ||
      compType === 'chimney_controls' ||
      compType === 'gesture_control' ||
      payload.action === 'chimney_controls' ||
      payload.action === 'gesture_control' ||
      (payload.title && payload.title.toLowerCase().includes('gesture control'))
    ) {
      updateDisplayBadge('Wave Gesture Controls');
      renderChimneyControls(container);
    } else if (compType === 'comparison' && products.length >= 2) {
      updateDisplayBadge(`Comparing ${products.length} Models`);
      renderComparisonMatrix(container, products, payload.title);
    } else if (compType === 'manual') {
      updateDisplayBadge('User Manual & Auto-Clean');
      renderUserManual(container, payload.manualData);
    } else if (compType === 'offers') {
      updateDisplayBadge(`Special Offers (${products.length})`);
      renderOffersShowcase(container, products, payload.title);
    } else {
      updateDisplayBadge(products.length === 1 ? 'Featured Appliance (1)' : `${products.length} Appliances`);
      renderProductCards(container, products);
    }
  }

  // 4a. Connect WebSocket (Cloudflare Durable Object Hibernation API)
  function connectWebSocket() {
    try {
      if (activeWebSocket) {
        activeWebSocket.close();
      }

      const wsProtocol = backendUrl.startsWith('https') ? 'wss:' : 'ws:';
      const wsHost = backendUrl.replace(/^https?:\/\//, '');
      const wsUrl = `${wsProtocol}//${wsHost}/api/ws?sessionId=${encodeURIComponent(sessionId)}`;

      activeWebSocket = new WebSocket(wsUrl);

      activeWebSocket.onopen = () => {
        if (serverStatusText) serverStatusText.textContent = 'Live Sync (Active)';
        if (serverStatusPill) serverStatusPill.style.backgroundColor = '#ecfdf5';
      };

      activeWebSocket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data && !data.isReplay && (data.type === 'PRODUCT_UPDATE' || data.products || data.componentType)) {
            handleIncomingImages(data);
          }
        } catch (_) {}
      };

      activeWebSocket.onclose = () => {
        setTimeout(connectWebSocket, 4000);
      };
    } catch (_) {}
  }

  // 4b. Connect Server-Sent Events (SSE)
  function connectSSE() {
    if (activeEventSource) {
      activeEventSource.close();
    }

    const sseUrl = `${backendUrl}/api/stream/${encodeURIComponent(sessionId)}`;

    try {
      activeEventSource = new EventSource(sseUrl);

      activeEventSource.onopen = () => {
        if (serverStatusText) serverStatusText.textContent = 'Live Sync (Active)';
        if (serverStatusPill) serverStatusPill.style.backgroundColor = '#ecfdf5';
      };

      activeEventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data && !data.isReplay) {
            handleIncomingImages(data);
          }
        } catch (_) {}
      };

      activeEventSource.onerror = () => {
        if (serverStatusText && !activeWebSocket) serverStatusText.textContent = 'Syncing...';
      };
    } catch (_) {}
  }

  // 4c. Smart Polling Fallback (Guarantees screen updates within 1.2s even if sockets drop)
  function startSmartPolling() {
    if (pollingInterval) clearInterval(pollingInterval);

    // Initial state fingerprint from server: do not render whatever was already on the server before reload
    let initialPollDone = false;

    async function pollState() {
      try {
        const stateUrl = `${backendUrl}/api/last-state?sessionId=${encodeURIComponent(sessionId)}&_t=${Date.now()}`;
        const res = await fetch(stateUrl);
        if (res.ok) {
          const data = await res.json();
          if (data && data.payload) {
            if (!initialPollDone) {
              initialPollDone = true;
              console.log('[Visualizer] Initial poll completed: recorded cached server state without rendering to preserve Home Screen');
              return;
            }
            if (!data.payload.isReplay) {
              handleIncomingImages(data.payload);
            }
          }
        }
      } catch (_) {}
    }

    setTimeout(() => {
      pollState();
      pollingInterval = setInterval(pollState, 1500);
    }, 1200);
  }

  function initLiveSync() {
    connectWebSocket();
    connectSSE();
    startSmartPolling();
  }

  
  // ==========================================================================
  // COMPONENT: WASHING MACHINE FABRIC CARE & STEAM WASH GUIDE (WITH RICH IMAGERY)
  // ==========================================================================
  function renderWashingMachineGuide(container) {
    if (!container) return;
    prepareViewTransition(container);

    if (displaySubtitle) {
      displaySubtitle.textContent = 'AI Direct Drive Inverter • 99.9% Steam Allergy Care • 1400 RPM Spin';
    }

    container.innerHTML = `
      <div class="installation-guide-card" id="washing-machine-guide-comp">
        <header class="guide-header">
          <div class="brand-title-group">
            <button class="btn-back-home-pill" id="btn-back-wm-guide" title="Return to All Categories Home">
              <span>← All Categories</span>
            </button>
            <div class="brand-wordmark">
              <span class="brand-wordmark-text">TATWA</span>
              <span class="brand-accent-line"></span>
            </div>
            <h1 class="main-title">SMART FABRIC CARE &amp; STEAM WASH GUIDE</h1>
            <div class="sub-title">AI DIRECT DRIVE • STEAM ALLERGEN SANITIZATION • 1400 RPM</div>
          </div>

          <div class="playback-controls">
            <button id="btn-toggle-wm-cycle" class="btn-auto-play-toggle" title="Pause or Resume Auto Cycle">
              <span id="cycle-icon-wm">⏸</span>
              <span id="cycle-text-wm">Auto Cycle Active</span>
            </button>
          </div>

          <nav class="steps-nav-tracker" aria-label="Washing Machine Cycles">
            <div class="step-nav-item active" data-step="1">
              <div class="step-circle">1</div>
              <span class="step-label">Steam Care</span>
            </div>
            <div class="step-nav-item" data-step="2">
              <div class="step-circle">2</div>
              <span class="step-label">Cotton Loads</span>
            </div>
            <div class="step-nav-item" data-step="3">
              <div class="step-circle">3</div>
              <span class="step-label">Delicates / 15m</span>
            </div>
            <div class="step-nav-item" data-step="4">
              <div class="step-circle">4</div>
              <span class="step-label">Direct Drive</span>
            </div>
          </nav>
        </header>

        <main class="installation-canvas">
          <div class="steps-column">
            <article class="step-card active" id="wm-step-card-1" data-step="1">
              <div class="step-info-col">
                <div class="step-title-header">
                  <span class="step-num-pill">01</span>
                  <h2 class="step-heading">AI STEAM ALLERGY CARE (60°C–90°C)</h2>
                </div>
                <ul class="step-bullets-list">
                  <li>Inbuilt heater generates micro-steam penetrating deep fabric weaves.</li>
                  <li>Eradicates 99.9% dust mites, bacteria, and allergen particles.</li>
                  <li>Smooths stubborn wrinkles, reducing daily ironing effort by 30%.</li>
                </ul>
              </div>
              <div class="step-square-box" title="Steam Allergy Wash Image">
                <img src="images/wm_front_load_8kg.jpg" alt="Front Load Steam Wash" />
              </div>
            </article>

            <article class="step-card" id="wm-step-card-2" data-step="2">
              <div class="step-info-col">
                <div class="step-title-header">
                  <span class="step-num-pill">02</span>
                  <h2 class="step-heading">COTTON &amp; HEAVY DAILY LOADS</h2>
                </div>
                <ul class="step-bullets-list">
                  <li>Load up to 80% drum capacity for optimal water circulation.</li>
                  <li>1400 RPM high spin speed extracts maximum moisture from jeans &amp; bedsheets.</li>
                  <li>Dual dispenser for liquid detergent and fabric softener.</li>
                </ul>
              </div>
              <div class="step-square-box" title="Cotton Heavy Load Image">
                <img src="images/wm_washer_dryer_10kg.jpg" alt="Washer Dryer Combo" />
              </div>
            </article>
          </div>

          <div class="hero-center-column">
            <div class="hero-chimney-img-box">
              <img src="images/wm_front_load_8kg.jpg" alt="Tatwa Smart Washing Machine Architecture" />
              <div class="hero-pointer-tag pointer-pos-01 active" id="wm-pointer-01" data-step="1" title="01: Micro-Steam Chamber (90°C)">01</div>
              <div class="hero-pointer-tag pointer-pos-02" id="wm-pointer-02" data-step="2" title="02: Direct Motion Inverter Motor">02</div>
              <div class="hero-pointer-tag pointer-pos-03" id="wm-pointer-03" data-step="3" title="03: Antibacterial Gasket &amp; Lifters">03</div>
              <div class="hero-pointer-tag pointer-pos-04" id="wm-pointer-04" data-step="4" title="04: AI Smart Fabric Sensing Drum">04</div>
            </div>
          </div>

          <div class="steps-column">
            <article class="step-card" id="wm-step-card-3" data-step="3">
              <div class="step-info-col">
                <div class="step-title-header">
                  <span class="step-num-pill">03</span>
                  <h2 class="step-heading">DELICATES &amp; QUICK 15M REFRESH</h2>
                </div>
                <ul class="step-bullets-list">
                  <li>15-minute express cycle for up to 2 kg lightly soiled daily clothes.</li>
                  <li>Saves up to 70% electricity and water on quick everyday washes.</li>
                  <li>Gentle drum wave rotation protects silks, activewear, and lace.</li>
                </ul>
              </div>
              <div class="step-square-box" title="Quick 15m Delicate Wash Image">
                <img src="images/wm_top_load_75kg.jpg" alt="Top Load Smart Washer" />
              </div>
            </article>

            <article class="step-card" id="wm-step-card-4" data-step="4">
              <div class="step-info-col">
                <div class="step-title-header">
                  <span class="step-num-pill">04</span>
                  <h2 class="step-heading">DIRECT DRIVE INVERTER MOTOR</h2>
                </div>
                <ul class="step-bullets-list">
                  <li>Beltless motor attached directly to the drum eliminating slippage.</li>
                  <li>Operates whisper-quiet under 52 dB during high-speed spinning.</li>
                  <li>10-Year motor warranty with 5-Star BEE maximum energy savings.</li>
                </ul>
              </div>
              <div class="step-square-box" title="Inverter Direct Drive Motor Image">
                <img src="images/wm_semi_automatic_65kg.jpg" alt="Direct Motion Motor" />
              </div>
            </article>
          </div>
        </main>

        <footer class="guide-bottom-strip">
          <div class="bottom-info-card">
            <div class="bottom-card-icon">♨️</div>
            <div class="bottom-card-text">
              <span class="bottom-card-title">Inbuilt Thermal Heater</span>
              <p class="bottom-card-desc">Heats water up to 90°C to tackle oily food stains, turmeric, and tough Indian curry marks.</p>
            </div>
          </div>

          <div class="bottom-info-card">
            <div class="bottom-card-icon">⚡</div>
            <div class="bottom-card-text">
              <span class="bottom-card-title">Direct Motion Inverter</span>
              <p class="bottom-card-desc">Frictionless electromagnetic drive cuts vibration and power consumption by up to 45%.</p>
            </div>
          </div>

          <div class="bottom-notice-card">
            <div class="notice-shield-icon">🛡️</div>
            <div class="notice-card-text">
              <span class="notice-card-title">10-Year Motor Warranty</span>
              <p class="notice-card-desc">2 Years comprehensive warranty + 10 Years on Inverter motor with free doorstep technician visits.</p>
            </div>
          </div>
        </footer>
      </div>
    `;

    // Back to home listener
    const btnBack = container.querySelector('#btn-back-wm-guide');
    if (btnBack) btnBack.addEventListener('click', () => renderTatwaWelcomeScreen(container));

    initWMStepCycle(container);
  }

  function initWMStepCycle(container) {
    if (!container) return;
    let currentStep = 1;
    const totalSteps = 4;
    let autoPlay = true;
    let cycleTimer = null;
    const cycleIntervalMs = 3800;

    const navItems = container.querySelectorAll('.step-nav-item');
    const stepCards = container.querySelectorAll('.step-card');
    const pointerTags = container.querySelectorAll('.hero-pointer-tag');
    const btnToggle = container.querySelector('#btn-toggle-wm-cycle');
    const cycleIcon = container.querySelector('#cycle-icon-wm');
    const cycleText = container.querySelector('#cycle-text-wm');

    function setActiveStep(stepNum) {
      currentStep = Number(stepNum);

      navItems.forEach((nav) => {
        const s = Number(nav.getAttribute('data-step'));
        nav.classList.toggle('active', s === currentStep);
      });

      stepCards.forEach((card) => {
        const s = Number(card.getAttribute('data-step'));
        card.classList.toggle('active', s === currentStep);
      });

      pointerTags.forEach((pt) => {
        const s = Number(pt.getAttribute('data-step'));
        pt.classList.toggle('active', s === currentStep);
      });
    }

    navItems.forEach((nav) => {
      nav.addEventListener('click', () => {
        const s = nav.getAttribute('data-step');
        if (s) {
          setActiveStep(s);
          resetAutoCycle();
        }
      });
    });

    stepCards.forEach((card) => {
      card.addEventListener('click', () => {
        const s = card.getAttribute('data-step');
        if (s) {
          setActiveStep(s);
          resetAutoCycle();
        }
      });
    });

    pointerTags.forEach((pt) => {
      pt.addEventListener('click', () => {
        const s = pt.getAttribute('data-step');
        if (s) {
          setActiveStep(s);
          resetAutoCycle();
        }
      });
    });

    function startAutoCycle() {
      if (cycleTimer) clearInterval(cycleTimer);
      cycleTimer = setInterval(() => {
        if (!autoPlay) return;
        currentStep = (currentStep % totalSteps) + 1;
        setActiveStep(currentStep);
      }, cycleIntervalMs);
    }

    function stopAutoCycle() {
      if (cycleTimer) {
        clearInterval(cycleTimer);
        cycleTimer = null;
      }
    }

    function resetAutoCycle() {
      stopAutoCycle();
      if (autoPlay) startAutoCycle();
    }

    if (btnToggle) {
      btnToggle.addEventListener('click', () => {
        autoPlay = !autoPlay;
        if (autoPlay) {
          if (cycleIcon) cycleIcon.textContent = '⏸';
          if (cycleText) cycleText.textContent = 'Auto Cycle Active';
          startAutoCycle();
        } else {
          if (cycleIcon) cycleIcon.textContent = '▶';
          if (cycleText) cycleText.textContent = 'Cycle Paused';
          stopAutoCycle();
        }
      });
    }

    startAutoCycle();
  }

  // ==========================================================================
  // COMPONENT: SMART TV DISPLAY & AUDIO CALIBRATION GUIDE (WITH RICH IMAGERY)
  // ==========================================================================
  function renderTVDisplayGuide(container) {
    if (!container) return;
    prepareViewTransition(container);

    if (displaySubtitle) {
      displaySubtitle.textContent = '4K QLED & OLED Calibration • 144Hz Native Gaming VRR • Dolby Atmos 60W Audio';
    }

    container.innerHTML = `
      <div class="installation-guide-card" id="tv-guide-comp">
        <header class="guide-header">
          <div class="brand-title-group">
            <button class="btn-back-home-pill" id="btn-back-tv-guide" title="Return to All Categories Home">
              <span>← All Categories</span>
            </button>
            <div class="brand-wordmark">
              <span class="brand-wordmark-text">TATWA</span>
              <span class="brand-accent-line"></span>
            </div>
            <h1 class="main-title">TATWA CINEMA DISPLAY &amp; AUDIO CALIBRATION GUIDE</h1>
            <div class="sub-title">4K QLED &amp; OLED CALIBRATION • 144HZ VRR • DOLBY ATMOS 60W SOUND</div>
          </div>

          <div class="playback-controls">
            <button id="btn-toggle-tv-cycle" class="btn-auto-play-toggle" title="Pause or Resume Auto Cycle">
              <span id="cycle-icon-tv">⏸</span>
              <span id="cycle-text-tv">Auto Cycle Active</span>
            </button>
          </div>

          <nav class="steps-nav-tracker" aria-label="Smart TV Calibration Steps">
            <div class="step-nav-item active" data-step="1">
              <div class="step-circle">1</div>
              <span class="step-label">Quantum QLED</span>
            </div>
            <div class="step-nav-item" data-step="2">
              <div class="step-circle">2</div>
              <span class="step-label">Cinema OLED</span>
            </div>
            <div class="step-nav-item" data-step="3">
              <div class="step-circle">3</div>
              <span class="step-label">Dolby Atmos</span>
            </div>
            <div class="step-nav-item" data-step="4">
              <div class="step-circle">4</div>
              <span class="step-label">144Hz Gaming</span>
            </div>
          </nav>
        </header>

        <main class="installation-canvas">
          <div class="steps-column">
            <article class="step-card active" id="tv-step-card-1" data-step="1">
              <div class="step-info-col">
                <div class="step-title-header">
                  <span class="step-num-pill">01</span>
                  <h2 class="step-heading">QUANTUM DOT QLED DISPLAY</h2>
                </div>
                <ul class="step-bullets-list">
                  <li>1000+ Nits Peak Brightness delivering over 1 Billion true-to-life colors.</li>
                  <li>Quantum Nanocrystals filter backlight for vivid color in bright sunlit rooms.</li>
                  <li>AI 4K Upscaler sharpens broadcast cable TV &amp; streaming video.</li>
                </ul>
              </div>
              <div class="step-square-box" title="Quantum QLED Display Image">
                <img src="images/tv_qled_55inch.jpg" alt="Tatwa 55 inch 4K QLED TV" />
              </div>
            </article>

            <article class="step-card" id="tv-step-card-2" data-step="2">
              <div class="step-info-col">
                <div class="step-title-header">
                  <span class="step-num-pill">02</span>
                  <h2 class="step-heading">CINEMA OLED INFINITE CONTRAST</h2>
                </div>
                <ul class="step-bullets-list">
                  <li>8.3 Million self-illuminating pixels give pure absolute black levels.</li>
                  <li>Infinite contrast ratio with zero light bleed around white subtitles.</li>
                  <li>Ultra-wide 178° viewing angle from any sofa angle without color fading.</li>
                </ul>
              </div>
              <div class="step-square-box" title="Cinema OLED Contrast Image">
                <img src="images/tv_oled_65inch.jpg" alt="Tatwa 65 inch OLED Cinema TV" />
              </div>
            </article>
          </div>

          <div class="hero-center-column">
            <div class="hero-chimney-img-box">
              <img src="images/tv_oled_65inch.jpg" alt="Tatwa OLED &amp; QLED Architecture" />
              <div class="hero-pointer-tag pointer-pos-01 active" id="tv-pointer-01" data-step="1" title="01: Quantum Dot Nanocrystal Layer">01</div>
              <div class="hero-pointer-tag pointer-pos-02" id="tv-pointer-02" data-step="2" title="02: 8.3M Self-Illuminating OLED Pixels">02</div>
              <div class="hero-pointer-tag pointer-pos-03" id="tv-pointer-03" data-step="3" title="03: Integrated 60W Dolby Atmos Soundbar">03</div>
              <div class="hero-pointer-tag pointer-pos-04" id="tv-pointer-04" data-step="4" title="04: 144Hz VRR HDMI 2.1 eARC Port">04</div>
            </div>
          </div>

          <div class="steps-column">
            <article class="step-card" id="tv-step-card-3" data-step="3">
              <div class="step-info-col">
                <div class="step-title-header">
                  <span class="step-num-pill">03</span>
                  <h2 class="step-heading">DOLBY ATMOS &amp; AUDIO TUNING</h2>
                </div>
                <ul class="step-bullets-list">
                  <li>Built-in 60W soundbar with integrated acoustic subwoofer.</li>
                  <li>Dialogue Enhancer isolates human speech for crisp vocal clarity.</li>
                  <li>eARC 2.1 lossless 24-bit audio passthrough to home theater AV receivers.</li>
                </ul>
              </div>
              <div class="step-square-box" title="Dolby Atmos Soundbar Image">
                <img src="images/tv_frameless_43inch.jpg" alt="Tatwa Frameless 4K Smart TV" />
              </div>
            </article>

            <article class="step-card" id="tv-step-card-4" data-step="4">
              <div class="step-info-col">
                <div class="step-title-header">
                  <span class="step-num-pill">04</span>
                  <h2 class="step-heading">144HZ NATIVE GAMING VRR</h2>
                </div>
                <ul class="step-bullets-list">
                  <li>144Hz native refresh rate with Variable Refresh Rate (VRR) gaming.</li>
                  <li>Auto Low Latency Mode (ALLM) delivers under 5ms input lag for consoles.</li>
                  <li>Hands-free Google TV with far-field voice mic &amp; wireless casting.</li>
                </ul>
              </div>
              <div class="step-square-box" title="144Hz Gaming VRR Image">
                <img src="images/tv_qled_55inch.jpg" alt="Tatwa Gaming QLED TV" />
              </div>
            </article>
          </div>
        </main>

        <footer class="guide-bottom-strip">
          <div class="bottom-info-card">
            <div class="bottom-card-icon">📺</div>
            <div class="bottom-card-text">
              <span class="bottom-card-title">Dolby Vision IQ</span>
              <p class="bottom-card-desc">Ambient light sensor dynamically optimizes HDR highlights and shadow detail in real-time.</p>
            </div>
          </div>

          <div class="bottom-info-card">
            <div class="bottom-card-icon">🎮</div>
            <div class="bottom-card-text">
              <span class="bottom-card-title">HDMI 2.1 eARC Port</span>
              <p class="bottom-card-desc">Full 48Gbps bandwidth supports uncompressed 4K 144Hz VRR signals from PS5 and PC graphics cards.</p>
            </div>
          </div>

          <div class="bottom-notice-card">
            <div class="notice-shield-icon">🛡️</div>
            <div class="notice-card-text">
              <span class="notice-card-title">3-Year Doorstep Panel Warranty</span>
              <p class="notice-card-desc">Comprehensive panel coverage and complimentary on-site calibration. Helpline: 1800-828-9222.</p>
            </div>
          </div>
        </footer>
      </div>
    `;

    // Back to home listener
    const btnBack = container.querySelector('#btn-back-tv-guide');
    if (btnBack) btnBack.addEventListener('click', () => renderTatwaWelcomeScreen(container));

    initTVStepCycle(container);
  }

  function initTVStepCycle(container) {
    if (!container) return;
    let currentStep = 1;
    const totalSteps = 4;
    let autoPlay = true;
    let cycleTimer = null;
    const cycleIntervalMs = 3800;

    const navItems = container.querySelectorAll('.step-nav-item');
    const stepCards = container.querySelectorAll('.step-card');
    const pointerTags = container.querySelectorAll('.hero-pointer-tag');
    const btnToggle = container.querySelector('#btn-toggle-tv-cycle');
    const cycleIcon = container.querySelector('#cycle-icon-tv');
    const cycleText = container.querySelector('#cycle-text-tv');

    function setActiveStep(stepNum) {
      currentStep = Number(stepNum);

      navItems.forEach((nav) => {
        const s = Number(nav.getAttribute('data-step'));
        nav.classList.toggle('active', s === currentStep);
      });

      stepCards.forEach((card) => {
        const s = Number(card.getAttribute('data-step'));
        card.classList.toggle('active', s === currentStep);
      });

      pointerTags.forEach((pt) => {
        const s = Number(pt.getAttribute('data-step'));
        pt.classList.toggle('active', s === currentStep);
      });
    }

    navItems.forEach((nav) => {
      nav.addEventListener('click', () => {
        const s = nav.getAttribute('data-step');
        if (s) {
          setActiveStep(s);
          resetAutoCycle();
        }
      });
    });

    stepCards.forEach((card) => {
      card.addEventListener('click', () => {
        const s = card.getAttribute('data-step');
        if (s) {
          setActiveStep(s);
          resetAutoCycle();
        }
      });
    });

    pointerTags.forEach((pt) => {
      pt.addEventListener('click', () => {
        const s = pt.getAttribute('data-step');
        if (s) {
          setActiveStep(s);
          resetAutoCycle();
        }
      });
    });

    function startAutoCycle() {
      if (cycleTimer) clearInterval(cycleTimer);
      cycleTimer = setInterval(() => {
        if (!autoPlay) return;
        currentStep = (currentStep % totalSteps) + 1;
        setActiveStep(currentStep);
      }, cycleIntervalMs);
    }

    function stopAutoCycle() {
      if (cycleTimer) {
        clearInterval(cycleTimer);
        cycleTimer = null;
      }
    }

    function resetAutoCycle() {
      stopAutoCycle();
      if (autoPlay) startAutoCycle();
    }

    if (btnToggle) {
      btnToggle.addEventListener('click', () => {
        autoPlay = !autoPlay;
        if (autoPlay) {
          if (cycleIcon) cycleIcon.textContent = '⏸';
          if (cycleText) cycleText.textContent = 'Auto Cycle Active';
          startAutoCycle();
        } else {
          if (cycleIcon) cycleIcon.textContent = '▶';
          if (cycleText) cycleText.textContent = 'Cycle Paused';
          stopAutoCycle();
        }
      });
    }

    startAutoCycle();
  }

    // Component 0: Tatwa Electronics Welcome Screen (Minimal, Clean & Simple Luxury Presentation)
  function renderTatwaWelcomeScreen(container) {
    const target = container || document.getElementById('component-viewport') || productGrid;
    if (!target) return;
    prepareViewTransition(target);

    updateDisplayBadge('Tatwa Studio');
    if (typeof displaySubtitle !== 'undefined' && displaySubtitle) {
      displaySubtitle.textContent = 'Speak to the assistant or select an appliance to begin';
    }

    target.innerHTML = `
      <div class="tatwa-welcome-container">
        <div class="tatwa-welcome-card glass-panel">
          <div class="welcome-brand-emblem glass-card">
            <img src="images/tatwa_logo.svg" alt="Tatwa Electronics" class="welcome-tatwa-logo" />
          </div>

          <div class="welcome-title-wrap">
            <span class="welcome-kicker">TATWA SMART LIVING • NEXT-GEN ELECTRONICS</span>
            <h2 class="welcome-headline">Tatwa Smart Appliance Visualizer</h2>
            <p class="welcome-lead">
              Official interactive showcase for Tatwa chimneys, dishwashers, washing machines &amp; smart TVs. Speak with the AI assistant on the left to explore appliances, guides &amp; comparisons.
            </p>
          </div>

          <div class="welcome-action-hint glass-pill">
            <div class="hint-pulse"></div>
            <span>Speak to the <strong>Tatwa AI Assistant</strong> on the left, or select a quick topic below:</span>
          </div>

          <div class="welcome-quick-pills">
            <button class="welcome-pill glass-button" data-welcome-query="30,000 के अंदर डिशवॉशर और चिमनी">🔍 Models under ₹30k</button>
            <button class="welcome-pill glass-button" data-welcome-action="installation">🛠️ Chimney Installation</button>
            <button class="welcome-pill glass-button" data-welcome-action="chimney_cleaning">🧼 Chimney Auto-Clean</button>
            <button class="welcome-pill glass-button" data-welcome-action="dishwasher_cleaning">💧 Dishwasher Salt &amp; Care</button>
            <button class="welcome-pill glass-button" data-welcome-action="dishwasher_loading">🍽️ How to Load Dishwasher</button>
            <button class="welcome-pill glass-button" data-welcome-action="washing_guide">🌀 Fabric Care Guide</button>
            <button class="welcome-pill glass-button" data-welcome-action="tv_calibration">📺 TV Calibration Guide</button>
            <button class="welcome-pill glass-button" data-welcome-action="bldc_motor">⚡ Inverter BLDC Video</button>
            <button class="welcome-pill glass-button" data-welcome-action="show_all">👁️ Browse All 20 Models</button>
          </div>
        </div>
      </div>
    `;

    // Wire suggestion pills inside the welcome card
    target.querySelectorAll('.welcome-pill').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const query = btn.getAttribute('data-welcome-query');
        const action = btn.getAttribute('data-welcome-action');
        const cat = btn.getAttribute('data-welcome-category');
        if (query) {
          hitTool({ query });
          showToast(`Sending: "${query}"`);
        } else if (cat) {
          hitTool({ category: cat });
          showToast(`Opening ${cat.replace('_', ' ').toUpperCase()} Showcase`);
        } else if (action) {
          if (action === 'washing_guide') {
            renderWashingMachineGuide(target);
            updateDisplayBadge('Fabric Care Guide');
            showToast('Displaying Washing Machine Fabric Care Guide');
          } else if (action === 'tv_calibration') {
            renderTVDisplayGuide(target);
            updateDisplayBadge('TV Calibration Guide');
            showToast('Displaying TV Display Calibration Guide');
          } else {
            hitTool({ action: action === 'show_all' ? 'show_products' : action });
            showToast(`Showing: ${action}`);
          }
        }
      });
    });
  }

  // Component A: Standard & Gallery Product Cards
  // Component A: Standard & Gallery Product Cards (Continuous Looping Marquee with 3-Card Viewport)
  function renderProductCards(container, products) {
    if (!products || products.length === 0) {
      container.innerHTML = `
        <div class="empty-placeholder">
          <h3>No Appliances Found</h3>
          <p>Try searching for a different price range or ask the agent to show all models.</p>
        </div>
      `;
      return;
    }
    prepareViewTransition(container);

    const isSingle = products.length === 1;
    const isDual = products.length === 2;
    const isMarquee = products.length >= 3;

    function renderCard(item, index, keySuffix = '') {
      const price = Number(item.price || 0);
      const mrp = Number(item.mrp || 0);
      const savings = Number(item.savings || (mrp > price ? mrp - price : 0));
      const discount = item.discountPercent || (mrp > 0 && price > 0 ? Math.round(((mrp - price) / mrp) * 100) : 0);
      const categoryLabel = item.categoryLabel || item.type || (item.category === 'chimney' ? 'Kitchen Chimney' : 'Dishwasher');
      const highlightTag = item.highlight || (item.isOffer ? 'Free Gift Inside' : 'Extended Warranty');

      return `
        <article class="product-card" data-key="${item.modelName || item.name || index}-${keySuffix}">
          <div class="product-image-box">
            <div class="card-badge-container">
              <span class="badge-brand-kicker">TATWA</span>
              <span class="badge-feature-highlight">${highlightTag}</span>
            </div>
            <img src="${item.imageUrl}" alt="${item.name || item.title}" loading="eager" />
          </div>

          <div class="card-details">
            <div class="card-header-info">
              <span class="card-category-label">${categoryLabel}</span>
              <h3 class="card-title">${item.name || item.title}</h3>
            </div>

            ${item.keyFeatures && item.keyFeatures.length > 0 ? `
              <ul class="card-features-bullet-list">
                ${item.keyFeatures.slice(0, 3).map(f => `<li>• ${f}</li>`).join('')}
              </ul>
            ` : (item.suctionPower ? `
              <ul class="card-features-bullet-list">
                <li>• Suction: ${item.suctionPower}</li>
                <li>• Filterless Auto-Clean Technology</li>
                <li>• Motion Sensor Gesture Control</li>
              </ul>
            ` : `
              <ul class="card-features-bullet-list">
                <li>• Capacity: ${item.capacity || '14-Place RapidDry'}</li>
                <li>• Multi-Wash Hygienic Spray Arms</li>
                <li>• Ultra-Silent BLDC Inverter Motor</li>
              </ul>
            `)}

            ${price > 0 ? `
              <div class="price-container">
                ${discount > 0 ? `
                  <div class="badge-tatwa-blue" title="Tatwa Promotional Savings">
                    <span>Tatwa Deal</span>
                    <strong>${discount}% OFF</strong>
                  </div>
                ` : ''}
                <div class="price-amounts-col">
                  ${mrp > price ? `<span class="price-mrp">Was ₹${mrp.toLocaleString('en-IN')}</span>` : ''}
                  <span class="price-amount">₹${price.toLocaleString('en-IN')}</span>
                </div>
              </div>
            ` : ''}

            <div class="card-footer-cta">
              <a href="${item.imageUrl}" target="_blank" class="btn-product-cta" rel="noopener">
                Try Visualizer →
              </a>
            </div>
          </div>
        </article>
      `;
    }

    if (products.length === 1) {
      container.innerHTML = `
        <div class="product-stepper-wrapper">
          <div class="stepper-header-bar">
            <div class="stepper-header-left">
              <button class="btn-back-home-pill" id="btn-back-home" title="Return to All Categories Home">
                <span>← All Categories</span>
              </button>
              <span class="stepper-live-dot"></span>
              <span class="stepper-title-txt">FEATURED APPLIANCE</span>
            </div>
          </div>
          <div class="product-grid single-item">
            ${renderCard(products[0], 0)}
          </div>
        </div>
      `;
      const btnBack = container.querySelector('#btn-back-home');
      if (btnBack) btnBack.addEventListener('click', () => renderTatwaWelcomeScreen(container));
      return;
    }

    if (products.length === 2) {
      container.innerHTML = `
        <div class="product-stepper-wrapper">
          <div class="stepper-header-bar">
            <div class="stepper-header-left">
              <button class="btn-back-home-pill" id="btn-back-home" title="Return to All Categories Home">
                <span>← All Categories</span>
              </button>
              <span class="stepper-live-dot"></span>
              <span class="stepper-title-txt">COMPARING 2 MODELS</span>
            </div>
          </div>
          <div class="product-grid dual-item">
            ${renderCard(products[0], 0)}
            ${renderCard(products[1], 1)}
          </div>
        </div>
      `;
      const btnBack = container.querySelector('#btn-back-home');
      if (btnBack) btnBack.addEventListener('click', () => renderTatwaWelcomeScreen(container));
      return;
    }

    // Group products into pairs of 2 for stepped vertical sliding (bottom to top)
    const pairs = [];
    for (let i = 0; i < products.length; i += 2) {
      pairs.push(products.slice(i, i + 2));
    }

    let currentSlide = 0;
    const totalSlides = pairs.length;

    container.innerHTML = `
      <div class="product-stepper-wrapper" id="product-stepper-wrapper">
        <div class="stepper-header-bar">
          <div class="stepper-header-left">
            <button class="btn-back-home-pill" id="btn-back-home" title="Return to All Categories Home">
              <span>← All Categories</span>
            </button>
            <span class="stepper-live-dot"></span>
            <span class="stepper-title-txt">SHOWCASE • 2 AT A TIME</span>
            <span class="badge-stepper-page" id="stepper-counter-badge">1–2 of ${products.length}</span>
          </div>

          <div class="stepper-header-right">
            <div class="stepper-dots-nav" id="stepper-dots-nav">
              ${pairs.map((_, idx) => `
                <button class="stepper-dot ${idx === 0 ? 'active' : ''}" data-slide="${idx}" title="Go to items ${idx * 2 + 1}–${Math.min((idx + 1) * 2, products.length)}" aria-label="Slide ${idx + 1}"></button>
              `).join('')}
            </div>

            <div class="stepper-nav-arrows">
              <button class="btn-stepper-arrow" id="btn-stepper-prev" title="Previous 2 appliances (Up)" aria-label="Previous pair">▲</button>
              <button class="btn-stepper-arrow" id="btn-stepper-next" title="Next 2 appliances (Down)" aria-label="Next pair">▼</button>
            </div>
          </div>
        </div>

        <div class="product-stepper-viewport" id="product-stepper-viewport">
          <div class="product-stepper-track" id="product-stepper-track" style="transform: translateY(0%); transition: transform 1.4s cubic-bezier(0.4, 0, 0.2, 1);">
            ${pairs.map((pair, pIdx) => `
              <div class="product-stepper-slide ${pair.length === 1 ? 'single-card-slide' : ''}" data-pair="${pIdx}">
                ${pair.map((item, i) => renderCard(item, pIdx * 2 + i)).join('')}
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;

    const btnBackStepper = container.querySelector('#btn-back-home');
    if (btnBackStepper) btnBackStepper.addEventListener('click', () => renderTatwaWelcomeScreen(container));

    // Connect slider controls & bottom-to-top auto-advancing logic
    const track = container.querySelector('#product-stepper-track');
    const counterBadge = container.querySelector('#stepper-counter-badge');
    const dots = container.querySelectorAll('.stepper-dot');
    const btnPrev = container.querySelector('#btn-stepper-prev');
    const btnNext = container.querySelector('#btn-stepper-next');
    const wrapper = container.querySelector('#product-stepper-wrapper');

    function goToSlide(index) {
      if (!track) return;
      currentSlide = (index + totalSlides) % totalSlides;
      // Bottom to top vertical slide transition
      track.style.transform = `translateY(-${currentSlide * 100}%)`;

      // Update counter badge
      if (counterBadge) {
        const startIdx = currentSlide * 2 + 1;
        const endIdx = Math.min((currentSlide + 1) * 2, products.length);
        counterBadge.textContent = `${startIdx}–${endIdx} of ${products.length}`;
      }

      // Update dot states
      dots.forEach((dot, idx) => {
        dot.classList.toggle('active', idx === currentSlide);
      });
    }

    if (btnPrev) {
      btnPrev.addEventListener('click', () => {
        goToSlide(currentSlide - 1);
        resetAutoAdvance();
      });
    }

    if (btnNext) {
      btnNext.addEventListener('click', () => {
        goToSlide(currentSlide + 1);
        resetAutoAdvance();
      });
    }

    dots.forEach((dot) => {
      dot.addEventListener('click', () => {
        const target = parseInt(dot.getAttribute('data-slide'), 10);
        if (!isNaN(target)) {
          goToSlide(target);
          resetAutoAdvance();
        }
      });
    });

    // Auto-advance bottom-to-top every 10 seconds with slow easy-in scroll
    let autoAdvanceTimer = null;
    function startAutoAdvance() {
      if (autoAdvanceTimer) clearInterval(autoAdvanceTimer);
      autoAdvanceTimer = setInterval(() => {
        goToSlide(currentSlide + 1);
      }, 10000);
    }

    function stopAutoAdvance() {
      if (autoAdvanceTimer) {
        clearInterval(autoAdvanceTimer);
        autoAdvanceTimer = null;
      }
    }

    function resetAutoAdvance() {
      stopAutoAdvance();
      startAutoAdvance();
    }

    // Pause on hover
    if (wrapper) {
      wrapper.addEventListener('mouseenter', stopAutoAdvance);
      wrapper.addEventListener('mouseleave', startAutoAdvance);

      // Mouse wheel stepped navigation (throttled)
      let wheelThrottled = false;
      wrapper.addEventListener('wheel', (e) => {
        if (Math.abs(e.deltaY) > 20 || Math.abs(e.deltaX) > 20) {
          e.preventDefault();
          if (wheelThrottled) return;
          wheelThrottled = true;
          const delta = Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
          if (delta > 0) {
            goToSlide(currentSlide + 1); // Wheel down -> Next 2 (bottom to top)
          } else {
            goToSlide(currentSlide - 1); // Wheel up -> Previous 2
          }
          resetAutoAdvance();
          setTimeout(() => {
            wheelThrottled = false;
          }, 450);
        }
      }, { passive: false });

      // Touch / swipe support (vertical swipe)
      let touchStartY = 0;
      wrapper.addEventListener('touchstart', (e) => {
        touchStartY = e.touches[0].clientY;
      }, { passive: true });

      wrapper.addEventListener('touchend', (e) => {
        const touchEndY = e.changedTouches[0].clientY;
        const diffY = touchEndY - touchStartY;
        if (Math.abs(diffY) > 40) {
          if (diffY < 0) {
            goToSlide(currentSlide + 1); // Swipe up -> Next 2 (bottom to top)
          } else {
            goToSlide(currentSlide - 1); // Swipe down -> Previous 2
          }
          resetAutoAdvance();
        }
      }, { passive: true });
    }

    startAutoAdvance();
  }

  // Component B: Side-by-Side Comparison Matrix (Inspired by Tatwa Comparison Mockup)
  function renderComparisonMatrix(container, products, title) {
    if (!container) return;
    prepareViewTransition(container);
    container.innerHTML = `
      <div class="comparison-card">
        <div class="comparison-header-banner">
          <div class="comparison-header-left">
            <h3 class="comparison-title-uppercase">COMPARISON MATRIX</h3>
            <span class="badge-item-count">${products.length} Items</span>
          </div>
          <div class="comparison-header-controls">
            <div class="table-scroll-arrows">
              <button class="btn-matrix-scroll" id="btn-matrix-scroll-left" title="Scroll matrix left" aria-label="Scroll left">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
              </button>
              <button class="btn-matrix-scroll" id="btn-matrix-scroll-right" title="Scroll matrix right" aria-label="Scroll right">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
              </button>
            </div>
          </div>
        </div>

        <div class="comparison-table-scroll" id="comparison-table-scroll">
          <table class="comparison-table">
            <thead>
              <tr>
                <th class="matrix-spec-header">Appliance</th>
                ${products.map(p => {
                  return `
                    <td class="comparison-product-header">
                      <div class="matrix-img-box">
                        <img src="${p.imageUrl}" alt="${p.name}" />
                      </div>
                      <div class="matrix-brand-kicker">TATWA</div>
                      <h4 class="matrix-product-title">${p.name}</h4>
                    </td>
                  `;
                }).join('')}
              </tr>
            </thead>
            <tbody>
              <tr>
                <th>Price</th>
                ${products.map(p => {
                  const price = Number(p.price || 0);
                  const mrp = Number(p.mrp || 0);
                  const discount = p.discountPercent || (mrp > 0 && price > 0 ? Math.round(((mrp - price) / mrp) * 100) : 0);
                  return `
                    <td>
                      <div class="matrix-price-cell">
                        <div class="matrix-price-main">
                          <span class="matrix-price-val">₹${price.toLocaleString('en-IN')}</span>
                          ${mrp > price ? `<span class="matrix-price-mrp">Was ₹${mrp.toLocaleString('en-IN')}</span>` : ''}
                        </div>
                        ${discount > 0 ? `
                          <div class="badge-tatwa-blue matrix-red-pill">
                            <span>Tatwa Deal</span>
                            <strong>${discount}% OFF</strong>
                          </div>
                        ` : ''}
                      </div>
                    </td>
                  `;
                }).join('')}
              </tr>
              ${(() => {
                const cats = new Set(products.map(p => p.category));
                const isTv = cats.size === 1 && cats.has('tv');
                const isWm = cats.size === 1 && cats.has('washing_machine');
                const isChimney = cats.size === 1 && cats.has('chimney');
                const isDw = cats.size === 1 && cats.has('dishwasher');

                if (isTv) {
                  return `
                    <tr>
                      <th>Display & Screen</th>
                      ${products.map(p => `<td><strong>${p.displaySize || '-'}</strong><div style="font-size:0.78rem; opacity:0.8;">${p.type || p.resolution || ''}</div></td>`).join('')}
                    </tr>
                    <tr>
                      <th>Refresh Rate & HDR</th>
                      ${products.map(p => `<td><strong>${p.refreshRate || '60 Hz'}</strong><div style="font-size:0.78rem; opacity:0.8;">${p.hdr || 'HDR'}</div></td>`).join('')}
                    </tr>
                    <tr>
                      <th>Sound & Audio</th>
                      ${products.map(p => `<td><strong>${p.sound || 'Stereo Speakers'}</strong></td>`).join('')}
                    </tr>
                    <tr>
                      <th>Smart OS</th>
                      ${products.map(p => `<td>${p.os || 'Google TV'}</td>`).join('')}
                    </tr>
                    <tr>
                      <th>Warranty</th>
                      ${products.map(p => `<td>${p.warranty || '3 Years Tatwa Warranty'}</td>`).join('')}
                    </tr>
                  `;
                }

                if (isWm) {
                  return `
                    <tr>
                      <th>Capacity & Type</th>
                      ${products.map(p => `<td><strong>${p.capacity || '-'}</strong><div style="font-size:0.78rem; opacity:0.8;">${p.type || ''}</div></td>`).join('')}
                    </tr>
                    <tr>
                      <th>Motor & Speed</th>
                      ${products.map(p => `<td><strong>${p.motor || 'Inverter Motor'}</strong></td>`).join('')}
                    </tr>
                    <tr>
                      <th>Programmes</th>
                      ${products.map(p => `<td>${p.washProgrammesCount ? p.washProgrammesCount + ' Wash Programmes' : (p.programmes || '-')}</td>`).join('')}
                    </tr>
                    <tr>
                      <th>Energy Rating</th>
                      ${products.map(p => `<td><strong>${p.energyRating || '5 Star BEE'}</strong></td>`).join('')}
                    </tr>
                    <tr>
                      <th>Warranty</th>
                      ${products.map(p => `<td>${p.warranty || '3 Years Comprehensive'}</td>`).join('')}
                    </tr>
                  `;
                }

                if (isChimney) {
                  return `
                    <tr>
                      <th>Suction Power</th>
                      ${products.map(p => `<td><strong>${p.suctionPower || '1500 m³/hr'}</strong></td>`).join('')}
                    </tr>
                    <tr>
                      <th>Filter Tech</th>
                      ${products.map(p => `<td><strong>${p.filterDesign || 'Filterless Tech'}</strong></td>`).join('')}
                    </tr>
                    <tr>
                      <th>Controls</th>
                      ${products.map(p => `<td>${p.controls || 'Wave Gesture & Touch'}</td>`).join('')}
                    </tr>
                    <tr>
                      <th>Warranty</th>
                      ${products.map(p => `<td>${p.warranty || '12 Years on Motor'}</td>`).join('')}
                    </tr>
                  `;
                }

                if (isDw) {
                  return `
                    <tr>
                      <th>Capacity</th>
                      ${products.map(p => `<td><strong>${p.capacity || '14 Place Settings'}</strong></td>`).join('')}
                    </tr>
                    <tr>
                      <th>Programmes</th>
                      ${products.map(p => `<td>${p.programmes || p.cleaningFunction || '6–8 Programmes'}</td>`).join('')}
                    </tr>
                    <tr>
                      <th>Spray Technology</th>
                      ${products.map(p => `<td><strong>${p.cleaningFunction || 'Dual Zone 3D Spray'}</strong></td>`).join('')}
                    </tr>
                    <tr>
                      <th>Warranty</th>
                      ${products.map(p => `<td>${p.warranty || '2 Years Tatwa Warranty'}</td>`).join('')}
                    </tr>
                  `;
                }

                // Mixed categories fallback
                return `
                  <tr>
                    <th>Specification</th>
                    ${products.map(p => `<td><strong>${p.suctionPower || p.capacity || p.displaySize || '-'}</strong></td>`).join('')}
                  </tr>
                  <tr>
                    <th>Key Technology</th>
                    ${products.map(p => `<td><strong>${p.filterDesign || p.motor || p.resolution || p.cleaningFunction || '-'}</strong></td>`).join('')}
                  </tr>
                  <tr>
                    <th>Controls</th>
                    ${products.map(p => `<td>${p.controls || p.os || 'Electronic Controls'}</td>`).join('')}
                  </tr>
                  <tr>
                    <th>Warranty</th>
                    ${products.map(p => `<td>${p.warranty || 'Tatwa Warranty'}</td>`).join('')}
                  </tr>
                `;
              })()}
              <tr>
                <th>Action</th>
                ${products.map(p => `
                  <td>
                    <a href="${p.imageUrl}" target="_blank" class="btn-product-cta matrix-cta" rel="noopener">
                      Try Visualizer →
                    </a>
                  </td>
                `).join('')}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    `;

    // Wire smooth horizontal scrolling arrows
    const btnLeft = container.querySelector('#btn-matrix-scroll-left');
    const btnRight = container.querySelector('#btn-matrix-scroll-right');
    const scrollContainer = container.querySelector('#comparison-table-scroll');

    if (btnLeft && scrollContainer) {
      btnLeft.addEventListener('click', () => scrollContainer.scrollBy({ left: -260, behavior: 'smooth' }));
    }
    if (btnRight && scrollContainer) {
      btnRight.addEventListener('click', () => scrollContainer.scrollBy({ left: 260, behavior: 'smooth' }));
    }
  }

  // Component C: Replaced with 4-Step Chimney Installation Visual
  function renderLoadingGuide(container, guideData) {
    if (displayModeBadge) displayModeBadge.textContent = 'Installation Guide';
    renderChimneyInstallation(container);
  }

  // Component D: User Manual & Comprehensive Maintenance / Troubleshooting Guide
  function renderUserManual(container, manualData) {
    const data = manualData || {};
    const autoClean = data.chimneyAutoClean || {};
    const steps = autoClean.steps || [];
    const gesture = data.gestureControl || {};
    const filterless = data.filterlessMaintenance || {};
    const install = data.installationGuide || {};
    const troubleshooting = data.troubleshootingGuide || {};
    const troubleshootItems = troubleshooting.items || [];
    const dishCare = data.dishwasherCare || {};

    container.innerHTML = `
      <div class="manual-container">
        <!-- 1. Auto-Clean Procedure Card -->
        <section class="manual-box-card">
          <div class="manual-section-header">
            <div>
              <h3>♨️ Chimney Heat Auto-Clean Step-by-Step Procedure</h3>
              <p class="section-subtext">Automated thermal coil liquefaction channels heavy grease into the collector tray</p>
            </div>
            <span class="price-discount-pill" style="color: #0284c7; background: #e0f2fe; border-color: #bae6fd;">10-Min Thermal Cycle</span>
          </div>

          <div class="autoclean-timeline">
            <div class="step-box">
              <span class="step-num-badge">1</span>
              <h4>Press Auto-Clean</h4>
              <p>Touch the Auto-Clean icon on the curved glass panel or trigger the wave gesture sensor.</p>
            </div>
            <div class="step-box">
              <span class="step-num-badge">2</span>
              <h4>Heating Phase (9 Mins)</h4>
              <p>Internal heating elements warm up the motor chamber to liquefy thick oil and stubborn grease.</p>
            </div>
            <div class="step-box">
              <span class="step-num-badge">3</span>
              <h4>Fan Drain Phase (1 Min)</h4>
              <p>High-speed blower fan rotates to channel the liquefied grease directly into the stainless steel collector.</p>
            </div>
            <div class="step-box">
              <span class="step-num-badge">4</span>
              <h4>Empty Collector Tray</h4>
              <p>Slide out the metal collector tray, dispose of accumulated oil, wash with warm soapy water, and replace.</p>
            </div>
          </div>
        </section>

        <!-- 2. Touch & Wave Gesture Control Operation Card (FAQ Q19-Q21) -->
        <section class="manual-box-card">
          <div class="manual-section-header">
            <div>
              <h3>👋 Touch & Wave Gesture Control Operating Guide</h3>
              <p class="section-subtext">Hands-free optical motion sensor operating at 5–10 cm distance across 9 speed levels</p>
            </div>
            <span class="view-badge">9 Speeds Control</span>
          </div>

          <div class="gesture-grid">
            <div class="gesture-card gesture-card-on">
              <div class="gesture-card-header">
                <span class="gesture-icon">👋 ➡️</span>
                <span class="gesture-badge badge-on">Power ON / Step Up</span>
              </div>
              <h4>Wave Left-to-Right</h4>
              <p>Wave hand smoothly from left to right across the optical sensor to turn chimney on at Speed 1. Successive waves increment speed through all 9 BLDC levels up to Speed 9.</p>
            </div>

            <div class="gesture-card gesture-card-off">
              <div class="gesture-card-header">
                <span class="gesture-icon">⬅️ 👋</span>
                <span class="gesture-badge badge-off">Step Down / Power OFF</span>
              </div>
              <h4>Wave Right-to-Left</h4>
              <p>Wave hand smoothly from right to left to step down speed level (9 → 1). A final wave at Speed 1 powers off the chimney completely.</p>
            </div>

            <div class="gesture-card gesture-card-touch">
              <div class="gesture-card-header">
                <span class="gesture-icon">👆 🔘</span>
                <span class="gesture-badge badge-touch">Capacitive Touch</span>
              </div>
              <h4>Direct Glass Touch Panel</h4>
              <p>Touch icons on the black tempered glass panel offer direct 1-tap control for all 9 speeds, LED lighting, and Auto-Clean when hands are wet or oily.</p>
            </div>
          </div>
        </section>

        <!-- 3. Filterless Reality & Maintenance Guidelines Card (FAQ Q13-Q18) -->
        <section class="manual-box-card">
          <div class="filterless-notice-box">
            <div class="notice-header">
              <span class="notice-icon">ℹ️</span>
              <strong>Filterless Reality Check: Filterless ≠ Maintenance-Free</strong>
            </div>
            <p>
              Filterless design eliminates messy baffle filters and wire mesh scrub replacements. However, regular maintenance remains essential:
              wipe exterior glass and canopy weekly with a damp microfiber cloth, empty the metal oil collector tray every 2–3 weeks, and trigger Auto-Clean monthly.
            </p>
          </div>
        </section>

        <!-- 4. Cooktop Sizing & Installation Clearance Card (FAQ Q27-Q30) -->
        <section class="manual-box-card">
          <div class="manual-section-header">
            <div>
              <h3>📐 Cooktop Sizing & Installation Clearance</h3>
              <p class="section-subtext">Recommended chimney width coverage and mounting guidelines</p>
            </div>
            <span class="view-badge">650–750 mm Height</span>
          </div>

          <div class="cooktop-sizing-grid">
            <div class="size-item">
              <span class="size-width">60 cm Hood (600 mm)</span>
              <span class="size-dims">600 × 418 × 485 mm</span>
              <p>Best suited for 2 to 4 burner cooktops up to 60 cm wide.</p>
            </div>
            <div class="size-item">
              <span class="size-width">75 cm Hood (750 mm)</span>
              <span class="size-dims">750 × 418 × 490 mm</span>
              <p>Best suited for 3 to 4 burner cooktops up to 75 cm wide.</p>
            </div>
            <div class="size-item">
              <span class="size-width">90 cm Hood (900 mm)</span>
              <span class="size-dims">900 × 418 × 490 mm</span>
              <p>Best suited for 3 to 5 burner cooktops (75 to 90 cm wide).</p>
            </div>
          </div>
        </section>

        <!-- 5. Customer Support Troubleshooting Matrix Card (FAQ Section 10) -->
        <section class="manual-box-card">
          <div class="manual-section-header">
            <div>
              <h3>🛠️ Customer Support Troubleshooting Matrix</h3>
              <p class="section-subtext">Official Tatwa first-response troubleshooting guide for common complaints</p>
            </div>
            <span class="price-discount-pill" style="color: #7c3aed; background: #faf5ff; border-color: #e9d5ff;">Official Support FAQ</span>
          </div>

          <div class="troubleshooting-grid">
            ${(troubleshootItems.length > 0 ? troubleshootItems : [
              { complaint: 'Chimney is not switching on', firstResponse: 'Check main power switch, wall socket plug point, and electrical voltage. If responsive neither to touch nor gesture, arrange authorized Tatwa service inspection.' },
              { complaint: 'Suction appears weak', firstResponse: 'Verify selected speed level (use Speeds 6–9 for deep frying / tadka). Check for obstructions in duct pipe, outer exhaust louvers, or full oil collector tray.' },
              { complaint: 'Chimney sounds noisy / loud', firstResponse: 'The Libra BLDC operates at an ultra-quiet 44–46 dB. Verify sound variation across speeds. Persistent unusual noise may indicate duct pipe bends or loose mounting; call Tatwa service.' },
              { complaint: 'Gesture control is not responding', firstResponse: 'Ensure the front glass sensor is clean and dry. Wave hand at 5–10 cm distance with steady movement. Check if touch controls work normally.' },
              { complaint: 'Auto-clean is not working', firstResponse: 'Ensure the 10-minute cycle is initiated (9 min heating + 1 min fan). Do not run manual high-speed extraction during heating. If heating coil fails to warm, contact support.' },
              { complaint: 'Smoke is not being extracted effectively', firstResponse: 'Check installation height (must be 65–75 cm above burners) and verify the hood width matches the cooktop surface area.' },
              { complaint: 'Oil or residue is accumulating / dripping', firstResponse: 'Empty and wash the metal oil collector tray immediately. Run a 10-minute Heat Auto-Clean cycle and wipe down outer glass canopy.' },
              { complaint: 'Chimney vibrates during operation', firstResponse: 'Cease operation immediately if mounting appears loose or unsafe. Ensure wall brackets are tightly secured and arrange professional service.' }
            ]).map(t => `
              <div class="trouble-card">
                <div class="trouble-complaint">
                  <span class="trouble-q-badge">Issue</span>
                  <strong>${t.complaint}</strong>
                </div>
                <div class="trouble-response">
                  <span class="trouble-a-badge">Tatwa Recommended Action</span>
                  <p>${t.firstResponse}</p>
                </div>
              </div>
            `).join('')}
          </div>
        </section>

        <!-- 6. Dishwasher Maintenance & Care Card -->
        <section class="manual-box-card">
          <div class="manual-section-header">
            <div>
              <h3>✨ Dishwasher Essential Maintenance & Chemical Guide</h3>
              <p class="section-subtext">Prevent limescale, water spots, and ensure sparkling hygiene</p>
            </div>
            <span class="price-discount-pill">Routine Care</span>
          </div>

          <div class="care-checklist">
            <div class="care-item">
              <h4>🧂 Dishwasher Salt Refill</h4>
              <p>Essential for hard Indian water. Softens water in the ion-exchanger to prevent cloudy white limescale stains on stainless steel utensils.</p>
            </div>
            <div class="care-item">
              <h4>💧 Rinse Aid Dispenser</h4>
              <p>Accelerates spot-free sheet drying and eliminates water droplet marks on glasses and cutlery.</p>
            </div>
            <div class="care-item">
              <h4>🔄 Triple-Stage Filter</h4>
              <p>Unscrew cylindrical filter at the tub bottom weekly, rinse trapped food particles under running tap water, and lock back in place.</p>
            </div>
            <div class="care-item">
              <h4>🚫 Detergent Safety</h4>
              <p>Use ONLY automatic dishwasher tablets, powder, or gel. Never use liquid Vim/Pril which causes massive foam overflows.</p>
            </div>
          </div>
        </section>
      </div>
    `;
  }

  // ==========================================================================
  // COMPONENT D1: SMART APPLIANCE BUNDLES & COMBO SUITES
  // ==========================================================================
  function renderBundleScreen(container, bundles) {
    if (!container) return;
    prepareViewTransition(container);

    if (displaySubtitle) {
      displaySubtitle.textContent = 'Curated Dual-Appliance Suites • Extra Bundle Discounts • Free VIP Dual Installation';
    }

    const bundleList = (bundles && bundles.length > 0) ? bundles : [
      {
        id: 'bundle-kitchen-suite',
        name: 'Tatwa Smart Chef Kitchen Suite',
        subtitle: 'Aero BLDC 60cm Chimney + PureWash FBID 14S Integrated Dishwasher',
        badge: 'Best-Seller Combo • Extra 10% Off',
        savingsTag: 'Save ₹23,490 Total',
        bundlePrice: 79990,
        combinedMrp: 103480,
        discountPercent: 23,
        items: [
          {
            name: 'Tatwa Aero BLDC 60 cm',
            role: 'Primary Cooker Hood',
            tag: '1500 m³/hr Suction • Heat Auto-Clean',
            imageUrl: 'images/chimney_curved_glass.jpg'
          },
          {
            name: 'Tatwa PureWash FBID 14S Integrated',
            role: 'Built-in Dishwasher',
            tag: '14 Place Settings • Dual Zone Wash',
            imageUrl: 'images/dishwasher_integrated.jpg'
          }
        ],
        perks: [
          'Free Standard Dual Installation (Worth ₹3,500)',
          'Free Dishwasher Starter Pack (Salt + Rinse Aid + Tablets)',
          '12-Year Motor Warranty on Chimney + 10-Year Cavity Warranty on Dishwasher',
          'Zero Cost EMI Available (from ₹6,666/mo)'
        ]
      },
      {
        id: 'bundle-smart-home-duo',
        name: 'Tatwa Complete Smart Home Duo',
        subtitle: 'Vision Pro 55" 4K QLED Google TV + EcoWash Pro 8kg Inverter Washer',
        badge: 'Living & Laundry Duo • Save ₹34,000',
        savingsTag: 'Save ₹34,000 Total',
        bundlePrice: 59990,
        combinedMrp: 93980,
        discountPercent: 36,
        items: [
          {
            name: 'Tatwa Vision Pro 55" 4K QLED Google TV',
            role: 'Quantum 4K Entertainment',
            tag: '55" QLED • 120Hz MEMC • 40W Dolby Atmos',
            imageUrl: 'images/tv_qled_55inch.jpg'
          },
          {
            name: 'Tatwa EcoWash Pro 8 kg Front Load',
            role: 'Smart Fabric Laundry',
            tag: '8.0 kg • 1400 RPM • AI Steam 99.9%',
            imageUrl: 'images/wm_front_load_8kg.jpg'
          }
        ],
        perks: [
          'Free TV Heavy-Duty Swivel Wall Mount (Worth ₹1,999)',
          'Free Anti-Vibration Washer Stand & Inlet Hoses (Worth ₹1,499)',
          '3-Year Comprehensive Home Warranty on both appliances',
          'Same-Day Delivery & Express Next-Day Installation'
        ]
      },
      {
        id: 'bundle-cinema-luxury-suite',
        name: 'Tatwa Cinema & All-in-One Suite',
        subtitle: 'CrystalView 65" Cinema OLED TV + AeroCare 10kg Washer-Dryer Combo',
        badge: 'Flagship Luxury Tier • Save ₹75,000',
        savingsTag: 'Save ₹75,000 Total',
        bundlePrice: 134990,
        combinedMrp: 209980,
        discountPercent: 36,
        items: [
          {
            name: 'Tatwa CrystalView 65" Cinema OLED TV',
            role: 'Flagship Cinema OLED',
            tag: '65" Self-Lit OLED • 144Hz VRR • 60W Soundbar',
            imageUrl: 'images/tv_oled_65inch.jpg'
          },
          {
            name: 'Tatwa AeroCare 10 kg AI Washer-Dryer',
            role: 'All-in-One Washer-Dryer',
            tag: '10kg Wash + 7kg 100% Dry • Direct Motion Inverter',
            imageUrl: 'images/wm_washer_dryer_10kg.jpg'
          }
        ],
        perks: [
          'VIP White-Glove Installation by Certified Senior Engineers',
          'Free HDMI 2.1 Ultra High Speed 48Gbps Cable (Worth ₹2,499)',
          '5-Year Extended Panel Warranty & 12-Year Motor Warranty',
          'Dedicated Priority Customer Service Concierge Line'
        ]
      }
    ];

    container.innerHTML = `
      <div class="bundle-suite-container">
        <header class="bundle-master-header">
          <div class="bundle-header-left">
            <button class="btn-back-home-pill" id="btn-back-bundle" title="Return to All Categories Home">
              <span>← All Categories</span>
            </button>
            <div class="brand-wordmark">
              <span class="brand-wordmark-text">TATWA</span>
              <span class="brand-accent-line"></span>
            </div>
            <h1 class="bundle-main-title">TATWA SMART APPLIANCE SUITES &amp; COMBOS</h1>
            <div class="bundle-sub-title">COMBINED EFFICIENCY • DUAL-PRODUCT PACKAGES • UP TO 36% DISCOUNT</div>
          </div>
          <div class="bundle-header-badge-pill">
            <span>✨ Festive Bundle Perks Active</span>
          </div>
        </header>

        <div class="bundle-cards-grid">
          ${bundleList.map((b, idx) => {
            const price = Number(b.bundlePrice || 0);
            const mrp = Number(b.combinedMrp || 0);
            const savings = mrp > price ? mrp - price : 0;
            const items = b.items || [];
            const itemA = items[0] ? (items[0].product || items[0]) : {};
            const itemB = items[1] ? (items[1].product || items[1]) : {};

            return `
              <div class="bundle-card ${idx === 0 ? 'bundle-card-featured' : ''}">
                <div class="bundle-card-banner">
                  <span class="bundle-badge">${b.badge || 'Smart Bundle Combo'}</span>
                  <span class="bundle-savings-pill">${b.savingsTag || `Save ₹${savings.toLocaleString('en-IN')}`}</span>
                </div>

                <div class="bundle-card-body">
                  <h3 class="bundle-title">${b.name}</h3>
                  <p class="bundle-subtitle">${b.subtitle || ''}</p>

                  <div class="bundle-duo-showcase">
                    <div class="bundle-appliance-item">
                      <div class="bundle-thumb-wrap">
                        <img src="${itemA.imageUrl || 'images/chimney_curved_glass.jpg'}" alt="${itemA.name || 'Appliance A'}" />
                      </div>
                      <div class="bundle-item-info">
                        <div class="bundle-item-role">${items[0]?.role || 'Appliance 1'}</div>
                        <h4 class="bundle-item-name">${itemA.name || 'Tatwa Appliance'}</h4>
                        <span class="bundle-item-tag">${items[0]?.tag || itemA.highlight || ''}</span>
                      </div>
                    </div>

                    <div class="bundle-plus-badge">+</div>

                    <div class="bundle-appliance-item">
                      <div class="bundle-thumb-wrap">
                        <img src="${itemB.imageUrl || 'images/dishwasher_integrated.jpg'}" alt="${itemB.name || 'Appliance B'}" />
                      </div>
                      <div class="bundle-item-info">
                        <div class="bundle-item-role">${items[1]?.role || 'Appliance 2'}</div>
                        <h4 class="bundle-item-name">${itemB.name || 'Tatwa Appliance'}</h4>
                        <span class="bundle-item-tag">${items[1]?.tag || itemB.highlight || ''}</span>
                      </div>
                    </div>
                  </div>

                  <div class="bundle-pricing-row">
                    <div class="bundle-price-box">
                      <span class="bundle-price-label">Bundle Price</span>
                      <span class="bundle-price-val">₹${price.toLocaleString('en-IN')}</span>
                      ${mrp > price ? `<span class="bundle-price-mrp">Total MRP ₹${mrp.toLocaleString('en-IN')}</span>` : ''}
                    </div>
                    <div class="bundle-discount-badge">
                      <span>${b.discountPercent || Math.round((savings / mrp) * 100)}% OFF</span>
                    </div>
                  </div>

                  <div class="bundle-perks-box">
                    <div class="bundle-perks-title">Included Bundle Privileges</div>
                    <ul class="bundle-perks-list">
                      ${(b.perks || []).map(p => `<li><span class="perk-check">✓</span> ${p}</li>`).join('')}
                    </ul>
                  </div>

                  <div class="bundle-actions">
                    <button class="btn-bundle-order" data-bundle="${b.id}">
                      <span>Inquire About Bundle →</span>
                    </button>
                  </div>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;

    const btnBack = container.querySelector('#btn-back-bundle');
    if (btnBack) {
      btnBack.addEventListener('click', () => renderTatwaWelcomeScreen(container));
    }

    container.querySelectorAll('.btn-bundle-order').forEach(btn => {
      btn.addEventListener('click', () => {
        showToast('Agent notified of bundle inquiry!');
      });
    });
  }

  // ==========================================================================
  // COMPONENT D2: PAN-INDIA PINCODE SERVICEABILITY & INSTALLATION ESTIMATOR
  // ==========================================================================
  function renderServiceabilityScreen(container, serviceData) {
    if (!container) return;
    prepareViewTransition(container);

    const data = serviceData || {
      pincode: '560001',
      city: 'Bangalore',
      state: 'Karnataka',
      turnaround: 'Within 24 Hours',
      deliveryType: 'Same-Day / Next-Day Express',
      inclusions: [
        'Free Unboxing and Pre-Installation Site Inspection',
        'Certified Installation by Authorized Tatwa Engineers',
        'Standard Wall Mounting and Levelling Alignment',
        'Duct & Water Connection using OEM certified accessories',
        'Comprehensive Operational Demo & In-Person Walkthrough',
        'Instant Digital Warranty Activation with Tatwa Care'
      ],
      helpline: '1800-TATWA-CARE (1800-828-9227)',
      operatingHours: '9:00 AM – 9:00 PM (Monday through Sunday)'
    };

    if (displaySubtitle) {
      displaySubtitle.textContent = `Pincode ${data.pincode} Verified • Authorized Tatwa Technician Visit ${data.turnaround}`;
    }

    container.innerHTML = `
      <div class="serviceability-container">
        <header class="service-master-header">
          <div class="service-header-left">
            <button class="btn-back-home-pill" id="btn-back-service" title="Return to All Categories Home">
              <span>← All Categories</span>
            </button>
            <div class="brand-wordmark">
              <span class="brand-wordmark-text">TATWA</span>
              <span class="brand-accent-line"></span>
            </div>
            <h1 class="service-main-title">PAN-INDIA CERTIFIED INSTALLATION &amp; SERVICE NETWORK</h1>
            <div class="service-sub-title">FACTORY CERTIFIED ENGINEERS • 24–48 HOUR VISITS • FREE STANDARD INSTALLATION</div>
          </div>
          <div class="service-status-pill">
            <span class="status-dot-pulse"></span>
            <span>Service Active in Your Area</span>
          </div>
        </header>

        <div class="service-spotlight-card">
          <div class="service-spotlight-top">
            <div class="service-pincode-pill">
              <span class="pin-icon">📍</span>
              <strong>PIN CODE: ${data.pincode}</strong>
              <span class="pin-city">(${data.city}, ${data.state})</span>
            </div>
            <div class="service-sla-tags">
              <span class="sla-badge sla-turnaround">⏱ Technician Visit: ${data.turnaround}</span>
              <span class="sla-badge sla-delivery">🚚 Delivery: ${data.deliveryType}</span>
            </div>
          </div>

          <div class="service-steps-grid">
            <div class="service-step-item">
              <div class="service-step-num">01</div>
              <div class="service-step-content">
                <h4>Free Site Inspection</h4>
                <p>Electrical line, water inlet pressure, and wall masonry audit prior to unboxing.</p>
              </div>
            </div>
            <div class="service-step-item">
              <div class="service-step-num">02</div>
              <div class="service-step-content">
                <h4>Certified Installation</h4>
                <p>Factory-trained engineers use laser leveling and anti-vibration OEM mounting brackets.</p>
              </div>
            </div>
            <div class="service-step-item">
              <div class="service-step-num">03</div>
              <div class="service-step-content">
                <h4>Live Operational Demo</h4>
                <p>Step-by-step training on gesture controls, heat auto-clean, steam wash, and detergent use.</p>
              </div>
            </div>
            <div class="service-step-item">
              <div class="service-step-num">04</div>
              <div class="service-step-content">
                <h4>Instant Cloud Warranty</h4>
                <p>QR code registration for 10-to-12 year motor/cavity warranties on the spot.</p>
              </div>
            </div>
          </div>
        </div>

        <div class="service-details-row">
          <div class="service-inclusions-card">
            <h3 class="service-card-title">Standard Free Installation Inclusions</h3>
            <ul class="service-inclusions-list">
              ${(data.inclusions || []).map(inc => `<li><span class="inc-check">✓</span> ${inc}</li>`).join('')}
            </ul>
          </div>

          <div class="service-support-card">
            <h3 class="service-card-title">Tatwa Care Support Helpline</h3>
            <div class="helpline-number-box">
              <span class="helpline-icon">📞</span>
              <div class="helpline-details">
                <span class="helpline-label">Toll-Free Helpline</span>
                <strong class="helpline-val">${data.helpline}</strong>
                <span class="helpline-timing">${data.operatingHours}</span>
              </div>
            </div>
            <div class="coverage-cities-box">
              <span class="cities-label">Metro Hubs with 24-Hour Express Dispatch:</span>
              <div class="cities-pills">
                <span class="city-pill">Bangalore</span>
                <span class="city-pill">Mumbai</span>
                <span class="city-pill">Delhi NCR</span>
                <span class="city-pill">Chennai</span>
                <span class="city-pill">Hyderabad</span>
                <span class="city-pill">Kolkata</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    const btnBack = container.querySelector('#btn-back-service');
    if (btnBack) {
      btnBack.addEventListener('click', () => renderTatwaWelcomeScreen(container));
    }
  }

  // Component E: Offers & Deals Showcase (Inspired by Tatwa Reference Mockup 3)
  function renderOffersShowcase(container, products, title) {
    container.innerHTML = `
      <div class="festive-offers-banner">
        <div class="festive-sparkle-decor">✨</div>
        <div class="festive-banner-content">
          <span class="festive-eyebrow">• FESTIVE CELEBRATIONS •</span>
          <h2 class="festive-headline">EXCLUSIVE FESTIVE OFFERS</h2>
          <p class="festive-subline">Get Up To 40% OFF + Assured Gifts on Tatwa Flagships</p>
        </div>
        <button class="btn-festive-cta" id="btn-festive-filterless">
          Try Visualizer →
        </button>
      </div>
      <div class="festive-combos-header">
        <span class="festive-combos-kicker">FESTIVE COMBOS &amp; PROMOTIONAL SAVINGS</span>
      </div>
      <div id="offers-grid-container"></div>
    `;
    const subContainer = document.getElementById('offers-grid-container');
    renderProductCards(subContainer, products);

    const btnFestive = container.querySelector('#btn-festive-filterless');
    if (btnFestive) {
      btnFestive.addEventListener('click', () => {
        hitTool({ action: 'filter_by_price', category: 'chimney', filter: 'filterless', isOffer: true, maxPrice: 25000 });
      });
    }
  }

  // Component F: Chimney Installation Guide (Interactive 4-Step Animated Highlighter)
  function renderChimneyInstallation(container) {
    if (!container) return;

    if (displaySubtitle) {
      displaySubtitle.textContent = 'BLDC Autoclean Cooker Hood Step-by-Step Installation Manual';
    }

    container.innerHTML = `
      <div class="installation-guide-card" id="installation-guide-comp">
        <header class="guide-header">
          <div class="brand-title-group">
            <div class="brand-wordmark">
              <span class="brand-wordmark-text">TATWA</span>
              <span class="brand-accent-line"></span>
            </div>
            <h1 class="main-title">INSTALLATION OF THE CHIMNEY</h1>
            <div class="sub-title">BLDC AUTOCLEAN COOKER HOOD</div>
          </div>

          <div class="playback-controls">
            <button id="btn-toggle-cycle-pane" class="btn-auto-play-toggle" title="Pause or Resume Auto Cycle">
              <span id="cycle-icon-pane">⏸</span>
              <span id="cycle-text-pane">Auto Cycle Active</span>
            </button>
          </div>

          <nav class="steps-nav-tracker" aria-label="Installation Steps">
            <div class="step-nav-item active" data-step="1">
              <div class="step-circle">1</div>
              <span class="step-label">Prepare Wall</span>
            </div>
            <div class="step-nav-item" data-step="2">
              <div class="step-circle">2</div>
              <span class="step-label">Fix Bracket</span>
            </div>
            <div class="step-nav-item" data-step="3">
              <div class="step-circle">3</div>
              <span class="step-label">Mount Chimney</span>
            </div>
            <div class="step-nav-item" data-step="4">
              <div class="step-circle">4</div>
              <span class="step-label">Connect &amp; Test</span>
            </div>
          </nav>
        </header>

        <main class="installation-canvas">
          <div class="steps-column">
            <article class="step-card active" id="pane-step-card-1" data-step="1">
              <div class="step-info-col">
                <div class="step-title-header">
                  <span class="step-num-pill">01</span>
                  <h2 class="step-heading">PREPARE THE WALL</h2>
                </div>
                <ul class="step-bullets-list">
                  <li>Ensure the wall is strong enough to hold the chimney.</li>
                  <li>Mark the level mounting positions as per the measurements.</li>
                  <li>Drill holes and insert suitable wall plugs.</li>
                </ul>
              </div>
              <div class="step-square-box" title="Step 1: Wall Drilling Image">
                <img src="images/step1_prepare_wall.jpg" alt="Prepare and drill wall" />
              </div>
            </article>

            <article class="step-card" id="pane-step-card-2" data-step="2">
              <div class="step-info-col">
                <div class="step-title-header">
                  <span class="step-num-pill">02</span>
                  <h2 class="step-heading">FIX THE BRACKET</h2>
                </div>
                <ul class="step-bullets-list">
                  <li>Secure the wall mounting bracket with appropriate screws.</li>
                  <li>Ensure the bracket is level and properly aligned.</li>
                  <li>Use the correct wall plugs and screws for your wall type.</li>
                </ul>
              </div>
              <div class="step-square-box" title="Step 2: Fixing Mounting Bracket Image">
                <img src="images/step2_fix_bracket.jpg" alt="Fixing bracket with screws" />
              </div>
            </article>
          </div>

          <div class="hero-center-column">
            <div class="hero-chimney-img-box">
              <img src="images/chimney_installation_hero.jpg" alt="Tatwa Chimney Installed Diagram" />
              <div class="hero-pointer-tag pointer-pos-01 active" id="pane-pointer-01" data-step="1" title="01: Wall Mounting Anchors">01</div>
              <div class="hero-pointer-tag pointer-pos-02" id="pane-pointer-02" data-step="2" title="02: Wall Mounting Bracket">02</div>
              <div class="hero-pointer-tag pointer-pos-03" id="pane-pointer-03" data-step="3" title="03: Chimney Body Hanging Point">03</div>
              <div class="hero-pointer-tag pointer-pos-04" id="pane-pointer-04" data-step="4" title="04: Corrugated Duct & Wall Flange">04</div>
            </div>
          </div>

          <div class="steps-column">
            <article class="step-card" id="pane-step-card-3" data-step="3">
              <div class="step-info-col">
                <div class="step-title-header">
                  <span class="step-num-pill">03</span>
                  <h2 class="step-heading">MOUNT THE CHIMNEY</h2>
                </div>
                <ul class="step-bullets-list">
                  <li>With two people, carefully hang the hood on the wall bracket.</li>
                  <li>Ensure the chimney is level.</li>
                  <li>Secure the hood body and fix the chimney cover / spacers as per the model.</li>
                </ul>
              </div>
              <div class="step-square-box" title="Step 3: Mounting Chimney Image">
                <img src="images/step3_mount_chimney.jpg" alt="Mount chimney on bracket" />
              </div>
            </article>

            <article class="step-card" id="pane-step-card-4" data-step="4">
              <div class="step-info-col">
                <div class="step-title-header">
                  <span class="step-num-pill">04</span>
                  <h2 class="step-heading">CONNECT &amp; TEST</h2>
                </div>
                <ul class="step-bullets-list">
                  <li>Connect the exhaust pipe to the hood and to the wall outlet.</li>
                  <li>Ensure a proper seal to avoid leakage.</li>
                  <li>Connect only to an earthed power socket after installation.</li>
                  <li>Test all functions for normal operation (fan, lights, auto-clean, etc.).</li>
                </ul>
              </div>
              <div class="step-square-box" title="Step 4: Exhaust Duct and Power Connection Image">
                <img src="images/step4_connect_test.jpg" alt="Connect exhaust duct and power socket" />
              </div>
            </article>
          </div>
        </main>

        <footer class="guide-bottom-strip">
          <div class="bottom-info-card">
            <div class="bottom-card-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="5" y="2" width="14" height="6" rx="1" />
                <line x1="3" y1="18" x2="21" y2="18" />
                <line x1="12" y1="9" x2="12" y2="15" />
                <polyline points="9 11 12 8 15 11" />
                <polyline points="9 13 12 16 15 13" />
              </svg>
            </div>
            <div class="bottom-card-text">
              <span class="bottom-card-title">Mounting height</span>
              <p class="bottom-card-desc">Verify the correct clearance for your model with an authorised installer (650–750 mm above cooktop).</p>
            </div>
          </div>

          <div class="bottom-info-card">
            <div class="bottom-card-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="9" />
                <circle cx="12" cy="12" r="5" stroke-dasharray="2 2" />
                <circle cx="12" cy="12" r="2" />
              </svg>
            </div>
            <div class="bottom-card-text">
              <span class="bottom-card-title">Outlet hole</span>
              <p class="bottom-card-desc">Outlet hole shown in manual: 160 mm; confirm model requirements before drilling.</p>
            </div>
          </div>

          <div class="bottom-notice-card">
            <div class="notice-shield-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <polyline points="9 12 11 14 15 10" />
              </svg>
            </div>
            <div class="notice-card-text">
              <span class="notice-card-title">Installation by an authorised service representative</span>
              <p class="notice-card-desc">Two people required to move/install. Call 1800-828-9222 for Tatwa authorized technician.</p>
            </div>
          </div>
        </footer>
      </div>
    `;

    initInstallationStepCycle(container);
  }

  function initInstallationStepCycle(container) {
    if (!container) return;
    let currentStep = 1;
    const totalSteps = 4;
    let autoPlay = true;
    let cycleTimer = null;
    const cycleIntervalMs = 3800;

    const navItems = container.querySelectorAll('.step-nav-item');
    const stepCards = container.querySelectorAll('.step-card');
    const pointerTags = container.querySelectorAll('.hero-pointer-tag');
    const btnToggle = container.querySelector('#btn-toggle-cycle-pane');
    const cycleIcon = container.querySelector('#cycle-icon-pane');
    const cycleText = container.querySelector('#cycle-text-pane');
    const compCard = container.querySelector('#installation-guide-comp');

    function setActiveStep(stepNum) {
      currentStep = Number(stepNum);

      navItems.forEach((nav) => {
        const s = Number(nav.getAttribute('data-step'));
        nav.classList.toggle('active', s === currentStep);
      });

      stepCards.forEach((card) => {
        const s = Number(card.getAttribute('data-step'));
        card.classList.toggle('active', s === currentStep);
      });

      pointerTags.forEach((ptr) => {
        const s = Number(ptr.getAttribute('data-step'));
        ptr.classList.toggle('active', s === currentStep);
      });
    }

    function nextStep() {
      let next = currentStep + 1;
      if (next > totalSteps) next = 1;
      setActiveStep(next);
    }

    function startCycle() {
      if (cycleTimer) clearInterval(cycleTimer);
      cycleTimer = setInterval(nextStep, cycleIntervalMs);
      autoPlay = true;
      if (cycleIcon) cycleIcon.textContent = '⏸';
      if (cycleText) cycleText.textContent = 'Auto Cycle Active';
    }

    function stopCycle() {
      if (cycleTimer) {
        clearInterval(cycleTimer);
        cycleTimer = null;
      }
      autoPlay = false;
      if (cycleIcon) cycleIcon.textContent = '▶';
      if (cycleText) cycleText.textContent = 'Paused (Click to play)';
    }

    navItems.forEach((nav) => {
      nav.addEventListener('click', () => {
        setActiveStep(nav.getAttribute('data-step'));
        stopCycle();
      });
    });

    stepCards.forEach((card) => {
      card.addEventListener('click', () => {
        setActiveStep(card.getAttribute('data-step'));
        stopCycle();
      });
    });

    pointerTags.forEach((ptr) => {
      ptr.addEventListener('click', () => {
        setActiveStep(ptr.getAttribute('data-step'));
        stopCycle();
      });
    });

    if (btnToggle) {
      btnToggle.addEventListener('click', () => {
        if (autoPlay) stopCycle();
        else startCycle();
      });
    }

    if (compCard) {
      compCard.addEventListener('mouseenter', () => {
        if (autoPlay && cycleTimer) clearInterval(cycleTimer);
      });
      compCard.addEventListener('mouseleave', () => {
        if (autoPlay) startCycle();
      });
    }

    setActiveStep(1);
    startCycle();
  }

  // ==========================================================================
  // COMPONENT: CHIMNEY CLEANING & SERVICING GUIDE (Tatwa Reference Blueprint)
  // ==========================================================================
  function renderChimneyCleaning(container) {
    if (!container) return;

    if (displaySubtitle) {
      displaySubtitle.textContent = 'Heat Auto-Clean & Stainless Steel Oil Collector Maintenance';
    }

    container.innerHTML = `
      <div class="installation-guide-card" id="chimney-cleaning-comp">
        <header class="guide-header">
          <div class="brand-title-group">
            <div class="brand-wordmark">
              <span class="brand-wordmark-text">TATWA</span>
              <span class="brand-accent-line"></span>
            </div>
            <h1 class="main-title">CLEANING &amp; MAINTENANCE OF THE CHIMNEY</h1>
            <div class="sub-title">HEAT AUTO-CLEAN &amp; FILTERLESS BLDC COOKER HOOD</div>
          </div>

          <div class="playback-controls">
            <button id="btn-toggle-cleaning-cycle" class="btn-auto-play-toggle" title="Pause or Resume Auto Cycle">
              <span id="cycle-icon-clean">⏸</span>
              <span id="cycle-text-clean">Auto Cycle Active</span>
            </button>
          </div>

          <nav class="steps-nav-tracker" aria-label="Cleaning Steps">
            <div class="step-nav-item active" data-step="1">
              <div class="step-circle">1</div>
              <span class="step-label">Surface Care</span>
            </div>
            <div class="step-nav-item" data-step="2">
              <div class="step-circle">2</div>
              <span class="step-label">Heat Melting</span>
            </div>
            <div class="step-nav-item" data-step="3">
              <div class="step-circle">3</div>
              <span class="step-label">Blower Flush</span>
            </div>
            <div class="step-nav-item" data-step="4">
              <div class="step-circle">4</div>
              <span class="step-label">Oil Collector</span>
            </div>
          </nav>
        </header>

        <main class="installation-canvas">
          <div class="steps-column">
            <article class="step-card active" id="clean-step-card-1" data-step="1">
              <div class="step-info-col">
                <div class="step-title-header">
                  <span class="step-num-pill">01</span>
                  <h2 class="step-heading">REGULAR SURFACE CARE</h2>
                </div>
                <ul class="step-bullets-list">
                  <li>Clean the exterior shell every 3 days.</li>
                  <li>Wipe curved tempered glass with soft microfiber cloth &amp; mild neutral detergent.</li>
                  <li>Auto-clean reminder appears after approx 30 hours of operation.</li>
                </ul>
              </div>
              <div class="step-square-box" title="Step 1: Microfiber Surface Cleaning">
                <img src="images/clean_step1_surface.jpg" alt="Surface cleaning with microfiber" />
              </div>
            </article>

            <article class="step-card" id="clean-step-card-2" data-step="2">
              <div class="step-info-col">
                <div class="step-title-header">
                  <span class="step-num-pill">02</span>
                  <h2 class="step-heading">9-MIN THERMAL MELTING</h2>
                </div>
                <ul class="step-bullets-list">
                  <li>Press 1-touch Auto-Clean button on panel.</li>
                  <li>Heating coil encasing blower chamber heats to ~80°C.</li>
                  <li>Liquefies thick sticky grease, ghee &amp; tadka residue hands-free.</li>
                </ul>
              </div>
              <div class="step-square-box" title="Step 2: 80°C Heating Coil Melting">
                <img src="images/clean_step2_heat.jpg" alt="Heating coil melting grease" />
              </div>
            </article>
          </div>

          <div class="hero-center-column">
            <div class="hero-chimney-img-box">
              <img src="images/clean_hero_diag.jpg" alt="Tatwa Heat Auto-Clean System Diagram" />
              <div class="hero-pointer-tag active" style="bottom: 26%; left: 16%;" id="clean-pointer-01" data-step="1" title="01: Tempered Curved Glass Shell">01</div>
              <div class="hero-pointer-tag" style="top: 36%; right: 36%;" id="clean-pointer-02" data-step="2" title="02: 80°C Internal Heating Coil">02</div>
              <div class="hero-pointer-tag" style="top: 48%; left: 45%;" id="clean-pointer-03" data-step="3" title="03: Centrifugal Blower Turbine">03</div>
              <div class="hero-pointer-tag" style="bottom: 12%; left: 48%;" id="clean-pointer-04" data-step="4" title="04: Stainless Steel Oil Collector Tray">04</div>
            </div>
          </div>

          <div class="steps-column">
            <article class="step-card" id="clean-step-card-3" data-step="3">
              <div class="step-info-col">
                <div class="step-title-header">
                  <span class="step-num-pill">03</span>
                  <h2 class="step-heading">1-MIN CENTRIFUGE FLUSH</h2>
                </div>
                <ul class="step-bullets-list">
                  <li>At minute 9, 1500 m³/hr BLDC motor spins high-speed centrifugal flush.</li>
                  <li>Expels liquefied oil droplets into drainage channel.</li>
                  <li>Prevents sticky oil accumulation on motor blades.</li>
                </ul>
              </div>
              <div class="step-square-box" title="Step 3: Centrifugal Blower Flush">
                <img src="images/clean_step3_blower.jpg" alt="Centrifugal blower flushing oil" />
              </div>
            </article>

            <article class="step-card" id="clean-step-card-4" data-step="4">
              <div class="step-info-col">
                <div class="step-title-header">
                  <span class="step-num-pill">04</span>
                  <h2 class="step-heading">EMPTY OIL COLLECTOR</h2>
                </div>
                <ul class="step-bullets-list">
                  <li>Slide out stainless steel oil collector from bottom slot.</li>
                  <li>Empty grease residue every 15 to 20 days.</li>
                  <li>Rinse in warm soapy water, dry thoroughly, and slide back.</li>
                </ul>
              </div>
              <div class="step-square-box" title="Step 4: Slide-Out Oil Tray">
                <img src="images/clean_step4_oiltray.jpg" alt="Slide out stainless steel oil tray" />
              </div>
            </article>
          </div>
        </main>

        <footer class="guide-bottom-strip">
          <div class="bottom-info-card">
            <div class="bottom-card-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </div>
            <div class="bottom-card-text">
              <span class="bottom-card-title">3-Day Routine Maintenance</span>
              <p class="bottom-card-desc">Wipe exterior glass every 3 days. Run auto-clean when prompted after 30h cooking.</p>
            </div>
          </div>

          <div class="bottom-info-card">
            <div class="bottom-card-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
              </svg>
            </div>
            <div class="bottom-card-text">
              <span class="bottom-card-title">6-Month Authorized Servicing</span>
              <p class="bottom-card-desc">Full internal blower overhaul &amp; impeller servicing every 6 months by authorized personnel only.</p>
            </div>
          </div>

          <div class="bottom-notice-card">
            <div class="notice-shield-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
            </div>
            <div class="notice-card-text">
              <span class="notice-card-title">Safety Restriction: Power Off First</span>
              <p class="notice-card-desc">Disconnect main power before cleaning. Non-professionals must never open internal motor/impeller.</p>
            </div>
          </div>
        </footer>
      </div>
    `;

    initCleaningStepCycle(container);
  }

  function initCleaningStepCycle(container) {
    if (!container) return;
    let currentStep = 1;
    const totalSteps = 4;
    let autoPlay = true;
    let cycleTimer = null;
    const cycleIntervalMs = 3800;

    const navItems = container.querySelectorAll('.step-nav-item');
    const stepCards = container.querySelectorAll('.step-card');
    const pointerTags = container.querySelectorAll('.hero-pointer-tag');
    const btnToggle = container.querySelector('#btn-toggle-cleaning-cycle');
    const cycleIcon = container.querySelector('#cycle-icon-clean');
    const cycleText = container.querySelector('#cycle-text-clean');
    const compCard = container.querySelector('#chimney-cleaning-comp');

    function setActiveStep(stepNum) {
      currentStep = Number(stepNum);

      navItems.forEach((nav) => {
        const s = Number(nav.getAttribute('data-step'));
        nav.classList.toggle('active', s === currentStep);
      });

      stepCards.forEach((card) => {
        const s = Number(card.getAttribute('data-step'));
        card.classList.toggle('active', s === currentStep);
      });

      pointerTags.forEach((ptr) => {
        const s = Number(ptr.getAttribute('data-step'));
        ptr.classList.toggle('active', s === currentStep);
      });
    }

    function nextStep() {
      let next = currentStep + 1;
      if (next > totalSteps) next = 1;
      setActiveStep(next);
    }

    function startCycle() {
      if (cycleTimer) clearInterval(cycleTimer);
      cycleTimer = setInterval(nextStep, cycleIntervalMs);
      autoPlay = true;
      if (cycleIcon) cycleIcon.textContent = '⏸';
      if (cycleText) cycleText.textContent = 'Auto Cycle Active';
    }

    function stopCycle() {
      if (cycleTimer) {
        clearInterval(cycleTimer);
        cycleTimer = null;
      }
      autoPlay = false;
      if (cycleIcon) cycleIcon.textContent = '▶';
      if (cycleText) cycleText.textContent = 'Paused (Click to play)';
    }

    navItems.forEach((nav) => {
      nav.addEventListener('click', () => {
        setActiveStep(nav.getAttribute('data-step'));
        stopCycle();
      });
    });

    stepCards.forEach((card) => {
      card.addEventListener('click', () => {
        setActiveStep(card.getAttribute('data-step'));
        stopCycle();
      });
    });

    pointerTags.forEach((ptr) => {
      ptr.addEventListener('click', () => {
        setActiveStep(ptr.getAttribute('data-step'));
        stopCycle();
      });
    });

    if (btnToggle) {
      btnToggle.addEventListener('click', () => {
        if (autoPlay) stopCycle();
        else startCycle();
      });
    }

    if (compCard) {
      compCard.addEventListener('mouseenter', () => {
        if (autoPlay && cycleTimer) clearInterval(cycleTimer);
      });
      compCard.addEventListener('mouseleave', () => {
        if (autoPlay) startCycle();
      });
    }

    setActiveStep(1);
    startCycle();
  }

  // ==========================================================================
  // COMPONENT: DISHWASHER MAINTENANCE & CHEMICAL CARE
  // ==========================================================================
  // ==========================================================================
  // COMPONENT: DISHWASHER MAINTENANCE & CHEMICAL CARE (Tatwa Reference Blueprint)
  // ==========================================================================
  function renderDishwasherCleaning(container) {
    if (!container) return;

    if (displaySubtitle) {
      displaySubtitle.textContent = 'Salt Softener, Rinse Aid, 3-Stage Filter & 70°C Machine Descaling';
    }

    container.innerHTML = `
      <div class="installation-guide-card" id="dw-cleaning-comp">
        <header class="guide-header">
          <div class="brand-title-group">
            <div class="brand-wordmark">
              <span class="brand-wordmark-text">TATWA</span>
              <span class="brand-accent-line"></span>
            </div>
            <h1 class="main-title">MAINTENANCE &amp; CARE OF THE DISHWASHER</h1>
            <div class="sub-title">WATER SOFTENING SALT, RINSE AID &amp; HYGIENE PROTOCOL</div>
          </div>

          <div class="playback-controls">
            <button id="btn-toggle-dw-clean-cycle" class="btn-auto-play-toggle" title="Pause or Resume Auto Cycle">
              <span id="cycle-icon-dw-clean">⏸</span>
              <span id="cycle-text-dw-clean">Auto Cycle Active</span>
            </button>
          </div>

          <nav class="steps-nav-tracker" aria-label="Maintenance Steps">
            <div class="step-nav-item active" data-step="1">
              <div class="step-circle">1</div>
              <span class="step-label">Salt Softener</span>
            </div>
            <div class="step-nav-item" data-step="2">
              <div class="step-circle">2</div>
              <span class="step-label">Rinse Aid</span>
            </div>
            <div class="step-nav-item" data-step="3">
              <div class="step-circle">3</div>
              <span class="step-label">Microfilter</span>
            </div>
            <div class="step-nav-item" data-step="4">
              <div class="step-circle">4</div>
              <span class="step-label">70°C Descaling</span>
            </div>
          </nav>
        </header>

        <main class="installation-canvas">
          <div class="steps-column">
            <!-- Step 1: Dishwasher Salt -->
            <article class="step-card active" id="dw-step-card-1" data-step="1">
              <div class="step-info-col">
                <div class="step-title-header">
                  <span class="step-num-pill">01</span>
                  <h2 class="step-heading">DISHWASHER SALT REFILL</h2>
                </div>
                <ul class="step-bullets-list">
                  <li>Unscrew cap at base; insert funnel to add coarse salt.</li>
                  <li>Recharges ion-exchange resin to soften hard Indian water.</li>
                  <li>Top up whenever the 'S' indicator illuminates on fascia.</li>
                </ul>
              </div>
              <div class="step-square-box" title="Step 1: Dishwasher Salt Refill">
                <img src="images/dw_clean_step1_salt.jpg" alt="Dishwasher salt refill with funnel" />
              </div>
            </article>

            <!-- Step 2: Rinse Aid Dispenser -->
            <article class="step-card" id="dw-step-card-2" data-step="2">
              <div class="step-info-col">
                <div class="step-title-header">
                  <span class="step-num-pill">02</span>
                  <h2 class="step-heading">RINSE AID DISPENSER</h2>
                </div>
                <ul class="step-bullets-list">
                  <li>Fill door-mounted dispenser next to tablet compartment.</li>
                  <li>Ensures sheet water runoff during hot drying phase.</li>
                  <li>Prevents water drop marks &amp; chalky film on glassware.</li>
                </ul>
              </div>
              <div class="step-square-box" title="Step 2: Rinse Aid Dispenser Fill">
                <img src="images/dw_clean_step2_rinseaid.jpg" alt="Rinse aid liquid dispenser" />
              </div>
            </article>
          </div>

          <!-- Hero Center Column -->
          <div class="hero-center-column">
            <div class="hero-chimney-img-box">
              <img src="images/dw_clean_hero_diag.jpg" alt="Tatwa Dishwasher Maintenance Architecture" />
              <div class="hero-pointer-tag active" style="bottom: 27%; left: 44%;" id="dw-clean-pointer-01" data-step="1" title="01: Salt Chamber / Reservoir">01</div>
              <div class="hero-pointer-tag" style="bottom: 30%; left: 32%;" id="dw-clean-pointer-02" data-step="2" title="02: Rinse Aid Door Dispenser">02</div>
              <div class="hero-pointer-tag" style="bottom: 28%; right: 38%;" id="dw-clean-pointer-03" data-step="3" title="03: 3-Stage Mesh Microfilter">03</div>
              <div class="hero-pointer-tag" style="top: 28%; left: 52%;" id="dw-clean-pointer-04" data-step="4" title="04: 70°C Wash Chamber &amp; Hygiene Cycle">04</div>
            </div>
          </div>

          <div class="steps-column">
            <!-- Step 3: 3-Stage Microfilter -->
            <article class="step-card" id="dw-step-card-3" data-step="3">
              <div class="step-info-col">
                <div class="step-title-header">
                  <span class="step-num-pill">03</span>
                  <h2 class="step-heading">3-STAGE MESH FILTER</h2>
                </div>
                <ul class="step-bullets-list">
                  <li>Twist cylindrical filter 90° anti-clockwise on tub floor.</li>
                  <li>Wash under tap with soft brush weekly to clear food debris.</li>
                  <li>Protects dual high-pressure rotating spray arm nozzles.</li>
                </ul>
              </div>
              <div class="step-square-box" title="Step 3: 3-Stage Mesh Filter Cleaning">
                <img src="images/dw_clean_step3_filter.jpg" alt="Wash mesh filter under running water" />
              </div>
            </article>

            <!-- Step 4: 70°C Machine Descaling -->
            <article class="step-card" id="dw-step-card-4" data-step="4">
              <div class="step-info-col">
                <div class="step-title-header">
                  <span class="step-num-pill">04</span>
                  <h2 class="step-heading">70°C MACHINE DESCALING</h2>
                </div>
                <ul class="step-bullets-list">
                  <li>Place machine cleaner bottle/powder in empty rack.</li>
                  <li>Run Intensive 70°C hygiene cycle once every 30 days.</li>
                  <li>Dissolves internal grease, limescale &amp; eliminates odors.</li>
                </ul>
              </div>
              <div class="step-square-box" title="Step 4: 70°C Machine Descaling">
                <img src="images/dw_clean_step4_descale.jpg" alt="70°C machine descaling cycle" />
              </div>
            </article>
          </div>
        </main>

        <footer class="guide-bottom-strip">
          <div class="bottom-info-card">
            <div class="bottom-card-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
              </svg>
            </div>
            <div class="bottom-card-text">
              <span class="bottom-card-title">Water Hardness Rule</span>
              <p class="bottom-card-desc">Always use Tatwa genuine dishwasher salt to prevent white calcium scaling on stainless steel.</p>
            </div>
          </div>

          <div class="bottom-info-card">
            <div class="bottom-card-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <line x1="9" y1="9" x2="15" y2="15" />
                <line x1="15" y1="9" x2="9" y2="15" />
              </svg>
            </div>
            <div class="bottom-card-text">
              <span class="bottom-card-title">Strict Detergent Rule</span>
              <p class="bottom-card-desc">Use only automatic dishwasher detergents. Never use liquid hand dish soap (causes foam overflow).</p>
            </div>
          </div>

          <div class="bottom-notice-card">
            <div class="notice-shield-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            <div class="notice-card-text">
              <span class="notice-card-title">Official Care Kits: 1800-828-9222</span>
              <p class="notice-card-desc">Order genuine Tatwa dishwasher salt, rinse aid, and descaling kits from Tatwa authorized service.</p>
            </div>
          </div>
        </footer>
      </div>
    `;

    initDWCleaningStepCycle(container);
  }

  function initDWCleaningStepCycle(container) {
    if (!container) return;
    let currentStep = 1;
    const totalSteps = 4;
    let autoPlay = true;
    let cycleTimer = null;
    const cycleIntervalMs = 3800;

    const navItems = container.querySelectorAll('.step-nav-item');
    const stepCards = container.querySelectorAll('.step-card');
    const pointerTags = container.querySelectorAll('.hero-pointer-tag');
    const btnToggle = container.querySelector('#btn-toggle-dw-clean-cycle');
    const cycleIcon = container.querySelector('#cycle-icon-dw-clean');
    const cycleText = container.querySelector('#cycle-text-dw-clean');
    const compCard = container.querySelector('#dw-cleaning-comp');

    function setActiveStep(stepNum) {
      currentStep = Number(stepNum);

      navItems.forEach((nav) => {
        const s = Number(nav.getAttribute('data-step'));
        nav.classList.toggle('active', s === currentStep);
      });

      stepCards.forEach((card) => {
        const s = Number(card.getAttribute('data-step'));
        card.classList.toggle('active', s === currentStep);
      });

      pointerTags.forEach((ptr) => {
        const s = Number(ptr.getAttribute('data-step'));
        ptr.classList.toggle('active', s === currentStep);
      });
    }

    function nextStep() {
      let next = currentStep + 1;
      if (next > totalSteps) next = 1;
      setActiveStep(next);
    }

    function startCycle() {
      if (cycleTimer) clearInterval(cycleTimer);
      cycleTimer = setInterval(nextStep, cycleIntervalMs);
      autoPlay = true;
      if (cycleIcon) cycleIcon.textContent = '⏸';
      if (cycleText) cycleText.textContent = 'Auto Cycle Active';
    }

    function stopCycle() {
      if (cycleTimer) {
        clearInterval(cycleTimer);
        cycleTimer = null;
      }
      autoPlay = false;
      if (cycleIcon) cycleIcon.textContent = '▶';
      if (cycleText) cycleText.textContent = 'Paused (Click to play)';
    }

    navItems.forEach((nav) => {
      nav.addEventListener('click', () => {
        setActiveStep(nav.getAttribute('data-step'));
        stopCycle();
      });
    });

    stepCards.forEach((card) => {
      card.addEventListener('click', () => {
        setActiveStep(card.getAttribute('data-step'));
        stopCycle();
      });
    });

    pointerTags.forEach((ptr) => {
      ptr.addEventListener('click', () => {
        setActiveStep(ptr.getAttribute('data-step'));
        stopCycle();
      });
    });

    if (btnToggle) {
      btnToggle.addEventListener('click', () => {
        if (autoPlay) stopCycle();
        else startCycle();
      });
    }

    if (compCard) {
      compCard.addEventListener('mouseenter', () => {
        if (autoPlay && cycleTimer) clearInterval(cycleTimer);
      });
      compCard.addEventListener('mouseleave', () => {
        if (autoPlay) startCycle();
      });
    }

    setActiveStep(1);
    startCycle();
  }

  // ==========================================================================
  // COMPONENT: DISHWASHER LOADING ARCHITECTURE & INDIAN COOKWARE GUIDE
  // ==========================================================================
  function renderDishwasherLoading(container) {
    if (!container) return;

    if (displaySubtitle) {
      displaySubtitle.textContent = 'Rack Architecture & Utensil Arrangement for Indian Cookware';
    }

    container.innerHTML = `
      <div class="installation-guide-card" id="dw-loading-comp">
        <header class="guide-header">
          <div class="brand-title-group">
            <div class="brand-wordmark">
              <span class="brand-wordmark-text">TATWA</span>
              <span class="brand-accent-line"></span>
            </div>
            <h1 class="main-title">HOW TO LOAD A TATWA DISHWASHER</h1>
            <div class="sub-title">OFFICIAL LOADING TECHNIQUES FOR INDIAN COOKWARE &amp; MAXIMUM HYGIENE</div>
          </div>

          <div class="playback-controls">
            <button id="btn-toggle-dw-load-cycle" class="btn-auto-play-toggle" title="Pause or Resume Auto Cycle">
              <span id="cycle-icon-dw-load">⏸</span>
              <span id="cycle-text-dw-load">Auto Cycle Active</span>
            </button>
          </div>

          <nav class="steps-nav-tracker" aria-label="Loading Steps">
            <div class="step-nav-item active" data-step="1">
              <div class="step-circle">1</div>
              <span class="step-label">Lower Basket</span>
            </div>
            <div class="step-nav-item" data-step="2">
              <div class="step-circle">2</div>
              <span class="step-label">Upper Basket</span>
            </div>
            <div class="step-nav-item" data-step="3">
              <div class="step-circle">3</div>
              <span class="step-label">Cutlery Tray</span>
            </div>
            <div class="step-nav-item" data-step="4">
              <div class="step-circle">4</div>
              <span class="step-label">Pre-Flight Checks</span>
            </div>
          </nav>
        </header>

        <main class="installation-canvas">
          <div class="steps-column">
            <!-- Step 1: Lower Basket -->
            <article class="step-card active" id="dw-load-card-1" data-step="1">
              <div class="step-info-col">
                <div class="step-title-header">
                  <span class="step-num-pill">01</span>
                  <h2 class="step-heading">LOWER BASKET: HEAVY COOKWARE</h2>
                </div>
                <ul class="step-bullets-list">
                  <li>Angle heavy kadai, patila &amp; pressure cookers at 45° face-down.</li>
                  <li>Align large thalis &amp; dinner plates vertically between rack tines.</li>
                  <li>Ensure vessels drain freely; never nest pots inside each other.</li>
                </ul>
              </div>
              <div class="step-square-box" title="Step 1: Lower Basket Cookware">
                <img src="images/usp2_dual_zone.jpg" alt="Lower basket for heavy Indian cookware" />
              </div>
            </article>

            <!-- Step 2: Upper Basket -->
            <article class="step-card" id="dw-load-card-2" data-step="2">
              <div class="step-info-col">
                <div class="step-title-header">
                  <span class="step-num-pill">02</span>
                  <h2 class="step-heading">UPPER BASKET: CROCKERY &amp; GLASS</h2>
                </div>
                <ul class="step-bullets-list">
                  <li>Invert chai mugs, wine glasses &amp; dessert bowls between tines.</li>
                  <li>Angle curved bottoms to prevent wash water pooling.</li>
                  <li>Secure lightweight steel katoris firmly so water jets do not flip them.</li>
                </ul>
              </div>
              <div class="step-square-box" title="Step 2: Upper Basket Glassware">
                <img src="images/usp4_14place.jpg" alt="Upper basket glassware and cups" />
              </div>
            </article>
          </div>

          <!-- Hero Center Column -->
          <div class="hero-center-column">
            <div class="hero-chimney-img-box">
              <img src="images/dw_clean_hero_diag.jpg" alt="Tatwa Dishwasher Loading Architecture" />
              <div class="hero-pointer-tag active" style="bottom: 34%; left: 48%;" id="dw-load-pointer-01" data-step="1" title="01: Lower Basket (Kadai &amp; Thalis)">01</div>
              <div class="hero-pointer-tag" style="top: 32%; left: 48%;" id="dw-load-pointer-02" data-step="2" title="02: Upper Basket (Glasses &amp; Cups)">02</div>
              <div class="hero-pointer-tag" style="bottom: 42%; left: 56%;" id="dw-load-pointer-03" data-step="3" title="03: Cutlery Basket (Spoons &amp; Knives)">03</div>
              <div class="hero-pointer-tag" style="top: 24%; right: 40%;" id="dw-load-pointer-04" data-step="4" title="04: Dual Rotating Spray Arms">04</div>
            </div>
          </div>

          <div class="steps-column">
            <!-- Step 3: Cutlery Basket -->
            <article class="step-card" id="dw-load-card-3" data-step="3">
              <div class="step-info-col">
                <div class="step-title-header">
                  <span class="step-num-pill">03</span>
                  <h2 class="step-heading">CUTLERY TRAY &amp; UTENSILS</h2>
                </div>
                <ul class="step-bullets-list">
                  <li>Alternate spoon handles up and down to prevent nesting together.</li>
                  <li>Point knife blades downwards for safety during unloading.</li>
                  <li>Lay long cooking ladles, chimta &amp; tongs flat on the upper rack shelf.</li>
                </ul>
              </div>
              <div class="step-square-box" title="Step 3: Cutlery Basket">
                <img src="images/usp1_spray_arms.jpg" alt="Cutlery tray organization" />
              </div>
            </article>

            <!-- Step 4: Pre-Flight Checks -->
            <article class="step-card" id="dw-load-card-4" data-step="4">
              <div class="step-info-col">
                <div class="step-title-header">
                  <span class="step-num-pill">04</span>
                  <h2 class="step-heading">CRITICAL PRE-FLIGHT CHECKS</h2>
                </div>
                <ul class="step-bullets-list">
                  <li>Spin spray arms by hand: ensure tall spatulas do not hit arms.</li>
                  <li>Scrape solid bones &amp; seeds into bin (no pre-rinsing required).</li>
                  <li>Ensure plates do not obstruct detergent tablet dispenser door.</li>
                </ul>
              </div>
              <div class="step-square-box" title="Step 4: Spray Arm Rotation Check">
                <img src="images/usp3_70c_wash.jpg" alt="Spray arm rotation check" />
              </div>
            </article>
          </div>
        </main>

        <footer class="guide-bottom-strip">
          <div class="bottom-info-card">
            <div class="bottom-card-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M8 12l2 2 4-4" />
              </svg>
            </div>
            <div class="bottom-card-text">
              <span class="bottom-card-title">Scrape, Don't Pre-Wash</span>
              <p class="bottom-card-desc">Tatwa 70°C Intensive cycle dissolves grease directly. Simply scrape solid food into trash.</p>
            </div>
          </div>

          <div class="bottom-info-card">
            <div class="bottom-card-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
              </svg>
            </div>
            <div class="bottom-card-text">
              <span class="bottom-card-title">Spray Clearance Check</span>
              <p class="bottom-card-desc">Always spin both spray arms 360° before starting to ensure zero obstruction from tall pans.</p>
            </div>
          </div>

          <div class="bottom-notice-card">
            <div class="notice-shield-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            </div>
            <div class="notice-card-text">
              <span class="notice-card-title">Dual Zone Wash Option</span>
              <p class="notice-card-desc">Activate Dual Zone for half-load efficiency if washing only upper or lower basket.</p>
            </div>
          </div>
        </footer>
      </div>
    `;

    initDWLoadingStepCycle(container);
  }

  function initDWLoadingStepCycle(container) {
    if (!container) return;
    let currentStep = 1;
    const totalSteps = 4;
    let autoPlay = true;
    let cycleTimer = null;
    const cycleIntervalMs = 3800;

    const navItems = container.querySelectorAll('.step-nav-item');
    const stepCards = container.querySelectorAll('.step-card');
    const pointerTags = container.querySelectorAll('.hero-pointer-tag');
    const btnToggle = container.querySelector('#btn-toggle-dw-load-cycle');
    const cycleIcon = container.querySelector('#cycle-icon-dw-load');
    const cycleText = container.querySelector('#cycle-text-dw-load');
    const compCard = container.querySelector('#dw-loading-comp');

    function setActiveStep(stepNum) {
      currentStep = Number(stepNum);

      navItems.forEach((nav) => {
        const s = Number(nav.getAttribute('data-step'));
        nav.classList.toggle('active', s === currentStep);
      });

      stepCards.forEach((card) => {
        const s = Number(card.getAttribute('data-step'));
        card.classList.toggle('active', s === currentStep);
      });

      pointerTags.forEach((ptr) => {
        const s = Number(ptr.getAttribute('data-step'));
        ptr.classList.toggle('active', s === currentStep);
      });
    }

    function nextStep() {
      let next = currentStep + 1;
      if (next > totalSteps) next = 1;
      setActiveStep(next);
    }

    function startCycle() {
      if (cycleTimer) clearInterval(cycleTimer);
      cycleTimer = setInterval(nextStep, cycleIntervalMs);
      autoPlay = true;
      if (cycleIcon) cycleIcon.textContent = '⏸';
      if (cycleText) cycleText.textContent = 'Auto Cycle Active';
    }

    function stopCycle() {
      if (cycleTimer) {
        clearInterval(cycleTimer);
        cycleTimer = null;
      }
      autoPlay = false;
      if (cycleIcon) cycleIcon.textContent = '▶';
      if (cycleText) cycleText.textContent = 'Paused (Click to play)';
    }

    navItems.forEach((nav) => {
      nav.addEventListener('click', () => {
        setActiveStep(nav.getAttribute('data-step'));
        stopCycle();
      });
    });

    stepCards.forEach((card) => {
      card.addEventListener('click', () => {
        setActiveStep(card.getAttribute('data-step'));
        stopCycle();
      });
    });

    pointerTags.forEach((ptr) => {
      ptr.addEventListener('click', () => {
        setActiveStep(ptr.getAttribute('data-step'));
        stopCycle();
      });
    });

    if (btnToggle) {
      btnToggle.addEventListener('click', () => {
        if (autoPlay) stopCycle();
        else startCycle();
      });
    }

    if (compCard) {
      compCard.addEventListener('mouseenter', () => {
        if (autoPlay && cycleTimer) clearInterval(cycleTimer);
      });
      compCard.addEventListener('mouseleave', () => {
        if (autoPlay) startCycle();
      });
    }

    setActiveStep(1);
    startCycle();
  }


  // ==========================================================================
  // COMPONENT: DISHWASHER UNIQUE SELLING POINTS & ADVANCED FEATURES
  // ==========================================================================
  function renderDishwasherUSP(container) {
    if (!container) return;

    if (displaySubtitle) {
      displaySubtitle.textContent = 'Engineered for Heavy Indian Cooking, Burnt Kadai & 14-Place Hygiene';
    }

    container.innerHTML = `
      <div class="installation-guide-card" id="dishwasher-usp-comp">
        <header class="guide-header">
          <div class="brand-title-group">
            <div class="brand-wordmark">
              <span class="brand-wordmark-text">TATWA</span>
              <span class="brand-accent-line"></span>
            </div>
            <h1 class="main-title">UNIQUE SELLING POINTS OF THE DISHWASHER</h1>
            <div class="sub-title">TAILORED FOR HEAVY INDIAN COOKING, MASALAS &amp; HYGIENE</div>
          </div>

          <div class="playback-controls">
            <button id="btn-toggle-usp-cycle" class="btn-auto-play-toggle" title="Pause or Resume Auto Cycle">
              <span id="cycle-icon-usp">⏸</span>
              <span id="cycle-text-usp">Auto Cycle Active</span>
            </button>
          </div>

          <nav class="steps-nav-tracker" aria-label="Dishwasher USPs">
            <div class="step-nav-item active" data-step="1">
              <div class="step-circle">1</div>
              <span class="step-label">3D Spray Arms</span>
            </div>
            <div class="step-nav-item" data-step="2">
              <div class="step-circle">2</div>
              <span class="step-label">Dual Zone</span>
            </div>
            <div class="step-nav-item" data-step="3">
              <div class="step-circle">3</div>
              <span class="step-label">70°C Hygiene</span>
            </div>
            <div class="step-nav-item" data-step="4">
              <div class="step-circle">4</div>
              <span class="step-label">14-Place Load</span>
            </div>
          </nav>
        </header>

        <main class="installation-canvas">
          <div class="steps-column">
            <article class="step-card active" id="usp-step-card-1" data-step="1">
              <div class="step-info-col">
                <div class="step-title-header">
                  <span class="step-num-pill">01</span>
                  <h2 class="step-heading">3D TRIPLE SPRAY ARMS</h2>
                </div>
                <ul class="step-bullets-list">
                  <li>Ceiling, middle &amp; lower high-pressure rotating spray arms.</li>
                  <li>360° hydro-streams scour burnt oil &amp; stubborn dal.</li>
                  <li>Omni-directional jets reach deep corners of tall pots.</li>
                </ul>
              </div>
              <div class="step-square-box" title="USP 1: 3D High Pressure Spray Arms">
                <img src="images/usp1_spray_arms.jpg" alt="3D rotating spray arms" />
              </div>
            </article>

            <article class="step-card" id="usp-step-card-2" data-step="2">
              <div class="step-info-col">
                <div class="step-title-header">
                  <span class="step-num-pill">02</span>
                  <h2 class="step-heading">DUAL ZONE WASH</h2>
                </div>
                <ul class="step-bullets-list">
                  <li>Selective upper or lower rack wash without waiting.</li>
                  <li>Concentrates heavy spray on lower rack for greasy kadais.</li>
                  <li>Saves up to 40% water and electricity on half loads.</li>
                </ul>
              </div>
              <div class="step-square-box" title="USP 2: Dual Zone Independent Wash">
                <img src="images/usp2_dual_zone.jpg" alt="Dual zone wash racks" />
              </div>
            </article>
          </div>

          <div class="hero-center-column">
            <div class="hero-chimney-img-box">
              <img src="images/dw_usp_hero.jpg" alt="Tatwa Dishwasher Interior Technology Cutaway" />
              <div class="hero-pointer-tag active" style="top: 40%; left: 48%;" id="usp-pointer-01" data-step="1" title="01: 3D Rotating Stainless Spray Arms">01</div>
              <div class="hero-pointer-tag" style="top: 32%; right: 18%;" id="usp-pointer-02" data-step="2" title="02: Dual Zone Water Paths">02</div>
              <div class="hero-pointer-tag" style="bottom: 22%; left: 52%;" id="usp-pointer-03" data-step="3" title="03: 70°C High-Temp Hygiene Heater">03</div>
              <div class="hero-pointer-tag" style="top: 56%; left: 46%;" id="usp-pointer-04" data-step="4" title="04: Loaded Cooker &amp; Kadai">04</div>
            </div>
          </div>

          <div class="steps-column">
            <article class="step-card" id="usp-step-card-3" data-step="3">
              <div class="step-info-col">
                <div class="step-title-header">
                  <span class="step-num-pill">03</span>
                  <h2 class="step-heading">70°C INTENSIVE HYGIENE</h2>
                </div>
                <ul class="step-bullets-list">
                  <li>Thermal cycle kills 99.9% of bacteria, germs &amp; viruses.</li>
                  <li>Melts hardened animal ghee, mustard oil &amp; burnt gravy.</li>
                  <li>Certified sterilization for baby bottles &amp; infant cutlery.</li>
                </ul>
              </div>
              <div class="step-square-box" title="USP 3: 70°C Intensive Hygiene Wash">
                <img src="images/usp3_70c_wash.jpg" alt="70 degree hygiene sanitization" />
              </div>
            </article>

            <article class="step-card" id="usp-step-card-4" data-step="4">
              <div class="step-info-col">
                <div class="step-title-header">
                  <span class="step-num-pill">04</span>
                  <h2 class="step-heading">14-PLACE INDIAN CAPACITY</h2>
                </div>
                <ul class="step-bullets-list">
                  <li>Fits 102+ utensils including 5-liter cookers &amp; deep kadais.</li>
                  <li>Foldable tines and height-adjustable upper basket.</li>
                  <li>Dedicated third cutlery rack for spoons, spatulas &amp; knives.</li>
                </ul>
              </div>
              <div class="step-square-box" title="USP 4: 14 Place Settings Capacity">
                <img src="images/usp4_14place.jpg" alt="14 place settings loading" />
              </div>
            </article>
          </div>
        </main>

        <footer class="guide-bottom-strip">
          <div class="bottom-info-card">
            <div class="bottom-card-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
              </svg>
            </div>
            <div class="bottom-card-text">
              <span class="bottom-card-title">10–12L Water Efficiency</span>
              <p class="bottom-card-desc">Uses only 10–12 liters per wash cycle vs 60+ liters consumed in manual handwashing (saves ~80% water).</p>
            </div>
          </div>

          <div class="bottom-info-card">
            <div class="bottom-card-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                <line x1="8" y1="21" x2="16" y2="21" />
                <line x1="12" y1="17" x2="12" y2="21" />
              </svg>
            </div>
            <div class="bottom-card-text">
              <span class="bottom-card-title">10-Year Cavity Warranty</span>
              <p class="bottom-card-desc">2-Year Comprehensive + 10-Year Inner Cavity Rust-Through Warranty across 14-place models.</p>
            </div>
          </div>

          <div class="bottom-notice-card">
            <div class="notice-shield-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <polyline points="9 12 11 14 15 10" />
              </svg>
            </div>
            <div class="notice-card-text">
              <span class="notice-card-title">Detergent Guardrail: Automatic Only</span>
              <p class="notice-card-desc">Use automatic dishwasher tablets or powder. Never use manual liquid soap (Vim/Pril) which causes foam overflows.</p>
            </div>
          </div>
        </footer>
      </div>
    `;

    initDishwasherUSPStepCycle(container);
  }

  function initDishwasherUSPStepCycle(container) {
    if (!container) return;
    let currentStep = 1;
    const totalSteps = 4;
    let autoPlay = true;
    let cycleTimer = null;
    const cycleIntervalMs = 3800;

    const navItems = container.querySelectorAll('.step-nav-item');
    const stepCards = container.querySelectorAll('.step-card');
    const pointerTags = container.querySelectorAll('.hero-pointer-tag');
    const btnToggle = container.querySelector('#btn-toggle-usp-cycle');
    const cycleIcon = container.querySelector('#cycle-icon-usp');
    const cycleText = container.querySelector('#cycle-text-usp');
    const compCard = container.querySelector('#dishwasher-usp-comp');

    function setActiveStep(stepNum) {
      currentStep = Number(stepNum);

      navItems.forEach((nav) => {
        const s = Number(nav.getAttribute('data-step'));
        nav.classList.toggle('active', s === currentStep);
      });

      stepCards.forEach((card) => {
        const s = Number(card.getAttribute('data-step'));
        card.classList.toggle('active', s === currentStep);
      });

      pointerTags.forEach((ptr) => {
        const s = Number(ptr.getAttribute('data-step'));
        ptr.classList.toggle('active', s === currentStep);
      });
    }

    function nextStep() {
      let next = currentStep + 1;
      if (next > totalSteps) next = 1;
      setActiveStep(next);
    }

    function startCycle() {
      if (cycleTimer) clearInterval(cycleTimer);
      cycleTimer = setInterval(nextStep, cycleIntervalMs);
      autoPlay = true;
      if (cycleIcon) cycleIcon.textContent = '⏸';
      if (cycleText) cycleText.textContent = 'Auto Cycle Active';
    }

    function stopCycle() {
      if (cycleTimer) {
        clearInterval(cycleTimer);
        cycleTimer = null;
      }
      autoPlay = false;
      if (cycleIcon) cycleIcon.textContent = '▶';
      if (cycleText) cycleText.textContent = 'Paused (Click to play)';
    }

    navItems.forEach((nav) => {
      nav.addEventListener('click', () => {
        setActiveStep(nav.getAttribute('data-step'));
        stopCycle();
      });
    });

    stepCards.forEach((card) => {
      card.addEventListener('click', () => {
        setActiveStep(card.getAttribute('data-step'));
        stopCycle();
      });
    });

    pointerTags.forEach((ptr) => {
      ptr.addEventListener('click', () => {
        setActiveStep(ptr.getAttribute('data-step'));
        stopCycle();
      });
    });

    if (btnToggle) {
      btnToggle.addEventListener('click', () => {
        if (autoPlay) stopCycle();
        else startCycle();
      });
    }

    if (compCard) {
      compCard.addEventListener('mouseenter', () => {
        if (autoPlay && cycleTimer) clearInterval(cycleTimer);
      });
      compCard.addEventListener('mouseleave', () => {
        if (autoPlay) startCycle();
      });
    }

    setActiveStep(1);
    startCycle();
  }

  // ==========================================================================
  // COMPONENT: INVERTER BLDC MOTOR SPOTLIGHT & 9-SPEED CONSOLE
  // ==========================================================================
  // ==========================================================================
  // COMPONENT: INVERTER BLDC MOTOR - FULL-VIEW CINEMATIC LOOPING VIDEO
  // ==========================================================================
  // ==========================================================================
  // COMPONENT: INVERTER BLDC MOTOR - PURE CINEMATIC LOOPING VIDEO (NO CLUTTER)
  // ==========================================================================
  function renderBLDCMotor(container, payload) {
    if (!container) return;
    prepareViewTransition(container);

    if (displaySubtitle) {
      displaySubtitle.textContent = '1500 m³/hr High-Velocity Suction • 150W Inverter BLDC Motor';
    }

    container.innerHTML = `
      <div class="bldc-pure-stage" id="bldc-motor-comp">
        <video
          id="bldc-loop-video"
          class="bldc-pure-video"
          src="images/1030.webm"
          autoplay
          loop
          muted
          playsinline
          controls
        ></video>
      </div>
    `;

    const videoEl = container.querySelector('#bldc-loop-video');
    if (videoEl) {
      videoEl.play().catch(() => {
        videoEl.muted = true;
        videoEl.play().catch((e) => console.warn('[BLDC Video Playback]', e));
      });
    }
  }

  // ==========================================================================
  // COMPONENT: WASHING MACHINE FAMILY SIZE & CAPACITY GUIDE (RESPONSIVE 4-TIER)
  // ==========================================================================
  function renderWMFamilyGuide(container, payload) {
    if (!container) return;
    prepareViewTransition(container);

    const tiers = (payload && payload.familyTiers) || [
      {
        household: '2–3 Members (Couples & Bachelors)',
        badge: 'Budget-Friendly Entry',
        capacity: '6.5 kg Wash / 5.0 kg Spin',
        modelName: 'Tatwa AquaSpin 6.5 kg Semi-Automatic Twin Tub',
        price: 9990,
        mrp: 14490,
        discountPercent: 31,
        motor: 'High Torque Dual Motor (1350 RPM)',
        bestFor: 'Budget homes, low water pressure, 15-min quick washes',
        loadExample: '8–10 daily clothes or 1 single bedsheet',
        imageUrl: 'images/wm_semi_automatic_65kg.jpg'
      },
      {
        household: '3–4 Members (Standard Family)',
        badge: 'Most Popular Top Load',
        capacity: '7.5 kg Smart Load',
        modelName: 'Tatwa HydroPulse 7.5 kg Top Load Smart Washer',
        price: 17990,
        mrp: 25490,
        discountPercent: 29,
        motor: 'Smart Pulsator Motor (780 RPM)',
        bestFor: 'Ergonomic upright loading (no bending), daily cottons & jeans',
        loadExample: '14–16 daily garments + 1 double bedsheet',
        imageUrl: 'images/wm_top_load_75kg.jpg'
      },
      {
        household: '4–5 Members (Heavy Laundry)',
        badge: '5-Star Inverter Care',
        capacity: '8.0 kg Direct Drive',
        modelName: 'Tatwa EcoWash Pro 8 kg Front Load Inverter',
        price: 27490,
        mrp: 38990,
        discountPercent: 30,
        motor: 'Direct Motion Inverter (1400 RPM)',
        bestFor: 'Heavy family loads, 90°C Steam sanitization & delicates',
        loadExample: '18–22 garments + king duvet & bath towels',
        imageUrl: 'images/wm_front_load_8kg.jpg'
      },
      {
        household: '5–8+ Members (Joint Family)',
        badge: 'Wash & Dry Combo',
        capacity: '10 kg Wash / 7 kg Dry',
        modelName: 'Tatwa AeroCare 10 kg AI Washer-Dryer Combo',
        price: 44990,
        mrp: 62990,
        discountPercent: 29,
        motor: 'AI Direct Drive Motor (1400 RPM)',
        bestFor: 'Joint families, zero balcony drying, heavy quilts & monsoon',
        loadExample: '25+ garments, heavy blankets, 100% heat dry',
        imageUrl: 'images/wm_washer_dryer_10kg.jpg'
      }
    ];

    container.innerHTML = `
      <div class="wm-family-guide-comp" id="wm-family-guide-comp">
        <header class="guide-header-compact">
          <div class="guide-header-left">
            <button class="btn-back-home-pill" id="btn-back-wm-family" title="Return to All Categories Home">
              <span>← All Categories</span>
            </button>
            <div class="brand-wordmark">
              <span class="brand-wordmark-text">TATWA</span>
              <span class="brand-accent-line"></span>
            </div>
            <h1 class="guide-compact-title">WASHING MACHINE CAPACITY &amp; FAMILY GUIDE</h1>
          </div>
          <div class="guide-badge-pill">
            <span>👨‍👩‍👧‍👦 4 Household Tiers</span>
          </div>
        </header>

        <!-- Compact Visual Rule Strip -->
        <div class="guide-quick-bar">
          <span class="quick-bar-icon">💡</span>
          <span class="quick-bar-text"><strong>Smart Sizing Rule:</strong> 2–3 Members = <strong>6.5 kg</strong> • 3–4 Members = <strong>7.5 kg Top Load</strong> • 4–5 Members = <strong>8.0 kg Inverter</strong> • Large Joint Family = <strong>10 kg Washer-Dryer</strong></span>
        </div>

        <!-- 4 Family Tiers Grid: fits 100% in 4 columns -->
        <div class="family-tiers-grid">
          ${tiers.map((tier, idx) => `
            <div class="family-tier-card ${idx === 2 ? 'featured-tier' : ''}">
              <div class="tier-card-header">
                <span class="tier-kicker">${tier.badge}</span>
                <h3 class="tier-household">${tier.household.split('(')[0].trim()}</h3>
                <div class="tier-capacity-pill">${tier.capacity}</div>
              </div>

              <div class="tier-img-box">
                <img src="${tier.imageUrl}" alt="${tier.modelName}" />
              </div>

              <div class="tier-card-body">
                <h4 class="tier-model-name">${tier.modelName}</h4>
                <div class="tier-pricing">
                  <span class="tier-price">₹${Number(tier.price).toLocaleString('en-IN')}</span>
                  <span class="tier-mrp">₹${Number(tier.mrp).toLocaleString('en-IN')}</span>
                  <span class="tier-discount">${tier.discountPercent}% OFF</span>
                </div>

                <div class="tier-specs-compact">
                  <div class="tier-chip" title="Load Capacity">🧺 ${tier.loadExample}</div>
                  <div class="tier-chip" title="Motor Specs">⚡ ${tier.motor}</div>
                  <div class="tier-chip-highlight" title="Best Use Case">💡 ${tier.bestFor}</div>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    const btnBack = container.querySelector('#btn-back-wm-family');
    if (btnBack) btnBack.addEventListener('click', () => renderTatwaWelcomeScreen(container));
  }

  // ==========================================================================
  // COMPONENT: DISHWASHER PLACE SETTINGS & CAPACITY GUIDE (VISUAL RACK TIERS)
  // ==========================================================================
  function renderDishwasherPlaceSettingsGuide(container, payload) {
    if (!container) return;
    prepareViewTransition(container);

    const tiers = (payload && payload.placeSettingTiers) || [
      {
        tierName: '8 Place Settings',
        badge: 'Compact Tabletop',
        type: 'Ace Series Tabletop',
        household: '1 to 3 Members (Bachelors / Couples)',
        utensilCount: '64–72 Utensils / Cycle',
        placement: 'Kitchen Countertop / Tabletop (Zero installation)',
        fitsUtensils: '8 Dinner Thalis, Bowls, Glasses & Small Pots',
        priceRange: '₹26,750 – ₹28,150',
        imageUrl: 'images/dw_rack_8_place.jpg',
        keyHighlights: [
          'Zero cabinetry modification — sits beside kitchen sink',
          'Accommodates 8 dinner plates, katoris, glasses & cutlery',
          'Half Load cycle saves up to 50% water & power for 1-2 people',
          '70°C Intensive Hygiene wash kills 99.9% kitchen bacteria'
        ]
      },
      {
        tierName: '12 Place Settings',
        badge: 'Nuclear Family (Best Value)',
        type: 'Neo Series Freestanding',
        household: '4 to 5 Members (Standard Nuclear Household)',
        utensilCount: '96–108 Utensils / Cycle',
        placement: 'Floor-standing (Fits under slab or beside sink)',
        fitsUtensils: '12 Thalis, Kadai, Fry Pan, Glasses & Bowls',
        priceRange: '₹29,999 – ₹34,250',
        imageUrl: 'images/dw_rack_12_place.jpg',
        keyHighlights: [
          'Best value Indian dishwasher under ₹30,000 (Neo ₹29,999)',
          'Accommodates breakfast, lunch & dinner in 1 single night wash',
          'Lower rack fits Indian cooking kadai, frying pans & saucepans',
          'Power Memory automatically resumes wash after power cuts'
        ]
      },
      {
        tierName: '14 Place Settings',
        badge: 'Heavy Cookware & Kadai',
        type: 'PureWash Integrated / Freestanding',
        household: '5 to 8+ Members (Joint Families & Entertaining)',
        utensilCount: '112–130+ Utensils / Cycle',
        placement: 'Built-in / Semi-Integrated / Freestanding',
        fitsUtensils: '5L Pressure Cooker, Deep Kadai, Patila & 14 Thalis',
        priceRange: '₹30,200 – ₹63,901',
        imageUrl: 'images/dw_rack_14_place.jpg',
        keyHighlights: [
          '3 Full-size Pull-Out Racks + dedicated top cutlery sliding tray',
          'Foldable bottom tines fit heavy 5L pressure cookers & oily kadai',
          '3D Triple Spray Arms reach inside deep pressure cookers & pots',
          'Dual Zone wash lets you run upper or lower rack independently'
        ]
      }
    ];

    container.innerHTML = `
      <div class="dw-place-settings-comp" id="dw-place-settings-comp">
        <header class="guide-header-compact">
          <div class="guide-header-left">
            <button class="btn-back-home-pill" id="btn-back-dw-places" title="Return to All Categories Home">
              <span>← All Categories</span>
            </button>
            <div class="brand-wordmark">
              <span class="brand-wordmark-text">TATWA</span>
              <span class="brand-accent-line"></span>
            </div>
            <h1 class="guide-compact-title">DISHWASHER PLACE SETTINGS &amp; CAPACITY GUIDE</h1>
          </div>
          <div class="guide-badge-pill">
            <span>🍽️ 8 Place vs 12 Place vs 14 Place</span>
          </div>
        </header>

        <!-- Compact Visual Definition Strip -->
        <div class="guide-quick-bar dw-quick-bar">
          <span class="quick-bar-icon">🍽️</span>
          <span class="quick-bar-text"><strong>What is 1 Indian Place Setting?</strong> 1 Dinner Thali + 1 Quarter Plate + 1 Glass + 2 Katoris/Bowls + Cutlery. Higher place settings (12S &amp; 14S) feature foldable bottom tines engineered specifically for heavy Indian Kadai &amp; 5L Pressure Cookers.</span>
        </div>

        <!-- 3 Place Setting Tiers Grid (Card with rack image, metrics and concise points) -->
        <div class="place-settings-grid">
          ${tiers.map((tier, idx) => `
            <div class="place-tier-card ${idx === 2 ? 'featured-tier' : ''}">
              <div class="tier-card-header">
                <span class="tier-kicker">${tier.badge}</span>
                <h3 class="tier-title">${tier.tierName}</h3>
                <div class="tier-series-sub">${tier.type || ''}</div>
              </div>

              <!-- Dedicated Visual Image of Dishwasher Rack Loaded -->
              <div class="place-rack-img-box" title="${tier.tierName} Rack Layout">
                <img src="${tier.imageUrl}" alt="${tier.tierName} Rack Interior" class="place-rack-img" />
                <span class="rack-capacity-tag">${tier.utensilCount}</span>
              </div>

              <div class="place-tier-body">
                <!-- Visual Metric Pills (Clean icons, zero bulky paragraphs) -->
                <div class="place-metrics-grid">
                  <div class="place-metric-pill" title="Household Recommendation">
                    <span class="m-icon">👥</span>
                    <div class="m-content">
                      <span class="m-label">Family Size</span>
                      <strong class="m-val">${tier.household}</strong>
                    </div>
                  </div>

                  <div class="place-metric-pill" title="Cookware Supported">
                    <span class="m-icon">🥘</span>
                    <div class="m-content">
                      <span class="m-label">Cookware</span>
                      <strong class="m-val">${tier.fitsUtensils}</strong>
                    </div>
                  </div>

                  <div class="place-metric-pill" title="Installation Type">
                    <span class="m-icon">📐</span>
                    <div class="m-content">
                      <span class="m-label">Placement</span>
                      <strong class="m-val">${tier.placement}</strong>
                    </div>
                  </div>

                  <div class="place-metric-pill price-pill" title="Price Range Across Models">
                    <span class="m-icon">🏷️</span>
                    <div class="m-content">
                      <span class="m-label">Price Range</span>
                      <strong class="m-val-price">${tier.priceRange}</strong>
                    </div>
                  </div>
                </div>

                <!-- Concise Advantages -->
                <div class="tier-highlights-compact">
                  <ul class="highlights-list-compact">
                    ${(tier.keyHighlights || []).map(h => `<li><span class="check-icon">✓</span> <span>${h}</span></li>`).join('')}
                  </ul>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    const btnBack = container.querySelector('#btn-back-dw-places');
    if (btnBack) btnBack.addEventListener('click', () => renderTatwaWelcomeScreen(container));
  }

  // ==========================================================================
  // COMPONENT: TOUCH & WAVE GESTURE MOTION CONTROLS
  // ==========================================================================
  function renderChimneyControls(container) {
    if (!container) return;
    container.innerHTML = `
      <div class="component-dashboard-card" id="chimney-controls-comp">
        <header class="dash-header">
          <div class="dash-title-group">
            <span class="dash-kicker">User Interface Guide</span>
            <h2 class="dash-heading">TOUCH &amp; WAVE GESTURE MOTION CONTROLS</h2>
            <span class="dash-subheading">Hands-free dual optical motion sensors &amp; 9-speed capacitive touch panel</span>
          </div>
          <div class="dash-badge-pill red">
            <span>👋 Dual Optical Motion Sensors</span>
          </div>
        </header>

        <div class="dash-body-grid-3">
          <!-- Column 1: Wave Left to Right -->
          <article class="dash-feature-card highlight">
            <div class="dash-card-top">
              <div class="dash-icon-box red">👋 ➡️</div>
              <div>
                <span class="dash-kicker" style="color:#e11d48;">Gesture Motion 01</span>
                <h3 class="dash-card-heading">WAVE LEFT TO RIGHT</h3>
              </div>
            </div>
            <p class="dash-card-desc">Wave hand smoothly 5–10 cm in front of the sensors from left to right. Turns power ON at Speed 1; successive waves increment speed up to 9.</p>
            <ul class="dash-card-bullets">
              <li>1st Wave: Power ON at Speed 1.</li>
              <li>Next Waves: Increments Speed 2 ➔ 9.</li>
              <li>Touchless hygienic operation with oily hands.</li>
            </ul>
            <div class="wave-guide-arrow">
              <span>👋</span>
              <span>══════▶</span>
              <span>Power ON / Speed UP</span>
            </div>
            <div class="dash-card-bottom-pill red" style="margin-top:0.4rem;">Left-to-Right = Step Up</div>
          </article>

          <!-- Column 2: Simulated Touch Screen Glass Panel -->
          <article class="dash-feature-card" style="background:#ffffff;border-color:#cbd5e1;">
            <div class="dash-card-top">
              <div class="dash-icon-box blue">🎛️</div>
              <div>
                <span class="dash-kicker" style="color:#0284c7;">Interactive Panel</span>
                <h3 class="dash-card-heading">GLASS TOUCH CONSOLE</h3>
              </div>
            </div>
            <p class="dash-card-desc">Interactive capacitive touch screen with digital readout. Test clicking the control buttons below:</p>

            <div class="gesture-console-screen">
              <div style="display:flex;align-items:center;justify-content:space-between;">
                <span style="font-size:0.65rem;color:#64748b;font-weight:700;">TATWA INTELLISENSE OLED</span>
                <div style="display:flex;align-items:center;gap:6px;">
                  <span id="console-light-dot" style="font-size:0.6rem;color:#facc15;display:none;">💡 LED</span>
                  <span id="console-autoclean-dot" style="font-size:0.6rem;color:#ef4444;display:none;">♨️ AutoClean</span>
                </div>
              </div>

              <div class="console-glass-panel">
                <button class="console-touch-key" id="key-power" title="Power Toggle">
                  <span>⏻</span>
                  <span>Power</span>
                </button>
                <button class="console-touch-key" id="key-speed-down" title="Decrease Speed">
                  <span>➖</span>
                  <span>Down</span>
                </button>
                <div class="console-display-digit" id="console-speed-digit">1</div>
                <button class="console-touch-key" id="key-speed-up" title="Increase Speed">
                  <span>➕</span>
                  <span>Up</span>
                </button>
                <button class="console-touch-key" id="key-light" title="LED Light Toggle">
                  <span>💡</span>
                  <span>Light</span>
                </button>
                <button class="console-touch-key" id="key-autoclean" title="10-Min Heat Auto-Clean">
                  <span>♨️</span>
                  <span>Clean</span>
                </button>
              </div>

              <div style="font-size:0.64rem;color:#38bdf8;text-align:center;font-family:monospace;" id="console-status-line">
                Status: Powered ON • Speed 1 (Simmer)
              </div>
            </div>
            <div class="dash-card-bottom-pill blue" style="margin-top:0.4rem;">Direct Touch Backup</div>
          </article>

          <!-- Column 3: Wave Right to Left -->
          <article class="dash-feature-card">
            <div class="dash-card-top">
              <div class="dash-icon-box blue">⬅️ 👋</div>
              <div>
                <span class="dash-kicker" style="color:#0284c7;">Gesture Motion 02</span>
                <h3 class="dash-card-heading">WAVE RIGHT TO LEFT</h3>
              </div>
            </div>
            <p class="dash-card-desc">Wave hand smoothly from right to left across optical sensors. Steps down speed level from 9 ➔ 1. A final wave from Speed 1 shuts power OFF.</p>
            <ul class="dash-card-bullets">
              <li>Each Wave: Decrements speed by 1 level.</li>
              <li>At Speed 1: Final wave powers OFF completely.</li>
              <li>Immediate response without glass smudges.</li>
            </ul>
            <div class="wave-guide-arrow">
              <span>◀══════</span>
              <span>👋</span>
              <span>Speed DOWN / Power OFF</span>
            </div>
            <div class="dash-card-bottom-pill blue" style="margin-top:0.4rem;">Right-to-Left = Step Down</div>
          </article>
        </div>

        <footer class="dash-footer-strip">
          <div class="bottom-info-card">
            <div class="bottom-card-icon">📏</div>
            <div class="bottom-card-text">
              <span class="bottom-card-title">Optimal Distance</span>
              <p class="bottom-card-desc">Wave hand at 5 to 10 cm (2–4 inches) distance with steady, moderate speed.</p>
            </div>
          </div>
          <div class="bottom-info-card">
            <div class="bottom-card-icon">✨</div>
            <div class="bottom-card-text">
              <span class="bottom-card-title">Sensor Cleanliness</span>
              <p class="bottom-card-desc">Keep black glass sensor area clean and free of water drops for prompt motion detection.</p>
            </div>
          </div>
          <div class="bottom-notice-card">
            <div class="notice-shield-icon">👆</div>
            <div class="notice-card-text">
              <span class="notice-card-title">Dual Control Reliability</span>
              <p class="notice-card-desc">If gesture is ever disrupted, full capacitive touch buttons provide instant direct control.</p>
            </div>
          </div>
        </footer>
      </div>
    `;

    initConsoleSimulator(container);
  }

  function initConsoleSimulator(container) {
    let powerOn = true;
    let speed = 1;
    let lightOn = false;
    let autoCleanOn = false;

    const digit = container.querySelector('#console-speed-digit');
    const statusLine = container.querySelector('#console-status-line');
    const lightDot = container.querySelector('#console-light-dot');
    const cleanDot = container.querySelector('#console-autoclean-dot');

    const btnPower = container.querySelector('#key-power');
    const btnDown = container.querySelector('#key-speed-down');
    const btnUp = container.querySelector('#key-speed-up');
    const btnLight = container.querySelector('#key-light');
    const btnClean = container.querySelector('#key-autoclean');

    function update() {
      if (!powerOn) {
        if (digit) digit.textContent = 'OFF';
        if (statusLine) statusLine.textContent = 'Status: Powered OFF (Wave left-to-right to turn on)';
        if (btnPower) btnPower.classList.remove('active');
        return;
      }
      if (btnPower) btnPower.classList.add('active');
      if (digit) digit.textContent = speed;
      if (statusLine) {
        statusLine.textContent = autoCleanOn
          ? 'Status: Auto-Clean Active (9m Heat + 1m Fan)'
          : `Status: Powered ON • Speed ${speed} (Inverter Suction)`;
      }
      if (lightDot) lightDot.style.display = lightOn ? 'inline' : 'none';
      if (cleanDot) cleanDot.style.display = autoCleanOn ? 'inline' : 'none';
      if (btnLight) btnLight.classList.toggle('active', lightOn);
      if (btnClean) btnClean.classList.toggle('active', autoCleanOn);
    }

    if (btnPower) {
      btnPower.addEventListener('click', () => {
        powerOn = !powerOn;
        if (powerOn && speed === 0) speed = 1;
        update();
      });
    }

    if (btnUp) {
      btnUp.addEventListener('click', () => {
        if (!powerOn) { powerOn = true; speed = 1; }
        else if (speed < 9) speed++;
        update();
      });
    }

    if (btnDown) {
      btnDown.addEventListener('click', () => {
        if (!powerOn) return;
        if (speed > 1) speed--;
        else { powerOn = false; }
        update();
      });
    }

    if (btnLight) {
      btnLight.addEventListener('click', () => {
        lightOn = !lightOn;
        update();
      });
    }

    if (btnClean) {
      btnClean.addEventListener('click', () => {
        autoCleanOn = !autoCleanOn;
        if (autoCleanOn) powerOn = true;
        update();
      });
    }

    update();
  }

  // 6. Send Tool Call to Backend
  async function hitTool(payload) {
    userInteractedRecently = true;
    try {
      const q = (payload.query || payload.action || '').toLowerCase();
      const container = document.getElementById('component-viewport') || productGrid;

      if (container) {
        prepareViewTransition(container);
        if (payload.action === 'welcome' || q === 'welcome' || q.includes('welcome') || q.includes('home')) {
          renderTatwaWelcomeScreen(container);
          showToast('Displaying Tatwa Welcome Screen');
          return;
        } else if (q.includes('install') || payload.action === 'installation' || payload.action === 'chimney_installation') {
          updateDisplayBadge('Installation Guide');
          renderChimneyInstallation(container);
          showToast('Displaying Chimney Installation Guide');
        } else if (payload.action === 'chimney_cleaning' || q.includes('chimney clean') || q.includes('oil collector')) {
          updateDisplayBadge('Chimney Cleaning Guide');
          renderChimneyCleaning(container);
          showToast('Displaying Chimney Cleaning Guide');
        } else if (payload.action === 'dishwasher_cleaning' || payload.action === 'dishwasher_maintenance' || q.includes('dishwasher clean') || q.includes('rinse aid') || q.includes('salt') || q.includes('water softener')) {
          updateDisplayBadge('Dishwasher Care Guide');
          renderDishwasherCleaning(container);
          showToast('Displaying Dishwasher Care Guide');
        } else if (payload.action === 'dishwasher_loading' || payload.action === 'loading_guide' || q.includes('how to load') || q.includes('rack loading') || (q.includes('dish') && q.includes('load'))) {
          updateDisplayBadge('Dishwasher Loading Guide');
          renderDishwasherLoading(container);
          showToast('Displaying Dishwasher Loading Guide');
        } else if (payload.action === 'dishwasher_usp' || payload.action === 'dishwasher_features' || q.includes('spray arm') || q.includes('dual zone') || q.includes('usp')) {
          updateDisplayBadge('Dishwasher USPs');
          renderDishwasherUSP(container);
          showToast('Displaying Dishwasher USPs');
        } else if (payload.action === 'bldc_motor' || q.includes('bldc') || q.includes('inverter motor')) {
          updateDisplayBadge('Inverter BLDC Motor');
          renderBLDCMotor(container);
          showToast('Displaying Inverter BLDC Motor');
        } else if (payload.action === 'chimney_controls' || payload.action === 'gesture_control' || q.includes('gesture') || q.includes('wave') || q.includes('touch panel')) {
          updateDisplayBadge('Wave Gesture Controls');
          renderChimneyControls(container);
          showToast('Displaying Wave Gesture Controls');
        }
      }

      const toolUrl = `${backendUrl}/api/tool?sessionId=${encodeURIComponent(sessionId)}`;
      const res = await fetch(toolUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          ...payload
        })
      });

      const result = await res.json();
      showToast(`Action: ${result.title || result.componentType || 'Updated'}`);
      const inspectorRes = document.getElementById('tool-inspector-response');
      if (inspectorRes) {
        inspectorRes.textContent = JSON.stringify(result, null, 2);
      }

      // Direct UI update fallback if SSE is delayed or reconnecting
      if (result && (result.componentType || result.displayedProducts)) {
        handleIncomingImages({
          ...result,
          products: result.displayedProducts || result.products || []
        });
      }
    } catch (err) {
      console.error('Failed to hit tool endpoint:', err);
      showToast('Error calling tool');
      const inspectorRes = document.getElementById('tool-inspector-response');
      if (inspectorRes) {
        inspectorRes.textContent = 'Error: ' + err.message;
      }
    }
  }

  // 7. Off-Canvas Side Nav Drawer Toggle and Escape Logic
  const sideNavDrawer = document.getElementById('side-nav-drawer');
  const drawerBackdrop = document.getElementById('drawer-backdrop');
  const btnCloseDrawer = document.getElementById('btn-close-drawer');
  const btnOpenDrawer = document.getElementById('btn-open-drawer');
  const btnOpenDrawerBurger = document.getElementById('btn-open-drawer-burger');
  const btnOpenDrawerRight = document.getElementById('btn-open-drawer-right');

  function openDrawer() {
    if (sideNavDrawer) {
      sideNavDrawer.classList.add('open');
      sideNavDrawer.setAttribute('aria-hidden', 'false');
    }
  }

  function closeDrawer() {
    if (sideNavDrawer) {
      sideNavDrawer.classList.remove('open');
      sideNavDrawer.setAttribute('aria-hidden', 'true');
    }
  }

  if (btnOpenDrawer) btnOpenDrawer.addEventListener('click', openDrawer);
  if (btnOpenDrawerBurger) btnOpenDrawerBurger.addEventListener('click', openDrawer);
  if (btnOpenDrawerRight) btnOpenDrawerRight.addEventListener('click', openDrawer);
  if (btnCloseDrawer) btnCloseDrawer.addEventListener('click', closeDrawer);
  if (drawerBackdrop) drawerBackdrop.addEventListener('click', closeDrawer);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && sideNavDrawer?.classList.contains('open')) {
      closeDrawer();
    }
  });

  // Backward compatibility for dropdown toggle if present
  if (btnToggleMenu && triggersDropdown) {
    btnToggleMenu.addEventListener('click', (e) => {
      e.stopPropagation();
      openDrawer();
    });
  }

  // 8. Wire Live Interactive Test Simulator Bar & Preset Pills
  const inputSimulatedQuery = document.getElementById('input-simulated-query');
  const btnRunSimulatedQuery = document.getElementById('btn-run-simulated-query');

  function executeSimulatedQuery() {
    if (!inputSimulatedQuery) return;
    const queryText = inputSimulatedQuery.value.trim();
    if (!queryText) {
      showToast('Please type a voice query first (e.g. 30,000 के अंदर डिशवॉशर और चिमनी)');
      inputSimulatedQuery.focus();
      return;
    }
    hitTool({ query: queryText });
    showToast(`Sending: "${queryText}"`);
  }

  if (btnRunSimulatedQuery) {
    btnRunSimulatedQuery.addEventListener('click', executeSimulatedQuery);
  }

  if (inputSimulatedQuery) {
    inputSimulatedQuery.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        executeSimulatedQuery();
      }
    });
  }

  // Wire Preset Pills for One-Click Testing
  document.querySelectorAll('.preset-pill').forEach((pill) => {
    pill.addEventListener('click', () => {
      const query = pill.getAttribute('data-preset-query');
      const action = pill.getAttribute('data-preset-action');
      const category = pill.getAttribute('data-preset-category');
      const maxPrice = pill.getAttribute('data-preset-max-price');
      const rawProducts = pill.getAttribute('data-preset-products');
      const filter = pill.getAttribute('data-preset-filter');
      const isOffer = pill.getAttribute('data-preset-is-offer');
      const compare = pill.getAttribute('data-preset-compare');

      if (query) {
        if (inputSimulatedQuery) inputSimulatedQuery.value = query;
        hitTool({ query });
        showToast(`Testing query: "${query}"`);
      } else if (action) {
        let products = undefined;
        if (rawProducts) {
          try { products = JSON.parse(rawProducts); } catch { products = rawProducts.split(','); }
        }
        hitTool({
          action,
          category: category || undefined,
          maxPrice: maxPrice ? Number(maxPrice) : undefined,
          products: products,
          filter: filter || undefined,
          isOffer: isOffer === 'true' ? true : undefined,
          compare: compare === 'true' ? true : undefined
        });
        showToast(`Testing: ${action} (${category || 'all'})`);
      }
    });
  });

  // Wire Preset Carousel Left and Right Scroll Navigation Buttons
  const btnPresetsScrollLeft = document.getElementById('btn-presets-scroll-left');
  const btnPresetsScrollRight = document.getElementById('btn-presets-scroll-right');
  const simulatorPresetsScroll = document.getElementById('simulator-presets-scroll');

  if (btnPresetsScrollLeft && simulatorPresetsScroll) {
    btnPresetsScrollLeft.addEventListener('click', () => {
      simulatorPresetsScroll.scrollBy({ left: -220, behavior: 'smooth' });
    });
  }

  if (btnPresetsScrollRight && simulatorPresetsScroll) {
    btnPresetsScrollRight.addEventListener('click', () => {
      simulatorPresetsScroll.scrollBy({ left: 220, behavior: 'smooth' });
    });
  }

  // 9. Wire Quick Trigger Buttons inside Dropdown Menu
  document.querySelectorAll('.btn-test').forEach((btn) => {
    btn.addEventListener('click', () => {
      triggersDropdown?.classList.remove('open');
      triggersMenuDropdown?.classList.remove('open');
      btnToggleMenu?.setAttribute('aria-expanded', 'false');

      const action = btn.getAttribute('data-action');
      const category = btn.getAttribute('data-category');
      const maxPrice = btn.getAttribute('data-max-price');
      const rawProducts = btn.getAttribute('data-products');
      const manualTopic = btn.getAttribute('data-manual-topic');
      const filter = btn.getAttribute('data-filter');
      const isOffer = btn.getAttribute('data-is-offer');
      const compare = btn.getAttribute('data-compare');
      const query = btn.getAttribute('data-query');
      const trigger = btn.getAttribute('data-trigger');

      if (action) {
        let products = undefined;
        if (rawProducts) {
          try { products = JSON.parse(rawProducts); } catch { products = rawProducts.split(','); }
        }

        hitTool({
          action: action === 'show_all' ? 'show_products' : action,
          category: category || undefined,
          maxPrice: maxPrice ? Number(maxPrice) : undefined,
          products: products,
          manualTopic: manualTopic || undefined,
          filter: filter || undefined,
          isOffer: isOffer === 'true' ? true : undefined,
          compare: compare === 'true' ? true : undefined,
          query: query || undefined
        });
      } else if (trigger) {
        hitTool({ product: trigger });
      }
    });
  });

  // 9. Preload products on startup without overwriting the Home Screen
  async function loadInitialImages() {
    try {
      const targetUrl = `${backendUrl}/api/products`;
      await fetch(targetUrl);
      // Ensure the Category Home Screen is displayed
      renderTatwaWelcomeScreen();
    } catch (e) {
      console.warn('Initial load error:', e);
    }
  }


  // ==========================================================================
  // VISUALIZER SETTING TOOL (AGENT SIMULATOR) CONTROLS
  // ==========================================================================
  function initVisualizerSettingTool() {
    const settingDisplayMode = document.getElementById('setting-display-mode');
    const settingCategory = document.getElementById('setting-category');
    const settingQuery = document.getElementById('setting-query');
    const btnSelectAll = document.getElementById('btn-enums-select-all');
    const btnClear = document.getElementById('btn-enums-clear');
    const btnFire = document.getElementById('btn-fire-tatwa-tool');
    const inspectorReq = document.getElementById('tool-inspector-request');
    const inspectorRes = document.getElementById('tool-inspector-response');
    const enumCheckboxes = document.querySelectorAll('input[name="tool_product_enum"]');

    function getSelectedEnums() {
      const selected = [];
      enumCheckboxes.forEach((cb) => {
        if (cb.checked) selected.push(cb.value);
      });
      return selected;
    }

    function buildCurrentPayload() {
      const displayMode = settingDisplayMode ? settingDisplayMode.value : 'sequence';
      const category = settingCategory && settingCategory.value ? settingCategory.value : undefined;
      const query = settingQuery && settingQuery.value.trim() ? settingQuery.value.trim() : undefined;
      const enums = getSelectedEnums();

      const payload = {
        tool: 'display_tatwa_products',
        display_mode: displayMode,
        product_enums: enums.length > 0 ? enums : undefined,
        category: category,
        query: query,
        sessionId: sessionId
      };

      const cleanPayload = {};
      for (const [k, v] of Object.entries(payload)) {
        if (v !== undefined) cleanPayload[k] = v;
      }
      return cleanPayload;
    }

    function updateInspectorRequest() {
      if (inspectorReq) {
        const payload = buildCurrentPayload();
        inspectorReq.textContent = JSON.stringify(payload, null, 2);
      }
    }

    if (settingDisplayMode) settingDisplayMode.addEventListener('change', updateInspectorRequest);
    if (settingCategory) settingCategory.addEventListener('change', updateInspectorRequest);
    if (settingQuery) settingQuery.addEventListener('input', updateInspectorRequest);

    enumCheckboxes.forEach((cb) => {
      cb.addEventListener('change', updateInspectorRequest);
    });

    if (btnSelectAll) {
      btnSelectAll.addEventListener('click', () => {
        enumCheckboxes.forEach((cb) => (cb.checked = true));
        updateInspectorRequest();
      });
    }

    if (btnClear) {
      btnClear.addEventListener('click', () => {
        enumCheckboxes.forEach((cb) => (cb.checked = false));
        updateInspectorRequest();
      });
    }

    if (btnFire) {
      btnFire.addEventListener('click', async () => {
        const payload = buildCurrentPayload();
        updateInspectorRequest();

        if (inspectorRes) {
          inspectorRes.textContent = 'Executing tool request via ' + backendUrl + '/api/tool...';
        }

        try {
          const toolUrl = `${backendUrl}/api/tool?sessionId=${encodeURIComponent(sessionId)}`;
          const res = await fetch(toolUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
          const result = await res.json();
          if (inspectorRes) {
            inspectorRes.textContent = JSON.stringify(result, null, 2);
          }
          showToast(`display_tatwa_products: ${result.title || result.componentType || 'Updated'}`);

          // Direct UI update fallback
          if (result && result.componentType) {
            handleIncomingImages({
              ...result,
              products: result.displayedProducts || result.products || []
            });
          }
        } catch (err) {
          console.error('[ToolSetting] Execution error:', err);
          if (inspectorRes) {
            inspectorRes.textContent = 'Error: ' + err.message;
          }
          showToast('Tool Execution Failed');
        }
      });
    }

    updateInspectorRequest();
  }

  // Initialize
  initVisualizerSettingTool();
  initOrationWidget();
  connectSSE();
  // Wire Return to Home on Brand Logo or Showcase Badge Click
  const brandHomeBtn = document.getElementById('brand-home-btn');
  if (brandHomeBtn) {
    brandHomeBtn.addEventListener('click', (e) => {
      e.preventDefault();
      renderTatwaWelcomeScreen();
      showToast('Returned to Home Screen');
    });
  }

  const studioBadge = document.getElementById('display-mode-badge');
  if (studioBadge) {
    studioBadge.style.cursor = 'pointer';
    studioBadge.addEventListener('click', (e) => {
      e.preventDefault();
      renderTatwaWelcomeScreen();
      showToast('Returned to Home Screen');
    });
  }

  // Handle URL Query Parameters (from direct links or voice session)
  const urlParams = new URLSearchParams(window.location.search);
  const qCat = urlParams.get('category');
  const qAction = urlParams.get('action');
  const qMode = urlParams.get('mode');
  const qMaxPrice = urlParams.get('maxPrice');

  if (qCat) {
    hitTool({ category: qCat, maxPrice: qMaxPrice ? Number(qMaxPrice) : undefined });
    try { window.history.replaceState({}, document.title, window.location.pathname); } catch (_) {}
  } else if (qAction) {
    hitTool({ action: qAction });
    try { window.history.replaceState({}, document.title, window.location.pathname); } catch (_) {}
  } else {
    // Default starting point: Render the Clean Minimal Home Screen directly on the right canvas
    renderTatwaWelcomeScreen();
  }

  if (qMode === 'voice' || qMode === 'controls') {
    setTimeout(openDrawer, 900);
  }
})();
