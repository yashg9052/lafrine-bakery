// src/components/OrderForm.jsx
import { useState } from 'react';
import { placeOrder } from '../services/api';
import PaymentModal from './PaymentModal';

const s = {
  wrap: { background: '#fffdf9', borderTop: '1px solid #e0d0be' },
  inner: {
    maxWidth: '1100px',
    margin: '0 auto',
    padding: '3rem 1.5rem',
    display: 'grid',
    gridTemplateColumns: '1fr 360px',
    gap: '2.5rem',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.3rem',
    marginBottom: '0.8rem',
  },
  formRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1rem',
  },
  label: {
    fontSize: '0.78rem',
    fontWeight: 500,
    letterSpacing: '0.5px',
    textTransform: 'uppercase',
    color: '#7a5c44',
  },
  input: {
    padding: '0.6rem 0.85rem',
    border: '1.5px solid #e0d0be',
    borderRadius: '3px',
    background: '#fff',
    color: '#2c1a0e',
    fontSize: '0.92rem',
    outline: 'none',
    width: '100%',
  },
  submitBtn: {
    width: '100%',
    background: '#c2813a',
    color: '#fff',
    border: 'none',
    padding: '0.85rem',
    borderRadius: '3px',
    fontSize: '0.92rem',
    fontWeight: 500,
    cursor: 'pointer',
    marginTop: '0.5rem',
  },
};

export default function OrderForm({
  cart,
  onRemoveItem,
  onClearCart,
  total,
}) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [type, setType] = useState('pickup');
  const [time, setTime] = useState('');
  const [notes, setNotes] = useState('');

  const [showPayment, setShowPayment] = useState(false);
  const [orderData, setOrderData] = useState(null);
  const [toast, setToast] = useState('');

  const showMsg = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  // Generate LOCAL min datetime (30 minutes from now)
  const getMinDateTime = () => {
    const now = new Date();

    now.setMinutes(now.getMinutes() + 30);

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');

    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const minDateTime = getMinDateTime();

  const handleSubmit = async () => {
    if (!name || !phone || !email) {
      showMsg('Fill in Name, Phone & Email.');
      return;
    }

    if (!time) {
      showMsg('Please select preferred time.');
      return;
    }

    if (cart.length === 0) {
      showMsg('Add items to cart first.');
      return;
    }

    try {
      const res = await placeOrder({
        customer: {
          name,
          phone,
          email,
        },
        items: cart.map((i) => ({
          itemId: i._id,
          name: i.name,
          price: i.price,
        })),
        orderType: type,
        pickupTime: time,
        notes,
      });

      setOrderData({
        orderId: res.data.orderId,
      });
    } catch (err) {
      console.error('Order error:', err);

      // fallback ID
      setOrderData({
        orderId: 'ORD-' + Date.now(),
      });
    }

    setShowPayment(true);
  };

  const handlePaySuccess = ({ method, paid, remaining }) => {
    setShowPayment(false);

    onClearCart();

    setName('');
    setPhone('');
    setEmail('');
    setTime('');
    setNotes('');

    showMsg(
      `Order confirmed! Paid ₹${paid.toFixed(
        2
      )} via ${method}${remaining > 0
        ? `. ₹${remaining.toFixed(2)} due on delivery.`
        : ''
      }`
    );
  };

  return (
    <>
      <div id="order" style={s.wrap}>
        <div style={s.inner}>
          {/* FORM */}

          <div>
            <p className="section-title">
              Place Your Order
            </p>

            <div style={s.formRow}>
              <div style={s.formGroup}>
                <label style={s.label}>
                  Your Name
                </label>

                <input
                  style={s.input}
                  placeholder="Riya Sharma"
                  value={name}
                  onChange={(e) =>
                    setName(e.target.value)
                  }
                />
              </div>

              <div style={s.formGroup}>
                <label style={s.label}>
                  Phone Number
                </label>

                <input
                  style={s.input}
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) =>
                    setPhone(e.target.value)
                  }
                />
              </div>
            </div>

            <div style={s.formGroup}>
              <label style={s.label}>
                Email Address
              </label>

              <input
                style={s.input}
                placeholder="you@example.com"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
              />
            </div>

            <div style={s.formRow}>
              <div style={s.formGroup}>
                <label style={s.label}>
                  Order Type
                </label>

                <select
                  style={s.input}
                  value={type}
                  onChange={(e) =>
                    setType(e.target.value)
                  }
                >
                  <option value="pickup">
                    Pick-up
                  </option>

                  <option value="delivery">
                    Local Delivery
                  </option>
                </select>
              </div>

              <div style={s.formGroup}>
                <label style={s.label}>
                  Preferred Time
                </label>

                <input
                  style={{
                    ...s.input,
                    background: '#bf8741',
                    color: '#fff'
                  }}
                  type="datetime-local"
                  value={time}
                  min={minDateTime}
                  onChange={(e) => setTime(e.target.value)}
                  required
                />
              </div>
            </div>

            <div style={s.formGroup}>
              <label style={s.label}>
                Special Instructions
              </label>

              <textarea
                style={{
                  ...s.input,
                  resize: 'vertical',
                  minHeight: '70px',
                }}
                placeholder="Allergies, custom messages, etc."
                value={notes}
                onChange={(e) =>
                  setNotes(e.target.value)
                }
              />
            </div>

            <button
              style={s.submitBtn}
              onClick={handleSubmit}
            >
              Proceed to Payment
            </button>
          </div>

          {/* CART */}

          <div
            style={{
              background: '#fff9f2',
              border: '1px solid #e0d0be',
              borderRadius: '4px',
              padding: '1.5rem',
              position: 'sticky',
              top: '80px',
            }}
          >
            <h3>
              Your Cart ({cart.length})
            </h3>

            {cart.length === 0 ? (
              <p>No items added yet.</p>
            ) : (
              cart.map((item) => (
                <div
                  key={item.cartKey}
                  style={{
                    display: 'flex',
                    justifyContent:
                      'space-between',
                    marginBottom: '8px',
                  }}
                >
                  <span>{item.name}</span>

                  <span>₹{item.price}</span>

                  <button
                    onClick={() =>
                      onRemoveItem(
                        item.cartKey
                      )
                    }
                  >
                    x
                  </button>
                </div>
              ))
            )}

            <hr />

            <div>
              <strong>
                Total: ₹
                {total.toFixed(2)}
              </strong>
            </div>
          </div>
        </div>
      </div>

      {/* TOAST */}

      {toast && (
        <div
          style={{
            position: 'fixed',
            bottom: '2rem',
            right: '2rem',
            zIndex: 999,
            background: '#3b2412',
            color: '#e8a94b',
            padding: '0.8rem 1.4rem',
            borderRadius: '3px',
          }}
        >
          {toast}
        </div>
      )}

      {/* PAYMENT */}

      {showPayment && (
        <PaymentModal
          cart={cart}
          total={total}
          orderData={orderData}
          onSuccess={handlePaySuccess}
          onClose={() =>
            setShowPayment(false)
          }
        />
      )}
    </>
  );
}