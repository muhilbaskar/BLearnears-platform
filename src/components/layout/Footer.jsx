import { Link, useLocation } from "react-router-dom";

import Logo from "../../assets/footer/logo.svg";
import LinkedInIcon from "../../assets/footer/linkedin.svg";
import XIcon from "../../assets/footer/x.svg";
import FacebookIcon from "../../assets/footer/facebook.svg";
import InstagramIcon from "../../assets/footer/instagram.svg";
import MailIcon from "../../assets/footer/mail.svg";

const SOCIALS = [
  { label: "LinkedIn", href: "https://www.linkedin.com/company/blended-pedagogy-pvt-ltd-2024/posts/?feedView=all", icon: LinkedInIcon, size: 22 },
  { label: "X (Twitter)", href: "https://x.com/BlendedPedagogy", icon: XIcon, size: 18 },
  { label: "Facebook", href: "https://www.facebook.com/profile.php?id=61576480381366", icon: FacebookIcon, size: 22 },
  { label: "Instagram", href: "https://www.instagram.com/blendedpedagogy/", icon: InstagramIcon, size: 22 },
];

const QUICK_LINKS = [
  { name: "Features of BLearners", href: "#features" },
  { name: "BLearners Tab", href: "#onetab" },
  { name: "Benefits", href: "#benefits" },
  { name: "Register", href: "#register" },
];

// Same helper as Navbar: navigate to { pathname: "/", hash } so HashRouter builds
// the correct in-page anchor URL on both "/" and any other route.
const useAnchor = () => {
  const { pathname } = useLocation();
  return (hash) => ({ pathname: "/", hash, ...(pathname === "/" ? {} : {}) });
};

const scrollToTop = (e) => {
  e.preventDefault();
  window.scrollTo({ top: 0, behavior: "smooth" });
};

export default function Footer() {
  const anchor = useAnchor();

  return (
    <footer
      className="cv-auto text-white pt-[50px] md:pt-[70px] pb-6 overflow-hidden"
      style={{ background: "radial-gradient(49.04% 217.05% at 50% 50%, #130A40 0%, #1E1160 100%)" }}
    >
      <div className="max-w-[1750px] mx-auto px-6 sm:px-8 lg:px-12">
        <div className="grid grid-cols-2 md:grid-cols-12 gap-x-4 gap-y-8 md:gap-8 mb-10 md:mb-24">
          {/* Logo */}
          <div className="col-span-1 md:col-span-4 lg:col-span-3 flex flex-col items-start">
            <button type="button" onClick={scrollToTop} aria-label="Scroll to top" className="focus:outline-none">
              <img
                src={Logo}
                alt="BLearners Logo"
                loading="lazy"
                decoding="async"
                width="180"
                height="180"
                className="h-[90px] sm:h-[120px] md:h-[180px] w-auto object-contain mt-2 cursor-pointer"
              />
            </button>
          </div>

          {/* Social + newsletter */}
          <div className="contents md:flex md:flex-col md:col-span-8 lg:col-span-4 md:pt-2 lg:pl-2">
            <div className="col-span-1 self-center md:self-auto">
              <h4 className="text-[18px] sm:text-[22px] font-semibold mb-4 text-white">Follow Us</h4>
              <div className="flex gap-3 sm:gap-4 items-center mb-0 md:mb-8">
                {SOCIALS.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:opacity-80 transition-opacity p-1"
                    aria-label={s.label}
                  >
                    <img src={s.icon} alt="" width={s.size} height={s.size} loading="lazy" decoding="async" style={{ width: s.size, height: s.size }} />
                  </a>
                ))}
              </div>
            </div>
 {/* news letter subscription form is commented out for now, can be enabled in future if needed */}
            {/* <div className="col-span-2 md:col-span-1">
              <h4 className="text-[18px] font-medium mb-3 text-white">Subscribe Newsletter</h4>
              <form className="flex items-center w-full sm:max-w-[340px]" onSubmit={(e) => e.preventDefault()}>
                <label htmlFor="newsletter-email" className="sr-only">Email address</label>
                <input
                  id="newsletter-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="Enter email"
                  className="bg-white text-gray-900 px-4 py-[10px] w-full focus:outline-none text-[15px] h-[44px]"
                />
                <button
                  type="submit"
                  className="text-white px-6 py-[10px] text-[15px] font-medium transition-opacity hover:opacity-90 flex items-center justify-center h-[44px]"
                  style={{ background: "linear-gradient(128.51deg, #CB02FF 18.44%, #4A54ED 83.76%)" }}
                >
                  Send
                </button>
              </form>
            </div> */}
          </div>

          {/* Quick links */}
          <div className="col-span-2 sm:col-span-1 md:col-span-6 lg:col-span-3 pt-0 sm:pt-2 lg:pl-10">
            <h4 className="text-[18px] sm:text-[22px] font-semibold mb-4 sm:mb-5 text-white">Quick Links</h4>
            <ul className="space-y-3 sm:space-y-4 text-[15px] sm:text-[16px] text-white/95">
              {QUICK_LINKS.map((l) => (
                <li key={l.href}>
                  <Link to={anchor(l.href)} className="hover:text-purple-300 transition-colors">{l.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="col-span-2 sm:col-span-1 md:col-span-6 lg:col-span-2 pt-0 sm:pt-2">
            <h4 className="text-[18px] sm:text-[22px] font-semibold mb-4 sm:mb-5 text-white">Contact</h4>
            <p className="text-[15px] sm:text-[16px] text-white/95 flex items-center gap-2.5">
              <img src={MailIcon} alt="" width="20" height="20" loading="lazy" decoding="async" className="w-[20px] h-[20px] object-contain" />
              <a href="mailto:contact@blearners.com" className="hover:text-purple-300 transition-colors break-all sm:break-normal">
                contact@blearners.com
              </a>
            </p>
          </div>
        </div>

        <div className="pt-6 border-t border-white/20 flex flex-col md:flex-row justify-between items-center gap-4 text-[12px] sm:text-[13px] text-center md:text-left text-white/90">
          <p>© 2026 Blended Pedagogy Pvt. Ltd. All rights reserved.</p>
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-2">
            <Link
              to="/privacy-policy"
              className="hover:text-white transition-colors underline underline-offset-4 decoration-white/70"
            >
              Privacy & Policy
            </Link>
            <Link
              to="/terms-conditions"
              className="hover:text-white transition-colors underline underline-offset-4 decoration-white/70"
            >
              Terms & Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}