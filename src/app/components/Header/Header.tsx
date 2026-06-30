// Header.tsx
// Extracted visual header from data.html — logo + nav only, no page routing,
// no language switcher logic, no CMS submenus that don't apply to the dashboard.
// Relies on the same external CSS (Bootstrap + FMIS theme + Hanuman font) being
// loaded in index.html — see the <head> snippet below.

export default function Header() {
  return (
    <header>
      <header className="header sticky-bar stick">
        <div className="container">
          <div className="main-header">
            <div className="header-left">
              <div className="col-md-3 header-logos">
                <a className="d-flex" href="/">
                  <img
                    alt="FMIS Logo"
                    src="https://fmis.gov.kh/storage/logo/new-fmis-site-logo-1.png"
                  />
                </a>
              </div>

              <div className="col-md-9 header-navs">
                <nav className="nav-main-menu d-none d-xl-block">
                  <ul className="main-menu">
                    <li>
                      <a href="https://fmis.gov.kh/en" title="Home">
                        Home
                      </a>
                    </li>
                    <li>
                      <a href="https://fmis.gov.kh/en/news" title="News">
                        News
                      </a>
                    </li>
                    <li>
                      <a href="https://fmis.gov.kh/en/knowledge-hub" title="Knowledge Hub">
                        Knowledge Hub
                      </a>
                    </li>
                    <li className="active">
                      <a
                        href="#"
                        title="Data"
                        style={{ color: "var(--primary-hover-color)", fontWeight: 600 }}
                      >
                        Data
                      </a>
                    </li>
                  </ul>
                </nav>

                <div className="burger-icon burger-icon-white">
                  <span className="burger-icon-top"></span>
                  <span className="burger-icon-mid"></span>
                  <span className="burger-icon-bottom"></span>
                </div>
              </div>

              <div className="header-right">
                <div className="d-none d-xl-inline-block">
                  <div className="d-none d-lg-block box-dropdown-cart me-2">
                    <span className="font-lg icon-list icon-account">
                      <img
                        src="https://fmis.gov.kh/vendor/core/core/base/img/flags/us.svg"
                        className="flag"
                        style={{ height: 16 }}
                        alt="flag"
                      />
                      <span className="color-grey-900 arrow-down ms-1">English</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
    </header>
  );
}
