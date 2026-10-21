// Insignia Court — Common Navigation & Interactive Controllers
(function () {
  'use strict';

  const WHATSAPP_PHONE = '2349110111122';
  const EMAIL_ADDRESS = 'stay@insigniacourts.com';
  const BOOKING_URL = 'https://booking.insigniacourts.com';

  // --- Mobile Drawer Controller ---
  function initDrawer() {
    const burgerBtn = document.querySelector('.mobile-burger-btn');
    const drawer = document.querySelector('.mobile-menu-drawer');
    const overlay = document.querySelector('.menu-backdrop-overlay');
    const closeBtns = document.querySelectorAll('[data-close-menu]');

    if (!burgerBtn || !drawer || !overlay) return;

    function openMenu() {
      drawer.style.display = 'flex';
      overlay.style.display = 'block';
      document.body.style.overflow = 'hidden';
      const label = burgerBtn.querySelector('.burger-label');
      if (label) label.textContent = 'Close';
    }

    function closeMenu() {
      drawer.style.display = 'none';
      overlay.style.display = 'none';
      document.body.style.overflow = '';
      const label = burgerBtn.querySelector('.burger-label');
      if (label) label.textContent = 'Menu';
    }

    burgerBtn.addEventListener('click', function (e) {
      e.preventDefault();
      if (drawer.style.display === 'flex') {
        closeMenu();
      } else {
        openMenu();
      }
    });

    overlay.addEventListener('click', closeMenu);
    closeBtns.forEach(btn => btn.addEventListener('click', closeMenu));

    // Close drawer when pressing Escape
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeMenu();
    });
  }

  // --- Active Navigation Link Highlighting ---
  function initActiveNav() {
    const currentPath = window.location.pathname.toLowerCase();
    const navLinks = document.querySelectorAll('.desktop-nav-link, .mobile-menu-link, .bottom-tab-item');

    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (!href || href === '#') return;

      const linkPath = href.toLowerCase().split('?')[0].split('#')[0];
      const isMatch = (
        (currentPath.endsWith('/') && (linkPath === 'index.html' || linkPath === './' || linkPath === '/')) ||
        (linkPath !== '/' && linkPath !== 'index.html' && currentPath.includes(linkPath.replace('./', '')))
      );

      if (isMatch) {
        if (link.classList.contains('desktop-nav-link')) link.classList.add('nav-active');
        if (link.classList.contains('bottom-tab-item')) link.classList.add('tab-active');
      }
    });
  }

  // --- Enquiry Modal Controller ---
  function initEnquiryModal() {
    const modal = document.getElementById('enquiryModal');
    if (!modal) return;

    const overlay = modal.querySelector('.drawer-backdrop') || modal;
    const form = modal.querySelector('#enquiryForm');
    const waBtn = modal.querySelector('#enquiryWaBtn');
    const mailBtn = modal.querySelector('#enquiryMailBtn');
    const roomButtons = modal.querySelectorAll('.room-choice-btn');
    const roomInput = modal.querySelector('#enquiryRoomInput');

    let selectedRoom = 'No preference';

    function updateActionLinks() {
      const name = (modal.querySelector('#enquiryName')?.value || '').trim();
      const contact = (modal.querySelector('#enquiryContact')?.value || '').trim();
      const checkin = modal.querySelector('#enquiryCheckin')?.value || '';
      const checkout = modal.querySelector('#enquiryCheckout')?.value || '';
      const note = (modal.querySelector('#enquiryNote')?.value || '').trim();

      const lines = ['Hello Insignia Court — I would like to enquire about a stay.'];
      if (name) lines.push('Name: ' + name);
      if (contact) lines.push('Contact: ' + contact);
      if (checkin || checkout) lines.push('Dates: ' + (checkin || '?') + ' to ' + (checkout || '?'));
      lines.push('Room: ' + selectedRoom);
      if (note) lines.push('Note: ' + note);

      const bodyText = lines.join('\n');

      if (waBtn) {
        waBtn.href = 'https://wa.me/' + WHATSAPP_PHONE + '?text=' + encodeURIComponent(bodyText);
      }
      if (mailBtn) {
        mailBtn.href = 'mailto:' + EMAIL_ADDRESS +
          '?subject=' + encodeURIComponent('Stay enquiry — Insignia Court') +
          '&body=' + encodeURIComponent(bodyText);
      }
    }

    // Bind input updates
    ['#enquiryName', '#enquiryContact', '#enquiryCheckin', '#enquiryCheckout', '#enquiryNote'].forEach(sel => {
      const input = modal.querySelector(sel);
      if (input) {
        input.addEventListener('input', updateActionLinks);
        input.addEventListener('change', updateActionLinks);
      }
    });

    // Room Choice pills
    roomButtons.forEach(btn => {
      btn.addEventListener('click', function () {
        roomButtons.forEach(b => {
          b.style.background = '#FFFFFF';
          b.style.color = '#3C0031';
        });
        this.style.background = '#3C0031';
        this.style.color = '#FFFFFF';
        selectedRoom = this.getAttribute('data-room') || this.textContent.trim();
        if (roomInput) roomInput.value = selectedRoom;
        updateActionLinks();
      });
    });

    window.openEnquiry = function (preselectRoom) {
      if (preselectRoom) {
        selectedRoom = preselectRoom;
        roomButtons.forEach(b => {
          const r = b.getAttribute('data-room');
          if (r && r.toLowerCase().includes(preselectRoom.toLowerCase())) {
            b.style.background = '#3C0031';
            b.style.color = '#FFFFFF';
          } else {
            b.style.background = '#FFFFFF';
            b.style.color = '#3C0031';
          }
        });
      }
      updateActionLinks();
      modal.style.display = 'flex';
      document.body.style.overflow = 'hidden';
    };

    window.closeEnquiry = function () {
      modal.style.display = 'none';
      document.body.style.overflow = '';
    };

    // Close triggers
    modal.querySelectorAll('[data-close-enquiry]').forEach(el => {
      el.addEventListener('click', function (e) {
        e.preventDefault();
        window.closeEnquiry();
      });
    });

    modal.addEventListener('click', function (e) {
      if (e.target === modal) window.closeEnquiry();
    });

    document.querySelectorAll('[data-open-enquiry]').forEach(btn => {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        const room = this.getAttribute('data-open-enquiry');
        window.openEnquiry(room);
      });
    });

    updateActionLinks();
  }

  // --- Initialize on DOM Ready ---
  document.addEventListener('DOMContentLoaded', function () {
    initDrawer();
    initActiveNav();
    initEnquiryModal();
  });
})();
