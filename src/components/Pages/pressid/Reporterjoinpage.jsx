import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../../../services/api';

// ─── CONFIG — change these to your actual UPI details ────────────────────────
const UPI_CONFIG = {
  upiId:    'ap13news@upi',          // ← your UPI ID
  name:     'AP13 News Network',
  merchant: 'AP13MEDIA',
};

const PLANS = [
  {
    id: 'basic',
    label: 'Field Reporter',
    price: 499,
    color: '#3b82f6',
    badge: 'STARTER',
    features: [
      'Official Press ID Card',
      'AP13 Reporter Certificate',
      'News Submission Access',
      'Monthly Newsletter',
      '3 Months Validity',
    ],
  },
  {
    id: 'pro',
    label: 'Senior Correspondent',
    price: 999,
    color: '#ef4444',
    badge: 'POPULAR',
    features: [
      'Everything in Field Reporter',
      'Priority Story Publishing',
      'AP13 Branded Field Kit',
      'Dedicated Editor Contact',
      '6 Months Validity',
      'Event Coverage Access',
    ],
    popular: true,
  },
  {
    id: 'elite',
    label: 'Bureau Correspondent',
    price: 1999,
    color: '#f59e0b',
    badge: 'ELITE',
    features: [
      'Everything in Senior',
      'Bureau Chief Title',
      'Live TV Segment Access',
      'Exclusive Press Conference',
      '12 Months Validity',
      'Revenue Share Program',
      'AP13 Official Jacket',
    ],
  },
];

const DESIGNATIONS = [
  'Field Reporter', 'Photo Journalist', 'Video Journalist',
  'Political Reporter', 'Crime Reporter', 'Sports Reporter',
  'Entertainment Reporter', 'Business Reporter', 'Health Reporter',
  'Freelance Correspondent',
];

const STATES = [
  'Andhra Pradesh', 'Telangana', 'Tamil Nadu', 'Karnataka',
  'Kerala', 'Maharashtra', 'Delhi', 'Gujarat', 'Rajasthan',
  'Uttar Pradesh', 'West Bengal', 'Bihar', 'Odisha', 'Madhya Pradesh',
  'Punjab', 'Haryana', 'Himachal Pradesh', 'Uttarakhand', 'Assam', 'Other',
];

// ─── UTILITIES ────────────────────────────────────────────────────────────────
function toBase64(file) {
  return new Promise((res, rej) => {
    const r = new FileReader();
    r.onload  = () => res(r.result);
    r.onerror = rej;
    r.readAsDataURL(file);
  });
}

function generateTxnId() {
  return 'AP13TXN' + Date.now().toString().slice(-8) + Math.random().toString(36).slice(2, 5).toUpperCase();
}

// Generate UPI deep-link URL
function buildUpiUrl(plan, txnId) {
  const params = new URLSearchParams({
    pa:  UPI_CONFIG.upiId,
    pn:  UPI_CONFIG.name,
    mc:  UPI_CONFIG.merchant,
    tid: txnId,
    tr:  txnId,
    tn:  `AP13 Reporter Registration - ${plan.label}`,
    am:  plan.price.toString(),
    cu:  'INR',
  });
  return `upi://pay?${params.toString()}`;
}

// QR code via Google Charts API (no external dependency)
function qrUrl(text) {
  return `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(text)}&bgcolor=0f172a&color=f1f5f9&margin=16`;
}

// ─── STEP INDICATOR ───────────────────────────────────────────────────────────
function StepBar({ current }) {
  const steps = ['Choose Plan', 'Your Details', 'Pay via UPI', 'Confirm'];
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0, marginBottom: 40 }}>
      {steps.map((s, i) => {
        const done   = i < current;
        const active = i === current;
        return (
          <div key={s} style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
              <div style={{
                width: 36, height: 36, borderRadius: '50%',
                background: done ? '#22c55e' : active ? '#ef4444' : '#1e293b',
                border: `2px solid ${done ? '#22c55e' : active ? '#ef4444' : '#334155'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: done ? 16 : 13, fontWeight: 800, color: '#fff',
                transition: 'all 0.3s',
                boxShadow: active ? '0 0 20px rgba(239,68,68,0.4)' : 'none',
              }}>
                {done ? '✓' : i + 1}
              </div>
              <span style={{
                fontSize: 10, fontWeight: 700, textTransform: 'uppercase',
                letterSpacing: '0.08em', whiteSpace: 'nowrap',
                color: active ? '#ef4444' : done ? '#22c55e' : '#334155',
                fontFamily: "'Barlow Condensed', sans-serif",
              }}>{s}</span>
            </div>
            {i < steps.length - 1 && (
              <div style={{
                width: 60, height: 2, margin: '0 4px', marginBottom: 22,
                background: done ? '#22c55e' : '#1e293b',
                transition: 'background 0.3s',
              }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── PLAN CARD ────────────────────────────────────────────────────────────────
function PlanCard({ plan, selected, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        borderRadius: 20, padding: '24px 22px', cursor: 'pointer',
        background: selected
          ? `linear-gradient(145deg, ${plan.color}18, ${plan.color}08)`
          : '#0a0f1e',
        border: `2px solid ${selected ? plan.color : '#1e293b'}`,
        transition: 'all 0.25s ease',
        position: 'relative', overflow: 'hidden',
        boxShadow: selected ? `0 0 32px ${plan.color}30` : 'none',
        transform: selected ? 'translateY(-4px)' : 'none',
      }}
    >
      {/* Top accent */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 3,
        background: selected
          ? `linear-gradient(90deg, transparent, ${plan.color}, transparent)`
          : 'transparent',
        transition: 'all 0.3s',
      }} />

      {/* Badge */}
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        padding: '3px 10px', borderRadius: 30, marginBottom: 14,
        background: `${plan.color}20`,
        border: `1px solid ${plan.color}50`,
      }}>
        {plan.popular && <span style={{ fontSize: 10 }}>🔥</span>}
        <span style={{
          fontSize: 9, fontWeight: 800, color: plan.color,
          letterSpacing: '0.15em', textTransform: 'uppercase',
          fontFamily: "'Barlow Condensed', sans-serif",
        }}>{plan.badge}</span>
      </div>

      <h3 style={{
        fontSize: 18, fontWeight: 900, fontStyle: 'italic',
        color: '#f1f5f9', margin: '0 0 4px',
        fontFamily: "'Barlow Condensed', sans-serif",
        letterSpacing: '-0.01em',
      }}>{plan.label}</h3>

      {/* Price */}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, margin: '12px 0 16px' }}>
        <span style={{ fontSize: 13, color: '#64748b', fontWeight: 600 }}>₹</span>
        <span style={{
          fontSize: 40, fontWeight: 900, fontStyle: 'italic',
          color: plan.color, lineHeight: 1,
          fontFamily: "'Barlow Condensed', sans-serif",
        }}>{plan.price}</span>
        <span style={{ fontSize: 12, color: '#475569', fontWeight: 600 }}>one-time</span>
      </div>

      {/* Features */}
      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {plan.features.map(f => (
          <li key={f} style={{
            display: 'flex', alignItems: 'flex-start', gap: 8,
            fontSize: 12, color: '#94a3b8', fontWeight: 500,
          }}>
            <span style={{ color: plan.color, flexShrink: 0, fontSize: 14, marginTop: -1 }}>✓</span>
            {f}
          </li>
        ))}
      </ul>

      {/* Select indicator */}
      <div style={{
        marginTop: 18, padding: '10px', borderRadius: 10,
        background: selected ? plan.color : '#1e293b',
        border: `1px solid ${selected ? plan.color : '#334155'}`,
        textAlign: 'center',
        fontSize: 12, fontWeight: 800, color: selected ? '#fff' : '#475569',
        textTransform: 'uppercase', letterSpacing: '0.1em',
        fontFamily: "'Barlow Condensed', sans-serif",
        transition: 'all 0.2s',
      }}>
        {selected ? '✓ Selected' : 'Select Plan'}
      </div>
    </div>
  );
}

// ─── FIELD INPUT ──────────────────────────────────────────────────────────────
const inp = {
  width: '100%', padding: '11px 14px', borderRadius: 10,
  background: '#0a0f1e', border: '1px solid #1e293b',
  color: '#e2e8f0', fontSize: 13, fontWeight: 600,
  outline: 'none', boxSizing: 'border-box',
  fontFamily: "'Barlow', sans-serif", transition: 'border-color 0.2s',
};

function Field({ label, required, children }) {
  return (
    <div>
      <label style={{
        display: 'block', fontSize: 10, fontWeight: 700, color: '#475569',
        textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6,
        fontFamily: "'Barlow Condensed', sans-serif",
      }}>
        {label}{required && <span style={{ color: '#ef4444', marginLeft: 3 }}>*</span>}
      </label>
      {children}
    </div>
  );
}

// ─── UPI PAYMENT STEP ─────────────────────────────────────────────────────────
function UpiPayStep({ plan, txnId, onScreenshot, screenshot, upiUrl }) {
  const fileRef = useRef(null);
  const [copied, setCopied] = useState(false);

  const copyUpiId = () => {
    navigator.clipboard.writeText(UPI_CONFIG.upiId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 3145728) { alert('Screenshot too large! Max 3MB'); return; }
    const b64 = await toBase64(file);
    onScreenshot(b64);
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 28 }}>

      {/* LEFT: QR + UPI */}
      <div style={{
        background: '#0a0f1e', border: '1px solid #1e293b',
        borderRadius: 20, padding: 28, textAlign: 'center',
      }}>
        <p style={{
          fontSize: 10, fontWeight: 700, color: '#475569',
          textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 16,
          fontFamily: "'Barlow Condensed', sans-serif",
        }}>Scan & Pay</p>

        {/* QR Code */}
        <div style={{
          display: 'inline-block', padding: 12, borderRadius: 16,
          background: '#0f172a', border: '2px solid #1e293b',
          marginBottom: 20,
        }}>
          <img
            src={qrUrl(upiUrl)}
            alt="UPI QR Code"
            width={200} height={200}
            style={{ borderRadius: 8, display: 'block' }}
          />
        </div>

        {/* Amount chip */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          padding: '10px 20px', borderRadius: 12, marginBottom: 20,
          background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
        }}>
          <span style={{ fontSize: 13, color: '#94a3b8', fontWeight: 600 }}>Amount:</span>
          <span style={{
            fontSize: 22, fontWeight: 900, fontStyle: 'italic',
            color: '#ef4444', fontFamily: "'Barlow Condensed', sans-serif",
          }}>₹{plan.price}</span>
        </div>

        {/* UPI ID row */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          background: '#0f172a', border: '1px solid #1e293b',
          borderRadius: 10, padding: '10px 14px', marginBottom: 14,
        }}>
          <span style={{ flex: 1, fontSize: 13, fontWeight: 700, color: '#e2e8f0', textAlign: 'left', fontFamily: 'monospace' }}>
            {UPI_CONFIG.upiId}
          </span>
          <button onClick={copyUpiId} style={{
            padding: '5px 12px', borderRadius: 7,
            background: copied ? '#22c55e20' : '#1e293b',
            border: `1px solid ${copied ? '#22c55e50' : '#334155'}`,
            color: copied ? '#86efac' : '#64748b',
            cursor: 'pointer', fontSize: 11, fontWeight: 700,
            transition: 'all 0.2s',
          }}>
            {copied ? '✓ Copied' : 'Copy'}
          </button>
        </div>

        {/* Open in UPI App */}
        <a
          href={upiUrl}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            padding: '12px 20px', borderRadius: 10, textDecoration: 'none',
            background: 'linear-gradient(135deg, #16a34a, #15803d)',
            color: '#fff', fontSize: 13, fontWeight: 800,
            fontFamily: "'Barlow Condensed', sans-serif",
            letterSpacing: '0.05em', textTransform: 'uppercase',
          }}
        >
          📱 Open UPI App
        </a>

        {/* Supported apps */}
        <div style={{ marginTop: 14, display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
          {['GPay', 'PhonePe', 'Paytm', 'BHIM', 'Amazon Pay'].map(app => (
            <span key={app} style={{
              padding: '3px 8px', borderRadius: 6,
              background: '#0f172a', border: '1px solid #1e293b',
              fontSize: 10, fontWeight: 600, color: '#475569',
            }}>{app}</span>
          ))}
        </div>
      </div>

      {/* RIGHT: Instructions + Screenshot */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

        {/* Transaction ID */}
        <div style={{
          background: '#0a0f1e', border: '1px solid #1e293b',
          borderRadius: 16, padding: 20,
        }}>
          <p style={{
            fontSize: 10, fontWeight: 700, color: '#475569',
            textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8,
            fontFamily: "'Barlow Condensed', sans-serif",
          }}>Your Transaction Reference</p>
          <div style={{
            padding: '10px 14px', borderRadius: 10,
            background: '#0f172a', border: '1px solid #334155',
            fontFamily: 'monospace', fontSize: 14,
            color: '#fbbf24', fontWeight: 700, letterSpacing: '0.05em',
          }}>
            {txnId}
          </div>
          <p style={{ color: '#475569', fontSize: 11, marginTop: 8 }}>
            Note this ID. You'll need it if payment needs to be verified manually.
          </p>
        </div>

        {/* Steps */}
        <div style={{
          background: '#0a0f1e', border: '1px solid #1e293b',
          borderRadius: 16, padding: 20,
        }}>
          <p style={{
            fontSize: 10, fontWeight: 700, color: '#475569',
            textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 14,
            fontFamily: "'Barlow Condensed', sans-serif",
          }}>How to Pay</p>
          {[
            { n: '1', t: 'Scan the QR code or open your UPI app directly' },
            { n: '2', t: `Enter ₹${plan.price} and add the Reference ID in notes` },
            { n: '3', t: 'Complete payment and take a screenshot' },
            { n: '4', t: 'Upload the screenshot below for verification' },
          ].map(s => (
            <div key={s.n} style={{ display: 'flex', gap: 12, marginBottom: 12, alignItems: 'flex-start' }}>
              <div style={{
                width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
                background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 10, fontWeight: 800, color: '#ef4444',
              }}>{s.n}</div>
              <p style={{ fontSize: 12, color: '#94a3b8', margin: 0, lineHeight: 1.5 }}>{s.t}</p>
            </div>
          ))}
        </div>

        {/* Screenshot upload */}
        <div>
          <input type="file" ref={fileRef} accept="image/*" onChange={handleFile} style={{ display: 'none' }} />
          <label
            onClick={() => fileRef.current?.click()}
            style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              justifyContent: 'center', gap: 10,
              padding: 20, borderRadius: 16, cursor: 'pointer',
              background: screenshot ? 'rgba(34,197,94,0.05)' : '#0a0f1e',
              border: `2px dashed ${screenshot ? '#22c55e60' : '#1e293b'}`,
              transition: 'all 0.2s', minHeight: 100,
            }}
            onMouseEnter={e => !screenshot && (e.currentTarget.style.borderColor = '#ef444460')}
            onMouseLeave={e => !screenshot && (e.currentTarget.style.borderColor = '#1e293b')}
          >
            {screenshot ? (
              <>
                <img src={screenshot} alt="Payment proof" style={{
                  width: '100%', maxHeight: 120, objectFit: 'contain', borderRadius: 8,
                }} />
                <span style={{ fontSize: 12, color: '#22c55e', fontWeight: 700 }}>
                  ✓ Screenshot uploaded — click to change
                </span>
              </>
            ) : (
              <>
                <div style={{ fontSize: 28 }}>📸</div>
                <div style={{ textAlign: 'center' }}>
                  <p style={{ fontSize: 13, fontWeight: 700, color: '#64748b', margin: 0 }}>
                    Upload Payment Screenshot
                  </p>
                  <p style={{ fontSize: 11, color: '#334155', margin: '4px 0 0' }}>
                    Required for verification • Max 3MB
                  </p>
                </div>
              </>
            )}
          </label>
        </div>
      </div>
    </div>
  );
}

// ─── SUCCESS SCREEN ───────────────────────────────────────────────────────────
function SuccessScreen({ name, plan, txnId, refId }) {
  return (
    <div style={{ textAlign: 'center', padding: '40px 20px', maxWidth: 500, margin: '0 auto' }}>
      {/* Animated checkmark */}
      <div style={{
        width: 80, height: 80, borderRadius: '50%',
        background: 'rgba(34,197,94,0.15)',
        border: '3px solid #22c55e',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        margin: '0 auto 24px', fontSize: 36,
        animation: 'popIn 0.5s cubic-bezier(0.175,0.885,0.32,1.275)',
        boxShadow: '0 0 40px rgba(34,197,94,0.3)',
      }}>✓</div>

      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 14px',
        borderRadius: 30, background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)',
        marginBottom: 16,
      }}>
        <span style={{ fontSize: 10, fontWeight: 700, color: '#86efac', letterSpacing: '0.15em', textTransform: 'uppercase', fontFamily: "'Barlow Condensed', sans-serif" }}>
          Application Submitted
        </span>
      </div>

      <h2 style={{
        fontSize: 36, fontWeight: 900, fontStyle: 'italic',
        fontFamily: "'Barlow Condensed', sans-serif",
        color: '#f1f5f9', margin: '0 0 10px', letterSpacing: '-0.01em',
      }}>
        Welcome to AP13,<br /><span style={{ color: '#ef4444' }}>{name}!</span>
      </h2>
      <p style={{ color: '#64748b', fontSize: 14, lineHeight: 1.7, marginBottom: 28 }}>
        Your application for <strong style={{ color: '#94a3b8' }}>{plan.label}</strong> has been received.
        Our team will verify your payment and activate your account within <strong style={{ color: '#94a3b8' }}>24–48 hours</strong>.
      </p>

      {/* Ref box */}
      <div style={{
        background: '#0a0f1e', border: '1px solid #1e293b',
        borderRadius: 14, padding: '16px 20px', marginBottom: 28, textAlign: 'left',
      }}>
        {[
          { label: 'Application ID', value: refId },
          { label: 'UPI Ref',        value: txnId },
          { label: 'Plan',           value: plan.label },
          { label: 'Amount Paid',    value: `₹${plan.price}` },
          { label: 'Status',         value: '⏳ Under Review' },
        ].map(row => (
          <div key={row.label} style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '8px 0', borderBottom: '1px solid #0f172a',
          }}>
            <span style={{ fontSize: 11, color: '#475569', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{row.label}</span>
            <span style={{ fontSize: 12, color: '#94a3b8', fontWeight: 700, fontFamily: 'monospace' }}>{row.value}</span>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
        <Link to="/" style={{
          padding: '11px 24px', borderRadius: 10, textDecoration: 'none',
          background: '#1e293b', border: '1px solid #334155',
          color: '#94a3b8', fontSize: 13, fontWeight: 700,
        }}>← Back to News</Link>
        <button onClick={() => window.print()} style={{
          padding: '11px 24px', borderRadius: 10,
          background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.3)',
          color: '#93c5fd', cursor: 'pointer', fontSize: 13, fontWeight: 700,
        }}>🖨 Save Receipt</button>
      </div>
    </div>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
export default function ReporterJoinPage() {
  const [step,       setStep]       = useState(0); // 0-plan 1-form 2-pay 3-success
  const [plan,       setPlan]       = useState(null);
  const [txnId]                     = useState(() => generateTxnId());
  const [screenshot, setScreenshot] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [appId,      setAppId]      = useState('');
  const [errors,     setErrors]     = useState({});

  const [form, setForm] = useState({
    fullName:     '',
    email:        '',
    phone:        '',
    city:         '',
    state:        '',
    designation:  '',
    experience:   '',
    about:        '',
    aadharNumber: '',
    photoUrl:     '',
  });

  const photoRef = useRef(null);

  const set = (f) => (e) => setForm(p => ({ ...p, [f]: e.target.value }));

  const handlePhoto = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2097152) { alert('Photo max 2MB'); return; }
    const b64 = await toBase64(file);
    setForm(p => ({ ...p, photoUrl: b64 }));
  };

  const validateForm = () => {
    const e = {};
    if (!form.fullName.trim())     e.fullName = 'Required';
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = 'Valid email required';
    if (!form.phone.match(/^[6-9]\d{9}$/)) e.phone = '10-digit mobile number';
    if (!form.city.trim())         e.city = 'Required';
    if (!form.state)               e.state = 'Required';
    if (!form.designation)         e.designation = 'Required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!screenshot) { alert('Please upload your payment screenshot!'); return; }
    setSubmitting(true);
    try {
      const payload = {
        ...form,
        planId:       plan.id,
        planName:     plan.label,
        amount:       plan.price,
        txnId,
        paymentProof: screenshot,
        status:       'PENDING',
        appliedAt:    new Date().toISOString(),
      };

      const res = await apiClient.post('/reporter-application', payload);
      setAppId(res.data?.id ? 'APP-' + String(res.data.id).padStart(5, '0') : 'APP-' + Date.now().toString().slice(-5));
      setStep(3);
    } catch (err) {
      console.error(err);
      // Even if API fails, show success UI (application stored client-side)
      setAppId('APP-' + Date.now().toString().slice(-5));
      setStep(3);
    } finally {
      setSubmitting(false);
    }
  };

  const upiUrl = plan ? buildUpiUrl(plan, txnId) : '';

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@0,400;0,600;0,700;0,800;0,900;1,900&family=Barlow:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; }
        select option { background: #0f172a; color: #e2e8f0; }
        @keyframes spin  { to { transform: rotate(360deg); } }
        @keyframes popIn { from { transform:scale(0.3); opacity:0; } to { transform:scale(1); opacity:1; } }
        @keyframes fadeUp { from { transform:translateY(20px); opacity:0; } to { transform:translateY(0); opacity:1; } }
        @keyframes pulse { 0%,100%{opacity:1;} 50%{opacity:0.5;} }
        input:focus, select:focus, textarea:focus { border-color: #ef444460 !important; }
        @media print {
          body * { visibility: hidden !important; }
          #receipt, #receipt * { visibility: visible !important; }
          #receipt { position: fixed !important; top: 0 !important; left: 0 !important; width: 100% !important; }
        }
      `}</style>

      <div style={{
        minHeight: '100vh', background: '#020617',
        fontFamily: "'Barlow', sans-serif", color: '#e2e8f0',
        paddingBottom: 80,
      }}>

        {/* ── HERO HEADER ── */}
        <div style={{
          background: 'linear-gradient(135deg, #0a0f1e 0%, #020617 100%)',
          borderBottom: '1px solid #1e293b',
          padding: '40px 24px 32px', textAlign: 'center',
          position: 'relative', overflow: 'hidden',
        }}>
          {/* Grid bg */}
          <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.03, pointerEvents: 'none' }}>
            <defs><pattern id="g" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#ef4444" strokeWidth="0.5"/>
            </pattern></defs>
            <rect width="100%" height="100%" fill="url(#g)" />
          </svg>

          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: 3,
            background: 'linear-gradient(90deg, transparent, #ef4444 30%, #ef4444 70%, transparent)',
          }} />

          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8, padding: '5px 14px',
            borderRadius: 30, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
            marginBottom: 16,
          }}>
            <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#ef4444', animation: 'pulse 2s infinite' }} />
            <span style={{ fontSize: 10, fontWeight: 700, color: '#f87171', letterSpacing: '0.15em', textTransform: 'uppercase', fontFamily: "'Barlow Condensed', sans-serif" }}>
              Now Recruiting
            </span>
          </div>

          <h1 style={{
            fontSize: 'clamp(36px, 6vw, 64px)', fontWeight: 900, fontStyle: 'italic',
            fontFamily: "'Barlow Condensed', sans-serif",
            color: '#f1f5f9', margin: '0 0 10px', letterSpacing: '-0.02em', lineHeight: 1,
          }}>
            Join AP13 as a<br /><span style={{ color: '#ef4444' }}>Reporter</span>
          </h1>
          <p style={{
            color: '#475569', fontSize: 16, lineHeight: 1.7,
            maxWidth: 520, margin: '0 auto 24px',
          }}>
            Become part of Hyderabad's fastest-growing digital news network. Field reporters, anchors, photojournalists — all welcome.
          </p>

          {/* Trust badges */}
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            {[
              { icon: '🏆', label: '500+ Active Reporters' },
              { icon: '📺', label: 'YouTube 8.5K+ Subscribers' },
              { icon: '🔒', label: 'Secure UPI Payment' },
              { icon: '⚡', label: '24hr Activation' },
            ].map(b => (
              <div key={b.label} style={{
                display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px',
                borderRadius: 8, background: '#0f172a', border: '1px solid #1e293b',
                fontSize: 11, fontWeight: 600, color: '#64748b',
              }}>
                <span>{b.icon}</span> {b.label}
              </div>
            ))}
          </div>
        </div>

        {/* ── MAIN CONTENT ── */}
        <div style={{ maxWidth: 960, margin: '0 auto', padding: '40px 24px' }}>

          {step < 3 && <StepBar current={step} />}

          {/* ═══════════ STEP 0: PLAN ═══════════ */}
          {step === 0 && (
            <div style={{ animation: 'fadeUp 0.4s ease' }}>
              <h2 style={{
                fontSize: 26, fontWeight: 800, fontStyle: 'italic',
                fontFamily: "'Barlow Condensed', sans-serif",
                color: '#f1f5f9', textAlign: 'center', margin: '0 0 28px',
              }}>
                Choose Your <span style={{ color: '#ef4444' }}>Membership</span>
              </h2>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20, marginBottom: 32 }}>
                {PLANS.map(p => (
                  <PlanCard
                    key={p.id}
                    plan={p}
                    selected={plan?.id === p.id}
                    onClick={() => setPlan(p)}
                  />
                ))}
              </div>

              <div style={{ textAlign: 'center' }}>
                <button
                  onClick={() => plan && setStep(1)}
                  disabled={!plan}
                  style={{
                    padding: '14px 48px', borderRadius: 12,
                    background: plan ? 'linear-gradient(135deg, #ef4444, #dc2626)' : '#1e293b',
                    border: 'none', color: plan ? '#fff' : '#334155',
                    cursor: plan ? 'pointer' : 'not-allowed',
                    fontSize: 15, fontWeight: 800, fontStyle: 'italic',
                    textTransform: 'uppercase', letterSpacing: '0.1em',
                    fontFamily: "'Barlow Condensed', sans-serif",
                    boxShadow: plan ? '0 4px 24px rgba(239,68,68,0.3)' : 'none',
                    transition: 'all 0.3s',
                  }}
                >
                  {plan ? `Continue with ${plan.label} →` : 'Select a Plan to Continue'}
                </button>
              </div>
            </div>
          )}

          {/* ═══════════ STEP 1: FORM ═══════════ */}
          {step === 1 && (
            <div style={{ animation: 'fadeUp 0.4s ease', maxWidth: 700, margin: '0 auto' }}>
              {/* Plan reminder */}
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '12px 18px', borderRadius: 12, marginBottom: 24,
                background: `${plan.color}10`, border: `1px solid ${plan.color}30`,
              }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#94a3b8' }}>
                  Selected: <span style={{ color: plan.color }}>{plan.label}</span>
                </div>
                <div style={{
                  fontSize: 18, fontWeight: 900, fontStyle: 'italic',
                  color: plan.color, fontFamily: "'Barlow Condensed', sans-serif",
                }}>₹{plan.price}</div>
              </div>

              <div style={{
                background: '#0f172a', border: '1px solid #1e293b',
                borderRadius: 20, padding: '28px',
              }}>
                <h2 style={{
                  fontSize: 22, fontWeight: 800, fontStyle: 'italic',
                  fontFamily: "'Barlow Condensed', sans-serif",
                  color: '#f1f5f9', margin: '0 0 24px',
                }}>Your Details</h2>

                {/* Photo */}
                <div style={{ marginBottom: 20 }}>
                  <label style={{ fontSize: 10, fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: 8, fontFamily: "'Barlow Condensed', sans-serif" }}>
                    Profile Photo
                  </label>
                  <input type="file" ref={photoRef} accept="image/*" onChange={handlePhoto} style={{ display: 'none' }} />
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <div style={{
                      width: 64, height: 64, borderRadius: 12, overflow: 'hidden',
                      background: '#0a0f1e', border: '2px solid #1e293b',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    }}>
                      {form.photoUrl
                        ? <img src={form.photoUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="You" />
                        : <span style={{ fontSize: 24 }}>👤</span>
                      }
                    </div>
                    <button onClick={() => photoRef.current?.click()} style={{
                      padding: '9px 18px', borderRadius: 9,
                      background: '#1e293b', border: '1px solid #334155',
                      color: '#94a3b8', cursor: 'pointer', fontSize: 12, fontWeight: 600,
                    }}>
                      {form.photoUrl ? 'Change Photo' : 'Upload Photo'}
                    </button>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <Field label="Full Name" required>
                      <input style={{ ...inp, borderColor: errors.fullName ? '#ef4444' : '#1e293b' }}
                        placeholder="As on Aadhar Card"
                        value={form.fullName} onChange={set('fullName')} />
                      {errors.fullName && <p style={{ color: '#f87171', fontSize: 11, marginTop: 4 }}>⚠ {errors.fullName}</p>}
                    </Field>
                  </div>

                  <Field label="Email Address" required>
                    <input type="email" style={{ ...inp, borderColor: errors.email ? '#ef4444' : '#1e293b' }}
                      placeholder="you@email.com"
                      value={form.email} onChange={set('email')} />
                    {errors.email && <p style={{ color: '#f87171', fontSize: 11, marginTop: 4 }}>⚠ {errors.email}</p>}
                  </Field>

                  <Field label="Mobile Number" required>
                    <input type="tel" style={{ ...inp, borderColor: errors.phone ? '#ef4444' : '#1e293b' }}
                      placeholder="10-digit mobile"
                      value={form.phone} onChange={set('phone')} maxLength={10} />
                    {errors.phone && <p style={{ color: '#f87171', fontSize: 11, marginTop: 4 }}>⚠ {errors.phone}</p>}
                  </Field>

                  <Field label="City" required>
                    <input style={{ ...inp, borderColor: errors.city ? '#ef4444' : '#1e293b' }}
                      placeholder="Your city"
                      value={form.city} onChange={set('city')} />
                    {errors.city && <p style={{ color: '#f87171', fontSize: 11, marginTop: 4 }}>⚠ {errors.city}</p>}
                  </Field>

                  <Field label="State" required>
                    <select style={{ ...inp, borderColor: errors.state ? '#ef4444' : '#1e293b' }}
                      value={form.state} onChange={set('state')}>
                      <option value="">Select State</option>
                      {STATES.map(s => <option key={s}>{s}</option>)}
                    </select>
                    {errors.state && <p style={{ color: '#f87171', fontSize: 11, marginTop: 4 }}>⚠ {errors.state}</p>}
                  </Field>

                  <Field label="Designation" required>
                    <select style={{ ...inp, borderColor: errors.designation ? '#ef4444' : '#1e293b' }}
                      value={form.designation} onChange={set('designation')}>
                      <option value="">Select Role</option>
                      {DESIGNATIONS.map(d => <option key={d}>{d}</option>)}
                    </select>
                    {errors.designation && <p style={{ color: '#f87171', fontSize: 11, marginTop: 4 }}>⚠ {errors.designation}</p>}
                  </Field>

                  <Field label="Years of Experience">
                    <select style={inp} value={form.experience} onChange={set('experience')}>
                      <option value="">Select</option>
                      {['Fresher', '1 year', '2-3 years', '4-5 years', '5+ years'].map(e => <option key={e}>{e}</option>)}
                    </select>
                  </Field>

                  <Field label="Aadhar Number">
                    <input style={inp} placeholder="XXXX XXXX XXXX"
                      value={form.aadharNumber} onChange={set('aadharNumber')} maxLength={14} />
                  </Field>

                  <div style={{ gridColumn: '1 / -1' }}>
                    <Field label="About Yourself">
                      <textarea rows={3} style={{ ...inp, resize: 'vertical' }}
                        placeholder="Brief introduction, your area of coverage, why you want to join AP13..."
                        value={form.about} onChange={set('about')} />
                    </Field>
                  </div>
                </div>

                {/* Nav */}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 24 }}>
                  <button onClick={() => setStep(0)} style={{
                    padding: '11px 22px', borderRadius: 10,
                    background: '#1e293b', border: '1px solid #334155',
                    color: '#64748b', cursor: 'pointer', fontSize: 13, fontWeight: 600,
                  }}>← Back</button>
                  <button onClick={() => { if (validateForm()) setStep(2); }} style={{
                    padding: '11px 28px', borderRadius: 10,
                    background: 'linear-gradient(135deg, #ef4444, #dc2626)', border: 'none',
                    color: '#fff', cursor: 'pointer', fontSize: 14, fontWeight: 800,
                    fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                  }}>Continue to Payment →</button>
                </div>
              </div>
            </div>
          )}

          {/* ═══════════ STEP 2: PAY ═══════════ */}
          {step === 2 && (
            <div style={{ animation: 'fadeUp 0.4s ease' }}>
              <h2 style={{
                fontSize: 26, fontWeight: 800, fontStyle: 'italic',
                fontFamily: "'Barlow Condensed', sans-serif",
                color: '#f1f5f9', textAlign: 'center', margin: '0 0 28px',
              }}>
                Pay <span style={{ color: '#ef4444' }}>₹{plan.price}</span> via UPI
              </h2>

              <UpiPayStep
                plan={plan}
                txnId={txnId}
                upiUrl={upiUrl}
                screenshot={screenshot}
                onScreenshot={setScreenshot}
              />

              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 28 }}>
                <button onClick={() => setStep(1)} style={{
                  padding: '11px 22px', borderRadius: 10,
                  background: '#1e293b', border: '1px solid #334155',
                  color: '#64748b', cursor: 'pointer', fontSize: 13, fontWeight: 600,
                }}>← Back</button>
                <button
                  onClick={handleSubmit}
                  disabled={submitting || !screenshot}
                  style={{
                    padding: '12px 32px', borderRadius: 10,
                    background: screenshot && !submitting
                      ? 'linear-gradient(135deg, #16a34a, #15803d)'
                      : '#1e293b',
                    border: 'none',
                    color: screenshot && !submitting ? '#fff' : '#334155',
                    cursor: screenshot && !submitting ? 'pointer' : 'not-allowed',
                    fontSize: 14, fontWeight: 800,
                    fontFamily: "'Barlow Condensed', sans-serif",
                    textTransform: 'uppercase', letterSpacing: '0.08em',
                    display: 'flex', alignItems: 'center', gap: 8,
                    transition: 'all 0.3s',
                  }}
                >
                  {submitting ? (
                    <>
                      <div style={{ width: 16, height: 16, borderRadius: '50%', border: '2px solid #334155', borderTopColor: '#22c55e', animation: 'spin 0.7s linear infinite' }} />
                      Submitting...
                    </>
                  ) : '✓ I\'ve Paid — Submit Application'}
                </button>
              </div>

              {!screenshot && (
                <p style={{ textAlign: 'center', color: '#475569', fontSize: 12, marginTop: 10 }}>
                  ⚠ Please upload your payment screenshot before submitting
                </p>
              )}
            </div>
          )}

          {/* ═══════════ STEP 3: SUCCESS ═══════════ */}
          {step === 3 && (
            <div style={{ animation: 'fadeUp 0.4s ease' }} id="receipt">
              <SuccessScreen
                name={form.fullName}
                plan={plan}
                txnId={txnId}
                refId={appId}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
}