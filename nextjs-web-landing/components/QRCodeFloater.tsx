'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { APP_DOWNLOAD_QR } from '@/lib/constants';
import StoreDownloadLink from '@/components/StoreDownloadLink';
import { getLocaleFromPath } from '@/lib/i18n/locale';
import { t } from '@/lib/i18n/messages';

export default function QRCodeFloater() {
  const pathname = usePathname() ?? '/';
  const locale = getLocaleFromPath(pathname);
  const copy = t(locale);
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div className="fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 flex-col items-center rounded-2xl border border-[#205072] bg-[#205072] p-2 shadow-xl max-md:min-w-0 md:left-auto md:right-6 md:bottom-24 md:min-w-[9rem] md:translate-x-0 md:p-4">
      <button
        className="absolute top-2 end-2.5 hidden md:block text-white/80 hover:text-white text-2xl font-bold leading-none focus:outline-none"
        onClick={() => setVisible(false)}
        aria-label={copy.qr.close}
      >
        ×
      </button>
      <span className="hidden md:block text-sm font-semibold text-white mb-2">
        {copy.qr.getTheApp}
      </span>
      <StoreDownloadLink className="hidden md:block rounded-lg border border-white/30 bg-white p-2 shadow-md">
        <img
          src={APP_DOWNLOAD_QR}
          alt="Scan to download app"
          className="w-24 h-24"
        />
      </StoreDownloadLink>

      <StoreDownloadLink className="md:hidden rounded-lg px-4 py-2.5 text-sm font-semibold uppercase tracking-wide text-white no-underline hover:text-white/90 hover:no-underline">
        {copy.qr.getTheApp}
      </StoreDownloadLink>
    </div>
  );
}
