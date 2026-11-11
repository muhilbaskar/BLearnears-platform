import React, { useState } from "react";
import { m } from "framer-motion";
import { ArrowRight, Loader2 } from "lucide-react";
import SectionHeading from "../ui/SectionHeading";
import { registerInterest } from "../../lib/api";

const GRADIENT = "linear-gradient(128.51deg, #CB02FF 18.44%, #C402FF 33.03%, #4A54ED 83.76%)";
const INPUT_CLS =
  "w-full border border-[#E2E4EF] rounded-xl px-4 py-3 text-[14px] text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#8B3DFF]/50 focus:border-[#8B3DFF] transition-shadow bg-white";

const bannerStyle = {
  background: GRADIENT,
  boxShadow: "0px 24px 48px -16px #5234BC47, 0px 2px 4px 0px #100E390D",
};
const formStyle = {
  maxWidth: "999px",
  minHeight: "371.6px",
  borderRadius: "32px",
  border: "1px solid #E2E4EF",
  padding: "clamp(20px, 5vw, 31.8px)",
};
const submitStyle = {
  height: "48px",
  gap: "8.01px",
  borderRadius: "26843500px",
  background: GRADIENT,
  paddingTop: "13.6px",
  paddingBottom: "14.4px",
  paddingLeft: "24px",
  paddingRight: "24px",
};

const badge = (
  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-gray-200 shadow-[0_2px_10px_rgba(0,0,0,0.04)] mb-4">
    <div className="w-2 h-2 rounded-full bg-gradient-to-tr from-[#D500FF] to-[#8D00FF]" />
    <span
      className="font-['Manrope'] font-semibold text-[12px] leading-[16px] tracking-[0.6px] text-center align-middle uppercase bg-clip-text text-transparent"
      style={{
        backgroundImage:
          "linear-gradient(87.24deg, #8D00FF 1.33%, #D500FF 33.15%, #EF00FF 42.68%, #E132F7 56.89%, #D002FF 74.17%, #CF02FF 97.01%)",
      }}
    >
      Register
    </span>
  </div>
);

const title = (
  <span className="font-['Sora'] font-semibold text-[30px] sm:text-[42px] md:text-[48px] leading-[1.1] tracking-[-0.96px] text-center text-[#0B0F2B] block mt-2">
    Register Your Interest in Our <br /> Product
  </span>
);

function Field({ id, label, required, error, ...props }) {
  return (
    <div>
      <label htmlFor={id} className="block text-[13px] font-medium text-[#1A233A] mb-1.5">
        {label}
        {required && " *"}
      </label>
      <input
        id={id}
        name={id}
        required={required}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        className={INPUT_CLS}
        {...props}
      />
      {error && (
        <p id={`${id}-error`} className="mt-1 text-[12px] text-red-500">
          {error}
        </p>
      )}
    </div>
  );
}

const INITIAL_FORM = {
  fullName: "",
  phone: "",
  email: "",
  institution: "",
  role: "Administrator",
  place: "",
};

export default function RegisterSection() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle");
  const [serverMsg, setServerMsg] = useState("");

  const update = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    setErrors((prev) => (prev[key] ? { ...prev, [key]: undefined } : prev));
  };

  const validate = () => {
    const e = {};
    if (!form.fullName.trim() || form.fullName.trim().length < 2) {
      e.fullName = "Please enter your full name";
    }
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      e.email = "Enter a valid email";
    }
    if (!form.phone.trim()) {
      e.phone = "Phone is required";
    } else if (!/^[0-9+\-\s()]{7,20}$/.test(form.phone)) {
      e.phone = "Enter a valid phone number";
    }
    if (!form.place.trim()) {
      e.place = "Place is required";
    }
    if (!["Administrator", "Teacher", "Student", "Parent"].includes(form.role)) {
      e.role = "Select a valid role";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerMsg("");
    if (!validate()) return;

    setStatus("loading");
    try {
      await registerInterest({
        fullName: form.fullName.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        institution: form.institution.trim(),
        role: form.role,
        place: form.place.trim(),
      });
      setStatus("success");
      setServerMsg("Registration received! Please check your email.");
      setForm(INITIAL_FORM);
    } catch (err) {
      setStatus("error");
      setServerMsg(err.message || "Something went wrong. Please try again.");
    }
  };

  const isLoading = status === "loading";

  return (
    <section id="register" className="cv-auto py-16 md:py-24 bg-white overflow-hidden">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <m.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative w-full max-w-[1575px] min-h-[412px] mx-auto rounded-[32px] py-12 sm:py-[80px] px-5 sm:px-10 lg:px-[64px] flex flex-col justify-center items-center text-center text-white mb-16 md:mb-28 overflow-hidden"
          style={bannerStyle}
        >
          <div className="absolute bottom-[-10%] left-[-5%] w-[300px] h-[300px] bg-white/10 rounded-full pointer-events-none" />
          <div className="absolute top-[-20%] right-[-5%] w-[350px] h-[350px] bg-white/10 rounded-full pointer-events-none" />

          <h2 className="text-3xl md:text-[42px] md:leading-[1.2] font-bold mb-5 relative z-10 max-w-4xl mx-auto tracking-tight">
            Be Prepared to become a part of BLearners for collaborative and global learning experience
          </h2>
          <p className="text-white/90 mb-10 max-w-[680px] mx-auto relative z-10 text-[15px] leading-[1.6]">
            Discover how BLearners brings curriculum, teachers, students, parents and technology together in one ecosystem.
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-[20px] relative z-10 w-full">
            <a
              href="#register-form"
              className="bg-white text-slate-900 text-[15px] font-bold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 shadow-lg px-8 py-3.5 rounded-full"
            >
              Register Your Interest <ArrowRight size={18} strokeWidth={2.5} aria-hidden="true" />
            </a>
            <a
              href="#bee"
              className="bg-transparent border border-white/30 text-white text-[15px] font-medium hover:bg-white/10 transition-colors flex items-center justify-center px-8 py-3.5 rounded-full"
            >
              Learn More About BEE
            </a>
          </div>
        </m.div>

        <div className="w-full flex justify-center">
          <div className="w-full max-w-[999px] mx-auto">
            <div className="flex flex-col items-center justify-center w-full mb-8">
              <SectionHeading badge={badge} title={title} />
            </div>

            <form
              id="register-form"
              onSubmit={handleSubmit}
              noValidate
              className="bg-white mx-auto text-left grid sm:grid-cols-2 gap-x-6 gap-y-5 mt-10 scroll-mt-8"
              style={formStyle}
            >
              <Field
                id="fullName"
                label="Full Name"
                required
                type="text"
                placeholder="Your full name"
                autoComplete="name"
                value={form.fullName}
                onChange={update("fullName")}
                error={errors.fullName}
              />
              <Field
                id="phone"
                label="Phone"
                required
                type="tel"
                inputMode="tel"
                placeholder="Your phone number"
                autoComplete="tel"
                value={form.phone}
                onChange={update("phone")}
                error={errors.phone}
              />
              <Field
                id="email"
                label="Email"
                required
                type="email"
                inputMode="email"
                placeholder="you@example.com"
                autoComplete="email"
                value={form.email}
                onChange={update("email")}
                error={errors.email}
              />
              <Field
                id="institution"
                label="Institution / School"
                type="text"
                placeholder="Institution / School"
                autoComplete="organization"
                value={form.institution}
                onChange={update("institution")}
                error={errors.institution}
              />

              <div>
                <label htmlFor="role" className="block text-[13px] font-medium text-[#1A233A] mb-1.5">
                  I am a *
                </label>
                <div className="relative">
                  <select
                    id="role"
                    name="role"
                    required
                    value={form.role}
                    onChange={update("role")}
                    aria-invalid={!!errors.role}
                    aria-describedby={errors.role ? "role-error" : undefined}
                    className={`${INPUT_CLS} appearance-none`}
                  >
                    <option>Administrator</option>
                    <option>Teacher</option>
                    <option>Student</option>
                    <option>Parent</option>
                  </select>
                  <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                    <svg className="w-4 h-4 text-[#1A233A]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
                {errors.role && (
                  <p id="role-error" className="mt-1 text-[12px] text-red-500">
                    {errors.role}
                  </p>
                )}
              </div>

              <Field
                id="place"
                label="Place"
                required
                type="text"
                placeholder="Your place of work or study"
                autoComplete="address-level2"
                value={form.place}
                onChange={update("place")}
                error={errors.place}
              />

              <div className="sm:col-span-2 mt-1">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full text-white text-[15px] font-semibold hover:opacity-90 hover:shadow-lg transition-[opacity,box-shadow] flex items-center justify-center disabled:opacity-60 disabled:cursor-not-allowed"
                  style={submitStyle}
                >
                  {isLoading ? (
                    <>
                      <Loader2 size={18} className="animate-spin" aria-hidden="true" />
                      Submitting…
                    </>
                  ) : (
                    <>
                      Register My Interest
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: "2px" }} aria-hidden="true">
                        <line x1="22" y1="2" x2="11" y2="13" />
                        <polygon points="22 2 15 22 11 13 2 9 22 2" />
                      </svg>
                    </>
                  )}
                </button>

                {status === "success" && (
                  <p role="status" className="mt-3 text-sm text-green-600 text-center">
                    {serverMsg}
                  </p>
                )}
                {status === "error" && (
                  <p role="alert" className="mt-3 text-sm text-red-600 text-center">
                    {serverMsg}
                  </p>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}