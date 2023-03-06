import "../styles/ProgressBar.css";

const ProgressBar = (props: any) => {
  const { completed, label, total } = props;

  return (
    <div className="component-container">
      <div className="label-styles">{label}</div>
      <div className="container-styles">
        <div
          className="filler-styles"
          style={{
            width: `${completed > total ? 100 : (completed / total) * 100}%`,
            backgroundColor: `${
              completed > total
                ? "var(--ceab-completed)"
                : "var(--main-purple-2)"
            }`,
          }}
        ></div>
        <div
          className="bar-label-styles"
          style={{ color: `${completed > total / 2 ? "white" : "black"}` }}
        >{`${completed}/${total}`}</div>
      </div>
    </div>
  );
};

export default ProgressBar;
