export default async function handler(req, res) {
  const { mode, id, provider, bank, rekening } = req.query;

  if (!mode) {
    return res.status(400).json({ error: 'Parameter mode wajib diisi (ewallet/bank).' });
  }

  let url = '';
  const headers = {
    'x-rapidapi-key': process.env.RAPIDAPI_KEY,
  };

  // ✅ E-Wallet Section
  if (mode === 'ewallet') {
    if (!id || !provider) {
      return res.status(400).json({ error: 'Parameter id dan provider wajib diisi untuk e-wallet.' });
    }

    let endpointPath, providerName;
    if (provider.toLowerCase() === 'linkaja') {
      endpointPath = 'cekewallet';
      providerName = 'LINKAJA'; // HARUS kapital
    } else {
      endpointPath = 'cek_ewallet';
      providerName = provider.toLowerCase(); // lowercase
    }

    url = `https://${process.env.RAPIDAPI_HOST}/${endpointPath}/${id}/${providerName}`;
    headers['x-rapidapi-host'] = process.env.RAPIDAPI_HOST;

  // ✅ BANK Section
  } else if (mode === 'bank') {
    if (!bank || !rekening) {
      return res.status(400).json({ error: 'Parameter bank dan rekening wajib diisi untuk cek rekening.' });
    }

    url = `https://${process.env.RAPIDAPI_HOST_BANK}/check_bank_lq/${bank}/${rekening}`;
    headers['x-rapidapi-host'] = process.env.RAPIDAPI_HOST_BANK;

  } else {
    return res.status(400).json({ error: 'Mode tidak valid. Gunakan "ewallet" atau "bank".' });
  }

  try {
    console.log('[DEBUG] Final URL:', url);
    const response = await fetch(url, { method: 'GET', headers });
    const data = await response.json();

    res.status(200).json(data);
  } catch (error) {
    console.error('API error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
