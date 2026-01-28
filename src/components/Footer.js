export function Footer() {
  return (
    <footer className="bg-white border-t border-brand-border py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-brand-text rounded-md flex items-center justify-center text-white text-xs font-bold">
            PB
          </div>
          <span className="font-semibold text-brand-text">PeerBot</span>
        </div>
        <div className="text-sm text-brand-textLight">
          © 2024 PeerBot Inc. All rights reserved.
        </div>
        <div className="flex gap-6 text-sm text-brand-textLight">
          <a href="#" className="hover:text-brand-primary">
            Privacy
          </a>
          <a href="#" className="hover:text-brand-primary">
            Terms
          </a>
          <a href="#" className="hover:text-brand-primary">
            Contact
          </a>
        </div>
      </div>
    </footer>
  )
}