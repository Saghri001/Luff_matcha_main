import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, MapPin, Phone, MessageSquare, Send, CheckCircle2 } from 'lucide-react';
import { STORE_INFO } from '../../data/matchaData';

interface ContactSectionProps {
  onNotify: (msg: string) => void;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ onNotify }) => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: 'Order Inquiry', message: '' });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    onNotify('Thank you! Your message has been sent to hello@luffmatcha.com');
    setTimeout(() => {
      setSent(false);
      setFormData({ name: '', email: '', subject: 'Order Inquiry', message: '' });
    }, 3000);
  };

  return (
    <section id="contact" className="py-24 bg-[#15191E] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-12">
        
        <div className="text-center flex flex-col items-center gap-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/60 text-[#4A7C59] border border-[#4A7C59]/40 text-xs font-mono font-bold uppercase tracking-wider">
            <MessageSquare className="w-4 h-4 text-[#4A7C59]" />
            <span>GET IN TOUCH</span>
          </div>
          <h2 className="font-display font-black text-3xl sm:text-5xl text-white tracking-tight">
            Connect with LUFF Studio
          </h2>
          <p className="text-sm text-gray-400 max-w-lg leading-relaxed">
            Have a question about your order, wholesale inquiries, or café listening bar reservations? We’d love to hear from you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Contact Info Cards */}
          <div className="flex flex-col gap-4">
            <div className="p-6 rounded-3xl bg-white/5 border border-white/10 flex items-start gap-4">
              <div className="p-3 rounded-2xl bg-[#E53935] text-white">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-display font-black text-lg text-white">Flagship Café & Studio</h4>
                <p className="text-xs text-gray-300 mt-1">{STORE_INFO.address}, {STORE_INFO.cityStateZip}</p>
                <span className="text-[10px] font-mono text-[#4A7C59] block mt-1">{STORE_INFO.crossStreets}</span>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-white/5 border border-white/10 flex items-start gap-4">
              <div className="p-3 rounded-2xl bg-[#4A7C59] text-white">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-display font-black text-lg text-white">Direct Email Concierge</h4>
                <p className="text-xs text-gray-300 mt-1">{STORE_INFO.email}</p>
                <span className="text-[10px] font-mono text-gray-400 block mt-1">Average response time: &lt; 2 hours</span>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-white/5 border border-white/10 flex items-start gap-4">
              <div className="p-3 rounded-2xl bg-[#F4EFE6] text-[#15191E]">
                <Phone className="w-6 h-6 text-[#E53935]" />
              </div>
              <div>
                <h4 className="font-display font-black text-lg text-white">Café Desk Phone</h4>
                <p className="text-xs text-gray-300 mt-1">{STORE_INFO.phone}</p>
                <span className="text-[10px] font-mono text-gray-400 block mt-1">Mon - Sun: 7:30 AM - 7:00 PM EST</span>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-8 rounded-3xl bg-white/5 border border-white/10 flex flex-col gap-4">
            <h3 className="font-display font-black text-xl text-white">Send Us a Message</h3>

            <input
              type="text"
              placeholder="Your Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="bg-black/60 p-3.5 rounded-2xl border border-white/20 text-xs text-white"
              required
            />

            <input
              type="email"
              placeholder="Your Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="bg-black/60 p-3.5 rounded-2xl border border-white/20 text-xs text-white"
              required
            />

            <select
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              className="bg-black/60 p-3.5 rounded-2xl border border-white/20 text-xs text-white font-mono"
            >
              <option value="Order Inquiry">Order Inquiry</option>
              <option value="Wholesale Tea Supply">Wholesale Tea Supply</option>
              <option value="Café & Vinyl Bar Booking">Café & Vinyl Bar Booking</option>
              <option value="Press & Media">Press & Media</option>
            </select>

            <textarea
              placeholder="How can we help you?"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="bg-black/60 p-3.5 rounded-2xl border border-white/20 text-xs text-white h-32"
              required
            />

            <button
              type="submit"
              className="py-4 rounded-full bg-[#E53935] hover:bg-[#C62828] text-white font-black text-xs uppercase tracking-wider shadow-2xl flex items-center justify-center gap-2 border border-white/20 transition-transform active:scale-95"
            >
              {sent ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-white" />
                  <span>Message Dispatched!</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Submit Inquiry</span>
                </>
              )}
            </button>
          </form>
        </div>

      </div>
    </section>
  );
};
