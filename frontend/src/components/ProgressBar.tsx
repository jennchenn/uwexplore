import "../styles/ProgressBar.css";

import Tooltip from "@mui/material/Tooltip";

const ProgressBar = (props: any) => {
  const { completed, label, total } = props;

  return (
    <div className="component-container">
      <Tooltip title={label} enterNextDelay={300} enterDelay={300} arrow>
        <h5 className="label-styles">{label}</h5>
      </Tooltip>
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
