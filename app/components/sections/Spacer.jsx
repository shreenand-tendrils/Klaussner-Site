export function Spacer({height = 48, showLine = false}) {
  return <div className="[&_hr]:[border:0] [&_hr]:[border-top:1px_solid_var(--color-line)] [&_hr]:[margin:0] [&_hr]:relative [&_hr]:[top:50%]" style={{height: `${height}px`}} aria-hidden="true">{showLine && <hr />}</div>;
}
