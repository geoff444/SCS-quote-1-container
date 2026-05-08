import { useState, useEffect } from 'react';
import { Check, X, ArrowRight, Package, MapPin, Building2, Plus, Trash2, Coffee, User } from 'lucide-react';
import { ROUTES } from './routes';

export default function QuoteForm() {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [splitAcrossRoasters, setSplitAcrossRoasters] = useState(false);
  const [multipleLots, setMultipleLots] = useState(false);
  const [lots, setLots] = useState([{ id: 1, name: '', bags: '', bagSize: '60', fob: '' }]);
  const [discloseRoaster, setDiscloseRoaster] = useState(false);
  const [roasterName, setRoasterName] = useState('');
  const [roasterEmail, setRoasterEmail] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const MIN_KG = 6000;
  const NO_WARNING_KG = 15000;

  const origins = [...new Set(ROUTES.map(r => r.origin))].sort();

  useEffect(() => {
    setDestination('');
  }, [origin]);

  const laneServiced = origin && destination && ROUTES.some(r => r.origin === origin && r.destination === destination);
  const availableDestinations = origin ? [...new Set(ROUTES.filter(r => r.origin === origin).map(r => r.destination))].sort() : [];

  const totalKg = lots.reduce((sum, l) => sum + (parseFloat(l.bags) || 0) * (parseFloat(l.bagSize) || 0), 0);
  const totalBags = lots.reduce((sum, l) => sum + (parseInt(l.bags) || 0), 0);
  const meetsMinimum = totalKg >= MIN_KG;
  const showUnderContainerNotice = totalKg >= MIN_KG && totalKg < NO_WARNING_KG;

  const lotsHaveValues = multipleLots
    ? lots.length > 0 && lots.every(l => l.bags && l.bagSize && l.fob)
    : lots[0].bags && lots[0].bagSize && lots[0].fob;
  const lotsValid = lotsHaveValues && meetsMinimum;

  const showDestination = !!origin;
  const showLotsDetail = laneServiced;
  const showRoasterSection = showLotsDetail && lotsValid;
  const showContact = showRoasterSection;
  const canSubmit = laneServiced && lotsValid && name && email && company;

  const addLot = () => {
    const nextId = Math.max(...lots.map(l => l.id)) + 1;
    setLots([...lots, { id: nextId, name: '', bags: '', bagSize: '60', fob: '' }]);
  };

  const removeLot = (id) => {
    if (lots.length > 1) setLots(lots.filter(l => l.id !== id));
  };

  const updateLot = (id, field, value) => {
    setLots(lots.map(l => l.id === id ? { ...l, [field]: value } : l));
  };

  const handleSubmit = () => {
    setSubmitted(true);
  };

  const reset = () => {
    setOrigin(''); setDestination(''); setSplitAcrossRoasters(false);
    setMultipleLots(false); setLots([{ id: 1, name: '', bags: '', bagSize: '60', fob: '' }]);
    setDiscloseRoaster(false); setRoasterName(''); setRoasterEmail('');
    setName(''); setEmail(''); setCompany(''); setSubmitted(false);
  };

  if (submitted) {
    return (
      <div className="max-w-xl mx-auto p-8">
        <div className="bg-green-50 border border-green-200 rounded-lg p-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center">
              <Check className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Got it — we're on it</h2>
          </div>
          <p className="text-gray-700 mb-4">
            Thanks {name}. A member of our team will reach out within <strong>3 business days</strong> with an indicative quote and next steps.
          </p>
          <div className="bg-white rounded border border-gray-200 p-4 text-sm">
            <div className="font-semibold text-gray-900 mb-2">Your request</div>
            <div className="space-y-1 text-gray-600">
              <div><strong>Lane:</strong> {origin} → {destination}</div>
              <div><strong>Total volume:</strong> {totalBags} bags ({totalKg.toLocaleString()} kg){splitAcrossRoasters ? ' — split across multiple roasters' : ''}</div>
              <div className="pt-2"><strong>Lots:</strong></div>
              {lots.map((lot, i) => (
                <div key={lot.id} className="ml-2">
                  • {lot.name || `Lot ${i + 1}`} — {lot.bags} bags × {lot.bagSize}kg @ ${lot.fob}/lb FOB
                </div>
              ))}
              {discloseRoaster && roasterName && (
                <div className="pt-2"><strong>Buyer:</strong> {roasterName}{roasterEmail ? ` (${roasterEmail})` : ''}</div>
              )}
              <div className="pt-2"><strong>Contact:</strong> {name} · {company}</div>
            </div>
          </div>
          <button onClick={reset} className="mt-6 text-sm text-gray-600 underline">Submit another</button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">Get a quote for shipping your coffee</h1>
        <p className="text-gray-600">Tell us about your shipment and we'll get back to you within 3 business days with an indicative quote.</p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded p-3 mb-6 text-sm text-blue-900">
        Quotes are based on shipping a <strong>full container</strong> (≈18,000 kg / 300 bags at 60 kg). You can split a container across multiple roasters and multiple lots, or ship under-volume — the price is the same either way.
      </div>

      <div className="space-y-6">
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-900 mb-2">
            <MapPin className="w-4 h-4" /> Origin
          </label>
          <select value={origin} onChange={e => setOrigin(e.target.value)} className="w-full px-4 py-2.5 border border-gray-300 rounded bg-white">
            <option value="">Select origin country</option>
            {origins.map(o => <option key={o} value={o}>{o}</option>)}
          </select>
        </div>

        {showDestination && (
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-900 mb-2">
              <MapPin className="w-4 h-4" /> Destination
            </label>
            <select value={destination} onChange={e => setDestination(e.target.value)} className="w-full px-4 py-2.5 border border-gray-300 rounded bg-white">
              <option value="">Select destination</option>
              {availableDestinations.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
            <div className="mt-2 text-xs text-gray-500">
              Showing {availableDestinations.length} destination{availableDestinations.length !== 1 ? 's' : ''} we currently service from {origin}
            </div>
            {laneServiced && (
              <div className="mt-2 flex items-center gap-2 text-sm text-green-700">
                <Check className="w-4 h-4" />
                <span>We service {origin} → {destination} regularly</span>
              </div>
            )}
          </div>
        )}

        {showLotsDetail && (
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-900 mb-2">
              <Coffee className="w-4 h-4" /> Coffee details
            </label>

            <label className="flex items-center gap-2 mb-3 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={multipleLots}
                onChange={e => {
                  setMultipleLots(e.target.checked);
                  if (!e.target.checked) setLots([lots[0]]);
                }}
              />
              I have multiple lots / qualities to ship
            </label>

            <div className="space-y-3">
              {lots.map((lot, i) => (
                <div key={lot.id} className="bg-gray-50 border border-gray-200 rounded p-4">
                  {multipleLots && (
                    <div className="flex items-center justify-between mb-3">
                      <div className="text-sm font-medium text-gray-700">Lot {i + 1}</div>
                      {lots.length > 1 && (
                        <button onClick={() => removeLot(lot.id)} className="text-gray-400 hover:text-red-600">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  )}

                  {multipleLots && (
                    <div className="mb-3">
                      <label className="block text-xs text-gray-600 mb-1">Lot name (optional)</label>
                      <input
                        type="text"
                        placeholder="e.g. Geisha Washed"
                        value={lot.name}
                        onChange={e => updateLot(lot.id, 'name', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                      />
                    </div>
                  )}

                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Bags</label>
                      <input
                        type="number"
                        placeholder="100"
                        value={lot.bags}
                        onChange={e => updateLot(lot.id, 'bags', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Bag size (kg)</label>
                      <select
                        value={lot.bagSize}
                        onChange={e => updateLot(lot.id, 'bagSize', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded text-sm bg-white"
                      >
                        <option value="60">60 kg</option>
                        <option value="69">69 kg</option>
                        <option value="70">70 kg</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">FOB ($/lb)</label>
                      <input
                        type="number"
                        step="0.01"
                        placeholder="4.50"
                        value={lot.fob}
                        onChange={e => updateLot(lot.id, 'fob', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                      />
                    </div>
                  </div>
                </div>
              ))}

              {multipleLots && (
                <button onClick={addLot} className="text-sm text-gray-700 flex items-center gap-1 hover:text-gray-900">
                  <Plus className="w-4 h-4" /> Add another lot
                </button>
              )}
            </div>

            {totalBags > 0 && (
              <div className="mt-3">
                <div className="text-sm text-gray-700 mb-1">
                  Total: <strong>{totalBags} bags</strong> ({totalKg.toLocaleString()} kg)
                </div>
                {!meetsMinimum && lotsHaveValues && (
                  <div className="flex items-start gap-2 text-sm text-red-700">
                    <X className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>This is below our minimum shipment size (6,000 kg / 100 bags at 60 kg). Add more bags or additional lots to continue.</span>
                  </div>
                )}
                {showUnderContainerNotice && (
                  <div className="flex items-start gap-2 text-sm text-amber-700">
                    <Package className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>This is below a full container (~18,000 kg). The price is still based on shipping the full container, whether the full volume is used or not.</span>
                  </div>
                )}
                {meetsMinimum && !showUnderContainerNotice && (
                  <div className="flex items-center gap-2 text-sm text-green-700">
                    <Check className="w-4 h-4" />
                    <span>We can quote this</span>
                  </div>
                )}
              </div>
            )}

            {meetsMinimum && (
              <label className="flex items-center gap-2 mt-3 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={splitAcrossRoasters}
                  onChange={e => setSplitAcrossRoasters(e.target.checked)}
                />
                This shipment is split across multiple roasters
              </label>
            )}
          </div>
        )}

        {showRoasterSection && (
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-900 mb-2">
              <User className="w-4 h-4" /> Buyer details <span className="text-xs font-normal text-gray-500">(optional)</span>
            </label>
            <div className="bg-gray-50 border border-gray-200 rounded p-4">
              <p className="text-sm text-gray-700 mb-3">
                If you tell us who the roaster is, we can give you a more accurate quote based on their account. This is optional — leave blank if you'd rather not share at this stage.
              </p>
              <label className="flex items-center gap-2 mb-3 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={discloseRoaster}
                  onChange={e => setDiscloseRoaster(e.target.checked)}
                />
                I'm happy to share the buyer's details
              </label>
              {discloseRoaster && (
                <div className="space-y-2">
                  <input
                    type="text"
                    placeholder="Roasting company name"
                    value={roasterName}
                    onChange={e => setRoasterName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                  />
                  <input
                    type="email"
                    placeholder="Buyer email (optional)"
                    value={roasterEmail}
                    onChange={e => setRoasterEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {showContact && (
          <div className="space-y-3">
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-900 mb-2">
                <Building2 className="w-4 h-4" /> About you
              </label>
              <input type="text" placeholder="Your name" value={name} onChange={e => setName(e.target.value)} className="w-full px-4 py-2.5 border border-gray-300 rounded mb-2" />
              <input type="text" placeholder="Producer / company name" value={company} onChange={e => setCompany(e.target.value)} className="w-full px-4 py-2.5 border border-gray-300 rounded mb-2" />
              <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className="w-full px-4 py-2.5 border border-gray-300 rounded" />
            </div>
          </div>
        )}

        {showContact && (
          <button onClick={handleSubmit} disabled={!canSubmit} className="w-full px-6 py-3 bg-gray-900 text-white rounded font-medium disabled:bg-gray-300 flex items-center justify-center gap-2">
            Request quote <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}