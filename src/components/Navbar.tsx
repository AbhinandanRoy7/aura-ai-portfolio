import { useState } from "react";
import { Github, Linkedin, Mail } from "lucide-react";
import {
  Navbar as ResizableNavbar,
  NavBody,
  NavItems,
  MobileNav,
  NavbarLogo,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from "@/components/ui/resizable-navbar";

export const Navbar = () => {
  const navItems = [
    { name: "About", link: "#about" },
    { name: "Projects", link: "#projects" },
    { name: "Contact", link: "#contact" },
  ];

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const socials = (
    <div className="flex items-center gap-3 relative z-20">
      <a href="https://github.com" target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
        <Github className="w-4 h-4" />
      </a>
      <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
        <Linkedin className="w-4 h-4" />
      </a>
      <a href="mailto:abhinandancr7@gmail.com" className="text-muted-foreground hover:text-primary transition-colors">
        <Mail className="w-4 h-4" />
      </a>
    </div>
  );

  return (
    <ResizableNavbar>
      {/* Desktop */}
      <NavBody>
        <NavbarLogo />
        <NavItems items={navItems} />
        {socials}
      </NavBody>

      {/* Mobile */}
      <MobileNav>
        <MobileNavHeader>
          <NavbarLogo />
          <MobileNavToggle
            isOpen={isMobileMenuOpen}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          />
        </MobileNavHeader>

        <MobileNavMenu
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
        >
          {navItems.map((item, idx) => (
            <a
              key={`mobile-link-${idx}`}
              href={item.link}
              onClick={() => setIsMobileMenuOpen(false)}
              className="relative text-muted-foreground hover:text-primary transition-colors font-mono text-sm uppercase tracking-widest"
            >
              {item.name}
            </a>
          ))}
          <div className="pt-4 border-t border-border w-full">{socials}</div>
        </MobileNavMenu>
      </MobileNav>
    </ResizableNavbar>
  );
};
