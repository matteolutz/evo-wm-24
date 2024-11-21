import { useSearchParams } from '@remix-run/react';

const useNFCReaderId = (): number => {
  const [searchParams] = useSearchParams();

  const nfcReaderIdStr = searchParams.get('nfc');

  if (nfcReaderIdStr === null) {
    return 0;
  }

  const nfcReaderId = parseInt(nfcReaderIdStr);

  if (isNaN(nfcReaderId)) return 0;

  return nfcReaderId;
};

export default useNFCReaderId;
