'use strict';
(() => {
  const tr = document.documentElement.lang === 'tr';
  const form = document.getElementById('deletion-request');
  const consent = document.getElementById('loss-consent');
  const email = document.getElementById('account-email');
  const player = document.getElementById('player-id');
  const profile = document.getElementById('profile-name');
  const prepare = document.getElementById('prepare-request');
  const copy = document.getElementById('copy-request');
  const preview = document.getElementById('request-preview');
  const status = document.getElementById('request-status');
  // Optional app context remains client-side, never a URL query or an HTTP request.
  const params = new URLSearchParams(location.hash.slice(1));
  const playerId = params.get('playerId');
  if (playerId && /^[A-Za-z0-9_-]{1,128}$/.test(playerId)) player.value = playerId;
  if (location.hash) history.replaceState(null, '', location.pathname + location.search);
  const subject = 'Football Club Manager - ' + (tr ? 'Hesap silme talebi' : 'Account deletion request');
  function update() {
    prepare.disabled = copy.disabled = !consent.checked;
    const clean = value => value.trim().replace(/[\r\n\x00-\x1f\x7f]/g, ' ');
    preview.value = [subject, '',
      (tr ? 'Hesap e-postası: ' : 'Account email: ') + clean(email.value),
      (tr ? 'Oyuncu kimliği (isteğe bağlı): ' : 'Player ID (optional): ') + clean(player.value),
      (tr ? 'Play Games profil adı: ' : 'Play Games profile name: ') + clean(profile.value), '',
      tr ? 'Oyun hesabımın ve ilişkili bulut verilerinin silinmesini talep ediyorum. Kullanılmamış Gold ve tüketilebilir paketlerin kaybedileceğini anladım. Lütfen sahiplik doğrulaması ve sonraki adımlar hakkında benimle iletişime geçin.'
         : 'I request deletion of my game account and associated cloud data. I understand that unused Gold and consumable packs will be lost. Please contact me about ownership verification and the next steps.'
    ].join('\n');
  }
  form.addEventListener('input', update);
  form.addEventListener('submit', event => {
    event.preventDefault();
    if (!consent.checked || !form.reportValidity()) return;
    update();
    status.textContent = tr ? 'Talep henüz gönderilmedi. Açılan taslağı e-posta uygulamanızdan gönderin. Uygulama açılmazsa metni kopyalayıp destek adresine gönderin.' : 'Your request has not been sent yet. Send the draft from your email app. If no app opens, copy the text and email support directly.';
    location.href = 'mailto:chepnistudio@outlook.com?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(preview.value);
  });
  copy.addEventListener('click', async () => {
    if (!consent.checked) return;
    update();
    try {
      await navigator.clipboard.writeText(preview.value);
      status.textContent = tr ? 'Metin kopyalandı; talep gönderilmedi. Destek adresine e-posta olarak gönderin.' : 'Text copied; no request was sent. Email it to the support address.';
    } catch {
      preview.focus(); preview.select();
      status.textContent = tr ? 'Metni aşağıdan elle kopyalayıp destek adresine gönderin.' : 'Copy the text below manually and email it to support.';
    }
  });
  update();
})();
