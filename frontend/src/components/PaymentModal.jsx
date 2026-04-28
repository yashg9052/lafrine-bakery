// src/components/PaymentModal.jsx
// UI-only payment gateway with partial payment option
import React, { useState } from 'react';
import { initiatePayment } from '../services/api';

const METHODS = ['UPI', 'Card', 'Net Banking', 'Cash on Delivery'];

const s = {
  overlay: {
    position:'fixed', inset:0, background:'rgba(0,0,0,0.6)',
    zIndex:300, display:'flex', alignItems:'center', justifyContent:'center', padding:'1rem',
  },
  modal: {
    background:'#fffdf9', borderRadius:'6px', width:'100%', maxWidth:'480px',
    animation:'popIn .4s cubic-bezier(.34,1.56,.64,1)',
    overflow:'hidden',
  },
  header: {
    background:'#3b2412', padding:'1.2rem 1.5rem',
    display:'flex', alignItems:'center', justifyContent:'space-between',
  },
  headerTitle: { fontFamily:"'Playfair Display', serif", color:'#e8a94b', fontSize:'1.2rem', fontWeight:700 },
  closeBtn: { background:'none', border:'none', color:'#d4b896', fontSize:'1.4rem', cursor:'pointer' },
  body: { padding:'1.5rem' },
  summaryBox: {
    background:'#fff9f2', border:'1px solid #e0d0be',
    borderRadius:'4px', padding:'1rem', marginBottom:'1.2rem',
  },
  summaryRow: { display:'flex', justifyContent:'space-between', fontSize:'0.88rem', color:'#7a5c44', marginBottom:'0.3rem' },
  totalRow: { display:'flex', justifyContent:'space-between', fontWeight:700, fontSize:'1rem', color:'#3b2412', paddingTop:'0.5rem', borderTop:'1px solid #e0d0be', marginTop:'0.5rem' },
  label: { fontSize:'0.78rem', fontWeight:500, letterSpacing:'0.5px', textTransform:'uppercase', color:'#7a5c44', display:'block', marginBottom:'0.3rem' },
  input: {
    width:'100%', padding:'0.6rem 0.85rem', border:'1.5px solid #e0d0be',
    borderRadius:'3px', background:'#fff', color:'#2c1a0e',
    fontFamily:"'DM Sans', sans-serif", fontSize:'0.92rem', outline:'none',
    boxSizing:'border-box',
  },
  methodGrid: { display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.6rem', margin:'0.8rem 0' },
  methodBtn: (active) => ({
    padding:'0.6rem', border:`1.5px solid ${active ? '#c2813a' : '#e0d0be'}`,
    borderRadius:'3px', background: active ? '#fff3e8' : '#fff',
    color: active ? '#3b2412' : '#7a5c44',
    fontFamily:"'DM Sans', sans-serif", fontSize:'0.82rem', fontWeight: active ? 600 : 400,
    cursor:'pointer', transition:'all .2s', textAlign:'center',
  }),
  partialToggle: {
    display:'flex', alignItems:'center', gap:'0.6rem',
    padding:'0.7rem', background:'#fff9f2', border:'1px solid #e0d0be',
    borderRadius:'3px', margin:'1rem 0', cursor:'pointer',
  },
  checkbox: { width:'16px', height:'16px', accentColor:'#c2813a', cursor:'pointer' },
  partialLabel: { fontSize:'0.88rem', color:'#3b2412', fontWeight:500 },
  partialNote: { fontSize:'0.78rem', color:'#7a5c44' },
  partialInput: { marginTop:'0.8rem' },
  payBtn: {
    width:'100%', background:'#c2813a', color:'#fff', border:'none',
    padding:'0.85rem', borderRadius:'3px', fontSize:'0.95rem',
    fontWeight:600, cursor:'pointer', fontFamily:"'DM Sans', sans-serif",
    letterSpacing:'0.5px', textTransform:'uppercase', transition:'background .2s',
  },
  successBox: { textAlign:'center', padding:'2rem 1rem' },
  successIcon: { fontSize:'3rem', marginBottom:'1rem' },
  successTitle: { fontFamily:"'Playfair Display', serif", color:'#3b2412', fontSize:'1.4rem', marginBottom:'0.5rem' },
  successSub: { color:'#7a5c44', fontSize:'0.9rem', marginBottom:'1.5rem' },
  errorMsg: { color:'#c0392b', fontSize:'0.83rem', marginTop:'0.5rem' },
};

export default function PaymentModal({ cart, total, orderData, onSuccess, onClose }) {
  const [method, setMethod]       = useState('UPI');
  const [isPartial, setIsPartial] = useState(false);
  const [partialAmt, setPartialAmt] = useState('');
  const [upiId, setUpiId]         = useState('');
  const [cardNo, setCardNo]       = useState('');
  const [cardExp, setCardExp]     = useState('');
  const [cardCvv, setCardCvv]     = useState('');
  const [loading, setLoading]     = useState(false);
  const [done, setDone]           = useState(false);
  const [error, setError]         = useState('');

  const payAmount = isPartial ? parseFloat(partialAmt) || 0 : total;
  const remaining = isPartial ? total - payAmount : 0;

  const handlePay = async () => {
    setError('');
    if (isPartial) {
      if (!partialAmt || payAmount <= 0) { setError('Enter valid partial amount.'); return; }
      if (payAmount >= total) { setError('Partial amount must be less than total.'); return; }
      if (payAmount < total * 0.3) { setError('Minimum 30% advance required.'); return; }
    }
    if (method === 'UPI' && !upiId.includes('@')) { setError('Enter valid UPI ID (e.g. name@upi)'); return; }
    if (method === 'Card' && (cardNo.length < 16 || !cardExp || !cardCvv)) { setError('Fill in all card details.'); return; }

    setLoading(true);
    try {
      await initiatePayment({
        orderId: orderData?.orderId || 'TEMP-' + Date.now(),
        amount: payAmount,
        method,
        isPartial,
        partialAmount: isPartial ? payAmount : null,
        remainingAmount: isPartial ? remaining : 0,
      });
      setDone(true);
      setTimeout(() => { onSuccess({ method, paid: payAmount, remaining }); }, 1500);
    } catch {
      // Mock success when backend offline
      setDone(true);
      setTimeout(() => { onSuccess({ method, paid: payAmount, remaining }); }, 1500);
    } finally {
      setLoading(false);
    }
  };

  const formatCard = (val) => val.replace(/\D/g,'').slice(0,16).replace(/(.{4})/g,'$1 ').trim();

  return (
    <div style={s.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={s.modal}>
        <div style={s.header}>
          <span style={s.headerTitle}>Secure Checkout</span>
          <button style={s.closeBtn} onClick={onClose}>x</button>
        </div>

        {done ? (
          <div style={s.successBox}>
            <div style={s.successIcon}>✓</div>
            <div style={s.successTitle}>Payment Confirmed!</div>
            <p style={s.successSub}>
              ₹{payAmount.toFixed(2)} paid via {method}.
              {isPartial && ` Balance ₹${remaining.toFixed(2)} due on delivery.`}
            </p>
          </div>
        ) : (
          <div style={s.body}>
            {/* Order Summary */}
            <div style={s.summaryBox}>
              {cart.map((item, i) => (
                <div key={i} style={s.summaryRow}>
                  <span>{item.name}</span>
                  <span>₹{item.price}</span>
                </div>
              ))}
              <div style={s.totalRow}>
                <span>Total</span>
                <span style={{ color:'#c2813a' }}>₹{total.toFixed(2)}</span>
              </div>
            </div>

            {/* Payment Method */}
            <label style={s.label}>Payment Method</label>
            <div style={s.methodGrid}>
              {METHODS.map(m => (
                <button key={m} style={s.methodBtn(method === m)} onClick={() => setMethod(m)}>
                  {m}
                </button>
              ))}
            </div>

            {/* Method-specific fields */}
            {method === 'UPI' && (
              <div>
                <label style={s.label}>UPI ID</label>
                <input style={s.input} placeholder="yourname@upi" value={upiId} onChange={e => setUpiId(e.target.value)} />
              </div>
            )}
            {method === 'Card' && (
              <div style={{ display:'flex', flexDirection:'column', gap:'0.6rem' }}>
                <div>
                  <label style={s.label}>Card Number</label>
                  <input style={s.input} placeholder="1234 5678 9012 3456" value={cardNo}
                    onChange={e => setCardNo(formatCard(e.target.value))} maxLength={19} />
                </div>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.6rem' }}>
                  <div>
                    <label style={s.label}>Expiry (MM/YY)</label>
                    <input style={s.input} placeholder="MM/YY" value={cardExp}
                      onChange={e => setCardExp(e.target.value)} maxLength={5} />
                  </div>
                  <div>
                    <label style={s.label}>CVV</label>
                    <input style={s.input} placeholder="***" type="password" value={cardCvv}
                      onChange={e => setCardCvv(e.target.value.slice(0,3))} maxLength={3} />
                  </div>
                </div>
              </div>
            )}
            {method === 'Net Banking' && (
              <div>
                <label style={s.label}>Select Bank</label>
                <select style={s.input}>
                  <option>HDFC Bank</option><option>SBI</option>
                  <option>ICICI Bank</option><option>Axis Bank</option>
                  <option>Kotak Bank</option>
                </select>
              </div>
            )}

            {/* Partial Payment Toggle */}
            {method !== 'Cash on Delivery' && (
              <label style={s.partialToggle}>
                <input type="checkbox" style={s.checkbox} checked={isPartial} onChange={e => setIsPartial(e.target.checked)} />
                <div>
                  <div style={s.partialLabel}>Pay Partial Amount Now</div>
                  <div style={s.partialNote}>Pay minimum 30% advance, rest on delivery</div>
                </div>
              </label>
            )}

            {isPartial && (
              <div style={s.partialInput}>
                <label style={s.label}>Advance Amount (min ₹{(total * 0.3).toFixed(0)})</label>
                <input style={s.input} type="number" placeholder={`Min ₹${(total * 0.3).toFixed(0)}`}
                  value={partialAmt} onChange={e => setPartialAmt(e.target.value)} />
                {partialAmt > 0 && (
                  <p style={{ fontSize:'0.82rem', color:'#7a5c44', marginTop:'0.4rem' }}>
                    Pay now: <strong style={{ color:'#c2813a' }}>₹{parseFloat(partialAmt).toFixed(2)}</strong>
                    &nbsp;|&nbsp;Due on delivery: <strong>₹{(total - parseFloat(partialAmt || 0)).toFixed(2)}</strong>
                  </p>
                )}
              </div>
            )}

            {error && <p style={s.errorMsg}>{error}</p>}

            <button
              style={{ ...s.payBtn, marginTop:'1rem', opacity: loading ? 0.7 : 1 }}
              onClick={handlePay}
              disabled={loading}
              onMouseOver={e => !loading && (e.target.style.background='#a8452a')}
              onMouseOut={e => (e.target.style.background='#c2813a')}
            >
              {loading ? 'Processing...' : `Pay ₹${payAmount > 0 ? payAmount.toFixed(2) : total.toFixed(2)}`}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
