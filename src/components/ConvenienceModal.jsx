import React, { useState } from 'react';
import { X, Phone, Copy, Check, MapPin, CreditCard, Calendar, AlertCircle, ShieldAlert } from 'lucide-react';
import { HOLIDAY_NOTICES, GENERAL_INFO } from '../data/shuttleData';

export default function ConvenienceModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('stops');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopyPhone = () => {
    navigator.clipboard.writeText(GENERAL_INFO.contact);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="conv-modal-sheet" onClick={(e) => e.stopPropagation()}>
        <div className="modal-sheet-header">
          <div className="modal-sheet-title">
            <AlertCircle size={20} color="var(--primary)" />
            <span>셔틀 이용 안내 & 민원</span>
          </div>
          <button type="button" className="modal-close-icon" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* 2x2 Segmented Grid Tabs */}
        <div className="conv-tabs-2x2">
          {[
            { id: 'stops', label: '승강장 위치', icon: MapPin },
            { id: 'holidays', label: '공휴일 안내', icon: Calendar },
            { id: 'fare', label: '요금 & 수칙', icon: CreditCard },
            { id: 'contact', label: '분실물 센터', icon: Phone }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                className={`conv-tab-btn-clean ${isActive ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <Icon size={15} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content Panes */}
        <div className="modal-body-content">
          {activeTab === 'stops' && (
            <div className="tab-pane">
              <div className="sheet-section-title"><MapPin size={14} /> 캠퍼스 탑승 위치 안내</div>
              <div className="info-card-box">
                <div style={{ fontWeight: 800, marginBottom: 4 }}>
                  🏫 공대 셔틀장 탑승
                </div>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-sub)' }}>
                  위 학생회관 탑승 가능 시간대를 제외한 모든 시간대
                </p>
              </div>

              <div className="info-card-box" style={{ borderLeft: '3px solid #3b82f6' }}>
                <div style={{ fontWeight: 800, marginBottom: 4, color: 'var(--text-main)' }}>
                  🏛️ 학생회관 승강장 탑승 가능 시간대
                </div>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-sub)' }}>
                  학기 중 평일 <strong>13:30 ~ 15:30</strong> 및 <strong>19:30 ~ 막차까지</strong>
                </p>
              </div>
            </div>
          )}

          {activeTab === 'holidays' && (
            <div className="tab-pane">
              <div className="sheet-section-title"><Calendar size={14} /> 2026-2학기 휴무 안내</div>
              {HOLIDAY_NOTICES.map((item, idx) => (
                <div key={idx} className="holiday-item-row">
                  <div>
                    <strong style={{ display: 'block', fontSize: '0.86rem' }}>{item.title}</strong>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{item.note}</span>
                  </div>
                  <span className="holiday-date-tag">{item.date}</span>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'fare' && (
            <div className="tab-pane">
              <div className="sheet-section-title"><CreditCard size={14} /> 결제 및 탑승 안내</div>
              <div className="info-card-box" style={{ borderLeft: '3px solid #3b82f6' }}>
                <div style={{ fontWeight: 800, marginBottom: 4, color: 'var(--text-main)' }}>💳 교통카드 전용</div>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-sub)' }}>{GENERAL_INFO.payment}</p>
                <div style={{ marginTop: 6, fontSize: '0.75rem', color: 'var(--accent-red)', fontWeight: 800, display: 'flex', alignItems: 'center', gap: 4 }}>
                  <ShieldAlert size={12} /> 현금 결제 불가 (카드 전용)
                </div>
              </div>

              <div className="info-card-box">
                <div style={{ fontWeight: 800, marginBottom: 6 }}>안전 탑승 수칙</div>
                <ul style={{ paddingLeft: 16, fontSize: '0.8rem', color: 'var(--text-sub)', display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {GENERAL_INFO.safetyRules.map((rule, idx) => (
                    <li key={idx}>{rule}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'contact' && (
            <div className="tab-pane">
              <div className="sheet-section-title"><Phone size={14} /> 분실물 및 민원 신고</div>
              <div className="info-card-box">
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>셔틀버스 민원/분실물 센터</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--primary)', margin: '4px 0 10px 0', fontFamily: 'monospace' }}>
                  {GENERAL_INFO.contact}
                </div>

                <a href={`tel:${GENERAL_INFO.contact}`} className="call-big-btn">
                  <Phone size={16} /> 전화 바로 걸기
                </a>

                <button type="button" className="copy-big-btn" onClick={handleCopyPhone}>
                  {copied ? <Check size={15} color="#10b981" /> : <Copy size={15} />}
                  <span>{copied ? '번호 복사 완료!' : '전화번호 복사'}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
