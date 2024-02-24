export function Header({ currentSection, OnOptionChanged, onChangingSection }) {
  return (
    <header className="header" style={{ pointerEvents: onChangingSection ? 'none' : 'auto' }}>
      <div className="logo">
        <h3>
          <img src="assets/imgs/logo.png" alt="logo" />
        </h3>
      </div>
      <div className="options">
        <Option
          title={'Home'}
          selected={currentSection}
          OnOptionChanged={OnOptionChanged}
          option={0}
        />
        <Option
          title={'Work'}
          selected={currentSection}
          OnOptionChanged={OnOptionChanged}
          option={1}
        />
        <Option
          title={'About'}
          selected={currentSection}
          OnOptionChanged={OnOptionChanged}
          option={2}
        />
        <Option
          title={"Let's talk"}
          selected={currentSection}
          OnOptionChanged={OnOptionChanged}
          option={3}
        />
      </div>
    </header>
  );
}

function Option({ title, selected, OnOptionChanged, option }) {
  return (
    <div
      onClick={() => {
        OnOptionChanged(option);
      }}
      className={`option ${selected === option && 'option-selected'}`}
    >
      <h3>{title}</h3>
    </div>
  );
}
