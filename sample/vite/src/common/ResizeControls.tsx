type ResizeControlsProps = {
  onToggleWidth: () => void;
  onToggleHeight: () => void;
};

export function ResizeControls({ onToggleWidth, onToggleHeight }: ResizeControlsProps) {
  return (
    <div
      style={{
        width: "100%",
        display: "flex",
      }}
    >
      <button
        style={{
          flex: 1,
        }}
        onClick={onToggleWidth}
      >
        Resize X
      </button>
      <button
        style={{
          flex: 1,
        }}
        onClick={onToggleHeight}
      >
        Resize Y
      </button>
    </div>
  );
}
