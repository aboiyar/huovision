"use client";

import React, { useState } from "react";
import { Send, CheckCircle2, Shield, Clock, Building, Mail, User } from "lucide-react";

export default function ConsultationForm() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    company: "",
    pillar: "01 Retail Strategy",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.firstName || !formData.email || !formData.message) return;
    setLoading(true);
    // Simulate consultation submission
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 800);
  };

  if (submitted) {
    return (
      <div className="hv-consult-success">
        <CheckCircle2 size={48} className="hv-success-icon" />
        <h3 className="hv-success-title">Consultation Request Dispatched</h3>
        <p className="hv-success-desc">
          Thank you, <strong>{formData.firstName}</strong>. Your advisory inquiry regarding <strong>{formData.pillar}</strong> has been routed to our senior strategic partners at <strong>hello@huonvision.com</strong>.
        </p>
        <p className="hv-success-sub">A dedicated strategic consultant will review your specifications and contact you within 24 business hours.</p>
        <button
          onClick={() => {
            setSubmitted(false);
            setFormData({
              firstName: "",
              lastName: "",
              email: "",
              company: "",
              pillar: "01 Retail Strategy",
              message: "",
            });
          }}
          className="hv-btn-outline"
          style={{ marginTop: "20px" }}
        >
          Submit Another Request
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="hv-consult-form">
      <div className="hv-form-row">
        <div className="hv-form-group">
          <label className="hv-label">First Name *</label>
          <div className="hv-input-wrap">
            <User size={16} className="hv-input-icon" />
            <input
              type="text"
              required
              placeholder="e.g. Alex"
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              className="hv-input"
            />
          </div>
        </div>

        <div className="hv-form-group">
          <label className="hv-label">Last Name *</label>
          <div className="hv-input-wrap">
            <User size={16} className="hv-input-icon" />
            <input
              type="text"
              required
              placeholder="e.g. Morgan"
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              className="hv-input"
            />
          </div>
        </div>
      </div>

      <div className="hv-form-row">
        <div className="hv-form-group">
          <label className="hv-label">Corporate Email Address *</label>
          <div className="hv-input-wrap">
            <Mail size={16} className="hv-input-icon" />
            <input
              type="email"
              required
              placeholder="alex.morgan@enterprise.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="hv-input"
            />
          </div>
        </div>

        <div className="hv-form-group">
          <label className="hv-label">Company / Organization *</label>
          <div className="hv-input-wrap">
            <Building size={16} className="hv-input-icon" />
            <input
              type="text"
              required
              placeholder="Global Logistics Corp"
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              className="hv-input"
            />
          </div>
        </div>
      </div>

      <div className="hv-form-group">
        <label className="hv-label">Strategic Focus / Capability Pillar</label>
        <select
          value={formData.pillar}
          onChange={(e) => setFormData({ ...formData, pillar: e.target.value })}
          className="hv-select"
        >
          <option value="01 Retail Strategy">01 Retail Strategy — Supply Chain & Inventory Optimization</option>
          <option value="02 Manufacturing">02 Manufacturing — Advanced Engineering & Operational Excellence</option>
          <option value="03 Utilities">03 Utilities — Critical Infrastructure & Sustainable Operations</option>
          <option value="04 Office Staffing">04 Office Staffing — Strategic Talent & Workforce Planning</option>
          <option value="05 Sustainability">05 Sustainability — ESG Compliance & Green Transformation</option>
          <option value="06 AI Innovation">06 AI Innovation — Automated Decisions & Enterprise AI</option>
          <option value="Comprehensive Enterprise Transformation">Full Enterprise Cross-Pillar Transformation</option>
        </select>
      </div>

      <div className="hv-form-group">
        <label className="hv-label">Project Objectives & Requirements *</label>
        <textarea
          rows={4}
          required
          placeholder="Summarize your current operational friction points, timeline, and strategic goals..."
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          className="hv-textarea"
        />
      </div>

      <div className="hv-form-footer">
        <div className="hv-form-trust">
          <Shield size={16} className="hv-trust-icon" />
          <span>Strict Non-Disclosure & Enterprise Confidentiality Guaranteed</span>
        </div>

        <button type="submit" disabled={loading} className="hv-btn-primary">
          {loading ? (
            <span className="hv-btn-loading">
              <Clock size={16} className="spin" /> Processing Inquiry...
            </span>
          ) : (
            <span className="hv-btn-content">
              Send Message <Send size={16} />
            </span>
          )}
        </button>
      </div>
    </form>
  );
}
