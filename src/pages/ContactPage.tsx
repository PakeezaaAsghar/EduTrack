import React, { useState } from 'react';
import { useEduTrack } from '../context/EduTrackContext';
import { 
  Mail, MapPin, Phone, Send, CheckCircle, 
  HelpCircle, ArrowRight, Clock, ShieldCheck 
} from 'lucide-react';

export const ContactPage: React.FC = () => {
  const { navigate, addNotification } = useEduTrack();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Full name is required.';
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required.';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please provide a valid email format.';
    }
    if (!formData.subject.trim()) newErrors.subject = 'Subject line is required.';
    if (!formData.message.trim()) {
      newErrors.message = 'Message content cannot be blank.';
    } else if (formData.message.trim().length < 15) {
      newErrors.message = 'Please provide at least 15 characters describing your inquiry.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
      addNotification({
        targetRole: 'admin',
        title: `Inquiry Received: ${formData.subject}`,
        message: `From ${formData.name} (${formData.email})`,
        type: 'info'
      });
    }, 800);
  };

  return (
    <div className="space-y-20 pb-20">
      
      {/* Hero Header */}
      <section className="pt-10 sm:pt-14 text-center max-w-2xl mx-auto px-4 sm:px-6 space-y-4">
        <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
          Academic Administration Support
        </span>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Contact Our Operations Team
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300">
          Have questions about deploying EduTrack for your department or require account assistance? We are here to support your institution.
        </p>
      </section>

      {/* Main Grid: Form + Info Card */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left: Contact Form */}
          <div className="lg:col-span-7 bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            {submitted ? (
              <div className="text-center py-12 space-y-4">
                <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  Message Dispatched Successfully
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto">
                  Thank you, <span className="font-semibold text-slate-900 dark:text-white">{formData.name}</span>. Your inquiry has been routed to our academic registrar support desk. You will receive a response at <span className="font-semibold text-slate-900 dark:text-white">{formData.email}</span>.
                </p>
                <div className="pt-4">
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({ name: '', email: '', subject: '', message: '' });
                    }}
                    className="px-4 py-2 text-xs font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
                  >
                    Send another inquiry
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
                    Send an Official Message
                  </h3>
                  <p className="text-xs text-slate-500">
                    All inquiries are routed to institutional support officers.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Dr. Jordan Hayes"
                      className={`w-full px-3.5 py-2 text-xs rounded-lg border bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 ${
                        errors.name ? 'border-rose-500 focus:ring-rose-400' : 'border-slate-300 dark:border-slate-700 focus:ring-indigo-500'
                      }`}
                    />
                    {errors.name && <p className="text-[11px] text-rose-500 mt-1">{errors.name}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Institutional Email *
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="e.g. j.hayes@edutrack.edu"
                      className={`w-full px-3.5 py-2 text-xs rounded-lg border bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 ${
                        errors.email ? 'border-rose-500 focus:ring-rose-400' : 'border-slate-300 dark:border-slate-700 focus:ring-indigo-500'
                      }`}
                    />
                    {errors.email && <p className="text-[11px] text-rose-500 mt-1">{errors.email}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Subject Line *
                  </label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="e.g. Fall 2026 Timetable Integration Inquiry"
                    className={`w-full px-3.5 py-2 text-xs rounded-lg border bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 ${
                      errors.subject ? 'border-rose-500 focus:ring-rose-400' : 'border-slate-300 dark:border-slate-700 focus:ring-indigo-500'
                    }`}
                  />
                  {errors.subject && <p className="text-[11px] text-rose-500 mt-1">{errors.subject}</p>}
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Message Details *
                  </label>
                  <textarea
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Please provide details regarding your query, department, or technical requirements..."
                    className={`w-full px-3.5 py-2 text-xs rounded-lg border bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 ${
                      errors.message ? 'border-rose-500 focus:ring-rose-400' : 'border-slate-300 dark:border-slate-700 focus:ring-indigo-500'
                    }`}
                  />
                  {errors.message && <p className="text-[11px] text-rose-500 mt-1">{errors.message}</p>}
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full sm:w-auto px-6 py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-xs flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {submitting ? (
                    <span>Submitting Message...</span>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Send Official Message</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Right: Institutional Contact Information */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-slate-900 text-slate-100 p-6 sm:p-8 rounded-2xl border border-slate-800 space-y-6 shadow-md">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400">
                  Headquarters & Registrar
                </span>
                <h3 className="text-xl font-bold text-white mt-1">
                  Academic Affairs Desk
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  University Central Administration Center
                </p>
              </div>

              <div className="space-y-4 text-xs">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-white">Main Academic Campus</p>
                    <p className="text-slate-400">Hall of Sciences, Suite 400 · Innovation Way</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-white">Electronic Dispatch</p>
                    <p className="text-slate-400">registrar@edutrack.edu</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-white">Office Hours</p>
                    <p className="text-slate-400">Monday – Friday: 08:30 – 17:00 EST</p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 text-xs text-slate-400 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>FERPA Compliant · Authorized Registrar Protocols</span>
              </div>
            </div>

            {/* Quick FAQ Link Card */}
            <div className="p-5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-2">
              <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
                <HelpCircle className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">Quick Answers</span>
              </div>
              <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                Looking for immediate answers?
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Check our detailed FAQ section for guidance on attendance algorithms, grade calculation, and account access.
              </p>
              <button
                onClick={() => navigate('/faq')}
                className="pt-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
              >
                <span>Browse FAQ Knowledge Base</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
};
