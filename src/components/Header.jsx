export function Header() {
  return (
    <header className="header">
      <div className="logo">
        <h3>
          <img src="assets/imgs/logo.png" alt="logo" />
        </h3>
      </div>
      <div className="options">
        <Option title={'Work'} />
        <Option title={'About'} />
        <Option title={"Let's talk"} />
      </div>
    </header>
  );
}

function Option({ title }) {
  return (
    <div className="option">
      <h3>{title}</h3>
    </div>
  );
}
